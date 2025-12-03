import React, { useEffect, useState } from "react";

type ServiceStatus = "healthy" | "degraded" | "down";

type Service = {
  id: string;
  name: string;
  url: string;
  status: ServiceStatus;
  lastCheckedAt?: string;
};

type ServicesResponse = {
  services: Service[];
};

const statusColor: Record<ServiceStatus, string> = {
  healthy: "#22c55e",
  degraded: "#eab308",
  down: "#ef4444"
};

export default function App() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      setError(null);
      const res = await fetch("/api/services");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as ServicesResponse;
      setServices(data.services);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    const id = setInterval(load, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ padding: "1.5rem", maxWidth: 960, margin: "0 auto" }}>
      <header style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 700 }}>Service Health Dashboard</h1>
        <p style={{ opacity: 0.7, marginTop: "0.25rem" }}>
          Simple monitoring UI backed by a Node/Express API.
        </p>
      </header>

      {loading && <p>Loading services</p>}
      {error && (
        <p style={{ color: "#f97316", marginBottom: "1rem" }}>
          Error loading services: {error}
        </p>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1rem"
        }}
      >
        {services.map((svc) => (
          <article
            key={svc.id}
            style={{
              borderRadius: "0.75rem",
              padding: "1rem",
              background: "#020617",
              border: "1px solid #1f2937",
              boxShadow: "0 10px 25px rgba(0,0,0,0.4)"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <h2 style={{ fontSize: "1rem", fontWeight: 600 }}>{svc.name}</h2>
              <span
                style={{
                  padding: "0.15rem 0.6rem",
                  borderRadius: 999,
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  background: "#020617",
                  border: `1px solid ${statusColor[svc.status]}`,
                  color: statusColor[svc.status],
                  textTransform: "uppercase",
                  letterSpacing: "0.06em"
                }}
              >
                {svc.status}
              </span>
            </div>
            <p style={{ fontSize: "0.8rem", opacity: 0.7, marginBottom: 8 }}>{svc.url}</p>
            {svc.lastCheckedAt && (
              <p style={{ fontSize: "0.75rem", opacity: 0.6 }}>
                Last checked: {new Date(svc.lastCheckedAt).toLocaleString()}
              </p>
            )}
          </article>
        ))}
      </div>

      {!loading && services.length === 0 && !error && (
        <p style={{ marginTop: "1rem", opacity: 0.7 }}>No services yet. Add some via the API.</p>
      )}
    </div>
  );
}