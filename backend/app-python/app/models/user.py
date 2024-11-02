from typing import List

from sqlalchemy.orm import Mapped, mapped_column, relationship
from werkzeug.security import check_password_hash, generate_password_hash

from app.common import BaseEntity


class User(BaseEntity):
    __tablename__ = "users"
    name: Mapped[str] = mapped_column()
    username: Mapped[str] = mapped_column()
    hashed_password: Mapped[str] = mapped_column()

    tokens: Mapped[list["Token"]] = relationship(
        cascade="all,delete-orphan", back_populates="user"
    )

    vacancies: Mapped[list["Vacancy"]] = relationship(
        "Vacancy",
        back_populates="user",
        cascade="all, delete-orphan"
    )

    folders: Mapped[list["Folder"]] = relationship(
        "Folder",
        back_populates="user",
        cascade="all, delete-orphan"
    )

    def set_password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.hashed_password, password)
