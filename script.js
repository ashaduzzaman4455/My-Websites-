(function () {
  'use strict';

  // ---------- PRODUCT DATA ----------
  const products = [
    { id: 1, name: 'AirPods Max 2', price: 129, oldPrice: 169, desc: 'Spatial audio, premium build', icon: 'fa-headphones', tag: '-20%', rating: 4.8, category: 'featured' },
    { id: 2, name: 'Organic Tee', price: 34, oldPrice: null, desc: '100% cotton, relaxed fit', icon: 'fa-tshirt', tag: 'eco', rating: 5.0, category: 'featured' },
    { id: 3, name: 'Ultraboost 23', price: 89, oldPrice: 110, desc: 'Lightweight, responsive cushion', icon: 'fa-shoe-prints', tag: 'hot', rating: 5.0, category: 'featured' },
    { id: 4, name: 'Zenbook S 14', price: 1499, oldPrice: null, desc: 'OLED, Intel Core Ultra 7', icon: 'fa-laptop', tag: 'new', rating: 4.9, category: 'featured' },
    { id: 5, name: 'Instax Mini 12', price: 79, oldPrice: null, desc: 'Instant film camera, pastel', icon: 'fa-camera', tag: null, rating: 4.9, category: 'new' },
    { id: 6, name: 'Series 10', price: 429, oldPrice: null, desc: 'GPS + Cellular, always-on', icon: 'fa-clock', tag: null, rating: 4.7, category: 'new' },
    { id: 7, name: 'Ember Mug 2', price: 99, oldPrice: null, desc: 'Temperature control, app', icon: 'fa-mug-hot', tag: null, rating: 5.0, category: 'new' },
    { id: 8, name: 'Ergonomic Chair', price: 249, oldPrice: null, desc: 'Mesh, lumbar support', icon: 'fa-chair', tag: null, rating: 4.9, category: 'new' }
  ];

  // ---------- STATE ----------
  let cartCount = 0;
  let toastTimer = null;

  // ---------- DOM ----------
  const productGrid = document.getElementById('productGrid');
  const newArrivalsGrid = document.getElementById('newArrivalsGrid');
  const cartBadge = document.getElementById('cartCount');
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');

  // ---------- HELPERS ----------
  function renderStars(rating) {
    const full = Math.floor(rating);
    const half = rating - full >= 0.5 ? 1 : 0;
    let html = '';
    for (let i = 0; i < full; i++) html += '<i class="fas fa-star"></i>';
    if (half) html += '<i class="fas fa-star-half-alt"></i>';
    for (let i = 0; i < 5 - full - half; i++) html += '<i class="far fa-star"></i>';
    return html;
  }

  function createCard(p) {
    const tagHtml = p.tag
      ? `<span class="product-tag ${p.tag === 'eco' ? 'green' : ''}">${p.tag}</span>`
      : '';
    const oldPrice = p.oldPrice ? `<small>$${p.oldPrice}</small>` : '';
    return `
      <div class="product-card" data-id="${p.id}" data-name="${p.name.toLowerCase()}" data-desc="${p.desc.toLowerCase()}">
        ${tagHtml}
        <div class="image"><i class="fas ${p.icon}"></i></div>
        <h4>${p.name}</h4>
        <div class="rating">${renderStars(p.rating)} <span>${p.rating}</span></div>
        <div class="desc">${p.desc}</div>
        <div class="price-row">
          <span class="price">$${p.price} ${oldPrice}</span>
          <button class="add-btn" data-id="${p.id}" aria-label="Add to cart"><i class="fas fa-plus"></i></button>
        </div>
      </div>`;
  }

  function renderAll() {
    productGrid.innerHTML = products
      .filter(p => p.category === 'featured')
      .map(createCard)
      .join('');
    newArrivalsGrid.innerHTML = products
      .filter(p => p.category === 'new')
      .map(createCard)
      .join('');
  }

  // ---------- TOAST ----------
  function showToast(msg, icon = 'fa-check-circle') {
    toastMsg.textContent = msg;
    toast.querySelector('i').className = 'fas ' + icon;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
  }

  // ---------- CART ----------
  function updateCart(delta) {
    cartCount = Math.max(0, cartCount + delta);
    cartBadge.textContent = cartCount;
    cartBadge.classList.add('bump');
    setTimeout(() => cartBadge.classList.remove('bump'), 200);
  }

  // ---------- ADD TO CART ----------
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.add-btn');
    if (!btn) return;
    const id = Number(btn.dataset.id);
    const product = products.find(p => p.id === id);
    if (!product) return;

    updateCart(1);
    btn.classList.add('added');
    btn.innerHTML = '<i class="fas fa-check"></i>';
    setTimeout(() => {
      btn.classList.remove('added');
      btn.innerHTML = '<i class="fas fa-plus"></i>';
    }, 900);
    showToast(`✨ ${product.name} added to cart`);
  });

  // ---------- SEARCH ----------
  function performSearch() {
    const q = searchInput.value.trim().toLowerCase();
    document.querySelectorAll('.product-card').forEach(card => {
      const name = card.dataset.name || '';
      const desc = card.dataset.desc || '';
      const match = !q || name.includes(q) || desc.includes(q);
      card.style.display = match ? '' : 'none';
    });
    if (q) showToast(`🔍 Results for "${q}"`, 'fa-search');
    else showToast('✨ Showing all products', 'fa-star');
  }

  searchBtn.addEventListener('click', performSearch);
  searchInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') performSearch();
  });

  // ---------- CATEGORY FILTER ----------
  document.getElementById('catList').addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;
    e.preventDefault();
    document.querySelectorAll('#catList a').forEach(a => a.classList.remove('active'));
    link.classList.add('active');

    const cat = link.dataset.cat;
    document.querySelectorAll('.product-card').forEach(card => {
      card.style.display = (cat === 'all' || cat === 'featured' || cat === 'new') ? '' : 'none';
    });

    if (cat === 'all') showToast('🛍️ Showing all products', 'fa-th-large');
    else showToast(`📂 Category: ${link.textContent.trim()}`, 'fa-filter');
  });

  // ---------- COUNTDOWN ----------
  function updateCountdown() {
    const now = new Date();
    const end = new Date(now);
    end.setHours(23, 59, 59, 999);
    let diff = Math.floor((end - now) / 1000);
    if (diff < 0) diff = 0;

    const h = String(Math.floor(diff / 3600)).padStart(2, '0');
    const m = String(Math.floor((diff % 3600) / 60)).padStart(2, '0');
    const s = String(diff % 60).padStart(2, '0');

    const el = document.getElementById('countdown');
    if (el) {
      el.innerHTML = `
        <div>${h} <span>h</span></div>
        <div>${m} <span>m</span></div>
        <div>${s} <span>s</span></div>`;
    }
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);

  // ---------- BUTTONS ----------
  document.getElementById('exploreBtn').addEventListener('click', () => {
    showToast('🚀 Explore our latest collection!', 'fa-rocket');
  });
  document.getElementById('flashBtn').addEventListener('click', () => {
    showToast('⚡ Flash sale — up to 40% off!', 'fa-bolt');
  });
  document.getElementById('cartIcon').addEventListener('click', (e) => {
    e.preventDefault();
    showToast(`🛒 You have ${cartCount} item${cartCount !== 1 ? 's' : ''} in cart`, 'fa-shopping-bag');
  });
  document.getElementById('wishlistIcon').addEventListener('click', (e) => {
    e.preventDefault();
    showToast('❤️ Wishlist is empty', 'fa-heart');
  });

  // ---------- INIT ----------
  renderAll();
  cartBadge.textContent = cartCount;
})();
