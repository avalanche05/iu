from typing import List

from sqlalchemy import ForeignKey
from sqlalchemy import Column, String
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.common import BaseEntity


class Vacancy(BaseEntity):
    __tablename__ = "vacancies"
    title: Mapped[str] = mapped_column(nullable=True)
    grade: Mapped[str] = mapped_column(nullable=True)
    description: Mapped[str] = mapped_column(nullable=True)
    competencies: Mapped[str] = mapped_column(nullable=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))

    user: Mapped["User"] = relationship("User", back_populates="vacancies")
    applications: Mapped[List["Application"]] = relationship("Application", back_populates="vacancies")

