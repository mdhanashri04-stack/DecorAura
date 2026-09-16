from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models import Category
from backend.schemas import CategoryResponse, CategoryCreate

router = APIRouter(prefix="/api/categories", tags=["Categories"])

@router.get("", response_model=List[CategoryResponse])
def get_categories(db: Session = Depends(get_db)):
    return db.query(Category).all()

@router.post("", response_model=CategoryResponse, status_code=201)
def create_category(category_in: CategoryCreate, db: Session = Depends(get_db)):
    existing = db.query(Category).filter(Category.slug == category_in.slug).first()
    if existing:
        raise HTTPException(status_code=400, detail="Category slug already exists")

    cat = Category(**category_in.dict())
    db.add(cat)
    db.commit()
    db.refresh(cat)
    return cat
