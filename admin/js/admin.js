/* ==========================================================================
   DecorAura 3D - Admin Panel Controller
   ========================================================================== */

const API_BASE = window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1')
  ? 'http://127.0.0.1:8000/api'
  : '/api';

document.addEventListener('DOMContentLoaded', () => {
  // Navigation Tabs
  const navLinks = document.querySelectorAll('.sidebar-nav a');
  const sections = document.querySelectorAll('.admin-section');

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = link.getAttribute('data-target');
      
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      sections.forEach(sec => sec.style.display = 'none');
      const targetSec = document.getElementById(`section-${target}`);
      if (targetSec) targetSec.style.display = 'block';

      if (target === 'products') loadProductsTable();
      if (target === 'blogs') loadBlogsTable();
      if (target === 'orders') loadOrdersTable();
    });
  });

  // Initial loads
  loadDashboardStats();
  loadProductsTable();
  setupProductForm();
  setupBlogForm();
});

async function loadDashboardStats() {
  try {
    const [prods, blogs, orders] = await Promise.all([
      fetch(`${API_BASE}/products`).then(r => r.json()),
      fetch(`${API_BASE}/blogs?published_only=false`).then(r => r.json()),
      fetch(`${API_BASE}/orders`).then(r => r.json())
    ]);

    document.getElementById('stat-prods').textContent = prods.length;
    document.getElementById('stat-blogs').textContent = blogs.length;
    document.getElementById('stat-orders').textContent = orders.length;

    const revenue = orders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
    document.getElementById('stat-revenue').textContent = `$${revenue.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
  } catch (err) {
    console.warn('Dashboard stats fallback:', err);
  }
}

async function loadProductsTable() {
  const tbody = document.getElementById('products-tbody');
  try {
    const res = await fetch(`${API_BASE}/products`);
    const products = await res.json();

    tbody.innerHTML = products.map(p => `
      <tr>
        <td><img src="${p.primary_image}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 4px;"></td>
        <td><strong>${p.name}</strong></td>
        <td>${p.category ? p.category.name : 'Decor'}</td>
        <td>$${p.price.toFixed(2)}</td>
        <td>${p.stock} units</td>
        <td>${p.is_3d_enabled ? '<span style="color: green; font-weight: bold;">Yes</span>' : 'No'}</td>
        <td>
          <button onclick="window.deleteProduct(${p.id})" style="color: red; cursor: pointer; border: none; background: none;">
            <i class="fa-solid fa-trash"></i> Delete
          </button>
        </td>
      </tr>
    `).join('');
  } catch (err) {
    tbody.innerHTML = '<tr><td colspan="7">Failed to load products from API.</td></tr>';
  }
}

async function loadBlogsTable() {
  const tbody = document.getElementById('blogs-tbody');
  try {
    const res = await fetch(`${API_BASE}/blogs?published_only=false`);
    const blogs = await res.json();

    tbody.innerHTML = blogs.map(b => `
      <tr>
        <td><strong>${b.title}</strong></td>
        <td>${b.category ? b.category.name : 'General'}</td>
        <td>${b.slug}</td>
        <td>${b.is_published ? '<span class="badge-status completed">Published</span>' : '<span class="badge-status processing">Draft</span>'}</td>
        <td>
          <button onclick="window.deleteBlog(${b.id})" style="color: red; cursor: pointer; border: none; background: none;">
            <i class="fa-solid fa-trash"></i> Delete
          </button>
        </td>
      </tr>
    `).join('');
  } catch (err) {
    tbody.innerHTML = '<tr><td colspan="5">Failed to load blogs.</td></tr>';
  }
}

async function loadOrdersTable() {
  const tbody = document.getElementById('orders-tbody');
  try {
    const res = await fetch(`${API_BASE}/orders`);
    const orders = await res.json();

    tbody.innerHTML = orders.map(o => `
      <tr>
        <td><strong>${o.order_number}</strong></td>
        <td>${o.customer_name}<br><small>${o.customer_email}</small></td>
        <td>$${o.total_amount.toFixed(2)}</td>
        <td><span class="badge-status ${o.status.toLowerCase()}">${o.status}</span></td>
        <td>${new Date(o.created_at).toLocaleDateString()}</td>
        <td>
          <select onchange="window.updateOrderStatus(${o.id}, this.value)">
            <option value="Pending" ${o.status==='Pending'?'selected':''}>Pending</option>
            <option value="Processing" ${o.status==='Processing'?'selected':''}>Processing</option>
            <option value="Shipped" ${o.status==='Shipped'?'selected':''}>Shipped</option>
            <option value="Completed" ${o.status==='Completed'?'selected':''}>Completed</option>
          </select>
        </td>
      </tr>
    `).join('');
  } catch (err) {
    tbody.innerHTML = '<tr><td colspan="6">Failed to load orders.</td></tr>';
  }
}

function setupProductForm() {
  const form = document.getElementById('product-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const productData = {
      name: document.getElementById('p-name').value,
      slug: document.getElementById('p-slug').value || document.getElementById('p-name').value.toLowerCase().replace(/ /g, '-'),
      price: parseFloat(document.getElementById('p-price').value),
      category_id: parseInt(document.getElementById('p-category').value),
      description: document.getElementById('p-desc').value,
      dimensions: document.getElementById('p-dims').value,
      material: document.getElementById('p-mat').value,
      stock: parseInt(document.getElementById('p-stock').value),
      is_3d_enabled: document.getElementById('p-3d').checked,
      primary_image: document.getElementById('p-image').value
    };

    try {
      const res = await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
      if (res.ok) {
        alert('Product created successfully!');
        form.reset();
        document.getElementById('product-modal').classList.remove('active');
        loadProductsTable();
        loadDashboardStats();
      }
    } catch (err) {
      alert('Error creating product.');
    }
  });
}

function setupBlogForm() {
  const form = document.getElementById('blog-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const blogData = {
      title: document.getElementById('b-title').value,
      slug: document.getElementById('b-slug').value || document.getElementById('b-title').value.toLowerCase().replace(/ /g, '-'),
      content: document.getElementById('b-content').value,
      excerpt: document.getElementById('b-excerpt').value,
      category_id: 1,
      tags_csv: document.getElementById('b-tags').value,
      featured_image: document.getElementById('b-image').value,
      is_published: document.getElementById('b-publish').checked,
      seo_title: document.getElementById('b-seotitle').value,
      meta_description: document.getElementById('b-seodesc').value
    };

    try {
      const res = await fetch(`${API_BASE}/blogs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(blogData)
      });
      if (res.ok) {
        alert('Blog post saved!');
        form.reset();
        document.getElementById('blog-modal').classList.remove('active');
        loadBlogsTable();
      }
    } catch (err) {
      alert('Error creating blog post.');
    }
  });
}

window.deleteProduct = async function(id) {
  if (!confirm('Are you sure you want to delete this product?')) return;
  await fetch(`${API_BASE}/products/${id}`, { method: 'DELETE' });
  loadProductsTable();
};

window.deleteBlog = async function(id) {
  if (!confirm('Are you sure you want to delete this post?')) return;
  await fetch(`${API_BASE}/blogs/${id}`, { method: 'DELETE' });
  loadBlogsTable();
};

window.updateOrderStatus = async function(id, newStatus) {
  await fetch(`${API_BASE}/orders/${id}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: newStatus })
  });
  loadOrdersTable();
};
