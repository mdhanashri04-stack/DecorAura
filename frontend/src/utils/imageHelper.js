import { API_BASE } from '../services/api';

/**
 * Normalizes image paths/URLs for products, collections, and blog articles.
 * Handles:
 * - Full HTTP/HTTPS URLs (http://..., https://...)
 * - Backend static uploads ('/uploads/products/xyz.webp', 'uploads/products/xyz.webp')
 * - Local static public assets ('/products/xyz.webp', 'products/xyz.webp', 'xyz.webp')
 * - Windows backslash file paths ('uploads\\products\\xyz.jpg')
 */
export function getProductImageUrl(path) {
  if (!path) return '';

  if (typeof path === 'object' && path !== null) {
    path = path.url || path.primary_image || path.src || path.path || '';
  }

  if (!path || typeof path !== 'string') return '';

  // Normalize string and convert backslashes to forward slashes
  let cleanPath = String(path).trim().replace(/\\/g, '/');

  if (cleanPath.startsWith('http://') || cleanPath.startsWith('https://')) {
    return cleanPath;
  }

  // Determine backend base URL without /api suffix (e.g. http://localhost:8000)
  const backendBase = API_BASE.replace(/\/api$/, '');

  if (cleanPath.startsWith('/uploads/') || cleanPath.startsWith('uploads/')) {
    const relative = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;
    return `${backendBase}${relative}`;
  }

  // If path is a standalone filename like 'luna-vase.webp' or 'luna-terracotta-vase.webp'
  if (!cleanPath.includes('/')) {
    return `/products/${cleanPath}`;
  }

  if (cleanPath.startsWith('/')) {
    return cleanPath;
  }

  return `/${cleanPath}`;
}

