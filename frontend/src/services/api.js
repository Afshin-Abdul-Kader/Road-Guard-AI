/**
 * The only place in the app that talks to the backend.
 *
 * Mock mode is on by default so the frontend runs standalone.
 * To point at the real FastAPI server, create frontend/.env.local:
 *
 *   VITE_USE_MOCK=false
 *   VITE_API_BASE=http://localhost:8000
 *
 * Leave VITE_API_BASE empty to use the Vite dev proxy in vite.config.js
 * (requests go to /api/* and Vite forwards them to :8000, no CORS needed).
 *
 * Endpoints used — do not rename:
 *   POST   /api/detect
 *   POST   /api/reports
 *   GET    /api/reports/{id}
 *   GET    /api/worker/tasks
 *   PATCH  /api/tasks/{id}/status
 *   POST   /api/tasks/{id}/completion
 *   GET    /api/councilor/dashboard
 *
 * Expected shapes (mockBackend.js returns these exactly):
 *   detect      -> { issue_type, confidence, severity, priority_score?, expected_fix_days? }
 *   report      -> { report_id, issue_type, severity, area, location, description,
 *                    status, priority_score, expected_fix_days, image_url,
 *                    assigned_worker, lat, lng }
 *   task        -> { task_id, report_id, issue_type, area, location,
 *                    priority, priority_score, status, image_url }
 *   dashboard   -> { stats: { critical, high, in_progress, completed },
 *                    priority_roads: [report], recently_completed?: [report] }
 */

import { mockBackend } from './mockBackend'

export const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'
const BASE = import.meta.env.VITE_API_BASE ?? ''

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, options)
  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    throw new Error(detail || `Request failed (${res.status})`)
  }
  return res.status === 204 ? null : res.json()
}

export const WORKERS = mockBackend.workers

export const api = {
  /** Screen 4 — AI detection. The backend is the source of truth. */
  detect(file) {
    if (USE_MOCK) return mockBackend.detect(file)
    const body = new FormData()
    body.append('file', file)
    return request('/api/detect', { method: 'POST', body })
  },

  /** Screen 5 — submit a citizen report. */
  createReport({ file, area, location, description, detection }) {
    if (USE_MOCK) return mockBackend.createReport({ file, area, location, description, detection })
    const body = new FormData()
    if (file) body.append('image', file)
    body.append('area', area)
    body.append('location', location)
    body.append('description', description)
    if (detection) body.append('detection', JSON.stringify(detection))
    return request('/api/reports', { method: 'POST', body })
  },

  /** Public status tracking + councilor issue details. */
  getReport(id) {
    if (USE_MOCK) return mockBackend.getReport(id)
    return request(`/api/reports/${id}`)
  },

  /** Screen 7 — worker's assigned tasks. */
  workerTasks(worker) {
    if (USE_MOCK) return mockBackend.workerTasks(worker)
    const q = worker ? `?worker=${encodeURIComponent(worker)}` : ''
    return request(`/api/worker/tasks${q}`)
  },

  /**
   * Screen 8 — start work, and Screen 12 — assign a worker.
   * Assignment reuses this endpoint with status ASSIGNED plus a worker field,
   * rather than inventing a new route. Confirm the field name with backend.
   */
  updateTaskStatus(taskId, { status }) {
  if (USE_MOCK) return mockBackend.updateTaskStatus(taskId, { status })

  return request(`/api/tasks/${taskId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  })
},

assignTask(taskId, worker_name) {
  if (USE_MOCK) {
    return mockBackend.updateTaskStatus(taskId, {
      status: 'ASSIGNED',
      worker: worker_name,
    })
  }

  return request(`/api/tasks/${taskId}/assign`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ worker_name }),
  })
},

  /** Screen 9 — completion photo + notes. */
  completeTask(taskId, { file, description }) {
    if (USE_MOCK) return mockBackend.completeTask(taskId, { file, description })
    const body = new FormData()
    if (file) body.append('image', file)
    body.append('description', description)
    return request(`/api/tasks/${taskId}/completion`, { method: 'POST', body })
  },

  /** Screens 10 & 11 — councilor stats and priority roads. */
  councilorDashboard() {
    if (USE_MOCK) return mockBackend.councilorDashboard()
    return request('/api/councilor/dashboard')
  },
}
