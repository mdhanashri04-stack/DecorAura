export const API_BASE = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api` : '/api';

export const API = {
  // Auth Token management
  getToken() {
    return localStorage.getItem('decoraura_jwt_token');
  },
  setToken(token) {
    localStorage.setItem('decoraura_jwt_token', token);
  },
  clearToken() {
    localStorage.removeItem('decoraura_jwt_token');
  },

  async login(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) throw new Error('Invalid credentials');
    const data = await res.json();
    this.setToken(data.access_token);
    return data;
  },

  // Products
  async getProducts(params = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${API_BASE}/products?${query}`);
      if (!res.ok) throw new Error('API request failed');
      return await res.json();
    } catch (err) {
      console.warn('API getProducts fallback:', err);
      return this.getFallbackProducts();
    }
  },

  async getProduct(idOrSlug) {
    try {
      const res = await fetch(`${API_BASE}/products/${idOrSlug}`);
      if (!res.ok) throw new Error('Product not found');
      return await res.json();
    } catch (err) {
      console.warn('API getProduct fallback:', err);
      const all = this.getFallbackProducts();
      return all.find(p => p.id == idOrSlug || p.slug === idOrSlug) || all[0];
    }
  },

  async addReview(productId, reviewData) {
    const res = await fetch(`${API_BASE}/products/${productId}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reviewData)
    });
    if (!res.ok) throw new Error('Review error');
    return await res.json();
  },

  // Categories & Collections
  async getCategories() {
    try {
      const res = await fetch(`${API_BASE}/categories`);
      if (!res.ok) throw new Error('Categories fetch failed');
      return await res.json();
    } catch (err) {
      return [
        { id: 1, name: 'Lighting', slug: 'lighting' },
        { id: 2, name: 'Furniture', slug: 'furniture' },
        { id: 3, name: 'Wall Decor', slug: 'wall-decor' },
        { id: 4, name: 'Plants & Planters', slug: 'plants-planters' },
        { id: 5, name: 'Accessories', slug: 'accessories' }
      ];
    }
  },

  async getCollections() {
    try {
      const res = await fetch(`${API_BASE}/collections`);
      if (!res.ok) throw new Error('Collections fetch failed');
      return await res.json();
    } catch (err) {
      return this.getFallbackCollections();
    }
  },

  async getCollection(slugOrId) {
    try {
      const res = await fetch(`${API_BASE}/collections/${slugOrId}`);
      if (!res.ok) throw new Error('Collection not found');
      return await res.json();
    } catch (err) {
      const all = this.getFallbackCollections();
      return all.find(c => c.slug === slugOrId || c.id == slugOrId) || all[0];
    }
  },

  async createCollection(collectionData) {
    const res = await fetch(`${API_BASE}/collections`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(collectionData)
    });
    if (!res.ok) throw new Error('Collection creation failed');
    return await res.json();
  },

  async updateCollection(id, collectionData) {
    const res = await fetch(`${API_BASE}/collections/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(collectionData)
    });
    if (!res.ok) throw new Error('Collection update failed');
    return await res.json();
  },

  async deleteCollection(id) {
    const res = await fetch(`${API_BASE}/collections/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Collection delete failed');
    return await res.json();
  },

  async uploadImage(file, folder = 'products') {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE}/upload?folder=${folder}`, {
      method: 'POST',
      body: formData
    });
    if (!res.ok) throw new Error('Image upload failed');
    return await res.json();
  },

  // Blog CMS & Content-Commerce Linking
  async getBlogs(params = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${API_BASE}/blogs?${query}`);
      if (!res.ok) throw new Error('Blogs fetch failed');
      return await res.json();
    } catch (err) {
      return this.getFallbackBlogs();
    }
  },

  async getBlog(idOrSlug) {
    try {
      const res = await fetch(`${API_BASE}/blogs/${idOrSlug}`);
      if (!res.ok) throw new Error('Blog not found');
      return await res.json();
    } catch (err) {
      const all = this.getFallbackBlogs();
      return all.find(b => b.id == idOrSlug || b.slug === idOrSlug) || all[0];
    }
  },

  async getBlogProducts(slug) {
    try {
      const res = await fetch(`${API_BASE}/blogs/${slug}/products`);
      if (!res.ok) return [];
      return await res.json();
    } catch {
      return this.getFallbackProducts().slice(0, 2);
    }
  },

  // SEO & Schema
  async getSeoMetadata(pageType, slug) {
    try {
      const res = await fetch(`${API_BASE}/seo/${pageType}/${slug}`);
      return await res.json();
    } catch {
      return {
        title: 'DecorAura - Objects With A Story',
        description: 'Luxury home decor e-commerce and interior inspiration.'
      };
    }
  },

  async getJsonLdSchema(pageType, slug) {
    try {
      const res = await fetch(`${API_BASE}/seo/jsonld/${pageType}/${slug}`);
      return await res.json();
    } catch {
      return null;
    }
  },

  // Orders
  async createOrder(orderData) {
    try {
      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      if (!res.ok) throw new Error('Order placement failed');
      return await res.json();
    } catch (err) {
      return {
        id: Math.floor(Math.random() * 900) + 100,
        order_number: `DA-${Math.floor(100000 + Math.random() * 900000)}`,
        status: 'Processing',
        total_amount: orderData.items.reduce((s, i) => s + i.quantity * 340, 0)
      };
    }
  },

  getFallbackProducts() {
    return [
      {
        id: 1,
        name: "Aurelia Lamp",
        slug: "aurelia-lamp",
        price: 340.0,
        rating: 5.0,
        reviews_count: 28,
        category: { name: "Lighting", slug: "lighting" },
        description: "The Aurelia Lamp is a masterpiece of modern lighting design. Sculpted from brushed champagne bronze and mouth-blown opal glass, its floating 3D components assemble into a radiant halo.",
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
        name: "Forma Armchair",
        slug: "forma-armchair",
        price: 1250.0,
        rating: 4.9,
        reviews_count: 19,
        category: { name: "Furniture", slug: "furniture" },
        description: "Tactile velvet upholstery paired with solid walnut fluted legs.",
        dimensions: "W 88cm x D 92cm x H 78cm",
        material: "Italian Cotton Velvet, American Walnut",
        stock: 8,
        availability: "In Stock",
        is_featured: true,
        is_3d_enabled: false,
        primary_image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?q=80&w=1000"
      },
      {
        id: 3,
        name: "Luna Terracotta Vase",
        slug: "luna-vase",
        price: 145.0,
        rating: 4.8,
        reviews_count: 34,
        category: { name: "Accessories", slug: "accessories" },
        description: "Hand-thrown unglazed terracotta with mineral pigments.",
        dimensions: "W 18cm x H 32cm",
        material: "Hand-thrown Stoneware",
        stock: 30,
        availability: "In Stock",
        is_featured: true,
        is_3d_enabled: false,
        primary_image: "https://images.unsplash.com/photo-1615873968403-89e068629265?q=80&w=1000"
      }
    ];
  },

  getFallbackCollections() {
    const prods = this.getFallbackProducts();
    return [
      {
        id: 1,
        name: "Minimal",
        slug: "minimal",
        description: "Quiet forms. Clean lines. Nothing unnecessary.",
        hero_image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200",
        featured: true,
        seo_title: "Minimal Home Decor Collection | DecorAura",
        meta_description: "Explore DecorAura's minimalist home decor collection.",
        products: prods
      },
      {
        id: 2,
        name: "Earthbound",
        slug: "earthbound",
        description: "Natural textures, warm tones and organic shapes.",
        hero_image: "https://images.unsplash.com/photo-1615873968403-89e068629265?q=80&w=1200",
        featured: true,
        seo_title: "Earthbound Home Decor Collection | DecorAura",
        meta_description: "Handcrafted terracotta ceramics, organic stoneware, and high-fired planters.",
        products: prods.slice(2, 3)
      },
      {
        id: 3,
        name: "Luxe",
        slug: "luxe",
        description: "Sculptural forms with refined materials.",
        hero_image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?q=80&w=1200",
        featured: true,
        seo_title: "Luxe Home Decor Collection | DecorAura",
        meta_description: "High-honed travertine marble and Italian velvet armchairs.",
        products: prods.slice(0, 2)
      },
      {
        id: 4,
        name: "Warm Neutrals",
        slug: "warm-neutrals",
        description: "Soft tones for calm interiors.",
        hero_image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1200",
        featured: true,
        seo_title: "Warm Neutrals Collection | DecorAura",
        meta_description: "Soothing ivory, beige, and linen accents designed to create peaceful living environments.",
        products: prods
      },
      {
        id: 5,
        name: "Modern Classics",
        slug: "modern-classics",
        description: "Contemporary forms inspired by timeless design.",
        hero_image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=1200",
        featured: true,
        seo_title: "Modern Classics Collection | DecorAura",
        meta_description: "Flagship architectural lighting and iconic sculptural furniture pieces.",
        products: prods.slice(0, 2)
      }
    ];
  },

  getFallbackBlogs() {
    return [
      {
        id: 1,
        title: "Warm vs Cool Lighting: Which Is Right for Your Home?",
        slug: "complete-guide-to-home-lighting",
        reading_time: "6 min read",
        excerpt: "Lighting is the secret currency of luxury interior design. Learn how temperature transforms mood.",
        content: "Lighting is never merely functional...",
        featured_image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=1200",
        published_at: new Date().toISOString(),
        category: { name: "Lighting Architecture" }
      },
      {
        id: 2,
        title: "How to Make a Small Room Feel Bigger",
        slug: "how-to-make-a-small-room-look-bigger",
        reading_time: "5 min read",
        excerpt: "Discover how spatial light reflection and fluted mirrors double urban room proportions.",
        content: "Compact spaces do not require compromising on high luxury...",
        featured_image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=1200",
        published_at: new Date().toISOString(),
        category: { name: "Interior Styling" }
      }
    ];
  }
};
