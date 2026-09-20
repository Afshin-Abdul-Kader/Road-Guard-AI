import { useState } from 'react'
import { WORKERS } from '../services/api'

export default function Login({ onSignIn }) {
  const [step, setStep] = useState('role')

  return (
    <div className="login">
      <div className="login__panel">
        <h1 className="login__mark">
          ROAD<span>GUARD</span> AI
        </h1>
        <p className="login__tagline">Smart road maintenance platform</p>
        <div className="lane login__lane" aria-hidden="true" />

        {step === 'role' && (
          <>
            <p className="login__prompt">Who is using this device?</p>
            <button className="role-btn role-btn--accent" onClick={() => onSignIn({ role: 'PUBLIC' })}>
              <strong>Public</strong>
              <small>Report a road problem near you</small>
            </button>
            <button className="role-btn" onClick={() => setStep('gov')}>
              <strong>Government official</strong>
              <small>Manage and prioritise repairs</small>
            </button>
          </>
        )}

        {step === 'gov' && (
          <>
            <p className="login__prompt">Which department account?</p>
            <button
              className="role-btn"
              onClick={() => onSignIn({ role: 'WORKER', worker: WORKERS[0] })}
            >
              <strong>Worker</strong>
              <small>Signing in as {WORKERS[0]} · see assigned repairs</small>
            </button>
            <button className="role-btn" onClick={() => onSignIn({ role: 'COUNCILOR' })}>
              <strong>Ward councilor</strong>
              <small>Ward priorities and worker assignment</small>
            </button>
            <button className="linkbtn" onClick={() => setStep('role')}>
              ← Back
            </button>
          </>
        )}

        <p className="login__note">
          Demo build. Roles are selected directly — no account or password needed.
        </p>
      </div>
    </div>
  )
}
