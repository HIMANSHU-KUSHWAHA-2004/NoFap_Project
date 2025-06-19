# app/database.py

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = "sqlite:///./nofap.db"  # Or your actual DB URL

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})  # SQLite-specific
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# ✅ Add this if missing
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
