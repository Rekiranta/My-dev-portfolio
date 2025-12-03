const statusEl = document.getElementById("status");
const form = document.getElementById("form");
const text = document.getElementById("text");
const list = document.getElementById("list");
const count = document.getElementById("count");
const clearDone = document.getElementById("clearDone");
const clearAll = document.getElementById("clearAll");

let STATE = { items: [] };

function wsUrl() {
  const proto = location.protocol === "https:" ? "wss:" : "ws:";
  return `${proto}//${location.host}/ws`;
}

function setStatus(kind, label) {
  statusEl.textContent = label;
  statusEl.style.opacity = kind === "connected" ? "1" : "0.75";
}

function render() {
  count.textContent = String(STATE.items.length);
  list.innerHTML = "";

  const items = [...STATE.items].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  for (const item of items) {
    const li = document.createElement("li");

    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.checked = !!item.done;
    cb.addEventListener("change", () => send({ type: "toggle", id: item.id }));

    const span = document.createElement("div");
    span.className = "text" + (item.done ? " done" : "");
    span.textContent = item.text;
    span.title = new Date(item.createdAt).toLocaleString();

    span.addEventListener("dblclick", () => {
      const next = prompt("Rename item:", item.text);
      if (next && next.trim()) send({ type: "rename", id: item.id, text: next.trim() });
    });

    const del = document.createElement("button");
    del.textContent = "Delete";
    del.addEventListener("click", () => send({ type: "delete", id: item.id }));

    li.appendChild(cb);
    li.appendChild(span);
    li.appendChild(del);
    list.appendChild(li);
  }
}

let ws;

function connect() {
  setStatus("connecting", "connecting");
  ws = new WebSocket(wsUrl());

  ws.addEventListener("open", () => setStatus("connected", "connected"));
  ws.addEventListener("close", () => {
    setStatus("disconnected", "disconnected (retrying)");
    setTimeout(connect, 800);
  });
  ws.addEventListener("error", () => setStatus("disconnected", "error (retrying)"));

  ws.addEventListener("message", (ev) => {
    let msg;
    try { msg = JSON.parse(ev.data); } catch { return; }
    if (msg.type === "state" && msg.state) {
      STATE = msg.state;
      render();
    }
    if (msg.type === "error") {
      console.warn(msg.message);
    }
  });
}

function send(payload) {
  if (!ws || ws.readyState !== WebSocket.OPEN) return;
  ws.send(JSON.stringify(payload));
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const v = text.value.trim();
  if (!v) return;
  send({ type: "add", text: v });
  text.value = "";
  text.focus();
});

clearDone.addEventListener("click", () => send({ type: "clearDone" }));
clearAll.addEventListener("click", () => {
  if (confirm("Clear ALL items?")) send({ type: "clearAll" });
});

connect();
