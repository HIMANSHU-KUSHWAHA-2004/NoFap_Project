from pydantic import BaseModel, EmailStr, ConfigDict
from datetime import date
from typing import Optional

# --------------------
# User Schemas
# --------------------

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    username: str
    email: EmailStr

    model_config = ConfigDict(from_attributes=True)


UserResponse = UserOut  # Alias used in auth route


# --------------------
# Marking Day Progress
# --------------------

class MarkRequest(BaseModel):
    date: date
    status: str  # 'fap' or 'nofap'


class MarkResponse(BaseModel):
    message: str
    current_streak: int
    longest_streak: int


# --------------------
# Daily Record Schemas
# --------------------

class DailyRecordBase(BaseModel):
    date: date
    status: str  # 'fap' or 'nofap'


class DailyRecordCreate(DailyRecordBase):
    pass


class DailyRecordOut(DailyRecordBase):
    id: int

    model_config = ConfigDict(from_attributes=True)


class DailyRecordUpdate(BaseModel):
    status: str  # "fap" or "nofap"


# --------------------
# Streak Schemas
# --------------------

class StreakOut(BaseModel):
    current_streak: int
    longest_streak: int
    last_updated: date

    model_config = ConfigDict(from_attributes=True)


# --------------------
# Certificate Schemas
# --------------------

class CertificateCreate(BaseModel):
    label: str
    day: int
    energy_saved: int
    time_saved: int
    mental_clarity: int
    willpower: float
    motivation_score: int


class CertificateOut(BaseModel):
    id: int
    name: str
    unlocked: bool

    model_config = ConfigDict(from_attributes=True)


# --------------------
# Full User Profile (Optional)
# --------------------

class User(BaseModel):
    id: int
    username: str
    email: str

    model_config = ConfigDict(from_attributes=True)
