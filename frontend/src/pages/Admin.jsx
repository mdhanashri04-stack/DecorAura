import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Package, Newspaper, Receipt, Plus, Trash2, Edit, Layers, LogOut, Lock, Upload, Image as ImageIcon } from 'lucide-react';
import { API, API_BASE } from '../services/api';
import ProductImage from '../components/ProductImage';

export default function Admin({ onNavigate }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginEmail, setLoginEmail] = useState('admin@decoraura.com');
  const [loginPassword, setLoginPassword] = useState('admin123');
  const [loginError, setLoginError] = useState('');

  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [collections, setCollections] = useState([]);
  const [orders, setOrders] = useState([]);

  // Product Form State
  const [showProdModal, setShowProdModal] = useState(false);
  const [prodForm, setProdForm] = useState({
    name: '', price: 290, category_id: 1, description: '', dimensions: '', material: '', stock: 20, is_3d_enabled: false, primary_image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=800'
  });

  // Blog Form State
  const [showBlogModal, setShowBlogModal] = useState(false);
  const [blogForm, setBlogForm] = useState({
    title: '', slug: '', excerpt: '', content: '', tags_csv: '', featured_image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200', is_published: true, seo_title: '', meta_description: '', selected_product_id: ''
  });

  // Collection Form State
  const [showCollModal, setShowCollModal] = useState(false);
  const [editingCollId, setEditingCollId] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [collForm, setCollForm] = useState({
    name: '',
    slug: '',
    description: '',
    hero_image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200',
    featured: true,
    seo_title: '',
    meta_description: '',
    product_ids: []
  });

  useEffect(() => {
    document.title = 'Admin Studio | DecorAura';
    const token = API.getToken();
    if (token) {
      setIsAuthenticated(true);
      loadData();
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoginError('');
      await API.login(loginEmail, loginPassword);
      setIsAuthenticated(true);
      loadData();
    } catch {
      setLoginError('Invalid admin email or password.');
    }
  };

  const handleLogout = () => {
    API.clearToken();
    setIsAuthenticated(false);
  };

  const loadData = async () => {
    try {
      const [p, b, c, o] = await Promise.all([
        API.getProducts(),
        API.getBlogs({ published_only: false }),
        API.getCollections(),
        fetch(`${API_BASE}/orders`).then(r => r.json()).catch(() => [])
      ]);
      setProducts(p);
      setBlogs(b);
      setCollections(c);
      setOrders(o);
    } catch (e) {
      console.warn('Admin data load error:', e);
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...prodForm,
          slug: prodForm.name.toLowerCase().replace(/ /g, '-')
        })
      });
      setShowProdModal(false);
      loadData();
      alert('Product saved!');
    } catch {
      alert('Failed to save product.');
    }
  };

  const handleCreateBlog = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/blogs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...blogForm,
          category_id: 1,
          slug: blogForm.slug || blogForm.title.toLowerCase().replace(/ /g, '-')
        })
      });
      const newBlog = await res.json();
      
      if (blogForm.selected_product_id) {
        await fetch(`${API_BASE}/blogs/${newBlog.id}/products/${blogForm.selected_product_id}`, { method: 'POST' });
      }

      setShowBlogModal(false);
      loadData();
      alert('Article published with product link!');
    } catch {
      alert('Failed to save article.');
    }
  };

  const openCreateCollection = () => {
    setEditingCollId(null);
    setCollForm({
      name: '',
      slug: '',
      description: '',
      hero_image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200',
      featured: true,
      seo_title: '',
      meta_description: '',
      product_ids: []
    });
    setShowCollModal(true);
  };

  const openEditCollection = (coll) => {
    setEditingCollId(coll.id);
    setCollForm({
      name: coll.name || '',
      slug: coll.slug || '',
      description: coll.description || '',
      hero_image: coll.hero_image || '',
      featured: coll.featured !== undefined ? coll.featured : true,
      seo_title: coll.seo_title || '',
      meta_description: coll.meta_description || '',
      product_ids: coll.products ? coll.products.map(p => p.id) : []
    });
    setShowCollModal(true);
  };

  const handleSaveCollection = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: collForm.name,
        slug: collForm.slug || collForm.name.toLowerCase().replace(/\s+/g, '-'),
        description: collForm.description,
        hero_image: collForm.hero_image,
        featured: collForm.featured,
        seo_title: collForm.seo_title || `${collForm.name} Collection | DecorAura`,
        meta_description: collForm.meta_description || collForm.description,
        product_ids: collForm.product_ids
      };

      if (editingCollId) {
        await API.updateCollection(editingCollId, payload);
        alert('Collection updated successfully!');
      } else {
        await API.createCollection(payload);
        alert('Collection created successfully!');
      }
      setShowCollModal(false);
      loadData();
    } catch (err) {
      console.error('Save collection error:', err);
      alert('Failed to save collection.');
    }
  };

  const handleDeleteCollection = async (id) => {
    if (!confirm('Are you sure you want to delete this collection?')) return;
    try {
      await API.deleteCollection(id);
      loadData();
    } catch (err) {
      alert('Failed to delete collection.');
    }
  };

  const handleHeroImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setUploadingImage(true);
      const res = await API.uploadImage(file, 'collections');
      if (res && res.url) {
        setCollForm(prev => ({ ...prev, hero_image: res.url }));
      }
    } catch (err) {
      alert('Failed to upload hero image.');
    } finally {
      setUploadingImage(false);
    }
  };

  const toggleProductInCollection = (productId) => {
    setCollForm(prev => {
      const current = prev.product_ids || [];
      if (current.includes(productId)) {
        return { ...prev, product_ids: current.filter(id => id !== productId) };
      } else {
        return { ...prev, product_ids: [...current, productId] };
      }
    });
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm('Delete product?')) return;
    await fetch(`${API_BASE}/products/${id}`, { method: 'DELETE' });
    loadData();
  };

  const handleDeleteBlog = async (id) => {
    if (!confirm('Delete article?')) return;
    await fetch(`${API_BASE}/blogs/${id}`, { method: 'DELETE' });
    loadData();
  };

  const handleUpdateOrderStatus = async (id, status) => {
    await fetch(`${API_BASE}/orders/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    loadData();
  };

  if (!isAuthenticated) {
    return (
      <div className="pt-36 pb-24 bg-ivory-100 min-h-screen flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-3xl border border-ivory-300 shadow-2xl max-w-md w-full text-center">
          <div className="w-12 h-12 rounded-full bg-ivory-200 text-bronze-600 flex items-center justify-center mx-auto mb-4">
            <Lock size={22} />
          </div>
          <h2 className="text-3xl font-serif text-charcoal-900 mb-1">DecorAura Studio</h2>
          <p className="text-xs font-sans text-charcoal-500 mb-6">Enter admin credentials to manage products, CMS articles & collections.</p>

          {loginError && <div className="text-xs text-red-600 bg-red-50 p-2.5 rounded-xl mb-4">{loginError}</div>}

          <form onSubmit={handleLogin} className="space-y-4 text-left text-xs font-sans">
            <div>
              <label className="font-semibold block mb-1">Email</label>
              <input type="email" required value={loginEmail} onChange={e => setLoginEmail(e.target.value)} className="w-full p-3 border rounded-xl" />
            </div>
            <div>
              <label className="font-semibold block mb-1">Password</label>
              <input type="password" required value={loginPassword} onChange={e => setLoginPassword(e.target.value)} className="w-full p-3 border rounded-xl" />
            </div>
            <button type="submit" className="w-full py-3 bg-charcoal-900 text-white hover:bg-bronze-500 rounded-full font-semibold uppercase tracking-widest text-xs transition-colors">
              Log In to Studio
            </button>
          </form>
        </div>
      </div>
    );
  }

  const totalRevenue = orders.reduce((s, o) => s + (o.total_amount || 0), 0);

  return (
    <div className="pt-28 pb-24 bg-ivory-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        
        {/* Admin Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 pb-6 border-b border-ivory-300">
          <div>
            <button
              onClick={() => onNavigate && onNavigate('home')}
              className="inline-flex items-center gap-2 text-xs font-sans font-semibold uppercase tracking-widest text-bronze-600 hover:text-charcoal-900 transition-colors mb-2 block"
            >
              ← Back to Home
            </button>
            <span className="text-xs font-sans font-bold uppercase tracking-widest text-bronze-600">DecorAura Studio</span>
            <h1 className="text-3xl font-serif text-charcoal-900">Admin Dashboard</h1>
          </div>

          <div className="flex items-center gap-3 mt-4 sm:mt-0">
            <button onClick={handleLogout} className="p-2.5 rounded-full bg-white border border-ivory-300 text-charcoal-700 hover:text-red-600 transition-colors" title="Logout">
              <LogOut size={16} />
            </button>
          </div>
        </div>

        {/* Tab Bar */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 rounded-full text-xs font-sans uppercase tracking-widest flex items-center gap-1.5 transition-all ${
              activeTab === 'dashboard' ? 'bg-charcoal-900 text-white' : 'bg-white border border-ivory-300 text-charcoal-700'
            }`}
          >
            <LayoutDashboard size={14} /> Overview
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-full text-xs font-sans uppercase tracking-widest flex items-center gap-1.5 transition-all ${
              activeTab === 'products' ? 'bg-charcoal-900 text-white' : 'bg-white border border-ivory-300 text-charcoal-700'
            }`}
          >
            <Package size={14} /> Products ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('collections')}
            className={`px-4 py-2 rounded-full text-xs font-sans uppercase tracking-widest flex items-center gap-1.5 transition-all ${
              activeTab === 'collections' ? 'bg-charcoal-900 text-white' : 'bg-white border border-ivory-300 text-charcoal-700'
            }`}
          >
            <Layers size={14} /> Collections ({collections.length})
          </button>
          <button
            onClick={() => setActiveTab('blogs')}
            className={`px-4 py-2 rounded-full text-xs font-sans uppercase tracking-widest flex items-center gap-1.5 transition-all ${
              activeTab === 'blogs' ? 'bg-charcoal-900 text-white' : 'bg-white border border-ivory-300 text-charcoal-700'
            }`}
          >
            <Newspaper size={14} /> Blog CMS ({blogs.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-full text-xs font-sans uppercase tracking-widest flex items-center gap-1.5 transition-all ${
              activeTab === 'orders' ? 'bg-charcoal-900 text-white' : 'bg-white border border-ivory-300 text-charcoal-700'
            }`}
          >
            <Receipt size={14} /> Orders ({orders.length})
          </button>
        </div>

        {/* Tab 1: Dashboard Overview */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 bg-white rounded-2xl border border-ivory-300">
                <span className="text-xs font-sans text-charcoal-500 uppercase tracking-wider block mb-1">Total Revenue</span>
                <div className="text-3xl font-serif font-bold text-charcoal-900">${totalRevenue.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
              </div>
              <div className="p-6 bg-white rounded-2xl border border-ivory-300">
                <span className="text-xs font-sans text-charcoal-500 uppercase tracking-wider block mb-1">Active Products</span>
                <div className="text-3xl font-serif font-bold text-charcoal-900">{products.length}</div>
              </div>
              <div className="p-6 bg-white rounded-2xl border border-ivory-300">
                <span className="text-xs font-sans text-charcoal-500 uppercase tracking-wider block mb-1">Curated Collections</span>
                <div className="text-3xl font-serif font-bold text-charcoal-900">{collections.length}</div>
              </div>
              <div className="p-6 bg-white rounded-2xl border border-ivory-300">
                <span className="text-xs font-sans text-charcoal-500 uppercase tracking-wider block mb-1">Customer Orders</span>
                <div className="text-3xl font-serif font-bold text-charcoal-900">{orders.length}</div>
              </div>
            </div>

            <div className="p-8 bg-white rounded-3xl border border-ivory-300">
              <h3 className="text-2xl font-serif text-charcoal-900 mb-2">Authenticated Studio</h3>
              <p className="text-sm font-sans text-charcoal-500">
                Manage products, Collections with product linking, CMS articles, and process customer order status connected to SQLite backend.
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: Products */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-serif text-charcoal-900">Products List</h2>
              <button onClick={() => setShowProdModal(true)} className="px-5 py-2.5 bg-bronze-500 hover:bg-bronze-600 text-white rounded-full text-xs font-sans uppercase tracking-widest font-semibold flex items-center gap-1.5">
                <Plus size={16} /> Add Product
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-ivory-300 overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs font-sans">
                <thead>
                  <tr className="bg-ivory-100 border-b border-ivory-300 text-charcoal-600 uppercase tracking-wider">
                    <th className="p-4">Image</th>
                    <th className="p-4">Name</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Stock</th>
                    <th className="p-4">3D Enabled</th>
                    <th className="p-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ivory-200">
                  {products.map(p => (
                    <tr key={p.id}>
                      <td className="p-4">
                        <div className="w-10 h-10 rounded-lg overflow-hidden border border-ivory-300">
                          <ProductImage src={p.primary_image} alt={p.name} className="w-full h-full object-cover" />
                        </div>
                      </td>
                      <td className="p-4 font-semibold text-charcoal-900">{p.name}</td>
                      <td className="p-4">${(Number(p?.price) || 0).toFixed(2)}</td>
                      <td className="p-4">{p.stock} units</td>
                      <td className="p-4">{p.is_3d_enabled ? <span className="text-green-600 font-bold">Yes</span> : 'No'}</td>
                      <td className="p-4">
                        <button onClick={() => handleDeleteProduct(p.id)} className="text-red-500 hover:text-red-700">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Collections Management */}
        {activeTab === 'collections' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-serif text-charcoal-900">Curated Design Collections</h2>
                <p className="text-xs font-sans text-charcoal-500">Create, edit, upload hero images, and assign products to aesthetic story collections.</p>
              </div>
              <button onClick={openCreateCollection} className="px-5 py-2.5 bg-bronze-500 hover:bg-bronze-600 text-white rounded-full text-xs font-sans uppercase tracking-widest font-semibold flex items-center gap-1.5">
                <Plus size={16} /> Create Collection
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {collections.map(c => (
                <div key={c.id} className="bg-white p-6 rounded-2xl border border-ivory-300 flex flex-col justify-between shadow-sm">
                  <div>
                    <div className="aspect-[21/9] rounded-xl overflow-hidden mb-4 bg-ivory-200 border border-ivory-300">
                      <ProductImage src={c.hero_image} alt={c.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-serif text-xl text-charcoal-900">{c.name}</h3>
                      <span className="text-[10px] font-sans font-bold uppercase tracking-wider bg-ivory-200 text-bronze-600 px-2.5 py-0.5 rounded-full">
                        {c.slug}
                      </span>
                    </div>
                    <p className="text-xs font-sans text-charcoal-600 mb-4">{c.description}</p>
                    
                    <div className="mb-4">
                      <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-charcoal-500 block mb-2">
                        Assigned Products ({c.products ? c.products.length : 0})
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {c.products && c.products.length > 0 ? (
                          c.products.map(p => (
                            <span key={p.id} className="text-[10px] font-sans bg-ivory-100 text-charcoal-800 border border-ivory-300 px-2 py-0.5 rounded-full">
                              {p.name}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-charcoal-400 italic">No products assigned</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-ivory-200 mt-2">
                    <span className="text-xs font-sans text-charcoal-500">
                      {c.featured ? 'Featured on Explore' : 'Standard Collection'}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditCollection(c)}
                        className="px-3 py-1.5 bg-ivory-100 hover:bg-ivory-200 border border-ivory-300 rounded-lg text-xs text-charcoal-800 flex items-center gap-1 font-semibold"
                      >
                        <Edit size={14} /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteCollection(c.id)}
                        className="p-1.5 text-red-500 hover:text-red-700"
                        title="Delete Collection"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Blogs */}
        {activeTab === 'blogs' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-serif text-charcoal-900">Blog CMS Articles</h2>
              <button onClick={() => setShowBlogModal(true)} className="px-5 py-2.5 bg-bronze-500 hover:bg-bronze-600 text-white rounded-full text-xs font-sans uppercase tracking-widest font-semibold flex items-center gap-1.5">
                <Plus size={16} /> Create Article
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-ivory-300 overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs font-sans">
                <thead>
                  <tr className="bg-ivory-100 border-b border-ivory-300 text-charcoal-600 uppercase tracking-wider">
                    <th className="p-4">Title</th>
                    <th className="p-4">Slug</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ivory-200">
                  {blogs.map(b => (
                    <tr key={b.id}>
                      <td className="p-4 font-semibold text-charcoal-900">{b.title}</td>
                      <td className="p-4 text-charcoal-500">{b.slug}</td>
                      <td className="p-4">
                        {b.is_published ? <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-[10px] uppercase font-bold">Published</span> : 'Draft'}
                      </td>
                      <td className="p-4">
                        <button onClick={() => handleDeleteBlog(b.id)} className="text-red-500 hover:text-red-700">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 5: Orders */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-serif text-charcoal-900">Customer Orders</h2>

            <div className="bg-white rounded-2xl border border-ivory-300 overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs font-sans">
                <thead>
                  <tr className="bg-ivory-100 border-b border-ivory-300 text-charcoal-600 uppercase tracking-wider">
                    <th className="p-4">Order #</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Total</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Update Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ivory-200">
                  {orders.map(o => (
                    <tr key={o.id}>
                      <td className="p-4 font-bold text-charcoal-900">{o.order_number}</td>
                      <td className="p-4">{o.customer_name}<br/><span className="text-charcoal-400">{o.customer_email}</span></td>
                      <td className="p-4 font-semibold">${(Number(o?.total_amount) || 0).toFixed(2)}</td>
                      <td className="p-4"><span className="px-2 py-1 rounded bg-ivory-200 font-bold">{o.status}</span></td>
                      <td className="p-4">
                        <select
                          value={o.status}
                          onChange={e => handleUpdateOrderStatus(o.id, e.target.value)}
                          className="px-3 py-1 bg-ivory-100 border border-ivory-300 rounded text-xs"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Collection Modal */}
      {showCollModal && (
        <div className="fixed inset-0 bg-charcoal-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-xl w-full max-h-[90vh] overflow-y-auto border border-ivory-300 shadow-2xl space-y-6">
            <h3 className="text-2xl font-serif text-charcoal-900">
              {editingCollId ? 'Edit Collection' : 'Create Collection'}
            </h3>
            
            <form onSubmit={handleSaveCollection} className="space-y-4 text-xs font-sans">
              <div>
                <label className="font-semibold block mb-1">Collection Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Minimal"
                  value={collForm.name}
                  onChange={e => setCollForm({ ...collForm, name: e.target.value })}
                  className="w-full p-3 border rounded-xl"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Slug</label>
                <input
                  type="text"
                  placeholder="e.g. minimal"
                  value={collForm.slug}
                  onChange={e => setCollForm({ ...collForm, slug: e.target.value })}
                  className="w-full p-3 border rounded-xl"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Editorial Description</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Quiet forms. Clean lines. Nothing unnecessary."
                  value={collForm.description}
                  onChange={e => setCollForm({ ...collForm, description: e.target.value })}
                  className="w-full p-3 border rounded-xl"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Hero Image URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={collForm.hero_image}
                    onChange={e => setCollForm({ ...collForm, hero_image: e.target.value })}
                    className="w-full p-3 border rounded-xl"
                  />
                  <label className="px-4 py-3 bg-ivory-200 hover:bg-ivory-300 border border-ivory-300 rounded-xl cursor-pointer flex items-center gap-1.5 font-semibold shrink-0">
                    <Upload size={14} />
                    <span>{uploadingImage ? 'Uploading...' : 'Upload'}</span>
                    <input type="file" accept="image/*" onChange={handleHeroImageUpload} className="hidden" />
                  </label>
                </div>
              </div>

              {/* Products Selection Checklist */}
              <div>
                <label className="font-semibold block mb-2">Curated Products in Collection</label>
                <div className="bg-ivory-50 p-4 border border-ivory-300 rounded-xl max-h-48 overflow-y-auto space-y-2">
                  {products.map(p => (
                    <label key={p.id} className="flex items-center gap-3 p-2 bg-white rounded-lg border border-ivory-200 cursor-pointer hover:bg-ivory-100">
                      <input
                        type="checkbox"
                        checked={(collForm.product_ids || []).includes(p.id)}
                        onChange={() => toggleProductInCollection(p.id)}
                        className="accent-bronze-500 w-4 h-4"
                      />
                      <div className="flex-1 flex items-center justify-between text-xs">
                        <span className="font-medium text-charcoal-900">{p.name}</span>
                        <span className="text-charcoal-500">${(Number(p?.price) || 0).toFixed(2)}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* SEO Fields */}
              <div className="pt-2 border-t border-ivory-200">
                <label className="font-semibold block mb-1">SEO Title</label>
                <input
                  type="text"
                  placeholder="Minimal Home Decor Collection | DecorAura"
                  value={collForm.seo_title}
                  onChange={e => setCollForm({ ...collForm, seo_title: e.target.value })}
                  className="w-full p-3 border rounded-xl mb-3"
                />
                
                <label className="font-semibold block mb-1">Meta Description</label>
                <textarea
                  rows={2}
                  placeholder="Explore DecorAura's minimalist home decor collection..."
                  value={collForm.meta_description}
                  onChange={e => setCollForm({ ...collForm, meta_description: e.target.value })}
                  className="w-full p-3 border rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-ivory-200">
                <button type="button" onClick={() => setShowCollModal(false)} className="px-5 py-2.5 border rounded-full font-semibold">
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2.5 bg-bronze-500 hover:bg-bronze-600 text-white rounded-full font-semibold">
                  Save Collection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showProdModal && (
        <div className="fixed inset-0 bg-charcoal-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto border border-ivory-300 shadow-2xl">
            <h3 className="text-2xl font-serif text-charcoal-900 mb-4">Add Product</h3>
            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs font-sans">
              <div>
                <label className="font-semibold block mb-1">Product Name</label>
                <input type="text" required value={prodForm.name} onChange={e => setProdForm({ ...prodForm, name: e.target.value })} className="w-full p-2.5 border rounded-xl" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold block mb-1">Price ($)</label>
                  <input type="number" step="0.01" required value={prodForm.price} onChange={e => setProdForm({ ...prodForm, price: Number(e.target.value) })} className="w-full p-2.5 border rounded-xl" />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Stock</label>
                  <input type="number" required value={prodForm.stock} onChange={e => setProdForm({ ...prodForm, stock: Number(e.target.value) })} className="w-full p-2.5 border rounded-xl" />
                </div>
              </div>
              <div>
                <label className="font-semibold block mb-1">Description</label>
                <textarea required rows={2} value={prodForm.description} onChange={e => setProdForm({ ...prodForm, description: e.target.value })} className="w-full p-2.5 border rounded-xl" />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowProdModal(false)} className="px-4 py-2 border rounded-full">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-bronze-500 text-white rounded-full font-semibold">Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Blog Modal */}
      {showBlogModal && (
        <div className="fixed inset-0 bg-charcoal-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto border border-ivory-300 shadow-2xl">
            <h3 className="text-2xl font-serif text-charcoal-900 mb-4">Create Blog Article</h3>
            <form onSubmit={handleCreateBlog} className="space-y-4 text-xs font-sans">
              <div>
                <label className="font-semibold block mb-1">Title</label>
                <input type="text" required value={blogForm.title} onChange={e => setBlogForm({ ...blogForm, title: e.target.value })} className="w-full p-2.5 border rounded-xl" />
              </div>
              <div>
                <label className="font-semibold block mb-1">Excerpt</label>
                <textarea required rows={2} value={blogForm.excerpt} onChange={e => setBlogForm({ ...blogForm, excerpt: e.target.value })} className="w-full p-2.5 border rounded-xl" />
              </div>
              <div>
                <label className="font-semibold block mb-1">Content</label>
                <textarea required rows={4} value={blogForm.content} onChange={e => setBlogForm({ ...blogForm, content: e.target.value })} className="w-full p-2.5 border rounded-xl" />
              </div>
              <div>
                <label className="font-semibold block mb-1">Featured Product (Content-Commerce Link)</label>
                <select
                  value={blogForm.selected_product_id}
                  onChange={e => setBlogForm({ ...blogForm, selected_product_id: e.target.value })}
                  className="w-full p-2.5 border rounded-xl"
                >
                  <option value="">None</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name} (${p.price})</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowBlogModal(false)} className="px-4 py-2 border rounded-full">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-bronze-500 text-white rounded-full font-semibold">Publish Article</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
