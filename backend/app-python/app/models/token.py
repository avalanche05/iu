import secrets

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.common import BaseEntity


class Token(BaseEntity):
    __tablename__ = "tokens"
    access_token: Mapped[str] = mapped_column(default=lambda: secrets.token_urlsafe(32))
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))

    user: Mapped["User"] = relationship(back_populates="tokens")
