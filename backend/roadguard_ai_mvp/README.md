# RoadGuard AI — Hackathon MVP

Demo workflow:

PUBLIC → REPORT → AI DETECTION → LOCATION → COUNCILOR → WORKER → COMPLETION → PUBLIC UPDATE

## Run backend

```bash
cd backend
python -m venv .venv
# Windows:
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

Backend: http://localhost:8000  
Swagger: http://localhost:8000/docs

Put the YOLO checkpoint at `backend/best.pt`. It is ignored by Git.
If unavailable, the backend uses a demo fallback so the complete workflow remains demonstrable.

Seed sample dashboard data with `POST /api/demo/seed`.

Main endpoints:
- POST /api/detect
- POST /api/reports
- GET /api/reports/{report_id}
- GET /api/worker/tasks
- PATCH /api/tasks/{task_id}/status
- POST /api/tasks/{task_id}/completion
- GET /api/councilor/dashboard
- POST /api/demo/seed
