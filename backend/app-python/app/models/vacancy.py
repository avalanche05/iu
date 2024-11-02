from typing import List

from sqlalchemy import ForeignKey
from sqlalchemy import Column, String
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.common import BaseEntity


class Vacancy(BaseEntity):
    __tablename__ = "vacancies"
    position: Mapped[str] = mapped_column()
    grade: Mapped[str] = mapped_column()
    speciality: Mapped[str] = mapped_column()
    description: Mapped[str] = mapped_column()
    team: Mapped[str] = mapped_column()
    city: Mapped[str] = mapped_column()
    work_format: Mapped[str] = mapped_column()
    skills: Mapped[list[str]] = mapped_column(ARRAY(String))
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))

    user: Mapped["User"] = relationship("User", back_populates="vacancies")

    applications: Mapped[List["Application"]] = relationship(back_populates="vacancy")
