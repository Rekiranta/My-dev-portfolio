import express from "express";
import { nanoid } from "nanoid";
import fs from "node:fs/promises";
import path from "node:path";

type Task = {
  id: string;
  text: string;
  done: boolean;
  createdAt: string;
};

type State = { tasks: Task[] };

const PORT = Number(process.env.PORT ?? 8091);
const DATA_FILE = path.join(process.cwd(), "data", "state.json");

async function ensureDataFile() {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  try {
    await fs.access(DATA_FILE);
  } catch {
    const initial: State = { tasks: [] };
    await fs.writeFile(DATA_FILE, JSON.stringify(initial, null, 2), "utf8");
  }
}

async function readState(): Promise<State> {
  await ensureDataFile();
  const raw = await fs.readFile(DATA_FILE, "utf8");
  const parsed = JSON.parse(raw) as State;
  if (!parsed || !Array.isArray(parsed.tasks)) return { tasks: [] };
  return parsed;
}

async function writeState(state: State) {
  await ensureDataFile();
  await fs.writeFile(DATA_FILE, JSON.stringify(state, null, 2), "utf8");
}

const app = express();
app.use(express.json());
app.use(express.static(path.join(process.cwd(), "public")));

const clients = new Set<express.Response>();

function sseSend(res: express.Response, data: unknown) {
  res.write(`data: ${JSON.stringify(data)}\n\n`);
}

async function broadcast() {
  const state = await readState();
  for (const res of clients) sseSend(res, { type: "state", state });
}

app.get("/events", async (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");

  // joissain proxissa auttaa:
  res.flushHeaders?.();

  clients.add(res);

  // heti nykytila
  sseSend(res, { type: "hello" });
  sseSend(res, { type: "state", state: await readState() });

  const ping = setInterval(() => res.write(": ping\n\n"), 25000);

  req.on("close", () => {
    clearInterval(ping);
    clients.delete(res);
  });
});

app.get("/api/tasks", async (_req, res) => {
  const state = await readState();
  res.json(state);
});

app.post("/api/tasks", async (req, res) => {
  const text = String(req.body?.text ?? "").trim();
  if (!text) return res.status(400).json({ error: "text is required" });

  const state = await readState();
  const task: Task = { id: nanoid(10), text, done: false, createdAt: new Date().toISOString() };
  state.tasks.unshift(task);
  await writeState(state);

  await broadcast();
  res.status(201).json(task);
});

app.patch("/api/tasks/:id", async (req, res) => {
  const id = String(req.params.id);
  const state = await readState();
  const t = state.tasks.find(x => x.id === id);
  if (!t) return res.status(404).json({ error: "not found" });

  if (typeof req.body?.text === "string") t.text = req.body.text.trim();
  if (typeof req.body?.done === "boolean") t.done = req.body.done;

  await writeState(state);
  await broadcast();
  res.json(t);
});

app.delete("/api/tasks/:id", async (req, res) => {
  const id = String(req.params.id);
  const state = await readState();
  const before = state.tasks.length;
  state.tasks = state.tasks.filter(x => x.id !== id);
  if (state.tasks.length === before) return res.status(404).json({ error: "not found" });

  await writeState(state);
  await broadcast();
  res.status(204).send();
});

app.get("/health", (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`SSE Task Feed running on http://localhost:${PORT}`);
  console.log(`SSE endpoint: http://localhost:${PORT}/events`);
});