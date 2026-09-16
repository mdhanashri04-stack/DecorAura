# DecorAura 3D - Deployment & Setup Guide

This guide details how to run **DecorAura 3D** locally and deploy it to cloud hosting services (Render, Vercel, Netlify, GitHub).

---

## 1. Local Development Instructions

### Prerequisites
- Python 3.9+ installed (`py --version`)

### Quick Setup

1. **Install Dependencies**:
   ```bash
   py -m pip install -r requirements.txt
   ```

2. **Seed Database**:
   ```bash
   py backend/seed.py
   ```
   *This creates `decoraura.db` pre-populated with luxury products, categories, reviews, and blog articles.*

3. **Start FastAPI Backend & Static File Server**:
   ```bash
   py -m uvicorn backend.main:app --reload --host 127.0.0.1 --port 8000
   ```

4. **Access Applications**:
   - **Landing Page (3D Assembly)**: `http://127.0.0.1:8000/` or `http://127.0.0.1:8000/frontend/index.html`
   - **Shop Catalogue**: `http://127.0.0.1:8000/shop.html`
   - **Product Page**: `http://127.0.0.1:8000/product.html?slug=aurelia-lamp`
   - **Admin Dashboard**: `http://127.0.0.1:8000/admin/index.html`
   - **Interactive OpenAPI Specs**: `http://127.0.0.1:8000/docs`

---

## 2. GitHub Setup Instructions

1. Initialize git repository:
   ```bash
   git init
   git add .
   git commit -m "Initial DecorAura 3D full-stack release"
   ```

2. Create a new repository on GitHub and push:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/DecorAura.git
   git branch -M main
   git push -u origin main
   ```

---

## 3. Backend Deployment (Render.com)

1. Sign in to [Render.com](https://render.com).
2. Click **New +** -> **Web Service**.
3. Connect your GitHub repository `DecorAura`.
4. Configure service parameters:
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt && python backend/seed.py`
   - **Start Command**: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
5. Click **Create Web Service**.

---

## 4. Frontend Deployment (Vercel / Netlify / GitHub Pages)

### Vercel / Netlify
1. Connect repository in Vercel or Netlify.
2. Set Root Directory to `frontend`.
3. Publish directory: `./`
4. Set environment variable `API_BASE_URL` if hosting backend separately on Render.

---

## 5. Production Environment Variables

| Variable | Description | Example |
|---|---|---|
| `DATABASE_URL` | SQLite or PostgreSQL connection string | `sqlite:///./decoraura.db` |
| `API_BASE_URL` | Host URL for API endpoints | `https://decoraura-api.onrender.com/api` |
| `DEBUG` | Enable debug logs | `false` |
