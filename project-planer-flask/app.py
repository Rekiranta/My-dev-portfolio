from flask import Flask, render_template, request, redirect, url_for
from models import get_connection, init_db

app = Flask(__name__)




init_db()


@app.route("/", methods=["GET", "POST"])
def index():
    conn = get_connection()

    if request.method == "POST":
        title = request.form["title"]
        description = request.form["description"]
        status = request.form["status"]
        due_date = request.form["due_date"] or None
        conn.execute(
            "INSERT INTO projects (title, description, status, due_date) VALUES (?, ?, ?, ?)",
            (title, description, status, due_date),
        )
        conn.commit()
        conn.close()
        return redirect(url_for("index"))

    status_filter = request.args.get("status", "all")
    if status_filter == "all":
        rows = conn.execute("SELECT * FROM projects ORDER BY id DESC").fetchall()
    else:
        rows = conn.execute(
            "SELECT * FROM projects WHERE status = ? ORDER BY id DESC",
            (status_filter,),
        ).fetchall()
    conn.close()
    return render_template("index.html", projects=rows, status_filter=status_filter)

@app.route("/set_status/<int:project_id>/<status>")
def set_status(project_id, status):
    conn = get_connection()
    conn.execute("UPDATE projects SET status = ? WHERE id = ?", (status, project_id))
    conn.commit()
    conn.close()
    return redirect(url_for("index"))

@app.route("/delete/<int:project_id>")
def delete_project(project_id):
    conn = get_connection()
    conn.execute("DELETE FROM projects WHERE id = ?", (project_id,))
    conn.commit()
    conn.close()
    return redirect(url_for("index"))

if __name__ == "__main__":
    app.run(debug=True)
