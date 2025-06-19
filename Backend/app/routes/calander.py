from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import models, schemas, database
from app.oauth2 import get_current_user  # We'll create this if you don’t have it

router = APIRouter(prefix="/calendar", tags=["calendar"])

# Dependency
get_db = database.get_db

@router.get("/")
def get_calendar_entries(db: Session = Depends(get_db), current_user: schemas.User = Depends(get_current_user)):
    records = db.query(models.DailyRecord).filter(models.DailyRecord.user_id == current_user.id).all()
    return records

@router.post("/")
def create_calendar_entry(entry: schemas.DailyRecordCreate, db: Session = Depends(get_db), current_user: schemas.User = Depends(get_current_user)):
    new_entry = models.DailyRecord(**entry.dict(), user_id=current_user.id)
    db.add(new_entry)
    db.commit()
    db.refresh(new_entry)
    return new_entry
