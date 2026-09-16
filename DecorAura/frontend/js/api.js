/* ==========================================================================
   DecorAura 3D - API Client Module
   ========================================================================== */

const API_BASE_URL = window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1')
  ? 'http://127.0.0.1:8000/api'
  : '/api';

export const API = {
  // Products
  async getProducts(params = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${API_BASE_URL}/products?${query}`);
      if (!res.ok) throw new Error('Failed to fetch products');
      return await res.json();
    } catch (err) {
      console.warn('API getProducts fallback:', err);
      return this.getFallbackProducts();
    }
  },

  async getProduct(idOrSlug) {
    try {
      const res = await fetch(`${API_BASE_URL}/products/${idOrSlug}`);
      if (!res.ok) throw new Error('Product not found');
      return await res.json();
    } catch (err) {
      console.warn('API getProduct fallback:', err);
      const all = this.getFallbackProducts();
      return all.find(p => p.id == idOrSlug || p.slug === idOrSlug) || all[0];
    }
  },

  async addReview(productId, reviewData) {
    try {
      const res = await fetch(`${API_BASE_URL}/products/${productId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData)
      });
      if (!res.ok) throw new Error('Failed to submit review');
      return await res.json();
    } catch (err) {
      console.error('Review submit error:', err);
      throw err;
    }
  },

  // Categories
  async getCategories() {
    try {
      const res = await fetch(`${API_BASE_URL}/categories`);
      if (!res.ok) throw new Error('Failed to fetch categories');
      return await res.json();
    } catch (err) {
      return [
        { id: 1, name: "Lighting", slug: "lighting" },
        { id: 2, name: "Furniture", slug: "furniture" },
        { id: 3, name: "Wall Decor", slug: "wall-decor" },
        { id: 4, name: "Plants & Planters", slug: "plants-planters" },
        { id: 5, name: "Accessories", slug: "accessories" }
      ];
    }
  },

  // Blog
  async getBlogs(params = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${API_BASE_URL}/blogs?${query}`);
      if (!res.ok) throw new Error('Failed to fetch blogs');
      return await res.json();
    } catch (err) {
      return this.getFallbackBlogs();
    }
  },

  async getBlog(idOrSlug) {
    try {
      const res = await fetch(`${API_BASE_URL}/blogs/${idOrSlug}`);
      if (!res.ok) throw new Error('Blog not found');
      return await res.json();
    } catch (err) {
      const all = this.getFallbackBlogs();
      return all.find(b => b.id == idOrSlug || b.slug === idOrSlug) || all[0];
    }
  },

  // Orders
  async createOrder(orderData) {
    try {
      const res = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      if (!res.ok) throw new Error('Order creation failed');
      return await res.json();
    } catch (err) {
      console.warn('API createOrder fallback mock response:', err);
      return {
        id: Math.floor(Math.random() * 1000) + 10,
        order_number: `DA-${Math.floor(100000 + Math.random() * 900000)}`,
        status: 'Processing',
        total_amount: orderData.items.reduce((sum, item) => sum + (item.quantity * 340), 0),
        customer_name: orderData.customer_name
      };
    }
  },

  // Fallback Product Data
  getFallbackProducts() {
    return [
      {
        id: 1,
        name: "Aurelia Lamp",
        slug: "aurelia-lamp",
        price: 340.0,
        rating: 5.0,
        reviews_count: 28,
        category_id: 1,
        category: { name: "Lighting", slug: "lighting" },
        description: "The Aurelia Lamp is a masterpiece of modern lighting design. Sculpted from brushed champagne bronze and frosted opalescent glass, its floating components create an enchanting interplay between shadow and warm radiance.",
        dimensions: "Base 22cm Dia x Height 54cm",
        material: "Brushed Bronze, Opal Mouth-Blown Glass",
        stock: 15,
        availability: "In Stock",
        is_featured: true,
        is_3d_enabled: true,
        primary_image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=1000"
      },
      {
        id: 2,
        name: "Solstice Velvet Lounge Chair",
        slug: "solstice-velvet-lounge-chair",
        price: 1250.0,
        rating: 4.9,
        reviews_count: 19,
        category_id: 2,
        category: { name: "Furniture", slug: "furniture" },
        description: "Italian cotton velvet upholstered chair resting upon curved dark walnut frame.",
        dimensions: "W 88cm x D 92cm x H 78cm",
        material: "Cotton Velvet, American Walnut",
        stock: 8,
        availability: "In Stock",
        is_featured: true,
        is_3d_enabled: false,
        primary_image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?q=80&w=1000"
      },
      {
        id: 3,
        name: "Komorebi Minimalist Ceramic Vase",
        slug: "komorebi-minimalist-ceramic-vase",
        price: 145.0,
        rating: 4.8,
        reviews_count: 34,
        category_id: 5,
        category: { name: "Accessories", slug: "accessories" },
        description: "Hand-thrown stoneware with an unglazed matte terracotta exterior.",
        dimensions: "W 18cm x H 32cm",
        material: "Hand-thrown Stoneware",
        stock: 30,
        availability: "In Stock",
        is_featured: true,
        is_3d_enabled: false,
        primary_image: "https://images.unsplash.com/photo-1612196808214-b7e239e5f6b7?q=80&w=1000"
      },
      {
        id: 4,
        name: "Elysian Travertine Coffee Table",
        slug: "elysian-travertine-coffee-table",
        price: 1890.0,
        rating: 5.0,
        reviews_count: 9,
        category_id: 2,
        category: { name: "Furniture", slug: "furniture" },
        description: "Carved from monolithic Roman travertine with organic surface veins.",
        dimensions: "L 130cm x W 70cm x H 38cm",
        material: "Honed Roman Travertine",
        stock: 4,
        availability: "In Stock",
        is_featured: true,
        is_3d_enabled: false,
        primary_image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=1000"
      }
    ];
  },

  getFallbackBlogs() {
    return [
      {
        id: 1,
        title: "Complete Guide to Home Lighting & Mood Architecture",
        slug: "complete-guide-to-home-lighting",
        reading_time: "6 min read",
        excerpt: "Lighting is the secret currency of luxury interior design.",
        content: "Discover how layering ambient, task, and accent light transforms living spaces...",
        featured_image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=1200",
        published_at: new Date().toISOString(),
        category: { name: "Lighting & Mood", slug: "lighting-mood" }
      },
      {
        id: 2,
        title: "10 Modern Living Room Ideas for Contemporary Interiors",
        slug: "10-modern-living-room-ideas",
        reading_time: "8 min read",
        excerpt: "From sculptural travertine tables to warm monochromatic palettes.",
        content: "Creating a timeless living room requires balancing architectural minimalism...",
        featured_image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200",
        published_at: new Date().toISOString(),
        category: { name: "Interior Design", slug: "interior-design" }
      }
    ];
  }
};
