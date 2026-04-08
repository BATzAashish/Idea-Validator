import { useState } from 'react'
import { Link } from 'react-router-dom'

import { createIdea } from '../lib/api'

const initialState = {
  title: '',
  description: '',
}

function SubmitIdea() {
  const [form, setForm] = useState(initialState)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const [createdId, setCreatedId] = useState('')

  const updateField = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setStatus('loading')
    setError('')
    setCreatedId('')

    try {
      const response = await createIdea(form)
      setCreatedId(response.id)
      setStatus('success')
      setForm(initialState)
    } catch (err) {
      setStatus('error')
      setError(err.message || 'Unable to create idea.')
    }
  }

  return (
    <section className="page">
      <div className="page-intro">
        <p className="eyebrow">Idea intake</p>
        <h1>Validate your next startup in minutes</h1>
        <p className="subtitle">
          Submit a clear title and description. The AI validator will return a
          structured report covering market context, competitors, risks, and a
          profitability score.
        </p>
      </div>

      <form className="card form" onSubmit={handleSubmit}>
        <label>
          <span>Idea title</span>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={updateField}
            placeholder="E.g., Instant research briefs for SaaS teams"
            required
          />
        </label>
        <label>
          <span>Description</span>
          <textarea
            name="description"
            value={form.description}
            onChange={updateField}
            placeholder="Describe who it serves, the problem, and the outcome."
            rows={6}
            required
          />
        </label>
        <div className="form-actions">
          <button className="primary" type="submit" disabled={status === 'loading'}>
            {status === 'loading' ? 'Analyzing...' : 'Generate validation'}
          </button>
          <p className="helper">Average response: 15-25 seconds</p>
        </div>
      </form>

      {status === 'error' && <p className="alert">{error}</p>}

      {status === 'success' && (
        <div className="card success">
          <h3>Report ready</h3>
          <p>Your idea was saved with a full validation report.</p>
          <div className="success-actions">
            <Link className="ghost" to="/ideas">
              View dashboard
            </Link>
            {createdId && (
              <Link className="primary" to={`/ideas/${createdId}`}>
                Open report
              </Link>
            )}
          </div>
        </div>
      )}
    </section>
  )
}

export default SubmitIdea
