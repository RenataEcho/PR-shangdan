from core.database import Base
from sqlalchemy import Column, DateTime, Integer, String


class Media_accounts(Base):
    __tablename__ = "media_accounts"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, index=True, autoincrement=True, nullable=False)
    user_id = Column(String, nullable=False)
    platform = Column(String, nullable=False)
    nickname = Column(String, nullable=False)
    account_id = Column(String, nullable=False)
    followers = Column(Integer, nullable=False)
    homepage_url = Column(String, nullable=False)
    avatar_url = Column(String, nullable=True, default='', server_default='')
    status = Column(String, nullable=True, default='active', server_default='active')
    created_at = Column(DateTime(timezone=True), nullable=True)