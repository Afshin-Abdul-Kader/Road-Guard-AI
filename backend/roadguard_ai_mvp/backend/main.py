from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path
import shutil, uuid
from datetime import datetime
from database import init_db, get_db
from ai import detect_image
from priority import calculate_priority

app = FastAPI(title="RoadGuard AI MVP", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True, allow_methods=["*"], allow_headers=["*"],
)
UPLOAD_DIR = Path(__file__).parent / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")
init_db()

@app.get("/")
def root():
    return {"message": "RoadGuard AI backend is running", "docs": "/docs"}

@app.get("/api/health")
def health():
    return {"status": "ok"}

@app.post("/api/detect")
async def detect(file: UploadFile = File(...)):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(400, "Please upload an image.")
    path = UPLOAD_DIR / f"detect_{uuid.uuid4().hex}_{file.filename}"
    with path.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    try:
        return detect_image(str(path))
    finally:
        try: path.unlink()
        except OSError: pass

@app.post("/api/reports")
async def create_report(
    image: UploadFile = File(...),
    area: str = Form(...),
    location: str = Form(...),
    description: str = Form(""),
    reporter_name: str = Form("Demo Citizen"),
    road_importance: int = Form(10),
    traffic_impact: int = Form(10),
):
    if not image.content_type or not image.content_type.startswith("image/"):
        raise HTTPException(400, "Please upload an image.")
    report_id = f"RG-{uuid.uuid4().hex[:6].upper()}"
    filename = f"{report_id}_{image.filename}"
    image_path = UPLOAD_DIR / filename
    with image_path.open("wb") as buffer:
        shutil.copyfileobj(image.file, buffer)

    ai = detect_image(str(image_path))
    priority = calculate_priority(ai["severity"], road_importance, traffic_impact)
    estimated = {"CRITICAL": 1, "HIGH": 2, "MEDIUM": 5, "LOW": 7}[priority["priority_level"]]

    db = get_db()
    db.execute("""INSERT INTO reports
        (report_id, defect, confidence, severity, priority_score, priority_level,
         area, location, description, image_path, status, reporter_name, created_at, estimated_fix_days)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
        (report_id, ai["defect"], ai["confidence"], ai["severity"],
         priority["priority_score"], priority["priority_level"], area, location,
         description, f"/uploads/{filename}", "REPORTED", reporter_name,
         datetime.now().isoformat(timespec="seconds"), estimated))
    db.commit(); db.close()

    return {
        "report_id": report_id, "defect": ai["defect"], "confidence": ai["confidence"],
        "severity": ai["severity"], **priority, "area": area, "location": location,
        "status": "REPORTED", "estimated_fix_days": estimated
    }

@app.get("/api/reports/{report_id}")
def get_report(report_id: str):
    db = get_db()
    row = db.execute("SELECT * FROM reports WHERE report_id = ?", (report_id,)).fetchone()
    db.close()
    if not row: raise HTTPException(404, "Report not found.")
    return dict(row)

@app.patch("/api/tasks/{task_id}/assign")
def assign_task(task_id: int, payload: dict):
    worker_name = payload.get("worker_name")

    if not worker_name or not worker_name.strip():
        raise HTTPException(400, "Worker name is required.")

    db = get_db()

    cur = db.execute(
        """
        UPDATE reports
        SET worker_name = ?, status = 'ASSIGNED'
        WHERE id = ?
        """,
        (worker_name.strip(), task_id)
    )

    db.commit()
    db.close()

    if not cur.rowcount:
        raise HTTPException(404, "Task not found.")

    return {
        "success": True,
        "id": task_id,
        "worker_name": worker_name.strip(),
        "status": "ASSIGNED"
    }

@app.get("/api/worker/tasks")
def worker_tasks():
    db = get_db()
    rows = db.execute("""SELECT id, report_id, defect AS issue, location, area,
        priority_score, priority_level, status, estimated_fix_days
        FROM reports WHERE status IN ('ASSIGNED','IN_PROGRESS')
        ORDER BY priority_score DESC""").fetchall()
    db.close()
    return {"tasks": [dict(r) for r in rows]}

@app.patch("/api/tasks/{task_id}/status")
def update_task_status(task_id: int, payload: dict):
    status = payload.get("status")
    allowed = {"REPORTED", "ASSIGNED", "IN_PROGRESS", "COMPLETED"}
    if status not in allowed: raise HTTPException(400, "Invalid status.")
    db = get_db()
    cur = db.execute("UPDATE reports SET status = ? WHERE id = ?", (status, task_id))
    db.commit(); db.close()
    if not cur.rowcount: raise HTTPException(404, "Task not found.")
    return {"success": True, "id": task_id, "status": status}

@app.post("/api/tasks/{task_id}/completion")
async def complete_task(task_id: int, image: UploadFile = File(...), description: str = Form("Road repair completed.")):
    if not image.content_type or not image.content_type.startswith("image/"):
        raise HTTPException(400, "Please upload an image.")
    db = get_db()
    row = db.execute("SELECT report_id FROM reports WHERE id = ?", (task_id,)).fetchone()
    if not row:
        db.close(); raise HTTPException(404, "Task not found.")
    report_id = row["report_id"]
    filename = f"{report_id}_completion_{image.filename}"
    path = UPLOAD_DIR / filename
    with path.open("wb") as buffer: shutil.copyfileobj(image.file, buffer)
    db.execute("""INSERT INTO completions
        (report_id, completion_image, completion_description, completed_at)
        VALUES (?, ?, ?, ?)""",
        (report_id, f"/uploads/{filename}", description, datetime.now().isoformat(timespec="seconds")))
    db.execute("UPDATE reports SET status='COMPLETED' WHERE id=?", (task_id,))
    db.commit(); db.close()
    return {"success": True, "report_id": report_id, "status": "COMPLETED",
            "completion_image": f"/uploads/{filename}"}

@app.get("/api/councilor/dashboard")
def councilor_dashboard():
    db = get_db()
    counts = {r["priority_level"].lower(): r["c"] for r in db.execute(
        "SELECT priority_level, COUNT(*) AS c FROM reports GROUP BY priority_level").fetchall()}
    completed = db.execute("SELECT COUNT(*) AS c FROM reports WHERE status='COMPLETED'").fetchone()["c"]
    rows = db.execute("""SELECT id, report_id, defect, area, location, priority_score,
        priority_level, status, estimated_fix_days FROM reports ORDER BY priority_score DESC""").fetchall()
    db.close()
    return {
        "critical": counts.get("critical", 0), "high": counts.get("high", 0),
        "medium": counts.get("medium", 0), "completed": completed,
        "in_progress": sum(1 for r in rows if r["status"] == "IN_PROGRESS"),
        "top_priority": [dict(r) for r in rows[:10]]
    }

@app.post("/api/demo/seed")
def seed_demo():
    db = get_db()
    if db.execute("SELECT COUNT(*) AS c FROM reports").fetchone()["c"]:
        db.close(); return {"message": "Demo data already exists."}
    demo = [
        ("RG-DEMO01","Pothole",.91,"HIGH",94,"CRITICAL","Ramapuram","Ramapuram Main Road","Large pothole.","REPORTED",2),
        ("RG-DEMO02","Pothole",.84,"HIGH",88,"HIGH","Porur","Arcot Road","Multiple potholes.","ASSIGNED",3),
        ("RG-DEMO03","Longitudinal Crack",.78,"MEDIUM",68,"MEDIUM","Guindy","Mount Poonamallee Road","Long crack.","IN_PROGRESS",5),
        ("RG-DEMO04","Pothole",.89,"HIGH",82,"HIGH","Ramapuram","College Road","Repaired road.","COMPLETED",2),
    ]
    for x in demo:
        db.execute("""INSERT INTO reports
        (report_id,defect,confidence,severity,priority_score,priority_level,area,location,description,
         image_path,status,reporter_name,created_at,estimated_fix_days)
         VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)""",
         (*x[:8], x[8], "", x[9], "Demo Citizen", datetime.now().isoformat(timespec="seconds"), x[10]))
    db.commit()
    count = db.execute("SELECT COUNT(*) AS c FROM reports").fetchone()["c"]
    db.close()
    return {"message": "Demo data seeded.", "count": count}
