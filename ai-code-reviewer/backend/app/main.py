from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import uvicorn

from . import auth, cud, models, schemas
from .database import SessionLocal, engine
from .ai_analyzer import analyze_code

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Code Review Assistant", version="1.0.0")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Authentication endpoints
@app.post("/token", response_model=schemas.Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = auth.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = auth.create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = cud.get_user_by_username(db, username=user.username)
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    return cud.create_user(db=db, user=user)

# Code analysis endpoints
@app.post("/analyze/", response_model=schemas.CodeAnalysis)
async def analyze_code_endpoint(
    code_request: schemas.CodeAnalysisRequest, 
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    user = auth.get_current_user(db, token)
    
    # Perform AI code analysis
    analysis_result = analyze_code(code_request.code, code_request.language)
    
    # Save analysis to database
    analysis = schemas.CodeAnalysisCreate(
        code_snippet=code_request.code[:500],  # Store a snippet
        language=code_request.language,
        issues_found=len(analysis_result["issues"]),
        suggestions_count=len(analysis_result["suggestions"])
    )
    db_analysis = cud.create_code_analysis(db, analysis, user.id)
    
    # Return the analysis result
    return {
        "id": db_analysis.id,
        "timestamp": db_analysis.timestamp,
        "code_snippet": code_request.code[:500],
        "language": code_request.language,
        "issues": analysis_result["issues"],
        "suggestions": analysis_result["suggestions"],
        "score": analysis_result["score"]
    }

@app.get("/history/", response_model=list[schemas.CodeAnalysis])
def get_analysis_history(
    skip: int = 0, 
    limit: int = 100,
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    user = auth.get_current_user(db, token)
    analyses = cud.get_user_analyses(db, user_id=user.id, skip=skip, limit=limit)
    return analyses

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)