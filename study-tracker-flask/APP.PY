from flask import Flask, render_template, request, redirect
import sqlite3
import os

app = Flask(__name__)
DB_NAME = "courses.db"

def get_connection():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    if not os.path.exists(DB_NAME):
        conn = get_connection()
        conn.execute("""
        CREATE TABLE courses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            credits INTEGER NOT NULL,
            grade REAL NOT NULL
        );
        """)
        conn.commit()
        conn.close()

@app.route("/", methods=["GET", "POST"])
def index():
    conn = get_connection()

    if request.method == "POST":
        name = request.form["name"]
        credits = int(request.form["credits"])
        grade = float(request.form["grade"])
        conn.execute(
            "INSERT INTO courses (name, credits, grade) VALUES (?, ?, ?)",
            (name, credits, grade)
        )
        conn.commit()
        conn.close()
        return redirect("/")

    courses = conn.execute("SELECT * FROM courses").fetchall()
    conn.close()

    total_credits = sum(c["credits"] for c in courses)
    if total_credits > 0:
        weighted = sum(c["credits"] * c["grade"] for c in courses)
        avg_grade = round(weighted / total_credits, 2)
    else:
        avg_grade = 0.0

    return render_template("index.html",
                           courses=courses,
                           total_credits=total_credits,
                           avg_grade=avg_grade)

if __name__ == "__main__":
    init_db()
    app.run(debug=True)
