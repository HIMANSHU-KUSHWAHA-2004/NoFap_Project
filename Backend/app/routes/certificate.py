from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Certificate, User
from app.schemas import CertificateCreate
from fastapi.security import OAuth2PasswordBearer
from app.jwt_handler import decode_jwt_token

router = APIRouter(prefix="/certificate", tags=["certificates"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/token")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    payload = decode_jwt_token(token)
    user = db.query(User).filter(User.id == payload["user_id"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.post("/unlock")
def unlock_certificate(certificate: CertificateCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    exists = db.query(Certificate).filter_by(user_id=current_user.id, label=certificate.label).first()
    if exists:
        return {"message": "Already unlocked"}
    cert = Certificate(
        user_id=current_user.id,
        label=certificate.label,
        day=certificate.day,
        energy_saved=certificate.energy_saved,
        time_saved=certificate.time_saved,
        mental_clarity=certificate.mental_clarity,
        willpower=certificate.willpower,
        motivation_score=certificate.motivation_score,
    )
    db.add(cert)
    db.commit()
    return {"message": f"Certificate '{certificate.label}' unlocked"}
