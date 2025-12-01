from flask import Flask, jsonify, Response

app = Flask(__name__)

@app.get("/")
def root():
    return jsonify(
        name="devops-ci-demo",
        version="1.0.0",
        endpoints={
            "info": "/",
            "health": "/health",
            "ui": "/ui",
        },
    )

@app.get("/health")
def health():
    return jsonify(status="ok")

@app.get("/ui")
def ui():
    html = """
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>DevOps CI Demo</title>
    <style>
      body { font-family: system-ui, Arial; background:#0b1120; color:#e5e7eb; margin:0; }
      .wrap { max-width: 900px; margin: 40px auto; padding: 24px; }
      .card { background:#111827; border:1px solid #1f2937; border-radius:16px; padding:20px; }
      a { color:#38bdf8; text-decoration:none; }
      code { background:#0b1220; padding:2px 6px; border-radius:8px; }
      .row { display:flex; gap:12px; flex-wrap:wrap; margin-top:12px; }
      .pill { border:1px solid #334155; border-radius:999px; padding:6px 10px; font-size:12px; color:#94a3b8; }
    </style>
  </head>
  <body>
    <div class="wrap">
      <div class="card">
        <h1>DevOps CI Demo</h1>
        <p>This is a simple Flask API used for CI testing (pytest).</p>
        <div class="row">
          <span class="pill">Flask</span>
          <span class="pill">pytest</span>
          <span class="pill">CI-ready</span>
        </div>
        <h2>Endpoints</h2>
        <ul>
          <li><a href="/">/</a> (JSON info)</li>
          <li><a href="/health">/health</a> (health check)</li>
          <li><a href="/ui">/ui</a> (this page)</li>
        </ul>
        <p>Tip: run tests with <code>python -m pytest -q</code></p>
      </div>
    </div>
  </body>
</html>
"""
    return Response(html, mimetype="text/html")

if __name__ == "__main__":
    app.run(debug=True)
