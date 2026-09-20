/**
 * In-memory stand-in for the FastAPI backend.
 *
 * Every function here returns the EXACT response shape documented in
 * services/api.js, so swapping to the real backend is a one-flag change
 * (VITE_USE_MOCK=false) and nothing in the UI has to be touched.
 *
 * State lives for the life of the browser tab, which is enough to demo the
 * full loop: public reports -> councilor assigns -> worker completes ->
 * public sees it closed.
 */

const WORKERS = ['Worker A', 'Worker B', 'Worker C']

// Repairs closed before this demo session started.
const COMPLETED_BASELINE = 25

let nextId = 1043

const issues = [
  {
    report_id: 'RG-1042',
    issue_type: 'Pothole',
    description: 'Deep pothole near the bus stop, two-wheelers are swerving into traffic.',
    area: 'Ramapuram',
    location: 'Ramapuram Main Road',
    severity: 'CRITICAL',
    priority_score: 94,
    expected_fix_days: 2,
    status: 'REPORTED',
    assigned_worker: null,
    image_url: null,
    reported_at: '2026-09-18',
    lat: 13.0324,
    lng: 80.1812,
  },
  {
    report_id: 'RG-1041',
    issue_type: 'Multiple potholes',
    description: 'Stretch of about 40 metres broken up after the rain.',
    area: 'Valasaravakkam',
    location: 'Arcot Road',
    severity: 'CRITICAL',
    priority_score: 89,
    expected_fix_days: 3,
    status: 'REPORTED',
    assigned_worker: null,
    image_url: null,
    reported_at: '2026-09-18',
    lat: 13.0468,
    lng: 80.1752,
  },
  {
    report_id: 'RG-1039',
    issue_type: 'Cracks',
    description: 'Long surface cracks widening across both lanes.',
    area: 'Porur',
    location: 'Mount Poonamallee Road',
    severity: 'HIGH',
    priority_score: 72,
    expected_fix_days: 5,
    status: 'ASSIGNED',
    assigned_worker: 'Worker A',
    image_url: null,
    reported_at: '2026-09-17',
    lat: 13.0381,
    lng: 80.1565,
  },
  {
    report_id: 'RG-1038',
    issue_type: 'Pothole',
    description: 'Water collecting in a pothole right at the junction.',
    area: 'Ramapuram',
    location: 'Mugalivakkam Main Road',
    severity: 'HIGH',
    priority_score: 68,
    expected_fix_days: 4,
    status: 'IN_PROGRESS',
    assigned_worker: 'Worker A',
    image_url: null,
    reported_at: '2026-09-16',
    lat: 13.0261,
    lng: 80.1698,
  },
  {
    report_id: 'RG-1037',
    issue_type: 'Broken road edge',
    description: 'Edge of the carriageway has crumbled near the school gate.',
    area: 'Alwarthirunagar',
    location: 'Pillaiyar Koil Street',
    severity: 'HIGH',
    priority_score: 64,
    expected_fix_days: 4,
    status: 'IN_PROGRESS',
    assigned_worker: 'Worker B',
    image_url: null,
    reported_at: '2026-09-16',
    lat: 13.0531,
    lng: 80.1836,
  },
  {
    report_id: 'RG-1036',
    issue_type: 'Open manhole',
    description: 'Cover missing beside the service lane.',
    area: 'Saligramam',
    location: 'Duraisamy Road',
    severity: 'CRITICAL',
    priority_score: 91,
    expected_fix_days: 1,
    status: 'IN_PROGRESS',
    assigned_worker: 'Worker C',
    image_url: null,
    reported_at: '2026-09-15',
    lat: 13.0509,
    lng: 80.1972,
  },
  {
    report_id: 'RG-1035',
    issue_type: 'Pothole',
    description: 'Cluster of potholes outside the market entrance.',
    area: 'Virugambakkam',
    location: 'Kaliamman Koil Street',
    severity: 'HIGH',
    priority_score: 61,
    expected_fix_days: 6,
    status: 'ASSIGNED',
    assigned_worker: 'Worker A',
    image_url: null,
    reported_at: '2026-09-15',
    lat: 13.0561,
    lng: 80.1882,
  },
  {
    report_id: 'RG-1034',
    issue_type: 'Cracks',
    description: 'Hairline cracks spreading along the middle of the road.',
    area: 'Porur',
    location: 'Kundrathur Main Road',
    severity: 'MEDIUM',
    priority_score: 44,
    expected_fix_days: 9,
    status: 'REPORTED',
    assigned_worker: null,
    image_url: null,
    reported_at: '2026-09-14',
    lat: 13.0287,
    lng: 80.1451,
  },
  {
    report_id: 'RG-1033',
    issue_type: 'Waterlogging',
    description: 'Road dips and holds water for hours after rain.',
    area: 'Ramapuram',
    location: 'Bharathi Salai',
    severity: 'MEDIUM',
    priority_score: 39,
    expected_fix_days: 10,
    status: 'REPORTED',
    assigned_worker: null,
    image_url: null,
    reported_at: '2026-09-14',
    lat: 13.0355,
    lng: 80.1747,
  },
  {
    report_id: 'RG-1032',
    issue_type: 'Pothole',
    description: 'Repaired and resurfaced.',
    area: 'Saligramam',
    location: 'Arcot Road Service Lane',
    severity: 'HIGH',
    priority_score: 58,
    expected_fix_days: 3,
    status: 'COMPLETED',
    assigned_worker: 'Worker B',
    image_url: null,
    reported_at: '2026-09-11',
    lat: 13.0489,
    lng: 80.2015,
  },
  {
    report_id: 'RG-1031',
    issue_type: 'Cracks',
    description: 'Crack sealing finished.',
    area: 'Porur',
    location: 'Trunk Road',
    severity: 'HIGH',
    priority_score: 55,
    expected_fix_days: 4,
    status: 'COMPLETED',
    assigned_worker: 'Worker C',
    image_url: null,
    reported_at: '2026-09-10',
    lat: 13.0342,
    lng: 80.1589,
  },
  {
    report_id: 'RG-1030',
    issue_type: 'Pothole',
    description: 'Patched with hot mix.',
    area: 'Virugambakkam',
    location: 'Sarathy Nagar Main Road',
    severity: 'MEDIUM',
    priority_score: 41,
    expected_fix_days: 6,
    status: 'COMPLETED',
    assigned_worker: 'Worker A',
    image_url: null,
    reported_at: '2026-09-09',
    lat: 13.0603,
    lng: 80.1859,
  },
]

