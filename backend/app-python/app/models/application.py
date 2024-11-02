from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.common import BaseEntity


class Application(BaseEntity):
    __tablename__ = "applications"
    vacancy_id: Mapped[int] = mapped_column(ForeignKey("vacancies.id"))
    candidate_id: Mapped[int] = mapped_column(ForeignKey("candidates.id"))
    status: Mapped[str] = mapped_column(nullable=False)

    vacancy: Mapped["Vacancy"] = relationship(back_populates="applications")
    candidate: Mapped["Candidate"] = relationship(back_populates="applications")
