import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { deleteIdea, getIdeas } from '../lib/api'

function riskTone(risk) {
  if (risk === 'High') return 'risk high'
  if (risk === 'Medium') return 'risk medium'
  return 'risk low'
}

function Dashboard() {
  const [ideas, setIdeas] = useState([])
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    const loadIdeas = async () => {
      setStatus('loading')
      setError('')
      try {
        const data = await getIdeas()
        if (active) {
          setIdeas(data)
          setStatus('ready')
        }
      } catch (err) {
        if (active) {
          setStatus('error')
          setError(err.message || 'Unable to load ideas.')
        }
      }
    }

    loadIdeas()

    return () => {
      active = false
    }
  }, [])

  const handleDelete = async (id) => {
    const previous = ideas
    setIdeas((items) => items.filter((item) => item.id !== id))
    try {
      await deleteIdea(id)
    } catch (err) {
      setIdeas(previous)
      setError(err.message || 'Unable to delete idea.')
    }
  }

  return (
    <section className="page">
      <div className="page-intro row">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h1>All validation reports</h1>
          <p className="subtitle">
            Track every submitted idea and open the full report when you are
            ready to share it.
          </p>
        </div>
        <Link className="primary" to="/">
          New submission
        </Link>
      </div>

      {status === 'loading' && <p className="helper">Loading ideas...</p>}
      {status === 'error' && <p className="alert">{error}</p>}

      {status === 'ready' && ideas.length === 0 && (
        <div className="card empty">
          <h3>No ideas yet</h3>
          <p>Submit your first startup idea to generate a report.</p>
        </div>
      )}

      {ideas.length > 0 && (
        <div className="grid">
          {ideas.map((idea) => (
            <article key={idea.id} className="card idea-card">
              <div className="idea-card__top">
                <div>
                  <h3>{idea.title}</h3>
                  <p className="muted">{idea.description}</p>
                </div>
                <span className={riskTone(idea.risk_level)}>{idea.risk_level}</span>
              </div>
              <div className="idea-card__meta">
                <div>
                  <p className="metric">Profitability score</p>
                  <p className="metric-value">{idea.profitability_score}</p>
                </div>
                <div>
                  <p className="metric">Created</p>
                  <p className="metric-value">{new Date(idea.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="idea-card__actions">
                <Link className="ghost" to={`/ideas/${idea.id}`}>
                  View report
                </Link>
                <button className="ghost danger" onClick={() => handleDelete(idea.id)}>
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default Dashboard
