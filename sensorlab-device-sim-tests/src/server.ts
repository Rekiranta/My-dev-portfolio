import express from "express";
import path from "node:path";

const app = express();
const PORT = Number(process.env.PORT ?? 8092);

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
    createdAt: new Date().toISOString(),
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

function deterministicTemp(seed: number, at: number, offsetC: number): number {
  const x = (seed * 9301 + 49297 * at) % 233280;
  const base = 15 + 10 * (x / 233280) + offsetC;
  return Math.round(base * 10) / 10;
}

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/api/devices", (_req, res) => {
  res.json({ devices: Array.from(devices.values()) });
});

app.post("/api/devices", (req, res) => {
  const rawName = typeof req.body?.name === "string" ? req.body.name : "";
  const name = rawName.trim() || "Device";

  const seed =
    typeof req.body?.seed === "number"
      ? req.body.seed
      : Number.isFinite(Number(req.body?.seed))
      ? Number(req.body.seed)
      : undefined;

  const device = createDevice(name, seed);
  res.status(201).json(device);
});

app.post("/api/devices/:id/calibrate", (req, res) => {
  try {
    const d = getDeviceOrThrow(req.params.id);
    const offsetC = Number(req.body?.offsetC);

    if (!Number.isFinite(offsetC)) {
      return res.status(400).json({ error: "offsetC must be a number" });
    }

    d.offsetC = offsetC;
    res.json(d);
  } catch (e: any) {
    const status = e?.status ?? 500;
    res.status(status).json({ error: e?.message ?? "error" });
  }
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
    const status = e?.status ?? 500;
    res.status(status).json({ error: e?.message ?? "error" });
  }
});

app.get("/api/devices/:id/reading", (req, res) => {
  try {
    const d = getDeviceOrThrow(req.params.id);
    const at = Number(req.query.at ?? Math.floor(Date.now() / 1000));

    if (!Number.isFinite(at)) {
      return res.status(400).json({ error: "invalid 'at' timestamp" });
    }

    const temperatureC = deterministicTemp(d.seed, at, d.offsetC);
    res.json({
      deviceId: d.id,
      at,
      reading: {
        temperatureC,
      },
    });
  } catch (e: any) {
    const status = e?.status ?? 500;
    res.status(status).json({ error: e?.message ?? "error" });
  }
});

app.get("/api/stream", (req, res) => {
  const deviceId = String(req.query.deviceId ?? "").trim();
  if (!deviceId) {
    res.status(400).json({ error: "deviceId required" });
    return;
  }

  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  res.write("retry: 1000\n\n");

  const interval = setInterval(() => {
    const d = devices.get(deviceId);
    const at = Math.floor(Date.now() / 1000);
    const temperatureC = d ? deterministicTemp(d.seed, at, d.offsetC) : 20;

    const payload = {
      deviceId,
      at,
      reading: { temperatureC },
    };

    res.write(`data: ${JSON.stringify(payload)}\n\n`);
  }, 1000);

  req.on("close", () => {
    clearInterval(interval);
  });
});

const publicDir = path.join(process.cwd(), "public");
app.use(express.static(publicDir));

app.listen(PORT, () => {
  console.log(`SensorLab running on http://localhost:${PORT}`);
  console.log(`Try UI: http://localhost:${PORT}/`);
  console.log(`SSE:   http://localhost:${PORT}/api/stream?deviceId=wind-1`);
});