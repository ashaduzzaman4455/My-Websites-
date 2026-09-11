/* ==================================================
   GLOWMART — Cart System
   ================================================== */
window.GlowCart = (function() {
  'use strict';

  function getCart() {
    try {
      return JSON.parse(localStorage.getItem('glowmart_cart_items') || '[]');
    } catch (e) { return []; }
  }

  function saveCart(cart) {
    localStorage.setItem('glowmart_cart_items', JSON.stringify(cart));
    updateBadges();
  }

  function add(productId, qty) {
    qty = qty || 1;
    const cart = getCart();
    const existing = cart.find(item => item.id === productId);
    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({ id: productId, qty: qty });
    }
    saveCart(cart);
    return true;
  }

  function remove(productId) {
    const cart = getCart().filter(item => item.id !== productId);
    saveCart(cart);
  }

  function updateQty(productId, qty) {
    const cart = getCart();
    const item = cart.find(x => x.id === productId);
    if (item) {
      item.qty = Math.max(1, qty);
      saveCart(cart);
    }
  }

  function clear() {
    localStorage.removeItem('glowmart_cart_items');
    updateBadges();
  }

  function getCount() {
    return getCart().reduce((sum, item) => sum + item.qty, 0);
  }

  function getTotal() {
    const cart = getCart();
    let total = 0;
    cart.forEach(item => {
      const p = window.PRODUCTS.find(x => x.id === item.id);
      if (p) total += p.price * item.qty;
    });
    return total;
  }

  function updateBadges() {
    const count = getCount();
    document.querySelectorAll('#cartCount').forEach(el => {
      el.textContent = count;
      el.classList.remove('bump');
      void el.offsetWidth;
      el.classList.add('bump');
    });
  }

  function getWishlist() {
    try {
      return JSON.parse(localStorage.getItem('glowmart_wishlist') || '[]');
    } catch (e) { return []; }
  }

  function toggleWishlist(productId) {
    let wl = getWishlist();
    if (wl.includes(productId)) {
      wl = wl.filter(x => x !== productId);
    } else {
      wl.push(productId);
    }
    localStorage.setItem('glowmart_wishlist', JSON.stringify(wl));
    updateWishlistBadge();
    return wl.includes(productId);
  }

  function updateWishlistBadge() {
    const count = getWishlist().length;
    document.querySelectorAll('#wishlistCount').forEach(el => {
      el.textContent = count;
    });
  }

  return { getCart, add, remove, updateQty, clear, getCount, getTotal, updateBadges, getWishlist, toggleWishlist, updateWishlistBadge };
})();

// Update badges on load
document.addEventListener('DOMContentLoaded', function() {
  if (window.GlowCart) {
    window.GlowCart.updateBadges();
    window.GlowCart.updateWishlistBadge();
  }
});
