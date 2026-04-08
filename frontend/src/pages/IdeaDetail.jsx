import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { getIdea } from '../lib/api'

function IdeaDetail() {
  const { id } = useParams()
  const [idea, setIdea] = useState(null)
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    const loadIdea = async () => {
      setStatus('loading')
      setError('')
      try {
        const data = await getIdea(id)
        if (active) {
          setIdea(data)
          setStatus('ready')
        }
      } catch (err) {
        if (active) {
          setStatus('error')
          setError(err.message || 'Unable to load report.')
        }
      }
    }

    loadIdea()

    return () => {
      active = false
    }
  }, [id])

  if (status === 'loading') {
    return <p className="helper">Loading report...</p>
  }

  if (status === 'error') {
    return <p className="alert">{error}</p>
  }

  if (!idea) {
    return null
  }

  const { report } = idea

  return (
    <section className="page">
      <div className="page-intro row">
        <div>
          <p className="eyebrow">Report</p>
          <h1>{idea.title}</h1>
          <p className="subtitle">{idea.description}</p>
        </div>
        <div className="actions">
          <Link className="ghost" to="/ideas">
            Back to dashboard
          </Link>
          <Link className="primary" to="/">
            New submission
          </Link>
        </div>
      </div>

      <div className="report-meta">
        <article className="card stat-card">
          <p className="metric">Risk level</p>
          <p className={`risk ${report.risk_level.toLowerCase()}`}>
            {report.risk_level}
          </p>
        </article>
        <article className="card stat-card">
          <p className="metric">Profitability score</p>
          <p className="score">{report.profitability_score}</p>
        </article>
        <article className="card stat-card">
          <p className="metric">Suggested stack</p>
          <div className="chip-row">
            {report.suggested_tech_stack.map((tech) => (
              <span key={tech} className="chip">
                {tech}
              </span>
            ))}
          </div>
        </article>
      </div>

      <div className="grid report-grid">
        <article className="card report-card">
          <h3>Problem summary</h3>
          <p>{report.problem_summary}</p>
        </article>
        <article className="card report-card">
          <h3>Customer persona</h3>
          <p>{report.customer_persona}</p>
        </article>
        <article className="card report-card">
          <h3>Market overview</h3>
          <p>{report.market_overview}</p>
        </article>
      </div>

      <div className="grid split">
        <article className="card report-card">
          <h3>Competitors</h3>
          <ul className="list competitors">
            {report.competitors.map((competitor, index) => (
              <li key={`${competitor.name}-${index}`}>
                <strong>{competitor.name}</strong>
                <span>{competitor.differentiation}</span>
              </li>
            ))}
          </ul>
        </article>
        <article className="card report-card justification">
          <h3>Justification</h3>
          <p>{report.justification}</p>
        </article>
      </div>
    </section>
  )
}

export default IdeaDetail
