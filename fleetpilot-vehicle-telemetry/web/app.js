const statusEl = document.getElementById("vehicle-form-status");
const formEl = document.getElementById("vehicle-form");
const tableBody = document.querySelector("#telemetry-table tbody");

const vehicles = new Map(); // id -> { id, name, lastTelemetry }

function setStatus(msg, ok = true) {
  statusEl.textContent = msg;
  statusEl.classList.toggle("ok", ok);
  statusEl.classList.toggle("err", !ok);
}

async function fetchVehicles() {
  try {
    const res = await fetch("/api/vehicles");
    if (!res.ok) throw new Error("Failed to load vehicles");
    const data = await res.json();
    (data.vehicles ?? []).forEach((v) => {
      vehicles.set(v.id, v);
    });
    renderTable();
  } catch (err) {
    console.error(err);
  }
}

function renderTable() {
  const rows = [];
  for (const v of vehicles.values()) {
    const t = v.lastTelemetry;
    rows.push(`
      <tr>
        <td>${v.name} (${v.id})</td>
        <td>${t ? t.lat.toFixed(5) : "-"}</td>
        <td>${t ? t.lon.toFixed(5) : "-"}</td>
        <td>${t ? t.speedKmh.toFixed(1) : "-"}</td>
        <td>${t ? t.fuelLevel.toFixed(0) : "-"}</td>
        <td>${t ? new Date(t.ts * 1000).toLocaleTimeString() : "-"}</td>
      </tr>
    `);
  }
  tableBody.innerHTML = rows.join("");
}

function handleTelemetryEvent(evt) {
  try {
    const data = JSON.parse(evt.data);
    const id = data.vehicleId;
    const telemetry = data.telemetry;
    const existing = vehicles.get(id) || {
      id,
      name: id,
      createdAt: new Date().toISOString(),
      lastTelemetry: null,
    };
    existing.lastTelemetry = telemetry;
    vehicles.set(id, existing);
    renderTable();
  } catch (err) {
    console.error("Bad telemetry event", err);
  }
}

function openSse() {
  const es = new EventSource("/api/stream/telemetry");
  es.onmessage = handleTelemetryEvent;
  es.onerror = (e) => {
    console.warn("SSE error, will reconnect", e);
  };
}

formEl.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("vehicle-name").value.trim();
  const id = document.getElementById("vehicle-id").value.trim();
  try {
    setStatus("Registering vehicle...", true);
    const payload = { name };
    if (id) payload.id = id;

    const res = await fetch("/api/vehicles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Failed to register vehicle");
    }

    const v = await res.json();
    vehicles.set(v.id, v);
    renderTable();
    setStatus(`Registered vehicle ${v.name} (${v.id})`, true);
    formEl.reset();
  } catch (err) {
    console.error(err);
    setStatus(err.message, false);
  }
});

// Init
fetchVehicles();
openSse();