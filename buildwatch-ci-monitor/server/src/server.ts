import express from "express";
import path from "node:path";

const app = express();
const PORT = Number(process.env.PORT ?? 8093);

app.use(express.json());

type BuildStatus = "queued" | "running" | "passed" | "failed";

interface Build {
  id: string;
  branch: string;
  commit: string;
  status: BuildStatus;
  triggeredAt: string;
  updatedAt: string;
  durationSec?: number;
}

const builds: Build[] = [];
const sseClients = new Set<express.Response>();

function broadcast(event: unknown) {
  const data = `data: ${JSON.stringify(event)}\n\n`;
  for (const res of sseClients) {
    res.write(data);
  }
}

function simulateLifecycle(build: Build) {
  const start = Date.now();

  // queued -> running
  setTimeout(() => {
    build.status = "running";
    build.updatedAt = new Date().toISOString();
    broadcast({ type: "build-update", build });
  }, 1000 + Math.random() * 2000);

  // running -> passed/failed
  setTimeout(() => {
    const end = Date.now();
    build.status = Math.random() < 0.8 ? "passed" : "failed";
    build.durationSec = Math.round((end - start) / 1000);
    build.updatedAt = new Date().toISOString();
    broadcast({ type: "build-update", build });
  }, 4000 + Math.random() * 4000);
}

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/api/builds", (_req, res) => {
  res.json({ builds });
});

app.get("/api/builds/:id", (req, res) => {
  const build = builds.find((b) => b.id === req.params.id);
  if (!build) {
    return res.status(404).json({ error: "Build not found" });
  }
  res.json(build);
});

app.post("/api/builds", (req, res) => {
  const branchRaw =
    typeof req.body?.branch === "string" ? req.body.branch : "main";
  const commitRaw =
    typeof req.body?.commit === "string" ? req.body.commit : "";
  const branch = branchRaw.trim() || "main";
  const commit = commitRaw.trim() || Math.random().toString(16).slice(2, 9);

  const nowIso = new Date().toISOString();
  const id = "b-" + Math.random().toString(36).slice(2, 10);

  const build: Build = {
    id,
    branch,
    commit,
    status: "queued",
    triggeredAt: nowIso,
    updatedAt: nowIso,
  };

  builds.unshift(build);
  broadcast({ type: "build-created", build });
  simulateLifecycle(build);

  res.status(201).json(build);
});

app.get("/api/stream-builds", (req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  sseClients.add(res);

  // Initial snapshot
  res.write(
    `data: ${JSON.stringify({ type: "snapshot", builds })}\n\n`,
  );

  req.on("close", () => {
    sseClients.delete(res);
  });
});

const publicDir = path.join(process.cwd(), "public");
app.use(express.static(publicDir));

app.listen(PORT, () => {
  console.log(`BuildWatch server listening on http://localhost:${PORT}`);
  console.log(`HTTP API: http://localhost:${PORT}/api/builds`);
  console.log(`SSE:      http://localhost:${PORT}/api/stream-builds`);
});