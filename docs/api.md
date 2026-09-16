# DecorAura 3D - API Specification & Documentation

The DecorAura 3D backend is built with **FastAPI**, **SQLAlchemy**, and **SQLite**.

Base URL: `http://127.0.0.1:8000/api`

---

## 1. Products API

### `GET /api/products`
Retrieves products with support for category, price range, search, and sorting.

**Query Parameters:**
- `category_slug` (string, optional): Filter by category slug (e.g. `lighting`, `furniture`)
- `min_price` (float, optional): Minimum price threshold
- `max_price` (float, optional): Maximum price threshold
- `search` (string, optional): Search keyword matching product name or description
- `featured` (boolean, optional): Filter featured products (`true`/`false`)
- `sort_by` (string, optional): `price_asc`, `price_desc`, `rating`, `newest`

### `GET /api/products/{id_or_slug}`
Retrieves detailed information for a single product by numeric ID or URL slug.

### `POST /api/products`
Creates a new product (Admin).
**Request Body:**
```json
{
  "name": "Aurelia Lamp",
  "slug": "aurelia-lamp",
  "price": 340.0,
  "category_id": 1,
  "description": "Luxury 3D sculptural lamp...",
  "dimensions": "Base 22cm x H 54cm",
  "material": "Brushed Bronze, Opal Glass",
  "stock": 15,
  "is_3d_enabled": true,
  "primary_image": "https://images.unsplash.com/photo-..."
}
```

### `PUT /api/products/{id}`
Updates existing product properties.

### `DELETE /api/products/{id}`
Deletes a product by ID.

### `POST /api/products/{id}/reviews`
Adds a customer review for a specific product.
**Request Body:**
```json
{
  "product_id": 1,
  "author_name": "Eleanor Vance",
  "rating": 5,
  "comment": "Exquisite craftsmanship and warm glow!"
}
```

---

## 2. Categories API

### `GET /api/categories`
Returns all product categories.

### `POST /api/categories`
Creates a new category.

---

## 3. Blog CMS API

### `GET /api/blogs`
Retrieves published blog posts with optional filters (`category_slug`, `tag`, `search`).

### `GET /api/blogs/{id_or_slug}`
Retrieves a single blog article.

### `POST /api/blogs`
Creates a new blog article.

### `PUT /api/blogs/{id}`
Updates an existing blog article.

### `DELETE /api/blogs/{id}`
Deletes a blog post.

---

## 4. Orders API

### `GET /api/orders`
Retrieves all customer orders for the admin dashboard.

### `POST /api/orders`
Creates a new customer order (Mock Checkout).
**Request Body:**
```json
{
  "customer_name": "Julian Thorne",
  "customer_email": "julian@example.com",
  "shipping_address": "742 Evergreen Terrace, NY",
  "payment_method": "Mock Checkout",
  "items": [
    { "product_id": 1, "quantity": 1 }
  ]
}
```

### `PUT /api/orders/{id}/status`
Updates order fulfillment status (`Pending`, `Processing`, `Shipped`, `Completed`).

---

## 5. SEO & Sitemap API

- `GET /api/seo/{page_type}/{target_slug}` - Returns dynamic SEO metadata
- `GET /sitemap.xml` - Dynamically generated XML sitemap
- `GET /robots.txt` - Web crawler directives
