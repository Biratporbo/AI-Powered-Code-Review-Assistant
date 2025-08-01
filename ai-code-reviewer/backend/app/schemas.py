from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional, Dict, Any

# User schemas
class UserBase(BaseModel):
    username: str
    email: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_active: bool
    
    class Config:
        orm_mode = True

# Authentication schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

# Code analysis schemas
class CodeAnalysisRequest(BaseModel):
    code: str
    language: str

class CodeIssue(BaseModel):
    type: str
    message: str
    severity: str

class CodeSuggestion(BaseModel):
    message: str
    example: str
    priority: str

class CodeAnalysisCreate(BaseModel):
    code_snippet: str
    language: str
    issues_found: int
    suggestions_count: int

class CodeAnalysis(CodeAnalysisCreate):
    id: int
    timestamp: datetime
    issues: List[CodeIssue]
    suggestions: List[CodeSuggestion]
    score: int
    
    class Config:
        orm_mode = True