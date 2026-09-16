import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.database import engine, Base, SessionLocal
from backend.models import (
    Category, Collection, CollectionProduct, Product,
    BlogCategory, Blog, BlogProduct, Review, SEOMetadata, User
)
from backend.dependencies import get_password_hash

def seed_database():
    print("Re-seeding Decor Aura Database...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    try:
        # 1. Admin User
        admin_user = User(
            email="admin@decoraura.com",
            full_name="Decor Aura Curator",
            is_admin=True,
            hashed_password=get_password_hash("admin123")
        )
        db.add(admin_user)
        db.commit()

        # 2. Categories
        cat_lighting = Category(name="Lighting", slug="lighting", description="Sculptural illumination crafted to warm up architectural spaces.", image_url="https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=800")
        cat_furniture = Category(name="Furniture", slug="furniture", description="Timeless seating, tables, and accent pieces.", image_url="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800")
        cat_wall_decor = Category(name="Wall Decor", slug="wall-decor", description="Tactile wall sculptures, mirrors, and curated art prints.", image_url="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=800")
        cat_planters = Category(name="Plants & Planters", slug="plants-planters", description="Organic ceramic vessels and handcrafted planters.", image_url="https://images.unsplash.com/photo-1485955900006-10f4d324d411?q=80&w=800")
        cat_accessories = Category(name="Accessories", slug="accessories", description="Curated brass objects, marble trays, and artisanal candles.", image_url="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=800")

        db.add_all([cat_lighting, cat_furniture, cat_wall_decor, cat_planters, cat_accessories])
        db.commit()

        # 3. Collections
        col_minimal = Collection(
            name="Minimal",
            slug="minimal",
            description="Quiet forms. Clean lines. Nothing unnecessary.",
            hero_image="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200",
            featured=True,
            seo_title="Minimal Home Decor Collection | DecorAura",
            meta_description="Explore DecorAura's minimalist home decor collection featuring lamps, mirrors, furniture and sculptural objects."
        )
        col_earthbound = Collection(
            name="Earthbound",
            slug="earthbound",
            description="Natural textures, warm tones and organic shapes.",
            hero_image="https://images.unsplash.com/photo-1615873968403-89e068629265?q=80&w=1200",
            featured=True,
            seo_title="Earthbound Home Decor Collection | DecorAura",
            meta_description="Handcrafted terracotta ceramics, organic stoneware, and high-fired planters for warm interiors."
        )
        col_luxe = Collection(
            name="Luxe",
            slug="luxe",
            description="Sculptural forms with refined materials.",
            hero_image="https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?q=80&w=1200",
            featured=True,
            seo_title="Luxe Home Decor Collection | DecorAura",
            meta_description="High-honed travertine marble, Italian velvet armchairs, and mouth-blown opal glass lighting."
        )
        col_warm_neutrals = Collection(
            name="Warm Neutrals",
            slug="warm-neutrals",
            description="Soft tones for calm interiors.",
            hero_image="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1200",
            featured=True,
            seo_title="Warm Neutrals Collection | DecorAura",
            meta_description="Soothing ivory, beige, and linen accents designed to create peaceful living environments."
        )
        col_modern_classics = Collection(
            name="Modern Classics",
            slug="modern-classics",
            description="Contemporary forms inspired by timeless design.",
            hero_image="https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=1200",
            featured=True,
            seo_title="Modern Classics Collection | DecorAura",
            meta_description="Flagship architectural lighting and iconic sculptural furniture pieces for modern spaces."
        )

        db.add_all([col_minimal, col_earthbound, col_luxe, col_warm_neutrals, col_modern_classics])
        db.commit()

        # 4. Products
        p1 = Product(
            name="Aurelia Lamp",
            slug="aurelia-lamp",
            price=340.0,
            rating=5.0,
            reviews_count=28,
            category_id=cat_lighting.id,
            description="The Aurelia Lamp is a masterpiece of modern lighting design. Sculpted from brushed champagne bronze and mouth-blown opal glass, its floating components create an enchanting interplay between shadow and warm radiance.",
            dimensions="Base 22cm Dia x Height 54cm",
            material="Brushed Bronze, Opal Mouth-Blown Glass",
            stock=15,
            availability="In Stock",
            is_featured=True,
            is_3d_enabled=True,
            model_path="/models/AureliaLamp.glb",
            primary_image="https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=1000"
        )

        p2 = Product(
            name="Forma Armchair",
            slug="forma-armchair",
            price=1250.0,
            rating=4.9,
            reviews_count=19,
            category_id=cat_furniture.id,
            description="Tactile velvet upholstery paired with solid walnut fluted legs.",
            dimensions="W 88cm x D 92cm x H 78cm",
            material="Italian Cotton Velvet, American Walnut",
            stock=8,
            availability="In Stock",
            is_featured=True,
            is_3d_enabled=False,
            primary_image="https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?q=80&w=1000"
        )

        p3 = Product(
            name="Luna Terracotta Vase",
            slug="luna-vase",
            price=145.0,
            rating=4.8,
            reviews_count=34,
            category_id=cat_accessories.id,
            description="Hand-thrown unglazed terracotta with mineral pigments.",
            dimensions="W 18cm x H 32cm",
            material="Hand-thrown Stoneware",
            stock=30,
            availability="In Stock",
            is_featured=True,
            is_3d_enabled=False,
            primary_image="https://images.unsplash.com/photo-1615873968403-89e068629265?q=80&w=1000"
        )

        p4 = Product(
            name="Arc Floor Lamp",
            slug="arc-floor-lamp",
            price=890.0,
            rating=5.0,
            reviews_count=14,
            category_id=cat_lighting.id,
            description="Arching solid brass floor lamp with dimmable ambient LED light.",
            dimensions="Reach 140cm x H 210cm",
            material="Brushed Brass, Travertine Base",
            stock=6,
            availability="In Stock",
            is_featured=True,
            is_3d_enabled=False,
            primary_image="https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=1000"
        )

        p5 = Product(
            name="Terra Fluted Planter",
            slug="terra-planter",
            price=165.0,
            rating=4.9,
            reviews_count=16,
            category_id=cat_planters.id,
            description="Artisanal ceramic planter with drainage tray. Soft ivory fluted texture.",
            dimensions="Dia 30cm x H 35cm",
            material="High-fired Clay, Matte Glaze",
            stock=22,
            availability="In Stock",
            is_featured=False,
            is_3d_enabled=False,
            primary_image="https://images.unsplash.com/photo-1485955900006-10f4d324d411?q=80&w=1000"
        )

        p6 = Product(
            name="Muse Fluted Wall Mirror",
            slug="muse-mirror",
            price=420.0,
            rating=4.7,
            reviews_count=22,
            category_id=cat_wall_decor.id,
            description="Arched focal mirror bordered by a fluted brushed brass frame.",
            dimensions="W 65cm x H 110cm",
            material="HD Glass, Anodized Brass Frame",
            stock=18,
            availability="In Stock",
            is_featured=False,
            is_3d_enabled=False,
            primary_image="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1000"
        )

        db.add_all([p1, p2, p3, p4, p5, p6])
        db.commit()

        # Link Products to Collections
        db.add_all([
            # Minimal
            CollectionProduct(collection_id=col_minimal.id, product_id=p1.id),
            CollectionProduct(collection_id=col_minimal.id, product_id=p6.id),
            CollectionProduct(collection_id=col_minimal.id, product_id=p2.id),
            # Earthbound
            CollectionProduct(collection_id=col_earthbound.id, product_id=p3.id),
            CollectionProduct(collection_id=col_earthbound.id, product_id=p5.id),
            # Luxe
            CollectionProduct(collection_id=col_luxe.id, product_id=p4.id),
            CollectionProduct(collection_id=col_luxe.id, product_id=p2.id),
            CollectionProduct(collection_id=col_luxe.id, product_id=p6.id),
            # Warm Neutrals
            CollectionProduct(collection_id=col_warm_neutrals.id, product_id=p3.id),
            CollectionProduct(collection_id=col_warm_neutrals.id, product_id=p5.id),
            CollectionProduct(collection_id=col_warm_neutrals.id, product_id=p1.id),
            # Modern Classics
            CollectionProduct(collection_id=col_modern_classics.id, product_id=p1.id),
            CollectionProduct(collection_id=col_modern_classics.id, product_id=p4.id),
            CollectionProduct(collection_id=col_modern_classics.id, product_id=p2.id),
        ])
        db.commit()

        # 5. Blog Posts & Blog-Product Associations
        bcat1 = BlogCategory(name="Lighting Architecture", slug="lighting-architecture")
        bcat2 = BlogCategory(name="Interior Styling", slug="interior-styling")
        db.add_all([bcat1, bcat2])
        db.commit()

        blog1 = Blog(
            title="Warm vs Cool Lighting: Which Is Right for Your Home?",
            slug="complete-guide-to-home-lighting",
            category_id=bcat1.id,
            tags_csv="Lighting, Ambient, Aurelia Lamp, Mood",
            featured_image="https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=1200",
            reading_time="6 min read",
            excerpt="Lighting is the secret currency of luxury interior design. Discover how temperature transforms mood.",
            content="""
Lighting dictates spatial volume and material warmth. 

### 1. Ambient Illumination
Warm 2700K temperature fixtures like the Aurelia Lamp create a welcoming baseline.

### 2. Accent Lighting
Spotlight fluted panels and artwork with directional brass sconces and floor lamps.
            """
        )

        blog2 = Blog(
            title="How to Make a Small Room Feel Bigger",
            slug="how-to-make-a-small-room-look-bigger",
            category_id=bcat2.id,
            tags_csv="Small Spaces, Mirrors, Styling",
            featured_image="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=1200",
            reading_time="5 min read",
            excerpt="Discover how light bounce and fluted mirrors double compact urban room proportions.",
            content="""
Compact spaces do not require compromising on high luxury. By strategically placing vertical brass mirrors across light sources, bounce light multiplies seamlessly across stoneware and linen surfaces.
            """
        )

        db.add_all([blog1, blog2])
        db.commit()

        # Link Blogs to Featured Products (Content-Commerce)
        db.add_all([
            BlogProduct(blog_id=blog1.id, product_id=p1.id), # Aurelia Lamp
            BlogProduct(blog_id=blog1.id, product_id=p4.id), # Arc Floor Lamp
            BlogProduct(blog_id=blog2.id, product_id=p3.id), # Luna Vase
            BlogProduct(blog_id=blog2.id, product_id=p6.id), # Muse Mirror
        ])

        # 6. Reviews
        db.add_all([
            Review(product_id=p1.id, author_name="Elena Rostova", rating=5, comment="The Aurelia Lamp completely transformed our penthouse living room."),
            Review(product_id=p1.id, author_name="Julian Vance", rating=5, comment="Exquisite weight and museum-grade brass finish!"),
            Review(product_id=p2.id, author_name="Marcus Thorne", rating=5, comment="The cotton velvet feels divine for our reading corner.")
        ])
        db.commit()

        print("Decor Aura Database Seeding Completed Successfully!")

    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
