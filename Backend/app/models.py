from sqlalchemy import Column, Integer, String, Boolean, Date, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base
from datetime import date

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)

    daily_records = relationship("DailyRecord", back_populates="user")
    streak = relationship("Streak", uselist=False, back_populates="user")
    certificates = relationship("Certificate", back_populates="user")


class DailyRecord(Base):
    __tablename__ = "daily_records"
    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, default=date.today)
    status = Column(String)  # 'nofap' or 'fap'
    user_id = Column(Integer, ForeignKey("users.id"))

    user = relationship("User", back_populates="daily_records")


class Streak(Base):
    __tablename__ = "streaks"
    id = Column(Integer, primary_key=True, index=True)
    current_streak = Column(Integer, default=0)
    longest_streak = Column(Integer, default=0)
    last_updated = Column(Date, default=date.today)

    user_id = Column(Integer, ForeignKey("users.id"))
    user = relationship("User", back_populates="streak")


class Certificate(Base):
    __tablename__ = "certificates"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    unlocked = Column(Boolean, default=False)

    user_id = Column(Integer, ForeignKey("users.id"))
    user = relationship("User", back_populates="certificates")
