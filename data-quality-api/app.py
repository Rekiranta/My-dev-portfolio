from flask import Flask, request, jsonify, render_template
from database import init_db, get_connection
from quality import analyze_data
import uuid

app = Flask(__name__)
init_db()

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/health")
def health():
    """Health check endpoint."""
    try:
        conn = get_connection()
        conn.execute("SELECT 1")
        conn.close()
        return jsonify({"ok": True, "database": "up"})
    except Exception as e:
        return jsonify({"ok": False, "error": str(e)}), 503

@app.route("/upload", methods=["POST"])
def upload_data():
    data = request.json.get("values", [])

    if not isinstance(data, list):
        return jsonify({"error": "Data must be a list"}), 400

    batch_id = str(uuid.uuid4())
    conn = get_connection()

    for value in data:
        conn.execute("INSERT INTO data (batch_id, value) VALUES (?, ?)",
                     (batch_id, value))
    conn.commit()

    rows = conn.execute("SELECT value FROM data WHERE batch_id = ?", (batch_id,)).fetchall()
    conn.close()

    report = analyze_data(rows)
    report["batch_id"] = batch_id

    return jsonify(report), 200

@app.route("/history")
def history():
    conn = get_connection()
    rows = conn.execute("""
        SELECT batch_id, COUNT(*) AS count
        FROM data
        GROUP BY batch_id
        ORDER BY batch_id DESC
        LIMIT 20
    """).fetchall()
    conn.close()
    return jsonify([dict(r) for r in rows])

if __name__ == "__main__":
    app.run(debug=True)
