from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, EmailStr

# Category Schemas
class CategoryBase(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    image_url: Optional[str] = None

class CategoryCreate(CategoryBase):
    pass

class CategoryResponse(CategoryBase):
    id: int
    class Config:
        from_attributes = True

# Collection Schemas
class CollectionBase(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    hero_image: Optional[str] = None
    featured: Optional[bool] = False
    seo_title: Optional[str] = None
    meta_description: Optional[str] = None

class CollectionCreate(CollectionBase):
    product_ids: Optional[List[int]] = []

class CollectionUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    hero_image: Optional[str] = None
    featured: Optional[bool] = None
    seo_title: Optional[str] = None
    meta_description: Optional[str] = None
    product_ids: Optional[List[int]] = None

class CollectionResponse(CollectionBase):
    id: int
    products: List[ProductResponse] = []
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    class Config:
        from_attributes = True

# Review Schemas
class ReviewBase(BaseModel):
    author_name: str
    rating: int
    comment: str

class ReviewCreate(ReviewBase):
    product_id: int

class ReviewResponse(ReviewBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

# Product Schemas
class ProductBase(BaseModel):
    name: str
    slug: str
    price: float
    category_id: int
    description: str
    dimensions: Optional[str] = None
    material: Optional[str] = None
    stock: Optional[int] = 25
    availability: Optional[str] = "In Stock"
    is_featured: Optional[bool] = False
    is_3d_enabled: Optional[bool] = False
    model_path: Optional[str] = None
    primary_image: str
    gallery_json: Optional[str] = None

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    price: Optional[float] = None
    category_id: Optional[int] = None
    description: Optional[str] = None
    dimensions: Optional[str] = None
    material: Optional[str] = None
    stock: Optional[int] = None
    availability: Optional[str] = None
    is_featured: Optional[bool] = None
    is_3d_enabled: Optional[bool] = None
    primary_image: Optional[str] = None

class ProductResponse(ProductBase):
    id: int
    rating: float
    reviews_count: int
    created_at: datetime
    category: Optional[CategoryResponse] = None
    reviews: List[ReviewResponse] = []
    class Config:
        from_attributes = True

# Order Schemas
class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int

class OrderItemResponse(BaseModel):
    id: int
    product_id: int
    quantity: int
    price: float
    product: Optional[ProductResponse] = None
    class Config:
        from_attributes = True

class OrderCreate(BaseModel):
    customer_name: str
    customer_email: str
    shipping_address: str
    payment_method: Optional[str] = "Mock Checkout"
    items: List[OrderItemCreate]

class OrderResponse(BaseModel):
    id: int
    order_number: str
    customer_name: str
    customer_email: str
    total_amount: float
    status: str
    shipping_address: str
    created_at: datetime
    items: List[OrderItemResponse] = []
    class Config:
        from_attributes = True

class OrderStatusUpdate(BaseModel):
    status: str

# Blog Schemas
class BlogCategoryResponse(BaseModel):
    id: int
    name: str
    slug: str
    class Config:
        from_attributes = True

class BlogBase(BaseModel):
    title: str
    slug: str
    content: str
    excerpt: str
    category_id: int
    tags_csv: Optional[str] = None
    featured_image: str
    is_published: Optional[bool] = True
    seo_title: Optional[str] = None
    meta_description: Optional[str] = None
    reading_time: Optional[str] = "5 min read"

class BlogCreate(BlogBase):
    pass

class BlogUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    content: Optional[str] = None
    excerpt: Optional[str] = None
    category_id: Optional[int] = None
    tags_csv: Optional[str] = None
    featured_image: Optional[str] = None
    is_published: Optional[bool] = None
    seo_title: Optional[str] = None
    meta_description: Optional[str] = None

class BlogResponse(BlogBase):
    id: int
    published_at: datetime
    category: Optional[BlogCategoryResponse] = None
    class Config:
        from_attributes = True

# SEO Metadata Schema
class SEOMetadataResponse(BaseModel):
    id: int
    page_type: str
    target_slug: str
    title: str
    description: str
    keywords: Optional[str] = None
    og_image: Optional[str] = None
    class Config:
        from_attributes = True
