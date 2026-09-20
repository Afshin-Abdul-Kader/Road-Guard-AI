import sqlite3
from pathlib import Path

DB_PATH = Path(__file__).parent / "roadguard.db"


def get_db():
    db = sqlite3.connect(DB_PATH)
    db.row_factory = sqlite3.Row
    return db


def init_db():
    db = get_db()

    db.executescript("""
    CREATE TABLE IF NOT EXISTS reports (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        report_id TEXT UNIQUE NOT NULL,
        defect TEXT NOT NULL,
        confidence REAL NOT NULL,
        severity TEXT NOT NULL,
        priority_score INTEGER NOT NULL,
        priority_level TEXT NOT NULL,
        area TEXT NOT NULL,
        location TEXT NOT NULL,
        description TEXT DEFAULT '',
        image_path TEXT DEFAULT '',
        status TEXT NOT NULL DEFAULT 'REPORTED',
        reporter_name TEXT DEFAULT 'Demo Citizen',
        created_at TEXT NOT NULL,
        estimated_fix_days INTEGER DEFAULT 7,
        worker_name TEXT DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS completions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        report_id TEXT NOT NULL,
        completion_image TEXT DEFAULT '',
        completion_description TEXT DEFAULT '',
        completed_at TEXT NOT NULL
    );
    """)

    # Add worker_name to an existing database if it is missing
    columns = db.execute("PRAGMA table_info(reports)").fetchall()
    column_names = {column["name"] for column in columns}

    if "worker_name" not in column_names:
        db.execute(
            "ALTER TABLE reports ADD COLUMN worker_name TEXT DEFAULT ''"
        )

    db.commit()
    db.close()