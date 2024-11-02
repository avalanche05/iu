from fastapi import APIRouter

from app.api.routes import application, candidate, folder, resume, user, vacancy, generate

# from app.api.routes import items, login, users, utils
from app.api.routes.common import health

api_router = APIRouter()


api_router.include_router(health.router, prefix="/health", tags=["health"])
api_router.include_router(user.router, prefix="/users", tags=["user"])
api_router.include_router(candidate.router, prefix="/candidates", tags=["candidate"])
api_router.include_router(
    application.router, prefix="/applications", tags=["application"]
)
api_router.include_router(vacancy.router, prefix="/vacancies", tags=["vacancy"])
api_router.include_router(resume.router, prefix="/resumes", tags=["resume"])
api_router.include_router(folder.router, prefix="/folders", tags=["folder"])
api_router.include_router(generate.router, prefix="/generate", tags=["generate"])
