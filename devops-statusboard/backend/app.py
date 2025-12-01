from flask import Flask, jsonify, render_template_string
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # allow React dev server to call API

environments = [
    {"name": "development", "status": "healthy", "detail": "Last deploy: 12 min ago"},
    {"name": "staging", "status": "degraded", "detail": "High latency on /api (p95 820ms)"},
    {"name": "production", "status": "healthy", "detail": "All checks passing"},
]

@app.get("/")
def root():
    return jsonify({
        "name": "devops-statusboard",
        "version": "1.0.0",
        "endpoints": {"info": "/", "health": "/health", "status": "/api/status", "ui": "/ui"}
    })

@app.get("/health")
def health():
    return jsonify({"ok": True})

@app.get("/api/status")
def api_status():
    return jsonify(environments)

@app.get("/ui")
def ui():
    html = """
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8"/>
        <title>DevOps StatusBoard (Backend UI)</title>
        <style>
          body{font-family:system-ui;background:#0f172a;color:#e2e8f0;margin:0}
          header{padding:16px 24px;border-bottom:1px solid #1e293b;display:flex;justify-content:space-between}
          .pill{border:1px solid #334155;border-radius:999px;padding:4px 10px;color:#94a3b8;font-size:12px}
          main{max-width:980px;margin:0 auto;padding:24px}
          .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;margin-top:16px}
          .card{background:#111827;border:1px solid #1e293b;border-radius:14px;padding:14px}
          .top{display:flex;justify-content:space-between;align-items:center;gap:8px}
          .badge{font-size:12px;border-radius:999px;padding:4px 10px;border:1px solid #334155;color:#94a3b8}
          .ok{border-color:#22c55e;color:#bbf7d0;background:rgba(34,197,94,.08)}
          .warn{border-color:#f97316;color:#fed7aa;background:rgba(249,115,22,.08)}
          .down{border-color:#ef4444;color:#fecaca;background:rgba(239,68,68,.08)}
          .muted{color:#94a3b8}
        </style>
      </head>
      <body>
        <header>
          <strong>DevOps StatusBoard</strong>
          <span class="pill">Flask UI (/ui)</span>
        </header>
        <main>
          <h1>Environment Health</h1>
          <p class="muted">This is a simple HTML UI served by the backend. React UI runs separately on Vite.</p>
          <div class="grid">
            {% for e in envs %}
              <div class="card">
                <div class="top">
                  <strong>{{ e.name }}</strong>
                  <span class="badge {{ 'ok' if e.status=='healthy' else 'warn' if e.status=='degraded' else 'down' }}">
                    {{ e.status }}
                  </span>
                </div>
                <p class="muted">{{ e.detail }}</p>
              </div>
            {% endfor %}
          </div>
        </main>
      </body>
    </html>
    """
    return render_template_string(html, envs=environments)

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