// The AI service would return these; the frontend never computes them.
const DETECTIONS = [
  { issue_type: 'Pothole', confidence: 0.87, severity: 'HIGH', priority_score: 78, expected_fix_days: 3 },
  { issue_type: 'Multiple potholes', confidence: 0.93, severity: 'CRITICAL', priority_score: 92, expected_fix_days: 2 },
  { issue_type: 'Cracks', confidence: 0.81, severity: 'MEDIUM', priority_score: 47, expected_fix_days: 8 },
  { issue_type: 'Broken road edge', confidence: 0.76, severity: 'HIGH', priority_score: 66, expected_fix_days: 5 },
]

let detectionTurn = 0

const wait = (ms) => new Promise((r) => setTimeout(r, ms))
const clone = (o) => JSON.parse(JSON.stringify(o))
const find = (id) => issues.find((i) => i.report_id === id || `T-${i.report_id}` === id)

function toTask(issue) {
  return {
    task_id: `T-${issue.report_id}`,
    report_id: issue.report_id,
    issue_type: issue.issue_type,
    description: issue.description,
    area: issue.area,
    location: issue.location,
    priority: issue.severity,
    priority_score: issue.priority_score,
    status: issue.status,
    assigned_worker: issue.assigned_worker,
    image_url: issue.image_url,
  }
}

export const mockBackend = {
  workers: WORKERS,

  async detect(file) {
    await wait(1600)
    const d = DETECTIONS[detectionTurn % DETECTIONS.length]
    detectionTurn += 1
    return { ...d, image_url: file ? URL.createObjectURL(file) : null }
  },

  async createReport({ file, area, location, description, detection }) {
    await wait(700)
    const issue = {
      report_id: `RG-${nextId++}`,
      issue_type: detection?.issue_type || 'Road damage',
      description: description || '',
      area,
      location,
      severity: detection?.severity || 'MEDIUM',
      priority_score: detection?.priority_score ?? 50,
      expected_fix_days: detection?.expected_fix_days ?? 7,
      status: 'REPORTED',
      assigned_worker: null,
      image_url: file ? URL.createObjectURL(file) : detection?.image_url || null,
      reported_at: new Date().toISOString().slice(0, 10),
      lat: 13.0324 + (Math.random() - 0.5) * 0.03,
      lng: 80.1812 + (Math.random() - 0.5) * 0.03,
    }
    issues.unshift(issue)
    return clone({
      report_id: issue.report_id,
      issue_type: issue.issue_type,
      severity: issue.severity,
      area: issue.area,
      status: issue.status,
    })
  },

  async getReport(id) {
    await wait(400)
    const issue = find(id)
    if (!issue) throw new Error(`No report found with ID ${id}`)
    return clone(issue)
  },

  async workerTasks(worker) {
    await wait(500)
    return issues
      .filter((i) => i.assigned_worker === worker && i.status !== 'REPORTED')
      .sort((a, b) => b.priority_score - a.priority_score)
      .map(toTask)
  },

  async updateTaskStatus(taskId, { status, worker }) {
    await wait(500)
    const issue = find(taskId)
    if (!issue) throw new Error(`No task found with ID ${taskId}`)
    issue.status = status
    if (worker) issue.assigned_worker = worker
    return toTask(issue)
  },

  async completeTask(taskId, { file, description }) {
    await wait(900)
    const issue = find(taskId)
    if (!issue) throw new Error(`No task found with ID ${taskId}`)
    issue.status = 'COMPLETED'
    issue.completion = {
      description,
      image_url: file ? URL.createObjectURL(file) : null,
      completed_at: new Date().toISOString().slice(0, 10),
    }
    return {
      task_id: taskId,
      status: 'COMPLETED',
      councilor_notified: true,
      reporter_notified: true,
    }
  },

  async councilorDashboard() {
    await wait(600)
    const open = issues.filter((i) => i.status !== 'COMPLETED')
    return {
      stats: {
        critical: open.filter((i) => i.severity === 'CRITICAL').length,
        high: open.filter((i) => i.severity === 'HIGH').length,
        in_progress: issues.filter((i) => i.status === 'IN_PROGRESS').length,
        completed: COMPLETED_BASELINE + issues.filter((i) => i.status === 'COMPLETED').length,
      },
      priority_roads: clone(
        issues
          .filter((i) => i.status !== 'COMPLETED')
          .sort((a, b) => b.priority_score - a.priority_score),
      ),
      recently_completed: clone(
        issues.filter((i) => i.status === 'COMPLETED').slice(0, 5),
      ),
    }
  },
}
