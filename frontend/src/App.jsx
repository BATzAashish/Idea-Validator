import { NavLink, Route, Routes } from 'react-router-dom'

import Dashboard from './pages/Dashboard'
import IdeaDetail from './pages/IdeaDetail'
import SubmitIdea from './pages/SubmitIdea'
import './App.css'

function App() {
  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">AI</span>
          <div>
            <p className="brand-title">Idea Validator</p>
            <p className="brand-subtitle">Validate startup concepts fast</p>
          </div>
        </div>
        <nav className="nav">
          <NavLink to="/" end>
            Submit
          </NavLink>
          <NavLink to="/ideas">Dashboard</NavLink>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<SubmitIdea />} />
          <Route path="/ideas" element={<Dashboard />} />
          <Route path="/ideas/:id" element={<IdeaDetail />} />
        </Routes>
      </main>

      <footer className="footer">
        <p>Built for 24h MVP delivery. Structured AI output, zero fluff.</p>
      </footer>
    </div>
  )
}

export default App
