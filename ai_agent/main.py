from fastapi import FastAPI

from saving_goals import router as saving_goals_router

app = FastAPI(title="AI Agent - Saving Goals")
app.include_router(saving_goals_router)
