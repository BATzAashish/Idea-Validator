# AI Startup Idea Validator

Validate startup ideas in minutes. Submit a title and description, get a structured AI report, and track ideas in a dashboard.

## Features

- AI-generated validation report with competitors, risks, and profitability score.
- Persistent storage of ideas with detail view and dashboard listing.
- Clean submission flow with structured JSON output from Gemini.

## Tech Stack

- Frontend: React + Vite
- Backend: FastAPI + MongoDB
- AI: Google Gemini

## Project Structure

```
frontend/   # React client
backend/    # FastAPI API
```

## Prerequisites

- Node.js 18+ and npm
- Python 3.10+
- MongoDB running locally on `mongodb://localhost:27017`

## Installation

### 1) Backend

From the `backend` folder:

```bash
python -m venv .venv
\.venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file using the example values below (or copy from `.env.example`):

```env
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB=idea_validator
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-2.0-flash
CORS_ORIGINS=http://localhost:5173
```

Start the API:

```bash
uvicorn app.main:app --reload
```

### 2) Frontend

From the `frontend` folder:

```bash
npm install
```

Create `.env` with the API base URL:

```env
VITE_API_BASE=http://localhost:8000
```

Start the client:

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

## API Endpoints

- `POST /ideas` - Create a new idea
- `GET /ideas` - List ideas
- `GET /ideas/{id}` - Fetch a single idea
- `DELETE /ideas/{id}` - Delete an idea

## Prompt Used

The backend uses this prompt to enforce JSON-only output:

```
You are an AI startup idea validator. Return ONLY JSON.

Rules:
- Concise, realistic answers.
- Exactly 3 competitors, each with name and differentiation.
- Tech stack is 4 to 6 technologies.
- Profitability score is an integer from 0 to 100.
- Risk level must be Low, Medium, or High.

Output JSON schema:
{
  "problem_summary": "",
  "customer_persona": "",
  "market_overview": "",
  "competitors": [
    {"name": "", "differentiation": ""},
    {"name": "", "differentiation": ""},
    {"name": "", "differentiation": ""}
  ],
  "suggested_tech_stack": ["", "", "", ""],
  "risk_level": "",
  "profitability_score": 0,
  "justification": ""
}
```
