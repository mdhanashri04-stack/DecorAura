/* ==========================================================================
   DecorAura 3D - Shopping Cart & LocalStorage Manager
   ========================================================================== */

const CART_KEY = 'decoraura_cart_items';

export const Cart = {
  getItems() {
    try {
      const data = localStorage.getItem(CART_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  saveItems(items) {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
    this.updateCartBadge();
  },

  addItem(product, quantity = 1) {
    const items = this.getItems();
    const existingIndex = items.findIndex(item => item.id === product.id);

    if (existingIndex > -1) {
      items[existingIndex].quantity += quantity;
    } else {
      items.push({
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        primary_image: product.primary_image,
        quantity: quantity
      });
    }

    this.saveItems(items);
    this.showToast(`Added "${product.name}" to cart`);
  },

  updateQuantity(productId, quantity) {
    let items = this.getItems();
    if (quantity <= 0) {
      items = items.filter(item => item.id !== productId);
    } else {
      const item = items.find(i => i.id === productId);
      if (item) item.quantity = quantity;
    }
    this.saveItems(items);
  },

  removeItem(productId) {
    const items = this.getItems().filter(item => item.id !== productId);
    this.saveItems(items);
  },

  clearCart() {
    localStorage.removeItem(CART_KEY);
    this.updateCartBadge();
  },

  getTotalCount() {
    const items = this.getItems();
    return items.reduce((sum, item) => sum + item.quantity, 0);
  },

  getSubtotal() {
    const items = this.getItems();
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  },

  updateCartBadge() {
    const count = this.getTotalCount();
    const badges = document.querySelectorAll('.cart-badge');
    badges.forEach(badge => {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    });
  },

  showToast(message) {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fa-solid fa-bag-shopping" style="color: var(--accent-gold);"></i> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  }
};

// Auto update badge on load
document.addEventListener('DOMContentLoaded', () => {
  Cart.updateCartBadge();
});
