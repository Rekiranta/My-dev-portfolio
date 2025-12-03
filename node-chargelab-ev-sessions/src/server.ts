import express from "express";
import path from "node:path";
import fs from "node:fs";
import { WebSocketServer, WebSocket } from "ws";

const app = express();
const PORT = Number(process.env.PORT ?? 8093);

app.use(express.json());

type StationConnectorType = "AC" | "DC";

type Station = {
  id: string;
  name: string;
  location: string;
  maxKw: number;
  connectorType: StationConnectorType;
  createdAt: string;
};

type SessionStatus = "active" | "completed";

type SessionBase = {
  id: string;
  stationId: string;
  vehicleId: string;
  startedAt: string;
};

type ActiveSession = SessionBase & {
  status: "active";
  lastUpdatedAt: string;
  energyKWh: number;
  estimatedCurrentKw: number;
};

type CompletedSession = SessionBase & {
  status: "completed";
  endedAt: string;
  energyKWh: number;
  costEUR: number;
};

type Session = ActiveSession | CompletedSession;

type DailyStationStats = {
  stationId: string;
  stationName: string;
  totalEnergyKWh: number;
  totalRevenueEUR: number;
  sessionCount: number;
};

type State = {
  stations: Station[];
  sessions: Session[];
};

const DATA_FILE = path.join(process.cwd(), "data", "state.json");

// In-memory state
let stations: Station[] = [];
let sessions: Session[] = [];

// --- Persistence helpers ----------------------------------------------------

function loadState() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      stations = [];
      sessions = [];
      return;
    }
    const raw = fs.readFileSync(DATA_FILE, "utf8");
    if (!raw.trim()) {
      stations = [];
      sessions = [];
      return;
    }
    const parsed = JSON.parse(raw) as State;
    stations = parsed.stations ?? [];
    sessions = parsed.sessions ?? [];
    console.log(
      `Loaded state: ${stations.length} stations, ${sessions.length} sessions`,
    );
  } catch (err) {
    console.error("Failed to load state:", err);
    stations = [];
    sessions = [];
  }
}

function saveState() {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const payload: State = { stations, sessions };
    fs.writeFileSync(DATA_FILE, JSON.stringify(payload, null, 2), "utf8");
  } catch (err) {
    console.error("Failed to save state:", err);
  }
}

// --- Helpers ----------------------------------------------------------------

function makeId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function getStationOrThrow(id: string): Station {
  const s = stations.find((s) => s.id === id);
  if (!s) {
    throw new HttpError(404, "Station not found");
  }
  return s;
}

function getSessionOrThrow(id: string): Session {
  const sess = sessions.find((s) => s.id === id);
  if (!sess) {
    throw new HttpError(404, "Session not found");
  }
  return sess;
}

// --- Simulation constants ---------------------------------------------------

const TICK_SECONDS = 10;
const CHARGING_EFFICIENCY = 0.9;
const PRICE_PER_KWH = 0.30;

// --- API routes -------------------------------------------------------------

app.get("/health", (_req, res) => {
  const active = sessions.filter((s) => s.status === "active").length;
  res.json({
    ok: true,
    stations: stations.length,
    activeSessions: active,
  });
});

app.get("/api/stations", (_req, res) => {
  res.json({ stations });
});

app.post("/api/stations", (req, res) => {
  const { name, location, maxKw, connectorType } = req.body ?? {};

  if (typeof name !== "string" || !name.trim()) {
    return res.status(400).json({ error: "name is required" });
  }
  if (typeof location !== "string" || !location.trim()) {
    return res.status(400).json({ error: "location is required" });
  }

  const power = Number(maxKw);
  if (!Number.isFinite(power) || power <= 0) {
    return res.status(400).json({ error: "maxKw must be a positive number" });
  }

  if (connectorType !== "AC" && connectorType !== "DC") {
    return res
      .status(400)
      .json({ error: "connectorType must be 'AC' or 'DC'" });
  }

  const station: Station = {
    id: makeId("st"),
    name: name.trim(),
    location: location.trim(),
    maxKw: power,
    connectorType,
    createdAt: new Date().toISOString(),
  };

  stations.push(station);
  saveState();
  res.status(201).json(station);
});

app.post("/api/sessions/start", (req, res) => {
  const { stationId, vehicleId } = req.body ?? {};

  if (typeof stationId !== "string" || !stationId.trim()) {
    return res.status(400).json({ error: "stationId is required" });
  }
  if (typeof vehicleId !== "string" || !vehicleId.trim()) {
    return res.status(400).json({ error: "vehicleId is required" });
  }

  const station = getStationOrThrow(stationId.trim());
  const now = new Date().toISOString();

  const session: ActiveSession = {
    id: makeId("sess"),
    stationId: station.id,
    vehicleId: vehicleId.trim(),
    startedAt: now,
    lastUpdatedAt: now,
    energyKWh: 0,
    estimatedCurrentKw: 0,
    status: "active",
  };

  sessions.push(session);
  saveState();

  broadcast({
    type: "session_started",
    session: publicSession(session),
  });

  res.status(201).json(session);
});

