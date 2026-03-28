from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.db.database import Base, engine
from app.routers import lessons, auth
from app.routers import saving_goals


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title="PocketWise API",
    description="Backend για την εφαρμογή χρηματοοικονομικού αλφαβητισμού PocketWise",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(lessons.router)
app.include_router(saving_goals.router)


@app.get("/", tags=["Health"])
def root():
    return {"status": "ok", "message": "PocketWise API is running"}