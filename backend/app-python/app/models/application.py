from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.common import BaseEntity


class Application(BaseEntity):
    __tablename__ = "applications"
    vacancy_id: Mapped[int] = mapped_column(ForeignKey("vacancies.id"))
    candidate_id: Mapped[int] = mapped_column(ForeignKey("candidates.id"))
    status: Mapped[str] = mapped_column(nullable=False)

    vacancies: Mapped["Vacancy"] = relationship("Vacancy", back_populates="applications")
    candidates: Mapped["Candidate"] = relationship("Candidate", back_populates="applications")
