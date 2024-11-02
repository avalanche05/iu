from fastapi import APIRouter

from app.api.deps import SessionDep
from app.models import Application

router = APIRouter()


@router.get("/check/")
async def health_check() -> bool:
    return True


@router.get("/create/")
async def create(session: SessionDep) -> bool:
    user = Application(
        candidate_id=1,
        vacancy_id=2,
        status="pending",
    )
    session.add(user)
    session.commit()

    print(user.candidate.email)

    print(user)

    return True
