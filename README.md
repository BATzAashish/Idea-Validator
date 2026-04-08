# AI Startup Idea Validator (MVP)

Builds an AI-powered validation report from a startup idea. Users submit a title and description, the system stores the idea, and the report is shown in the dashboard and detail view.

## Structure

- frontend: React (Vite)
- backend: FastAPI + MongoDB + Gemini

## Setup

### Backend

1. From the backend folder, create a virtual environment and install dependencies:

```
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
```

2. Create a .env file using the example:

```
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB=idea_validator
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-1.5-flash
CORS_ORIGINS=http://localhost:5173
```

3. Run the API:

```
uvicorn app.main:app --reload
```

### Frontend

1. From the frontend folder, install dependencies:

```
npm install
```

2. Create a .env file using the example:

```
VITE_API_BASE=http://localhost:8000
```

3. Start the app:

```
npm run dev
```

## API Endpoints

- POST /ideas
- GET /ideas
- GET /ideas/{id}
- DELETE /ideas/{id}

## AI Prompt Used

The backend uses the following prompt to enforce a JSON-only report:

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
