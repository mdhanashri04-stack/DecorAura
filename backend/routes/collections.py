from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models import Collection, CollectionProduct, Product
from backend.schemas import CollectionCreate, CollectionUpdate, CollectionResponse, ProductResponse

router = APIRouter(prefix="/api/collections", tags=["Collections"])

def format_collection_dict(c: Collection, db: Session):
    prods = db.query(Product).join(CollectionProduct).filter(CollectionProduct.collection_id == c.id).all()
    return {
        "id": c.id,
        "name": c.name,
        "slug": c.slug,
        "description": c.description,
        "hero_image": c.hero_image,
        "featured": c.featured if c.featured is not None else False,
        "seo_title": c.seo_title,
        "meta_description": c.meta_description,
        "created_at": c.created_at,
        "updated_at": c.updated_at,
        "products": prods
    }

@router.get("", response_model=List[CollectionResponse])
def get_collections(featured_only: Optional[bool] = False, db: Session = Depends(get_db)):
    query = db.query(Collection)
    if featured_only:
        query = query.filter(Collection.featured == True)
    collections = query.all()
    return [format_collection_dict(c, db) for c in collections]

@router.get("/{slug_or_id}", response_model=CollectionResponse)
def get_collection(slug_or_id: str, db: Session = Depends(get_db)):
    if slug_or_id.isdigit():
        c = db.query(Collection).filter(Collection.id == int(slug_or_id)).first()
    else:
        c = db.query(Collection).filter(Collection.slug == slug_or_id).first()

    if not c:
        raise HTTPException(status_code=404, detail="Collection not found")

    return format_collection_dict(c, db)

@router.post("", response_model=CollectionResponse, status_code=201)
def create_collection(coll_in: CollectionCreate, db: Session = Depends(get_db)):
    db_coll = Collection(
        name=coll_in.name,
        slug=coll_in.slug or coll_in.name.lower().replace(" ", "-"),
        description=coll_in.description,
        hero_image=coll_in.hero_image,
        featured=coll_in.featured or False,
        seo_title=coll_in.seo_title,
        meta_description=coll_in.meta_description
    )
    db.add(db_coll)
    db.commit()
    db.refresh(db_coll)

    if coll_in.product_ids:
        for pid in coll_in.product_ids:
            cp = CollectionProduct(collection_id=db_coll.id, product_id=pid)
            db.add(cp)
        db.commit()

    return format_collection_dict(db_coll, db)

@router.put("/{collection_id}", response_model=CollectionResponse)
def update_collection(collection_id: int, coll_in: CollectionUpdate, db: Session = Depends(get_db)):
    c = db.query(Collection).filter(Collection.id == collection_id).first()
    if not c:
        raise HTTPException(status_code=404, detail="Collection not found")

    if coll_in.name is not None:
        c.name = coll_in.name
    if coll_in.slug is not None:
        c.slug = coll_in.slug
    if coll_in.description is not None:
        c.description = coll_in.description
    if coll_in.hero_image is not None:
        c.hero_image = coll_in.hero_image
    if coll_in.featured is not None:
        c.featured = coll_in.featured
    if coll_in.seo_title is not None:
        c.seo_title = coll_in.seo_title
    if coll_in.meta_description is not None:
        c.meta_description = coll_in.meta_description

    if coll_in.product_ids is not None:
        # Clear existing associations
        db.query(CollectionProduct).filter(CollectionProduct.collection_id == collection_id).delete()
        for pid in coll_in.product_ids:
            cp = CollectionProduct(collection_id=collection_id, product_id=pid)
            db.add(cp)

    db.commit()
    db.refresh(c)
    return format_collection_dict(c, db)

@router.delete("/{collection_id}")
def delete_collection(collection_id: int, db: Session = Depends(get_db)):
    c = db.query(Collection).filter(Collection.id == collection_id).first()
    if not c:
        raise HTTPException(status_code=404, detail="Collection not found")

    db.delete(c)
    db.commit()
    return {"message": "Collection deleted successfully"}
