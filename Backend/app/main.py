from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app import models
from app.database import engine
from app.routes import auth, progress
from app.routes import auth, progress, calander

# Create database tables on startup
models.Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI()

# Frontend CORS origins (React dev server)
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth.router)
app.include_router(progress.router)
from app.routes import streak

app.include_router(streak.router)
