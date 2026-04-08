const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || 'Request failed')
  }

  if (response.status === 204) {
    return null
  }

  return response.json()
}

export async function createIdea(payload) {
  return request('/ideas', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function getIdeas() {
  return request('/ideas')
}

export async function getIdea(id) {
  return request(`/ideas/${id}`)
}

export async function deleteIdea(id) {
  return request(`/ideas/${id}`, { method: 'DELETE' })
}
