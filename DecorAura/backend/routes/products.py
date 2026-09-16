from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models import Product, Category, Review
from backend.schemas import ProductResponse, ProductCreate, ProductUpdate, ReviewCreate, ReviewResponse

router = APIRouter(prefix="/api/products", tags=["Products"])

@router.get("", response_model=List[ProductResponse])
def get_products(
    category_slug: Optional[str] = None,
    category_id: Optional[int] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    material: Optional[str] = None,
    availability: Optional[str] = None,
    search: Optional[str] = None,
    featured: Optional[bool] = None,
    sort_by: Optional[str] = Query(None, description="price_asc, price_desc, rating, newest"),
    db: Session = Depends(get_db)
):
    query = db.query(Product)

    if category_slug:
        cat = db.query(Category).filter(Category.slug == category_slug).first()
        if cat:
            query = query.filter(Product.category_id == cat.id)
    elif category_id:
        query = query.filter(Product.category_id == category_id)

    if min_price is not None:
        query = query.filter(Product.price >= min_price)
    if max_price is not None:
        query = query.filter(Product.price <= max_price)

    if material:
        query = query.filter(Product.material.ilike(f"%{material}%"))

    if availability:
        query = query.filter(Product.availability.ilike(f"%{availability}%"))

    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            (Product.name.ilike(search_pattern)) | 
            (Product.description.ilike(search_pattern)) |
            (Product.material.ilike(search_pattern))
        )

    if featured is not None:
        query = query.filter(Product.is_featured == featured)

    # Sorting
    if sort_by == "price_asc":
        query = query.order_by(Product.price.asc())
    elif sort_by == "price_desc":
        query = query.order_by(Product.price.desc())
    elif sort_by == "rating":
        query = query.order_by(Product.rating.desc())
    elif sort_by == "newest":
        query = query.order_by(Product.created_at.desc())
    else:
        query = query.order_by(Product.id.asc())

    return query.all()

@router.get("/{id_or_slug}", response_model=ProductResponse)
def get_product(id_or_slug: str, db: Session = Depends(get_db)):
    if id_or_slug.isdigit():
        product = db.query(Product).filter(Product.id == int(id_or_slug)).first()
    else:
        product = db.query(Product).filter(Product.slug == id_or_slug).first()

    if not product:
        raise HTTPException(status_code=444, detail="Product not found")
    return product

@router.post("", response_model=ProductResponse, status_code=201)
def create_product(product_in: ProductCreate, db: Session = Depends(get_db)):
    db_product = Product(**product_in.dict())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

@router.put("/{product_id}", response_model=ProductResponse)
def update_product(product_id: int, product_in: ProductUpdate, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=444, detail="Product not found")

    update_data = product_in.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(product, field, value)

    db.commit()
    db.refresh(product)
    return product

@router.delete("/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=444, detail="Product not found")

    db.delete(product)
    db.commit()
    return {"message": "Product deleted successfully"}

@router.post("/{product_id}/reviews", response_model=ReviewResponse, status_code=201)
def add_product_review(product_id: int, review_in: ReviewCreate, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=444, detail="Product not found")

    review = Review(
        product_id=product_id,
        author_name=review_in.author_name,
        rating=review_in.rating,
        comment=review_in.comment
    )
    db.add(review)
    
    # Recalculate average rating
    reviews = db.query(Review).filter(Review.product_id == product_id).all()
    total_reviews = len(reviews) + 1
    sum_ratings = sum(r.rating for r in reviews) + review_in.rating
    product.rating = round(sum_ratings / total_reviews, 1)
    product.reviews_count = total_reviews

    db.commit()
    db.refresh(review)
    return review
