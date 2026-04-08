import asyncio
import json
import os
import logging

import google.generativeai as genai
from groq import Groq

logger = logging.getLogger(__name__)

PROMPT = """
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
"""


def _fallback_report():
    return {
        "problem_summary": "The idea targets a clear pain point but needs sharper focus on a single workflow.",
        "customer_persona": "Early-stage founders and solo builders validating a product direction.",
        "market_overview": "The market is active with many light-weight tools, but buyers want faster insight.",
        "competitors": [
            {"name": "LeanCanvas", "differentiation": "Template-driven, lighter on AI depth."},
            {"name": "IdeaBuddy", "differentiation": "Business planning focus, less tactical validation."},
            {"name": "FounderStack", "differentiation": "Broad suite, limited per-idea depth."},
        ],
        "suggested_tech_stack": [
            "React",
            "FastAPI",
            "MongoDB",
            "LLM API",
        ],
        "risk_level": "Medium",
        "profitability_score": 62,
        "justification": "Strong need, moderate competition, execution quality will determine traction.",
    }


def _normalize_report(report):
    fallback = _fallback_report()
    if not isinstance(report, dict):
        return fallback

    competitors = report.get("competitors", [])
    if not isinstance(competitors, list):
        competitors = []
    if len(competitors) < 3:
        competitors = competitors + fallback["competitors"]
    competitors = competitors[:3]

    tech_stack = report.get("suggested_tech_stack", [])
    if not isinstance(tech_stack, list):
        tech_stack = []
    if len(tech_stack) < 4:
        tech_stack = tech_stack + fallback["suggested_tech_stack"]
    tech_stack = tech_stack[:6]

    risk_level = report.get("risk_level")
    if risk_level not in {"Low", "Medium", "High"}:
        risk_level = "Medium"

    score = report.get("profitability_score", 0)
    try:
        score = int(score)
    except (TypeError, ValueError):
        score = fallback["profitability_score"]
    score = max(0, min(100, score))

    return {
        "problem_summary": report.get("problem_summary") or fallback["problem_summary"],
        "customer_persona": report.get("customer_persona") or fallback["customer_persona"],
        "market_overview": report.get("market_overview") or fallback["market_overview"],
        "competitors": competitors,
        "suggested_tech_stack": tech_stack,
        "risk_level": risk_level,
        "profitability_score": score,
        "justification": report.get("justification") or fallback["justification"],
    }


def _generate_report_with_groq(title: str, description: str):
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        return None

    model_name = os.getenv("GROQ_MODEL", "llama-3.1-8b-instant")
    client = Groq(api_key=api_key)

    payload = {"title": title, "description": description}
    messages = [
        {"role": "system", "content": PROMPT.strip()},
        {"role": "user", "content": f"Input:\n{json.dumps(payload, ensure_ascii=True)}"},
    ]

    try:
        response = client.chat.completions.create(
            model=model_name,
            messages=messages,
            temperature=0.7,
        )
        text = response.choices[0].message.content.strip()
        return _normalize_report(json.loads(text))
    except Exception as exc:
        logger.warning("Groq request failed: %s", exc)
        return None


def _generate_report_with_gemini(title: str, description: str):
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return None

    genai.configure(api_key=api_key)
    model_name = os.getenv("GEMINI_MODEL", "gemini-2.0-flash")
    model = genai.GenerativeModel(model_name)

    payload = {"title": title, "description": description}
    prompt = f"{PROMPT}\nInput:\n{json.dumps(payload, ensure_ascii=True)}"

    try:
        response = model.generate_content(
            prompt,
            generation_config={"response_mime_type": "application/json"},
        )
        text = response.text.strip()
        return _normalize_report(json.loads(text))
    except Exception as exc:
        logger.warning("Gemini request failed: %s", exc)
        return None


def _generate_report_sync(title: str, description: str):
    report = _generate_report_with_groq(title, description)
    if report:
        return report

    report = _generate_report_with_gemini(title, description)
    if report:
        return report

    return _fallback_report()


async def generate_report(title: str, description: str):
    report = await asyncio.to_thread(_generate_report_sync, title, description)
    return _normalize_report(report)
