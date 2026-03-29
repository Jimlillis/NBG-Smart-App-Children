from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from supabase import create_client, Client
import google.generativeai as genai
import os
from pathlib import Path
from dotenv import load_dotenv
from typing import Any, cast

_ENV_LOCAL = Path(__file__).resolve().parent / ".env"
_ENV_REPO_ROOT = Path(__file__).resolve().parents[1] / ".env"

# Prefer ai_agent/.env to avoid mixing with backend config.
# Use override=True so values in the .env win even if the shell has empty env vars set.
_dotenv_path = _ENV_LOCAL if _ENV_LOCAL.exists() else _ENV_REPO_ROOT
load_dotenv(dotenv_path=_dotenv_path, override=True)

router = APIRouter(prefix="", tags=["Saving Goals"])

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

_missing = [
    name
    for name, value in (
        ("SUPABASE_URL", SUPABASE_URL),
        ("SUPABASE_KEY", SUPABASE_KEY),
        ("GEMINI_API_KEY", GEMINI_API_KEY),
    )
    if not value
]
if _missing:
    raise RuntimeError(
        "Missing required environment variables: "
        + ", ".join(_missing)
        + f". Loaded dotenv from: {_dotenv_path}"
    )

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("models/gemini-flash-latest")


class NewGoalRequest(BaseModel):
    child_id: str
    item_name: str
    target_amount: float
    category: str


@router.post("/create-goal")
async def create_goal(request: NewGoalRequest):
    try:
        child_res = supabase.table("children").select("*").eq("id", request.child_id).execute()
        if not child_res.data:
            raise HTTPException(status_code=404, detail="Το παιδί δεν βρέθηκε.")

        child = cast(dict[str, Any], child_res.data[0])

        cap_res = (
            supabase.table("spending_caps")
            .select("*")
            .eq("child_id", request.child_id)
            .eq("category", request.category)
            .execute()
        )
        cap_data = cast(list[dict[str, Any]], cap_res.data or [])

        current_savings = float(child.get("savings_balance", 0) or 0)
        cap_info = (
            f"Όριο {request.category}: {cap_data[0]['limit_amount']}€"
            if cap_data
            else "Δεν υπάρχει συγκεκριμένο όριο για αυτή την κατηγορία."
        )

        missing_amount = request.target_amount - current_savings
        monthly_rate = missing_amount / 3 if missing_amount > 0 else 0

        prompt = f"""
        Είσαι ο Finny, ένας πανέξυπνος οικονομικός σύμβουλος για παιδιά {child['age']} ετών.
        Στόχος: {request.item_name} αξίας {request.target_amount}€.
        Λείπουν: {missing_amount}€.
        Μηνιαίος ρυθμός (για 3 μήνες): {monthly_rate:.2f}€/μήνα.
        Πληροφορία ορίου: {cap_info}.

        ΟΔΗΓΙΑ: Απάντησε ΑΥΣΤΗΡΑ σε δύο προτάσεις στα Ελληνικά:
        1. Στην πρώτη πρόταση, ανέφερε ότι λείπουν {missing_amount}€ και πες τη γνώμη σου αν η τιμή των {request.target_amount}€ είναι λογική για ένα {request.item_name}.
        2. Στη δεύτερη πρόταση, πρότεινε να αποταμιεύει {monthly_rate:.2f}€ το μήνα για να το έχει σε 3 μήνες, συνδέοντάς το με το {cap_info}.
        """

        response = model.generate_content(prompt)
        ai_response = (response.text or "").strip()

        goal_data = {
            "child_id": request.child_id,
            "item_name": request.item_name,
            "category": request.category,
            "target_amount": request.target_amount,
            "current_saved": current_savings,
            "ai_suggestion": ai_response,
        }

        insert_result = supabase.table("saving_goals").insert(goal_data).execute()

        return {
            "status": "success",
            "goal": insert_result.data[0],
            "suggestion": ai_response,
            "calculation": {
                "missing": missing_amount,
                "monthly_needed": round(monthly_rate, 2),
            },
        }

    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/get-goals/{child_id}")
async def get_goals(child_id: str):
    goals = supabase.table("saving_goals").select("*").eq("child_id", child_id).execute()
    return goals.data


@router.get("/debug/children")
async def get_all_children():
    res = supabase.table("children").select("id, fullname").execute()
    return res.data