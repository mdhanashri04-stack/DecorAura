from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models import Blog, BlogCategory, BlogProduct, Product
from backend.schemas import BlogResponse, BlogCreate, BlogUpdate, BlogCategoryResponse, ProductResponse

router = APIRouter(prefix="/api/blogs", tags=["Blog CMS"])

@router.get("/categories", response_model=List[BlogCategoryResponse])
def get_blog_categories(db: Session = Depends(get_db)):
    return db.query(BlogCategory).all()

@router.get("", response_model=List[BlogResponse])
def get_blogs(
    category_slug: Optional[str] = None,
    tag: Optional[str] = None,
    search: Optional[str] = None,
    published_only: bool = True,
    db: Session = Depends(get_db)
):
    query = db.query(Blog)

    if published_only:
        query = query.filter(Blog.is_published == True)

    if category_slug:
        cat = db.query(BlogCategory).filter(BlogCategory.slug == category_slug).first()
        if cat:
            query = query.filter(Blog.category_id == cat.id)

    if tag:
        query = query.filter(Blog.tags_csv.ilike(f"%{tag}%"))

    if search:
        pattern = f"%{search}%"
        query = query.filter(
            (Blog.title.ilike(pattern)) |
            (Blog.content.ilike(pattern)) |
            (Blog.excerpt.ilike(pattern))
        )

    return query.order_by(Blog.published_at.desc()).all()

@router.get("/{id_or_slug}", response_model=BlogResponse)
def get_blog_post(id_or_slug: str, db: Session = Depends(get_db)):
    if id_or_slug.isdigit():
        blog = db.query(Blog).filter(Blog.id == int(id_or_slug)).first()
    else:
        blog = db.query(Blog).filter(Blog.slug == id_or_slug).first()

    if not blog:
        raise HTTPException(status_code=404, detail="Blog post not found")
    return blog

@router.get("/{id_or_slug}/products", response_model=List[ProductResponse])
def get_blog_featured_products(id_or_slug: str, db: Session = Depends(get_db)):
    if id_or_slug.isdigit():
        blog = db.query(Blog).filter(Blog.id == int(id_or_slug)).first()
    else:
        blog = db.query(Blog).filter(Blog.slug == id_or_slug).first()

    if not blog:
        return []

    products = db.query(Product).join(BlogProduct).filter(BlogProduct.blog_id == blog.id).all()
    return products

@router.post("", response_model=BlogResponse, status_code=201)
def create_blog(blog_in: BlogCreate, db: Session = Depends(get_db)):
    db_blog = Blog(**blog_in.dict())
    db.add(db_blog)
    db.commit()
    db.refresh(db_blog)
    return db_blog

@router.put("/{blog_id}", response_model=BlogResponse)
def update_blog(blog_id: int, blog_in: BlogUpdate, db: Session = Depends(get_db)):
    blog = db.query(Blog).filter(Blog.id == blog_id).first()
    if not blog:
        raise HTTPException(status_code=404, detail="Blog post not found")

    update_data = blog_in.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(blog, field, value)

    db.commit()
    db.refresh(blog)
    return blog

@router.post("/{blog_id}/products/{product_id}")
def link_product_to_blog(blog_id: int, product_id: int, db: Session = Depends(get_db)):
    existing = db.query(BlogProduct).filter(
        BlogProduct.blog_id == blog_id,
        BlogProduct.product_id == product_id
    ).first()
    if not existing:
        bp = BlogProduct(blog_id=blog_id, product_id=product_id)
        db.add(bp)
        db.commit()
    return {"message": "Product linked to blog successfully"}

@router.delete("/{blog_id}")
def delete_blog(blog_id: int, db: Session = Depends(get_db)):
    blog = db.query(Blog).filter(Blog.id == blog_id).first()
    if not blog:
        raise HTTPException(status_code=404, detail="Blog post not found")

    db.delete(blog)
    db.commit()
    return {"message": "Blog post deleted successfully"}
