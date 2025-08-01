from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    
    analyses = relationship("CodeAnalysis", back_populates="owner")

class CodeAnalysis(Base):
    __tablename__ = "code_analyses"
    
    id = Column(Integer, primary_key=True, index=True)
    code_snippet = Column(Text)
    language = Column(String)
    issues_found = Column(Integer)
    suggestions_count = Column(Integer)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    owner_id = Column(Integer, ForeignKey("users.id"))
    
    owner = relationship("User", back_populates="analyses")