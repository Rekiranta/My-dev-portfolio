import express from "express";
import path from "node:path";

const app = express();
const PORT = Number(process.env.PORT ?? 8093);

app.use(express.json());

type Device = {
  id: string;
  name: string;
  seed: number;
  offsetC: number;
  fault: number;
  createdAt: string;
};

const devices = new Map<string, Device>();

function createDevice(name: string, seed?: number): Device {
  const id = "dev-" + Math.random().toString(36).slice(2, 10);
  const s = Number.isFinite(seed) ? Number(seed) : Math.floor(Math.random() * 1_000_000);

  const device: Device = {
    id,
    name: name || `Device ${id}`,
    seed: s,
    offsetC: 0,
    fault: 0,
    createdAt: new Date().toISOString()
  };

  devices.set(id, device);
  return device;
}

function getDeviceOrThrow(id: string): Device {
  const d = devices.get(id);
  if (!d) {
    const err = new Error("Device not found");
    // @ts-ignore
    err.status = 404;
    throw err;
  }
  return d;
}

function deterministicTemp(seed: number, at: number, offsetC: number, fault: boolean): number {
  const x = (seed * 9301 + 49297 * at) % 233280;
  const base = 20 + 10 * (x / 233280) + offsetC;
  return fault ? base + 10 * Math.sin(at) : base;
}

app.get("/health", (_req, res) => res.json({ ok: true }));

app.get("/api/devices", (_req, res) =>
  res.json({ devices: Array.from(devices.values()) })
);

app.post("/api/devices", (req, res) => {
  const name = String(req.body?.name ?? "").trim() || "Device";
  const seed = Number(req.body?.seed) || undefined;
  const device = createDevice(name, seed);
  res.status(201).json(device);
});

app.post("/api/devices/:id/fault", (req, res) => {
  try {
    const d = getDeviceOrThrow(req.params.id);
    const fault = Number(req.body?.fault);
    if (!Number.isFinite(fault) || fault < 0 || fault > 1) {
      return res.status(400).json({ error: "fault must be between 0 and 1" });
    }
    d.fault = fault;
    res.json(d);
  } catch (e: any) {
    res.status(e.status ?? 500).json({ error: e.message });
  }
});

app.post("/api/devices/:id/calibrate", (req, res) => {
  try {
    const d = getDeviceOrThrow(req.params.id);
    const offset = Number(req.body?.offsetC);
    if (!Number.isFinite(offset) || Math.abs(offset) > 20) {
      return res.status(400).json({ error: "offsetC must be between -20..20" });
    }
    d.offsetC = offset;
    res.json(d);
  } catch (e: any) {
    res.status(e.status ?? 500).json({ error: e.message });
  }
});

app.get("/api/devices/:id/reading", (req, res) => {
  try {
    const d = getDeviceOrThrow(req.params.id);
    const at = Number(req.query.at ?? Math.floor(Date.now() / 1000));
    const fault = d.fault > 0;
    const temperatureC = deterministicTemp(d.seed, at, d.offsetC, fault);
    res.json({ deviceId: d.id, at, temperatureC, fault: d.fault });
  } catch (e: any) {
    res.status(e.status ?? 500).json({ error: e.message });
  }
});

app.get("/api/stream", (req, res) => {
  const id = String(req.query.deviceId ?? "");
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive"
  });

  const timer = setInterval(() => {
    const d = devices.get(id);
    if (!d) {
      res.write(`data: ${JSON.stringify({ type: "error", message: "not found" })}\n\n`);
      return;
    }

    const at = Math.floor(Date.now() / 1000);
    const fault = d.fault > 0;
    const temperatureC = deterministicTemp(d.seed, at, d.offsetC, fault);

    res.write(
      `data: ${JSON.stringify({
        type: "reading",
        payload: { deviceId: d.id, at, temperatureC, fault: d.fault }
      })}\n\n`
    );
  }, 1000);

  req.on("close", () => clearInterval(timer));
});

createDevice("Wind Sensor #1", 123456);

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});