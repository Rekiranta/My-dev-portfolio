const dot = document.getElementById("dot");
const statusText = document.getElementById("statusText");
const form = document.getElementById("form");
const input = document.getElementById("text");
const list = document.getElementById("list");
const hint = document.getElementById("hint");
const clearBtn = document.getElementById("clearBtn");

function setStatus(ok, msg) {
  dot.classList.toggle("ok", !!ok);
  statusText.textContent = msg;
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (c) => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[c]));
}

function render(state) {
  const items = Array.isArray(state?.items) ? state.items : [];
  list.innerHTML = "";
  if (items.length === 0) {
    hint.textContent = "No tasks yet. Add one above.";
    return;
  }
  hint.textContent = "";
  for (const it of items) {
    const li = document.createElement("li");
    li.className = "item" + (it.done ? " done" : "");
    li.innerHTML = 
      <div class="left">
        <div class="check"></div>
        <div class="text" title=""></div>
      </div>
      <div class="actions">
        <button data-act="toggle" data-id=""></button>
        <button class="secondary" data-act="delete" data-id="">Delete</button>
      </div>
    ;
    list.appendChild(li);
  }
}

async function api(path, opts = {}) {
  const res = await fetch(path, {
    headers: { "Content-Type":"application/json" },
    ...opts,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || "request failed");
  return data;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  input.value = "";
  try {
    await api("/api/items", { method:"POST", body: JSON.stringify({ text }) });
  } catch (err) {
    alert(err.message);
  }
});

clearBtn.addEventListener("click", async () => {
  if (!confirm("Clear all tasks?")) return;
  try {
    await api("/api/clear", { method:"POST", body: "{}" });
  } catch (err) {
    alert(err.message);
  }
});

list.addEventListener("click", async (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  const act = btn.dataset.act;
  const id = btn.dataset.id;
  if (!act || !id) return;

  try {
    if (act === "toggle") {
      await api(\/api/items/\/toggle\, { method:"POST", body:"{}" });
    } else if (act === "delete") {
      await api(\/api/items/\\, { method:"DELETE" });
    }
  } catch (err) {
    alert(err.message);
  }
});

async function bootstrap() {
  try {
    const state = await (await fetch("/api/state")).json();
    render(state);
  } catch {
    // ignore
  }

  const es = new EventSource("/events");
  es.addEventListener("open", () => setStatus(true, "live"));
  es.addEventListener("error", () => setStatus(false, "reconnecting"));
  es.addEventListener("state", (e) => {
    try { render(JSON.parse(e.data)); } catch {}
  });
}

bootstrap();