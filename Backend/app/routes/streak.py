from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date, timedelta
from app import models
from app.database import get_db
from app.depenencies import get_current_user

router = APIRouter(prefix="/streak", tags=["Streak"])

# Helper: calculate streaks
def calculate_streaks(records):
    if not records:
        return 0, 0

    records = sorted([r.date for r in records if r.status == "nofap"])
    longest = 0
    current = 0
    temp = 0
    today = date.today()

    for i in range(len(records)):
        if i == 0 or records[i] == records[i-1] + timedelta(days=1):
            temp += 1
        else:
            temp = 1
        longest = max(longest, temp)

    if records and records[-1] == today:
        current = 1
        for j in range(len(records) - 2, -1, -1):
            if records[j] == records[j+1] - timedelta(days=1):
                current += 1
            else:
                break
    else:
        current = 0

    return current, longest

# 🎯 GET /streak/summary
@router.get("/summary")
def get_streak_summary(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    user_id = current_user.id
    records = db.query(models.DailyRecord).filter(models.DailyRecord.user_id == user_id).all()

    fap_days = sum(1 for r in records if r.status == "fap")
    nofap_days = sum(1 for r in records if r.status == "nofap")

    current_streak, longest_streak = calculate_streaks(records)

    # Certificates that should be unlocked
    levels = [
        {"day": 1, "label": "Beginner 🟢"},
        {"day": 7, "label": "Explorer 🌱"},
        {"day": 14, "label": "Achiever 🚀"},
        {"day": 30, "label": "Warrior ⚔️"},
        {"day": 60, "label": "Champion 👑"},
        {"day": 90, "label": "Legend 🐉"},
    ]

    unlocked = [level for level in levels if current_streak >= level["day"]]

    return {
        "current_streak": current_streak,
        "longest_streak": longest_streak,
        "total_fap_days": fap_days,
        "total_nofap_days": nofap_days,
        "certificates": unlocked
    }
