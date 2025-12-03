import express from "express";

const app = express();
const PORT = Number(process.env.PORT ?? 8093);

app.use(express.json());

type ServiceStatus = "healthy" | "degraded" | "down";

type Service = {
  id: string;
  name: string;
  url: string;
  status: ServiceStatus;
  lastCheckedAt?: string;
};

const services = new Map<string, Service>();

function seedServices() {
  const base: Omit<Service, "id">[] = [
    { name: "Auth API", url: "https://auth.example.com/health", status: "healthy" },
    { name: "Payments", url: "https://payments.example.com/health", status: "degraded" },
    { name: "Reporting", url: "https://reports.example.com/health", status: "down" }
  ];
  base.forEach((s, idx) => {
    const id = "svc-" + (idx + 1);
    services.set(id, { id, ...s });
  });
}

seedServices();

app.get("/health", (_req, res) => {
  res.json({ ok: true, services: services.size });
});

app.get("/api/services", (_req, res) => {
  res.json({
    services: Array.from(services.values())
  });
});

app.post("/api/services", (req, res) => {
  const name = String(req.body?.name ?? "").trim();
  const url = String(req.body?.url ?? "").trim();

  if (!name || !url) {
    return res.status(400).json({ error: "name and url are required" });
  }

  const id = "svc-" + Math.random().toString(36).slice(2, 8);
  const svc: Service = {
    id,
    name,
    url,
    status: "healthy"
  };
  services.set(id, svc);
  res.status(201).json(svc);
});

app.post("/api/services/:id/status", (req, res) => {
  const svc = services.get(req.params.id);
  if (!svc) {
    return res.status(404).json({ error: "Service not found" });
  }

  const status = req.body?.status as ServiceStatus | undefined;
  if (!status || !["healthy", "degraded", "down"].includes(status)) {
    return res.status(400).json({ error: "status must be healthy|degraded|down" });
  }

  svc.status = status;
  svc.lastCheckedAt = new Date().toISOString();
  res.json(svc);
});

app.listen(PORT, () => {
  console.log(`Service Health Dashboard API running on http://localhost:${PORT}`);
});