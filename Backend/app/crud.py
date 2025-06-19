from sqlalchemy.orm import Session
from datetime import date, timedelta
from app import models, schemas
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# ───── USER ─────
def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = pwd_context.hash(user.password)
    db_user = models.User(
        username=user.username,
        email=user.email,
        password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def authenticate_user(db: Session, email: str, password: str):
    user = get_user_by_email(db, email)
    if not user or not pwd_context.verify(password, user.password):
        return None
    return user


# ───── DAILY RECORD ─────
def get_record_by_date(db: Session, user_id: int, record_date: date):
    return db.query(models.DailyRecord).filter_by(user_id=user_id, date=record_date).first()


def create_record(db: Session, user_id: int, record: schemas.DailyRecordCreate):
    db_record = models.DailyRecord(
        user_id=user_id,
        date=record.date,
        status=record.status
    )
    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    return db_record


def get_all_records(db: Session, user_id: int):
    return db.query(models.DailyRecord).filter_by(user_id=user_id).order_by(models.DailyRecord.date).all()


# ───── STREAK ─────
def get_streak(db: Session, user_id: int):
    return db.query(models.Streak).filter_by(user_id=user_id).first()


def update_streak(db: Session, user_id: int):
    records = get_all_records(db, user_id)
    records.sort(key=lambda r: r.date, reverse=True)

    streak = 0
    today = date.today()

    for i, record in enumerate(records):
        if (today - record.date).days != i:
            break
        if record.status == "nofap":
            streak += 1
        else:
            break

    db_streak = get_streak(db, user_id)
    if db_streak:
        db_streak.current_streak = streak
        if streak > db_streak.longest_streak:
            db_streak.longest_streak = streak
    else:
        db_streak = models.Streak(
            user_id=user_id,
            current_streak=streak,
            longest_streak=streak
        )
        db.add(db_streak)

    db.commit()

    # Award certificate if milestone
    if streak in [7, 30, 90, 180, 365]:
        existing = db.query(models.Certificate).filter_by(user_id=user_id, streak_length=streak).first()
        if not existing:
            certificate = models.Certificate(
                user_id=user_id,
                streak_length=streak,
                issued_date=today
            )
            db.add(certificate)
            db.commit()


# ───── CERTIFICATES ─────
def get_user_certificates(db: Session, user_id: int):
    return db.query(models.Certificate).filter_by(user_id=user_id).all()
