# DecorAura 3D - Luxury Home Decor & Interior Inspiration Platform

![DecorAura 3D Hero](https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=1200)

**DecorAura 3D** is a premium, full-stack home-decor e-commerce and interior inspiration web application built with React, Vite, Three.js, React Three Fiber, GSAP ScrollTrigger, and Python FastAPI.

The defining feature is an interactive **3D Scroll Assembly Landing Page Experience**, where the flagship **Aurelia Lamp** forms progressively in 3D space as the user scrolls down the page.

---

## 🚀 One-Click Windows Launch (No Terminal Commands Required!)

You can open DecorAura directly from Windows File Explorer without running dev server commands or typing URLs.

### How to Open DecorAura:
1. Open the `DecorAura` project folder in Windows File Explorer.
2. Double-click **`Open-DecorAura.bat`**.
3. The background servers (FastAPI backend + Vite frontend) start automatically and your browser opens to **`http://localhost:5173`**.

### How to Close DecorAura:
1. Double-click **`Close-DecorAura.bat`**.
2. All background server processes on ports `5173` and `8000` shut down cleanly.

---

## Key Features

- **Interactive 3D Scroll Assembly Hero**:
  - Built using **Three.js** and **GSAP ScrollTrigger**.
  - Starts with floating lamp parts in space with random offsets & rotations.
  - Smooth scroll scrubbing aligns components into position.
  - Materials transition seamlessly to rich champagne bronze, brass, and mouth-blown opal glass.
  - Built-in procedural 3D model fallback ensures 100% out-of-the-box performance.

- **Full-Stack REST Backend**:
  - Built with **Python**, **FastAPI**, **SQLAlchemy**, and **SQLite**.
  - Automated database seeding script (`backend/seed.py`) populating luxury products, blog posts, reviews, and SEO metadata.
  - Complete REST endpoints for Products, Categories, Blog CMS, Orders, Reviews, and SEO (`sitemap.xml`, `robots.txt`).

- **E-Commerce & Shop Experience**:
  - Dynamic product catalog with Category filtering, Price Range slider, Search keyword filter, and Sorting controls.
  - Interactive 3D Product Viewer for detailed 360-degree orbit rotation on product page.
  - Shopping Cart with LocalStorage persistence, quantity controls, and mock checkout system.

- **Blog CMS & Editorial Journal**:
  - Magazine design showcasing interior design tips, lighting architecture guides, and spatial advice.

- **Admin Dashboard Panel (`/admin`)**:
  - Studio to view metrics, add/edit products, publish blog articles, and track/update customer order statuses.

---

## Project Structure

```
DecorAura/
├── Open-DecorAura.bat       # Single-click launcher for Windows
├── Close-DecorAura.bat      # Single-click shutdown script for Windows
├── start-dev.ps1            # PowerShell launcher script
├── stop-dev.ps1             # PowerShell shutdown script
├── frontend/                # React + Vite + Three.js application
│   ├── src/
│   │   ├── components/      # Hero3D, ProductViewer, Navbar, CartDrawer, etc.
│   │   ├── pages/           # Home, Shop, Product, Blog, Article, Admin
│   │   ├── services/        # API client & configuration (API_BASE)
│   │   └── App.jsx          # Route management & URL sync
│   ├── vite.config.js       # Vite server configuration (Port 5173 + Proxy)
│   └── package.json
├── backend/                 # Python FastAPI backend
│   ├── main.py              # FastAPI main app & static routing
│   ├── database.py          # SQLite engine & session
│   ├── models.py            # SQLAlchemy models
│   ├── schemas.py           # Pydantic schemas
│   ├── seed.py              # Database seeding script
│   └── routes/              # API route handlers
├── admin/                   # Admin static panel
├── decoraura.db             # SQLite database file
├── requirements.txt
└── README.md
```

---

## Developer Direct Commands

Developers can also run standard dev commands if preferred:

### Frontend Dev Server:
```bash
cd frontend
npm run dev
```

### Backend REST API Server:
```bash
py -m uvicorn backend.main:app --reload --host 127.0.0.1 --port 8000
```
