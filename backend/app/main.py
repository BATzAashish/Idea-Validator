from datetime import datetime
import os

from bson import ObjectId
from bson.errors import InvalidId
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from app.ai import generate_report
from app.database import get_db
from app.schemas import IdeaCreate, IdeaListItem, IdeaResponse

_env_path = os.path.join(os.path.dirname(__file__), "..", ".env")
load_dotenv(_env_path)

app = FastAPI(title="Idea Validator API")

origins = [
    origin.strip()
    for origin in os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"] ,
    allow_headers=["*"],
)


def _serialize_idea(doc):
    created_at = doc.get("created_at")
    return {
        "id": str(doc["_id"]),
        "title": doc.get("title"),
        "description": doc.get("description"),
        "report": doc.get("report"),
        "created_at": created_at.isoformat() if created_at else None,
    }


def _serialize_list_item(doc):
    created_at = doc.get("created_at")
    report = doc.get("report") or {}
    return {
        "id": str(doc["_id"]),
        "title": doc.get("title"),
        "description": doc.get("description"),
        "problem_summary": report.get("problem_summary"),
        "risk_level": report.get("risk_level", "Medium"),
        "profitability_score": report.get("profitability_score", 0),
        "created_at": created_at.isoformat() if created_at else None,
    }


@app.post("/ideas", response_model=IdeaResponse)
async def create_idea(payload: IdeaCreate):
    db = get_db()
    report = await generate_report(payload.title, payload.description)
    doc = {
        "title": payload.title,
        "description": payload.description,
        "report": report,
        "created_at": datetime.utcnow(),
    }
    result = await db.ideas.insert_one(doc)
    doc["_id"] = result.inserted_id
    return _serialize_idea(doc)


@app.get("/ideas", response_model=list[IdeaListItem])
async def list_ideas():
    db = get_db()
    cursor = db.ideas.find().sort("created_at", -1)
    items = []
    async for doc in cursor:
        items.append(_serialize_list_item(doc))
    return items


@app.get("/ideas/{idea_id}", response_model=IdeaResponse)
async def get_idea(idea_id: str):
    db = get_db()
    try:
        oid = ObjectId(idea_id)
    except InvalidId as exc:
        raise HTTPException(status_code=400, detail="Invalid idea id") from exc

    doc = await db.ideas.find_one({"_id": oid})
    if not doc:
        raise HTTPException(status_code=404, detail="Idea not found")
    return _serialize_idea(doc)


@app.delete("/ideas/{idea_id}")
async def delete_idea(idea_id: str):
    db = get_db()
    try:
        oid = ObjectId(idea_id)
    except InvalidId as exc:
        raise HTTPException(status_code=400, detail="Invalid idea id") from exc

    result = await db.ideas.delete_one({"_id": oid})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Idea not found")
    return {"status": "deleted"}
