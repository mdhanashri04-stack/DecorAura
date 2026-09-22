import json
from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models import SEOMetadata, Product, Blog
from backend.schemas import SEOMetadataResponse

router = APIRouter(tags=["SEO"])

@router.get("/api/seo/{page_type}/{target_slug}", response_model=SEOMetadataResponse)
def get_seo_metadata(page_type: str, target_slug: str, db: Session = Depends(get_db)):
    seo = db.query(SEOMetadata).filter(
        SEOMetadata.page_type == page_type,
        SEOMetadata.target_slug == target_slug
    ).first()

    if seo:
        return seo

    if page_type == "product":
        prod = db.query(Product).filter(Product.slug == target_slug).first()
        if prod:
            return SEOMetadata(
                id=0,
                page_type="product",
                target_slug=target_slug,
                title=f"{prod.name} - Decor Aura Luxury Decor",
                description=prod.description[:160],
                keywords=f"{prod.name}, luxury decor, lighting, furniture",
                og_image=prod.primary_image,
                canonical_url=f"https://decoraura.netlify.app/products/{target_slug}"
            )
    elif page_type == "blog":
        blog = db.query(Blog).filter(Blog.slug == target_slug).first()
        if blog:
            return SEOMetadata(
                id=0,
                page_type="blog",
                target_slug=target_slug,
                title=blog.seo_title or f"{blog.title} - DecorAura Journal",
                description=blog.meta_description or blog.excerpt[:160],
                keywords=blog.tags_csv,
                og_image=blog.featured_image,
                canonical_url=f"https://decoraura.netlify.app/journal/{target_slug}"
            )

    return SEOMetadata(
        id=0,
        page_type=page_type,
        target_slug=target_slug,
        title="Decor Aura - Objects With A Story",
        description="Premium interior design, high-end modern lighting and furniture for contemporary living.",
        keywords="interior design, luxury decor, home lighting, Aurelia Lamp",
        og_image="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200",
        canonical_url="https://decoraura.netlify.app/"
    )

@router.get("/api/seo/jsonld/{page_type}/{target_slug}")
def get_json_ld_schema(page_type: str, target_slug: str, db: Session = Depends(get_db)):
    if page_type == "product":
        prod = db.query(Product).filter(Product.slug == target_slug).first()
        if prod:
            schema = {
                "@context": "https://schema.org/",
                "@type": "Product",
                "name": prod.name,
                "image": [prod.primary_image],
                "description": prod.description,
                "sku": f"DA-{prod.id}",
                "offers": {
                    "@type": "Offer",
                    "url": f"https://decoraura.netlify.app/products/{prod.slug}",
                    "priceCurrency": "USD",
                    "price": str(prod.price),
                    "availability": "https://schema.org/InStock"
                },
                "aggregateRating": {
                    "@type": "AggregateRating",
                    "ratingValue": str(prod.rating),
                    "reviewCount": str(prod.reviews_count)
                }
            }
            return schema

    elif page_type == "blog":
        blog = db.query(Blog).filter(Blog.slug == target_slug).first()
        if blog:
            schema = {
                "@context": "https://schema.org/",
                "@type": "BlogPosting",
                "headline": blog.title,
                "image": [blog.featured_image],
                "datePublished": blog.published_at.isoformat(),
                "author": {
                    "@type": "Person",
                    "name": blog.author
                },
                "publisher": {
                    "@type": "Organization",
                    "name": "Decor Aura",
                    "logo": {
                        "@type": "ImageObject",
                        "url": "https://decoraura.netlify.app/decoraura-logo.png"
                    }
                },
                "description": blog.excerpt
            }
            return schema

    # Default Organization Schema
    return {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Decor Aura",
        "url": "https://decoraura.netlify.app",
        "logo": "https://decoraura.netlify.app/decoraura-logo.png",
        "description": "Luxury home-decor e-commerce and interior inspiration brand."
    }

@router.get("/sitemap.xml")
def get_sitemap(db: Session = Depends(get_db)):
    products = db.query(Product).all()
    blogs = db.query(Blog).all()

    urls = [
        "https://decoraura.netlify.app/",
        "https://decoraura.netlify.app/shop",
        "https://decoraura.netlify.app/collections",
        "https://decoraura.netlify.app/journal"
    ]

    for p in products:
        urls.append(f"https://decoraura.netlify.app/products/{p.slug}")
    for b in blogs:
        urls.append(f"https://decoraura.netlify.app/journal/{b.slug}")

    xml_content = '<?xml version="1.0" encoding="UTF-8"?>\n'
    xml_content += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    for url in urls:
        xml_content += f'  <url><loc>{url}</loc></url>\n'
    xml_content += '</urlset>'

    return Response(content=xml_content, media_type="application/xml")

@router.get("/robots.txt")
def get_robots():
    content = "User-agent: *\nAllow: /\n\nSitemap: https://decoraura.netlify.app/sitemap.xml\n"
    return Response(content=content, media_type="text/plain")
