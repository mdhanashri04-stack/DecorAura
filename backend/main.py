import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from backend.database import engine, Base
from backend.routes import products, categories, collections, blogs, orders, seo, auth

# Initialize Database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Decor Aura REST API",
    description="PeachWeb-style Luxury Home Decor & 3D E-Commerce Backend",
    version="2.5.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router)
app.include_router(products.router)
app.include_router(categories.router)
app.include_router(collections.router)
app.include_router(blogs.router)
app.include_router(orders.router)
app.include_router(seo.router)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UPLOADS_DIR = os.path.join(BASE_DIR, "backend", "uploads")
os.makedirs(os.path.join(UPLOADS_DIR, "products"), exist_ok=True)
os.makedirs(os.path.join(UPLOADS_DIR, "collections"), exist_ok=True)

app.mount("/uploads", StaticFiles(directory=UPLOADS_DIR), name="uploads")

from fastapi import UploadFile, File
import shutil
import uuid

@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...), folder: str = "products"):
    folder_dir = os.path.join(UPLOADS_DIR, folder)
    os.makedirs(folder_dir, exist_ok=True)
    
    ext = os.path.splitext(file.filename)[1] or ".jpg"
    filename = f"{uuid.uuid4().hex}{ext}"
    file_path = os.path.join(folder_dir, filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    return {"url": f"/uploads/{folder}/{filename}"}

FRONTEND_DIST = os.path.join(BASE_DIR, "frontend", "dist")

if os.path.exists(FRONTEND_DIST):
    app.mount("/assets", StaticFiles(directory=os.path.join(FRONTEND_DIST, "assets")), name="assets")

    @app.get("/{full_path:path}")
    def serve_react_app(full_path: str):
        file_path = os.path.join(FRONTEND_DIST, full_path)
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(FRONTEND_DIST, "index.html"))
else:
    @app.get("/")
    def root():
        return {
            "message": "Decor Aura API is active.",
            "docs": "/docs",
            "status": "online"
        }