app.post("/api/sessions/:id/stop", (req, res) => {
  try {
    const id = req.params.id;
    const existing = getSessionOrThrow(id);

    if (existing.status !== "active") {
      throw new HttpError(400, "Session already completed");
    }

    const station = getStationOrThrow(existing.stationId);

    // Final tick just before stopping
    const now = new Date();
    const last = new Date(existing.lastUpdatedAt);
    const dtSec = Math.max(
      0,
      (now.getTime() - last.getTime()) / 1000,
    );
    const powerKw = station.maxKw * CHARGING_EFFICIENCY;
    const added = powerKw * dtSec / 3600;
    existing.energyKWh = Number(
      (existing.energyKWh + added).toFixed(3),
    );

    const completed: CompletedSession = {
      id: existing.id,
      stationId: existing.stationId,
      vehicleId: existing.vehicleId,
      startedAt: existing.startedAt,
      status: "completed",
      endedAt: now.toISOString(),
      energyKWh: existing.energyKWh,
      costEUR: Number((existing.energyKWh * PRICE_PER_KWH).toFixed(2)),
    };

    sessions = sessions.map((s) => (s.id === id ? completed : s));
    saveState();

    broadcast({
      type: "session_completed",
      session: publicSession(completed),
    });

    res.json(completed);
  } catch (err: any) {
    const status = err?.status ?? 500;
    res.status(status).json({ error: err?.message ?? "error" });
  }
});

app.get("/api/sessions", (req, res) => {
  let result = sessions;

  const status = typeof req.query.status === "string"
    ? (req.query.status as SessionStatus)
    : undefined;
  const stationId = typeof req.query.stationId === "string"
    ? req.query.stationId
    : undefined;

  if (status === "active" || status === "completed") {
    result = result.filter((s) => s.status === status);
  }

  if (stationId) {
    result = result.filter((s) => s.stationId === stationId);
  }

  res.json({
    sessions: result,
  });
});

app.get("/api/stats/daily", (req, res) => {
  const dateParam = typeof req.query.date === "string"
    ? req.query.date
    : undefined;

  const today = new Date();
  const defaultDate = today.toISOString().slice(0, 10); // YYYY-MM-DD

  const date = (dateParam && dateParam.trim()) || defaultDate;

  const statsMap = new Map<string, DailyStationStats>();

  const completed = sessions.filter(
    (s): s is CompletedSession => s.status === "completed",
  );

  for (const s of completed) {
    if (!s.endedAt.startsWith(date)) continue;
    const station = stations.find((st) => st.id === s.stationId);
    const key = s.stationId;

    if (!statsMap.has(key)) {
      statsMap.set(key, {
        stationId: s.stationId,
        stationName: station?.name ?? "Unknown station",
        totalEnergyKWh: 0,
        totalRevenueEUR: 0,
        sessionCount: 0,
      });
    }

    const entry = statsMap.get(key)!;
    entry.totalEnergyKWh += s.energyKWh;
    entry.totalRevenueEUR += s.costEUR;
    entry.sessionCount += 1;
  }

  res.json({
    date,
    stations: Array.from(statsMap.values()).map((st) => ({
      ...st,
      totalEnergyKWh: Number(st.totalEnergyKWh.toFixed(3)),
      totalRevenueEUR: Number(st.totalRevenueEUR.toFixed(2)),
    })),
  });
});

// --- WebSocket for realtime updates -----------------------------------------

const server = app.listen(PORT, () => {
  console.log(`ChargeLab running on http://localhost:${PORT}`);
  console.log(`REST:   http://localhost:${PORT}/api/...`);
  console.log(`WS:     ws://localhost:${PORT}/ws/sessions`);
  console.log(`Stats:  http://localhost:${PORT}/api/stats/daily`);
});

const wss = new WebSocketServer({
  server,
  path: "/ws/sessions",
});

type PublicSessionPayload = {
  id: string;
  stationId: string;
  vehicleId: string;
  status: SessionStatus;
  startedAt: string;
  lastUpdatedAt?: string;
  endedAt?: string;
  energyKWh: number;
  estimatedCurrentKw?: number;
  costEUR?: number;
};

function publicSession(s: Session): PublicSessionPayload {
  if (s.status === "active") {
    return {
      id: s.id,
      stationId: s.stationId,
      vehicleId: s.vehicleId,
      status: s.status,
      startedAt: s.startedAt,
      lastUpdatedAt: s.lastUpdatedAt,
      energyKWh: s.energyKWh,
      estimatedCurrentKw: s.estimatedCurrentKw,
    };
  }
  return {
    id: s.id,
    stationId: s.stationId,
    vehicleId: s.vehicleId,
    status: s.status,
    startedAt: s.startedAt,
    endedAt: s.endedAt,
    energyKWh: s.energyKWh,
    costEUR: s.costEUR,
  };
}

function broadcast(event: any) {
  const data = JSON.stringify(event);
  for (const client of wss.clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  }
}

wss.on("connection", (socket) => {
  console.log("WebSocket client connected");

  socket.send(
    JSON.stringify({
      type: "snapshot",
      stations,
      sessions: sessions.map(publicSession),
    }),
  );

  socket.on("close", () => {
    console.log("WebSocket client disconnected");
  });
});

// --- Simulation loop --------------------------------------------------------

loadState();

setInterval(() => {
  const now = new Date();
  const updated: ActiveSession[] = [];

  for (const s of sessions) {
    if (s.status !== "active") continue;

    const station = stations.find((st) => st.id === s.stationId);
    if (!station) continue;

    const last = new Date(s.lastUpdatedAt);
    const dtSec = Math.max(
      TICK_SECONDS,
      (now.getTime() - last.getTime()) / 1000,
    );
    const powerKw = station.maxKw * CHARGING_EFFICIENCY;
    const added = powerKw * dtSec / 3600;

    s.energyKWh = Number((s.energyKWh + added).toFixed(3));
    s.estimatedCurrentKw = powerKw;
    s.lastUpdatedAt = now.toISOString();
    updated.push(s);
  }

  if (updated.length > 0) {
    broadcast({
      type: "sessions_tick",
      at: now.toISOString(),
      sessions: updated.map(publicSession),
    });
    saveState();
  }
}, TICK_SECONDS * 1000);