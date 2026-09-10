/* ==================================================
   GLOWMART — Main Script
   ================================================== */
(function () {
  'use strict';

  /* ---------- PRODUCT DATA ---------- */
  const PRODUCTS = [
    { id: 1, name: 'AirPods Max 2', price: 129, oldPrice: 169, desc: 'Spatial audio, premium build', icon: 'fa-headphones', tag: '-20%', tagColor: '', rating: 4.8, category: 'featured' },
    { id: 2, name: 'Organic Cotton Tee', price: 34, oldPrice: null, desc: '100% cotton, relaxed fit', icon: 'fa-shirt', tag: 'eco', tagColor: 'green', rating: 5.0, category: 'featured' },
    { id: 3, name: 'Ultraboost 23', price: 89, oldPrice: 110, desc: 'Lightweight, responsive cushion', icon: 'fa-shoe-prints', tag: 'hot', tagColor: '', rating: 5.0, category: 'featured' },
    { id: 4, name: 'Zenbook S 14', price: 1499, oldPrice: null, desc: 'OLED, Intel Core Ultra 7', icon: 'fa-laptop', tag: 'new', tagColor: 'blue', rating: 4.9, category: 'featured' },
    { id: 5, name: 'Instax Mini 12', price: 79, oldPrice: null, desc: 'Instant film camera, pastel', icon: 'fa-camera', tag: null, tagColor: '', rating: 4.9, category: 'new' },
    { id: 6, name: 'Smart Watch Series 10', price: 429, oldPrice: null, desc: 'GPS + Cellular, always-on', icon: 'fa-clock', tag: null, tagColor: '', rating: 4.7, category: 'new' },
    { id: 7, name: 'Ember Mug 2', price: 99, oldPrice: null, desc: 'Temperature control, app enabled', icon: 'fa-mug-hot', tag: null, tagColor: '', rating: 5.0, category: 'new' },
    { id: 8, name: 'Ergonomic Chair Pro', price: 249, oldPrice: null, desc: 'Mesh back, lumbar support', icon: 'fa-chair', tag: null, tagColor: '', rating: 4.9, category: 'new' },
    { id: 9, name: 'Wireless Earbuds Pro', price: 159, oldPrice: 199, desc: 'ANC, 30h battery life', icon: 'fa-headphones-simple', tag: '-20%', tagColor: '', rating: 4.7, category: 'featured' },
    { id: 10, name: 'Minimalist Backpack', price: 69, oldPrice: null, desc: 'Water-resistant, USB port', icon: 'fa-bag-shopping', tag: 'new', tagColor: 'blue', rating: 4.8, category: 'new' }
  ];

  /* ---------- STATE ---------- */
  let cartCount = parseInt(localStorage.getItem('glowmart_cart') || '0', 10);
  let toastTimer = null;

  /* ---------- DOM ---------- */
  const productGrid = document.getElementById('productGrid');
  const newArrivalsGrid = document.getElementById('newArrivalsGrid');
  const cartBadge = document.getElementById('cartCount');
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');
  const countdownEl = document.getElementById('countdown');

  /* ---------- HELPERS ---------- */
  function starHTML(rating) {
    const full = Math.floor(rating);
    const half = rating - full >= 0.5 ? 1 : 0;
    let html = '';
    for (let i = 0; i < full; i++) html += '<i class="fas fa-star"></i>';
    if (half) html += '<i class="fas fa-star-half-alt"></i>';
    for (let i = 0; i < 5 - full - half; i++) html += '<i class="far fa-star"></i>';
    return html;
  }

  function productCard(p) {
    const tag = p.tag
      ? `<span class="product-tag ${p.tagColor}">${p.tag}</span>`
      : '';
    const oldPrice = p.oldPrice
      ? `<small>$${p.oldPrice}</small>`
      : '';
    return `
      <div class="product-card"
           data-id="${p.id}"
           data-name="${p.name.toLowerCase()}"
           data-desc="${p.desc.toLowerCase()}"
           data-cat="${p.category}">
        <div class="product-image">
          ${tag}
          <i class="fas ${p.icon}"></i>
        </div>
        <h4>${p.name}</h4>
        <div class="product-rating">
          <span class="stars">${starHTML(p.rating)}</span>
          <span>${p.rating}</span>
        </div>
        <p class="product-desc">${p.desc}</p>
        <div class="product-footer">
          <span class="product-price">$${p.price} ${oldPrice}</span>
          <button class="add-btn" data-id="${p.id}" aria-label="Add ${p.name} to cart">
            <i class="fas fa-plus"></i>
          </button>
        </div>
      </div>`;
  }

  function render() {
    if (!productGrid || !newArrivalsGrid) return;
    productGrid.innerHTML = PRODUCTS
      .filter(p => p.category === 'featured')
      .map(productCard)
      .join('');
    newArrivalsGrid.innerHTML = PRODUCTS
      .filter(p => p.category === 'new')
      .map(productCard)
      .join('');
  }

  /* ---------- TOAST ---------- */
  function showToast(msg, icon) {
    if (!toast || !toastMsg) return;
    toastMsg.textContent = msg;
    const iconEl = toast.querySelector('i');
    if (iconEl && icon) iconEl.className = 'fas ' + icon;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2400);
  }

  /* ---------- CART ---------- */
  function updateCart(delta) {
    cartCount = Math.max(0, cartCount + delta);
    if (cartBadge) {
      cartBadge.textContent = cartCount;
      cartBadge.classList.remove('bump');
      void cartBadge.offsetWidth;
      cartBadge.classList.add('bump');
    }
    localStorage.setItem('glowmart_cart', cartCount);
  }

  /* ---------- EVENT: ADD TO CART ---------- */
  document.addEventListener('click', function (e) {
    const btn = e.target.closest('.add-btn');
    if (!btn) return;
    e.preventDefault();
    const id = Number(btn.dataset.id);
    const product = PRODUCTS.find(p => p.id === id);
    if (!product) return;

    updateCart(1);
    btn.classList.add('added');
    btn.innerHTML = '<i class="fas fa-check"></i>';
    setTimeout(() => {
      btn.classList.remove('added');
      btn.innerHTML = '<i class="fas fa-plus"></i>';
    }, 900);
    showToast(product.name + ' added to cart', 'fa-check-circle');
  });

  /* ---------- SEARCH ---------- */
  function performSearch() {
    const q = (searchInput.value || '').trim().toLowerCase();
    document.querySelectorAll('.product-card').forEach(card => {
      const name = card.dataset.name || '';
      const desc = card.dataset.desc || '';
      const match = !q || name.includes(q) || desc.includes(q);
      card.style.display = match ? '' : 'none';
    });
    if (q) {
      showToast('Showing results for "' + q + '"', 'fa-search');
    } else {
      showToast('Showing all products', 'fa-star');
    }
  }

  if (searchBtn) searchBtn.addEventListener('click', performSearch);
  if (searchInput) {
    searchInput.addEventListener('keyup', function (e) {
      if (e.key === 'Enter') performSearch();
    });
  }

  /* ---------- CATEGORY FILTER ---------- */
  const catList = document.getElementById('catList');
  if (catList) {
    catList.addEventListener('click', function (e) {
      const link = e.target.closest('a');
      if (!link) return;
      e.preventDefault();
      catList.querySelectorAll('a').forEach(a => a.classList.remove('active'));
      link.classList.add('active');
      const cat = link.dataset.cat;
      document.querySelectorAll('.product-card').forEach(card => {
        card.style.display = (cat === 'all') ? '' : 'none';
      });
      if (cat === 'all') {
        showToast('Showing all products', 'fa-th-large');
      } else {
        showToast('Category: ' + link.textContent.trim(), 'fa-filter');
      }
    });
  }

  /* ---------- COUNTDOWN ---------- */
  function tick() {
    if (!countdownEl) return;
    const now = new Date();
    const end = new Date(now);
    end.setHours(23, 59, 59, 999);
    let diff = Math.floor((end - now) / 1000);
    if (diff < 0) diff = 0;
    const h = String(Math.floor(diff / 3600)).padStart(2, '0');
    const m = String(Math.floor((diff % 3600) / 60)).padStart(2, '0');
    const s = String(diff % 60).padStart(2, '0');
    countdownEl.innerHTML = `
      <div><strong>${h}</strong><span>Hours</span></div>
      <div><strong>${m}</strong><span>Minutes</span></div>
      <div><strong>${s}</strong><span>Seconds</span></div>`;
  }
  tick();
  setInterval(tick, 1000);

  /* ---------- BUTTONS ---------- */
  const exploreBtn = document.getElementById('exploreBtn');
  const learnBtn = document.getElementById('learnBtn');
  const flashBtn = document.getElementById('flashBtn');
  const cartBtn = document.getElementById('cartBtn');
  const wishlistBtn = document.getElementById('wishlistBtn');
  const newsletterForm = document.getElementById('newsletterForm');

  if (exploreBtn) exploreBtn.addEventListener('click', () => showToast('Exploring our collection!', 'fa-rocket'));
  if (learnBtn) learnBtn.addEventListener('click', () => showToast('Learn more coming soon!', 'fa-book'));
  if (flashBtn) flashBtn.addEventListener('click', () => showToast('Flash sale — up to 40% off!', 'fa-bolt'));
  if (cartBtn) cartBtn.addEventListener('click', () => showToast('You have ' + cartCount + ' item(s) in cart', 'fa-shopping-bag'));
  if (wishlistBtn) wishlistBtn.addEventListener('click', () => showToast('Wishlist is empty', 'fa-heart'));

  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const email = newsletterForm.querySelector('input').value;
      if (email) {
        showToast('Subscribed with ' + email, 'fa-envelope-circle-check');
        newsletterForm.reset();
      }
    });
  }

  /* ---------- INITIAL RENDER ---------- */
  if (cartBadge) cartBadge.textContent = cartCount;
  render();

})();
