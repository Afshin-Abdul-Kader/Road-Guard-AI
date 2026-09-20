# RoadGuard AI — frontend

React + Vite. Runs standalone on mock data, so it never blocks on the backend.

## Run

```bash
cd frontend
npm install
npm run dev     # http://localhost:5173
```

## Switching to the real backend

One file changes behaviour: `src/services/api.js`. Create `frontend/.env.local`:

```
VITE_USE_MOCK=false
VITE_API_BASE=http://localhost:8000
```

Leave `VITE_API_BASE` empty instead if you'd rather use the dev proxy already set
up in `vite.config.js` — requests go to `/api/*` and Vite forwards them to
port 8000, which avoids any CORS setup on FastAPI.

No component imports `fetch` directly, so nothing else needs editing.

## Endpoints used

| Screen | Call |
| --- | --- |
| AI result | `POST /api/detect` (multipart, field `image`) |
| Submit report | `POST /api/reports` (multipart: `image`, `area`, `location`, `description`, `detection`) |
| Public status, issue details | `GET /api/reports/{id}` |
| Worker dashboard | `GET /api/worker/tasks?worker=Worker%20A` |
| Start work, assign worker | `PATCH /api/tasks/{id}/status` — `{"status":"IN_PROGRESS"}` / `{"status":"ASSIGNED","worker":"Worker A"}` |
| Complete work | `POST /api/tasks/{id}/completion` (multipart: `image`, `description`) |
| Councilor dashboard | `GET /api/councilor/dashboard` |

**One thing to confirm with the backend dev:** there was no endpoint in the spec
for assigning a worker, so assignment reuses `PATCH /api/tasks/{id}/status` with
an extra `worker` field rather than inventing a route. If the backend expects
something else, it's a three-line change in `api.js`.

Response shapes the UI expects are documented at the top of `src/services/api.js`
and produced exactly by `src/services/mockBackend.js`.

## Demo script (about 90 seconds)

1. **Public** → take/upload a photo → Analyse road → AI detection → fill Ramapuram / Ramapuram Main Road → Submit. Note the report ID.
2. **Switch role → Ward councilor** → the new report appears in the priority list → open it → assign Worker A.
3. **Switch role → Worker** (Worker A) → the job is in today's work → Start work → Mark completed → add photo and notes → Submit.
4. **Councilor** → it moves to Recently completed.
5. **Public** → Check repair status with the report ID → the road progress bar shows COMPLETED with the repair photo.

Mock state lives in the browser tab, so don't refresh mid-demo.

## Structure

```
src/
├── components/   Badge, RoadProgress, PhotoPicker, IssueMap, Shell, Ui
├── pages/        one file per screen
├── services/     api.js (the only backend seam) + mockBackend.js
├── App.jsx       session + screen stack
└── main.jsx
```

Map is Leaflet + OpenStreetMap, on the councilor dashboard, markers coloured by
severity. If it causes trouble on demo day, delete the `<IssueMap />` line in
`pages/CouncilorDashboard.jsx` — nothing else depends on it.
