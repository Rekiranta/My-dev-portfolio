import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { nanoid } from "nanoid";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT ?? 8094);

app.use(express.json());

type TelemetryPoint = {
  ts: number;          // unix seconds
  lat: number;
  lon: number;
  speedKmh: number;
  fuelLevel: number;   // 0100
};

type Vehicle = {
  id: string;
  name: string;
  createdAt: string;
  lastTelemetry?: TelemetryPoint;
  history: TelemetryPoint[];
};

const vehicles = new Map<string, Vehicle>();

function getVehicleOrThrow(id: string): Vehicle {
  const v = vehicles.get(id);
  if (!v) {
    const err = new Error("Vehicle not found");
    // @ts-ignore
    err.status = 404;
    throw err;
  }
  return v;
}

// ------- SSE stream management -------

type TelemetryEvent = {
  vehicleId: string;
  telemetry: TelemetryPoint;
};

const telemetrySubscribers = new Set<import("express").Response>();

function broadcast(event: TelemetryEvent) {
  const data = `data: ${JSON.stringify(event)}\n\n`;
  for (const res of telemetrySubscribers) {
    res.write(data);
  }
}

// ------- Routes -------

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

// List vehicles
app.get("/api/vehicles", (_req, res) => {
  res.json({
    vehicles: Array.from(vehicles.values()).map((v) => ({
      id: v.id,
      name: v.name,
      createdAt: v.createdAt,
      lastTelemetry: v.lastTelemetry ?? null
    })),
  });
});

// Create / register vehicle
app.post("/api/vehicles", (req, res) => {
  const rawName = typeof req.body?.name === "string" ? req.body.name : "";
  const name = rawName.trim() || "Unnamed vehicle";

  const id = req.body?.id && typeof req.body.id === "string"
    ? req.body.id
    : nanoid(8);

  if (vehicles.has(id)) {
    return res.status(400).json({ error: "Vehicle id already exists" });
  }

  const v: Vehicle = {
    id,
    name,
    createdAt: new Date().toISOString(),
    history: [],
  };

  vehicles.set(id, v);
  res.status(201).json(v);
});

// Push telemetry for a vehicle
app.post("/api/vehicles/:id/telemetry", (req, res) => {
  try {
    const v = getVehicleOrThrow(req.params.id);

    const lat = Number(req.body?.lat);
    const lon = Number(req.body?.lon);
    const speedKmh = Number(req.body?.speedKmh);
    const fuelLevel = Number(req.body?.fuelLevel);
    const ts = req.body?.ts ? Number(req.body.ts) : Math.floor(Date.now() / 1000);

    if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
      return res.status(400).json({ error: "lat and lon are required numbers" });
    }
    if (!Number.isFinite(speedKmh)) {
      return res.status(400).json({ error: "speedKmh must be a number" });
    }
    if (!Number.isFinite(fuelLevel) || fuelLevel < 0 || fuelLevel > 100) {
      return res.status(400).json({ error: "fuelLevel must be between 0 and 100" });
    }
    if (!Number.isFinite(ts)) {
      return res.status(400).json({ error: "ts must be a number (unix seconds)" });
    }

    const point: TelemetryPoint = { ts, lat, lon, speedKmh, fuelLevel };
    v.lastTelemetry = point;
    v.history.push(point);
    if (v.history.length > 500) {
      v.history.splice(0, v.history.length - 500);
    }

    broadcast({ vehicleId: v.id, telemetry: point });

    res.status(201).json({ ok: true, vehicleId: v.id, telemetry: point });
  } catch (err: any) {
    const status = (err as any)?.status ?? 500;
    res.status(status).json({ error: err?.message ?? "error" });
  }
});

// Historical telemetry for a single vehicle
app.get("/api/vehicles/:id/history", (req, res) => {
  try {
    const v = getVehicleOrThrow(req.params.id);
    res.json({
      vehicleId: v.id,
      history: v.history,
    });
  } catch (err: any) {
    const status = (err as any)?.status ?? 500;
    res.status(status).json({ error: err?.message ?? "error" });
  }
});

// SSE stream of latest telemetry events
app.get("/api/stream/telemetry", (req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });
  res.write("retry: 1000\n\n");

  telemetrySubscribers.add(res);

  req.on("close", () => {
    telemetrySubscribers.delete(res);
  });
});

// Serve frontend
const webDir = path.join(__dirname, "..", "web");
app.use(express.static(webDir));

import http from "node:http";

async function startServerWithFallback(startPort: number, maxAttempts = 10) {
  for (let i = 0; i < maxAttempts; i++) {
    const port = startPort + i;
    const server = http.createServer(app);

    try {
      await new Promise<void>((resolve, reject) => {
        server.once("error", (err: any) => reject(err));
        server.listen(port, () => resolve());
      });

      console.log(`FleetPilot server running on http://localhost:${port}`);
      console.log(`UI:    http://localhost:${port}/`);
      console.log(`SSE:   http://localhost:${port}/api/stream/telemetry`);
      return server;
    } catch (err: any) {
      if (err?.code === "EADDRINUSE") {
        console.warn(`Port ${port} is already in use, trying next port...`);
        // continue to next attempt
        continue;
      }
      console.error(err);
      process.exit(1);
    }
  }

  console.error(`No available ports in range ${startPort}-${startPort + maxAttempts - 1}`);
  process.exit(1);
}

// Start server, trying the configured port and falling back if necessary
startServerWithFallback(PORT, 20).catch((err) => {
  console.error(err);
  process.exit(1);
});