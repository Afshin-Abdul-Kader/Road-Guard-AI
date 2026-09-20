import { useState } from 'react'
import Shell from './components/Shell'
import Login from './pages/Login'
import PublicHome from './pages/PublicHome'
import PublicPhoto from './pages/PublicPhoto'
import AiResult from './pages/AiResult'
import ReportDetails from './pages/ReportDetails'
import ReportSuccess from './pages/ReportSuccess'
import PublicStatus from './pages/PublicStatus'
import WorkerTasks from './pages/WorkerTasks'
import WorkDetails from './pages/WorkDetails'
import CompleteWork from './pages/CompleteWork'
import CouncilorDashboard from './pages/CouncilorDashboard'
import IssueDetails from './pages/IssueDetails'

/**
 * A tiny screen router. No routing library — the demo is a linear flow and
 * keeping files/photos in memory between screens is simpler this way.
 */
const SCREENS = {
  'public.home': PublicHome,
  'public.photo': PublicPhoto,
  'public.result': AiResult,
  'public.details': ReportDetails,
  'public.success': ReportSuccess,
  'public.status': PublicStatus,
  'worker.tasks': WorkerTasks,
  'worker.task': WorkDetails,
  'worker.complete': CompleteWork,
  'councilor.dashboard': CouncilorDashboard,
  'councilor.issue': IssueDetails,
}

const HOME = {
  PUBLIC: 'public.home',
  WORKER: 'worker.tasks',
  COUNCILOR: 'councilor.dashboard',
}

const ROLE_LABEL = {
  PUBLIC: 'Public',
  WORKER: 'Worker',
  COUNCILOR: 'Ward councilor',
}

export default function App() {
  const [session, setSession] = useState(null)
  const [stack, setStack] = useState([])

  function signIn(next) {
    setSession(next)
    setStack([{ name: HOME[next.role], params: {} }])
  }

  function signOut() {
    setSession(null)
    setStack([])
  }

  function go(name, params = {}) {
    // Returning to a role's home screen resets the stack rather than deepening it.
    if (Object.values(HOME).includes(name)) setStack([{ name, params }])
    else setStack((s) => [...s, { name, params }])
  }

  const back = () => setStack((s) => (s.length > 1 ? s.slice(0, -1) : s))

  if (!session) return <Login onSignIn={signIn} />

  const current = stack[stack.length - 1]
  const Screen = SCREENS[current.name]

  return (
    <Shell
      role={ROLE_LABEL[session.role]}
      onSignOut={signOut}
      onBack={stack.length > 1 ? back : null}
      backLabel="Back"
    >
      <Screen
        go={go}
        back={back}
        params={current.params}
        session={session}
        onChangeWorker={(worker) => setSession((s) => ({ ...s, worker }))}
      />
    </Shell>
  )
}
