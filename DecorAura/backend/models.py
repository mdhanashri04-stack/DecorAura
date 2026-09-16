from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from backend.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=False)
    is_admin = Column(Boolean, default=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    slug = Column(String, unique=True, index=True, nullable=False)
    description = Column(Text, nullable=True)
    image_url = Column(String, nullable=True)

    products = relationship("Product", back_populates="category")

class Collection(Base):
    __tablename__ = "collections"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    slug = Column(String, unique=True, index=True, nullable=False)
    description = Column(Text, nullable=True)
    hero_image = Column(String, nullable=True)
    featured = Column(Boolean, default=False)
    seo_title = Column(String, nullable=True)
    meta_description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    collection_products = relationship("CollectionProduct", back_populates="collection", cascade="all, delete-orphan")

class CollectionProduct(Base):
    __tablename__ = "collection_products"

    id = Column(Integer, primary_key=True, index=True)
    collection_id = Column(Integer, ForeignKey("collections.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)

    collection = relationship("Collection", back_populates="collection_products")
    product = relationship("Product")

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    slug = Column(String, unique=True, index=True, nullable=False)
    price = Column(Float, nullable=False)
    rating = Column(Float, default=4.9)
    reviews_count = Column(Integer, default=12)
    category_id = Column(Integer, ForeignKey("categories.id"))
    description = Column(Text, nullable=False)
    dimensions = Column(String, nullable=True)
    material = Column(String, nullable=True)
    stock = Column(Integer, default=25)
    availability = Column(String, default="In Stock")
    is_featured = Column(Boolean, default=False)
    is_3d_enabled = Column(Boolean, default=False)
    model_path = Column(String, nullable=True)
    primary_image = Column(String, nullable=False)
    gallery_json = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    category = relationship("Category", back_populates="products")
    reviews = relationship("Review", back_populates="product", cascade="all, delete-orphan")
    order_items = relationship("OrderItem", back_populates="product")
    blog_products = relationship("BlogProduct", back_populates="product", cascade="all, delete-orphan")

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    order_number = Column(String, unique=True, index=True, nullable=False)
    customer_name = Column(String, nullable=False)
    customer_email = Column(String, nullable=False)
    total_amount = Column(Float, nullable=False)
    status = Column(String, default="Pending")
    payment_method = Column(String, default="Mock Checkout")
    shipping_address = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")

class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"))
    product_id = Column(Integer, ForeignKey("products.id"))
    quantity = Column(Integer, nullable=False)
    price = Column(Float, nullable=False)

    order = relationship("Order", back_populates="items")
    product = relationship("Product", back_populates="order_items")

class BlogCategory(Base):
    __tablename__ = "blog_categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    slug = Column(String, unique=True, index=True, nullable=False)

    blogs = relationship("Blog", back_populates="category")

class Blog(Base):
    __tablename__ = "blogs"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    slug = Column(String, unique=True, index=True, nullable=False)
    content = Column(Text, nullable=False)
    excerpt = Column(Text, nullable=False)
    author = Column(String, default="DecorAura Editorial")
    category_id = Column(Integer, ForeignKey("blog_categories.id"))
    tags_csv = Column(String, nullable=True)
    featured_image = Column(String, nullable=False)
    is_published = Column(Boolean, default=True)
    published_at = Column(DateTime, default=datetime.utcnow)
    seo_title = Column(String, nullable=True)
    meta_description = Column(Text, nullable=True)
    reading_time = Column(String, default="5 min read")

    category = relationship("BlogCategory", back_populates="blogs")
    blog_products = relationship("BlogProduct", back_populates="blog", cascade="all, delete-orphan")

class BlogProduct(Base):
    __tablename__ = "blog_products"

    id = Column(Integer, primary_key=True, index=True)
    blog_id = Column(Integer, ForeignKey("blogs.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)

    blog = relationship("Blog", back_populates="blog_products")
    product = relationship("Product", back_populates="blog_products")

class Tag(Base):
    __tablename__ = "tags"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)

class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"))
    author_name = Column(String, nullable=False)
    rating = Column(Integer, nullable=False)
    comment = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    product = relationship("Product", back_populates="reviews")

class SEOMetadata(Base):
    __tablename__ = "seo_metadata"

    id = Column(Integer, primary_key=True, index=True)
    page_type = Column(String, nullable=False)
    target_slug = Column(String, nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    keywords = Column(String, nullable=True)
    og_image = Column(String, nullable=True)
    canonical_url = Column(String, nullable=True)
