import express from "express";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";
import { WebSocketServer } from "ws";
import { nanoid } from "nanoid";
import fs from "node:fs/promises";

type Item = { id: string; text: string; done: boolean; createdAt: string };
type State = { items: Item[] };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT ?? 8090);
const ROOT = path.resolve(__dirname, "..");
const PUBLIC_DIR = path.resolve(ROOT, "public");
const DATA_DIR = path.resolve(ROOT, "data");
const STATE_PATH = path.resolve(DATA_DIR, "state.json");

let state: State = { items: [] };

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function loadState() {
  try {
    const raw = await fs.readFile(STATE_PATH, "utf-8");
    const parsed = JSON.parse(raw);
    if (parsed && Array.isArray(parsed.items)) state = { items: parsed.items };
  } catch {
    // first run: ignore
  }
}

let saveTimer: NodeJS.Timeout | null = null;
function scheduleSave() {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(async () => {
    await ensureDataDir();
    await fs.writeFile(STATE_PATH, JSON.stringify(state, null, 2), "utf-8");
  }, 50);
}

function safeJson<T>(s: string): T | null {
  try { return JSON.parse(s) as T; } catch { return null; }
}

type ClientMsg =
  | { type: "add"; text: string }
  | { type: "toggle"; id: string }
  | { type: "delete"; id: string }
  | { type: "rename"; id: string; text: string }
  | { type: "clearDone" }
  | { type: "clearAll" };

function broadcast(wss: WebSocketServer) {
  const payload = JSON.stringify({ type: "state", state });
  for (const client of wss.clients) {
    if (client.readyState === 1) client.send(payload);
  }
}

function clampText(s: string) {
  const t = (s ?? "").trim();
  return t.length > 140 ? t.slice(0, 140) : t;
}

const app = express();
app.use(express.json({ limit: "32kb" }));

app.get("/health", (_req, res) => res.json({ ok: true }));
app.get("/api/state", (_req, res) => res.json(state));
app.use(express.static(PUBLIC_DIR));

const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: "/ws" });

wss.on("connection", (ws) => {
  ws.send(JSON.stringify({ type: "state", state }));

  ws.on("message", (buf) => {
    const msg = safeJson<ClientMsg>(buf.toString("utf-8"));
    if (!msg || typeof msg.type !== "string") {
      ws.send(JSON.stringify({ type: "error", message: "Invalid message" }));
      return;
    }

    if (msg.type === "add") {
      const text = clampText(msg.text);
      if (!text) return;
      state.items.push({ id: nanoid(10), text, done: false, createdAt: new Date().toISOString() });
      scheduleSave();
      broadcast(wss);
      return;
    }

    if (msg.type === "toggle") {
      const it = state.items.find((x) => x.id === msg.id);
      if (!it) return;
      it.done = !it.done;
      scheduleSave();
      broadcast(wss);
      return;
    }

    if (msg.type === "delete") {
      state.items = state.items.filter((x) => x.id !== msg.id);
      scheduleSave();
      broadcast(wss);
      return;
    }

    if (msg.type === "rename") {
      const it = state.items.find((x) => x.id === msg.id);
      if (!it) return;
      const text = clampText(msg.text);
      if (!text) return;
      it.text = text;
      scheduleSave();
      broadcast(wss);
      return;
    }

    if (msg.type === "clearDone") {
      state.items = state.items.filter((x) => !x.done);
      scheduleSave();
      broadcast(wss);
      return;
    }

    if (msg.type === "clearAll") {
      state.items = [];
      scheduleSave();
      broadcast(wss);
      return;
    }
  });
});

await ensureDataDir();
await loadState();

server.listen(PORT, () => {
  console.log(`Realtime Board running on http://localhost:${PORT}`);
  console.log(`WebSocket endpoint: ws://localhost:${PORT}/ws`);
});
