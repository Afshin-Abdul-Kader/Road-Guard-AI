import { USE_MOCK } from '../services/api'

export default function Shell({ role, onSignOut, onBack, backLabel, children }) {
  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar__inner">
          <span className="topbar__mark">ROADGUARD AI</span>
          <span className="topbar__role">
            {USE_MOCK && <span className="mocknote">demo data</span>}
            <span>{role}</span>
            <button className="linkbtn" onClick={onSignOut}>
              Switch role
            </button>
          </span>
        </div>
      </header>

      <main className="main">
        {onBack && (
          <button className="backlink" onClick={onBack}>
            ← {backLabel || 'Back'}
          </button>
        )}
        {children}
      </main>
    </div>
  )
}
