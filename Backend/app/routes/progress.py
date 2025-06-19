from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date
from typing import List

from app import models, schemas
from app.database import get_db
from app.oauth2 import get_current_user

router = APIRouter(prefix="/progress", tags=["Progress"])


@router.get("/calendar", response_model=List[schemas.DailyRecordOut])
def get_calendar_records(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    records = (
        db.query(models.DailyRecord)
        .filter(models.DailyRecord.user_id == current_user.id)
        .all()
    )
    return records


@router.post("/calendar/mark", response_model=schemas.MarkResponse)
def mark_day(
    data: schemas.MarkRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    record = (
        db.query(models.DailyRecord)
        .filter(models.DailyRecord.user_id == current_user.id, models.DailyRecord.date == data.date)
        .first()
    )
    if data.status not in ["fap", "nofap"]:
        raise HTTPException(status_code=400, detail="Invalid status")

    if record:
        record.status = data.status
    else:
        record = models.DailyRecord(
            user_id=current_user.id,
            date=data.date,
            status=data.status,
        )
        db.add(record)

    db.commit()

    # 🔁 Update streaks
    update_streaks(db, current_user.id)

    user = db.query(models.User).filter(models.User.id == current_user.id).first()
    return {
        "message": "Day marked",
        "current_streak": user.current_streak,
        "longest_streak": user.longest_streak,
    }


def update_streaks(db: Session, user_id: int):
    records = (
        db.query(models.DailyRecord)
        .filter(models.DailyRecord.user_id == user_id)
        .order_by(models.DailyRecord.date)
        .all()
    )

    current_streak = 0
    longest_streak = 0
    last_date = None

    for rec in records:
        if rec.status == "nofap":
            if last_date and (rec.date - last_date).days == 1:
                current_streak += 1
            else:
                current_streak = 1
            longest_streak = max(longest_streak, current_streak)
            last_date = rec.date
        else:
            current_streak = 0
            last_date = None

    user = db.query(models.User).filter(models.User.id == user_id).first()
    user.current_streak = current_streak
    user.longest_streak = longest_streak
    db.commit()
