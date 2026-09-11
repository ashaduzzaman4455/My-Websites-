/* ==================================================
   GLOWMART — Main Script
   ================================================== */
(function() {
  'use strict';

  /* ---------- TOAST ---------- */
  window.showToast = function(msg, icon) {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toastMsg');
    if (!toast || !toastMsg) return;
    toastMsg.textContent = msg;
    const iconEl = toast.querySelector('i');
    if (iconEl && icon) iconEl.className = 'fas ' + icon;
    toast.classList.add('show');
    clearTimeout(window._toastTimer);
    window._toastTimer = setTimeout(() => toast.classList.remove('show'), 2400);
  };

  /* ---------- STAR RENDER ---------- */
  function starHTML(rating) {
    const full = Math.floor(rating);
    const half = rating - full >= 0.5 ? 1 : 0;
    let html = '';
    for (let i = 0; i < full; i++) html += '<i class="fas fa-star"></i>';
    if (half) html += '<i class="fas fa-star-half-alt"></i>';
    for (let i = 0; i < 5 - full - half; i++) html += '<i class="far fa-star"></i>';
    return html;
  }

  /* ---------- PRODUCT CARD ---------- */
  window.renderProductCard = function(p) {
    const tag = p.tag
      ? `<span class="product-tag ${p.tagColor || ''}">${p.tag}</span>`
      : '';
    const oldPrice = p.oldPrice ? `<small>$${p.oldPrice}</small>` : '';
    const wishlist = window.GlowCart.getWishlist();
    const inWishlist = wishlist.includes(p.id);
    
    return `
      <div class="product-card" data-id="${p.id}">
        <div class="product-image">
          ${tag}
          <button class="wishlist-btn ${inWishlist ? 'active' : ''}" data-id="${p.id}" title="Wishlist">
            <i class="${inWishlist ? 'fas' : 'far'} fa-heart"></i>
          </button>
          <a href="product.html?id=${p.id}" class="product-link">
            <i class="fas ${p.icon}"></i>
          </a>
        </div>
        <a href="product.html?id=${p.id}" class="product-link">
          <h4>${p.name}</h4>
        </a>
        <div class="product-rating">
          <span class="stars">${starHTML(p.rating)}</span>
          <span>${p.rating} (${p.reviews})</span>
        </div>
        <p class="product-desc">${p.desc}</p>
        <div class="product-footer">
          <span class="product-price">$${p.price} ${oldPrice}</span>
          <button class="add-btn" data-id="${p.id}" aria-label="Add to cart">
            <i class="fas fa-plus"></i>
          </button>
        </div>
      </div>`;
  };

  /* ---------- RENDER GRIDS ---------- */
  function renderHome() {
    const productGrid = document.getElementById('productGrid');
    const newArrivalsGrid = document.getElementById('newArrivalsGrid');
    
    if (productGrid) {
      productGrid.innerHTML = window.PRODUCTS
        .filter(p => p.subcat === 'featured')
        .slice(0, 8)
        .map(window.renderProductCard)
        .join('');
    }
    if (newArrivalsGrid) {
      newArrivalsGrid.innerHTML = window.PRODUCTS
        .filter(p => p.subcat === 'new')
        .slice(0, 8)
        .map(window.renderProductCard)
        .join('');
    }
  }

  /* ---------- ADD TO CART ---------- */
  document.addEventListener('click', function(e) {
    // Add to cart
    const addBtn = e.target.closest('.add-btn');
    if (addBtn) {
      e.preventDefault();
      const id = Number(addBtn.dataset.id);
      const product = window.PRODUCTS.find(p => p.id === id);
      if (!product) return;
      
      window.GlowCart.add(id, 1);
      addBtn.classList.add('added');
      addBtn.innerHTML = '<i class="fas fa-check"></i>';
      setTimeout(() => {
        addBtn.classList.remove('added');
        addBtn.innerHTML = '<i class="fas fa-plus"></i>';
      }, 900);
      window.showToast(product.name + ' added to cart', 'fa-check-circle');
      return;
    }
    
    // Wishlist toggle
    const wlBtn = e.target.closest('.wishlist-btn');
    if (wlBtn) {
      e.preventDefault();
      e.stopPropagation();
      const id = Number(wlBtn.dataset.id);
      const added = window.GlowCart.toggleWishlist(id);
      wlBtn.classList.toggle('active', added);
      wlBtn.innerHTML = added 
        ? '<i class="fas fa-heart"></i>' 
        : '<i class="far fa-heart"></i>';
      window.showToast(added ? 'Added to wishlist ❤️' : 'Removed from wishlist', added ? 'fa-heart' : 'fa-heart-broken');
      return;
    }
  });

  /* ---------- SEARCH ---------- */
  const searchBtn = document.getElementById('searchBtn');
  const searchInput = document.getElementById('searchInput');
  
  if (searchBtn && searchInput) {
    const doSearch = () => {
      const q = searchInput.value.trim();
      if (q) window.location.href = 'shop.html?search=' + encodeURIComponent(q);
    };
    searchBtn.addEventListener('click', doSearch);
    searchInput.addEventListener('keyup', e => { if (e.key === 'Enter') doSearch(); });
  }

  /* ---------- COUNTDOWN ---------- */
  function tickCountdown() {
    const el = document.getElementById('countdown');
    if (!el) return;
    const now = new Date();
    const end = new Date(now);
    end.setHours(23, 59, 59, 999);
    let diff = Math.floor((end - now) / 1000);
    if (diff < 0) diff = 0;
    const h = String(Math.floor(diff / 3600)).padStart(2, '0');
    const m = String(Math.floor((diff % 3600) / 60)).padStart(2, '0');
    const s = String(diff % 60).padStart(2, '0');
    el.innerHTML = `
      <div><strong>${h}</strong><span>Hours</span></div>
      <div><strong>${m}</strong><span>Minutes</span></div>
      <div><strong>${s}</strong><span>Seconds</span></div>`;
  }

  /* ---------- HERO SLIDER ---------- */
  function initSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.slider-dots button');
    if (!slides.length) return;
    let current = 0;
    let interval;
    
    function goTo(idx) {
      slides.forEach((s, i) => s.classList.toggle('active', i === idx));
      dots.forEach((d, i) => d.classList.toggle('active', i === idx));
      current = idx;
    }
    
    function next() { goTo((current + 1) % slides.length); }
    
    function start() {
      clearInterval(interval);
      interval = setInterval(next, 5000);
    }
    
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => { goTo(i); start(); });
    });
    
    goTo(0);
    start();
  }

  /* ---------- NEWSLETTER ---------- */
  const nlForm = document.getElementById('newsletterForm');
  if (nlForm) {
    nlForm.addEventListener('submit', e => {
      e.preventDefault();
      window.showToast('Subscribed successfully! 🎉', 'fa-envelope-circle-check');
      nlForm.reset();
    });
  }

  /* ---------- DARK MODE ---------- */
  const darkBtn = document.getElementById('darkModeBtn');
  if (darkBtn) {
    const isDark = localStorage.getItem('glowmart_dark') === 'true';
    if (isDark) {
      document.body.classList.add('dark-mode');
      darkBtn.innerHTML = '<i class="fas fa-sun"></i>';
    }
    darkBtn.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      const active = document.body.classList.contains('dark-mode');
      localStorage.setItem('glowmart_dark', active);
      darkBtn.innerHTML = active ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    });
  }

  /* ---------- INIT ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    renderHome();
    tickCountdown();
    setInterval(tickCountdown, 1000);
    initSlider();
  });

})();
