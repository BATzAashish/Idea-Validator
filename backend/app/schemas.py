from typing import List, Literal

from pydantic import BaseModel, Field


class IdeaCreate(BaseModel):
    title: str = Field(..., min_length=2, max_length=100)
    description: str = Field(..., min_length=10, max_length=2000)


class Competitor(BaseModel):
    name: str
    differentiation: str


class IdeaReport(BaseModel):
    problem_summary: str
    customer_persona: str
    market_overview: str
    competitors: List[Competitor]
    suggested_tech_stack: List[str]
    risk_level: Literal["Low", "Medium", "High"]
    profitability_score: int
    justification: str


class IdeaResponse(BaseModel):
    id: str
    title: str
    description: str
    report: IdeaReport
    created_at: str


class IdeaListItem(BaseModel):
    id: str
    title: str
    description: str
    risk_level: Literal["Low", "Medium", "High"]
    profitability_score: int
    created_at: str
