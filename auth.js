/* ==================================================
   GLOWMART — Authentication (localStorage based)
   ================================================== */
window.GlowAuth = (function() {
  'use strict';

  function getUser() {
    try {
      return JSON.parse(localStorage.getItem('glowmart_user') || 'null');
    } catch (e) { return null; }
  }

  function saveUser(user) {
    localStorage.setItem('glowmart_user', JSON.stringify(user));
  }

  function logout() {
    localStorage.removeItem('glowmart_user');
    window.location.href = 'index.html';
  }

  function isLoggedIn() {
    return getUser() !== null;
  }

  function updateNavbar() {
    const user = getUser();
    const authLink = document.getElementById('authLink');
    const accountBtn = document.getElementById('accountBtn');
    
    if (user) {
      if (authLink) authLink.innerHTML = '<i class="fas fa-user"></i> ' + user.name;
      if (accountBtn) accountBtn.innerHTML = '<i class="fas fa-user-circle"></i> <span>' + user.name.split(' ')[0] + '</span>';
    }
  }

  return { getUser, saveUser, logout, isLoggedIn, updateNavbar };
})();

// Auto-run
document.addEventListener('DOMContentLoaded', function() {
  if (window.GlowAuth) window.GlowAuth.updateNavbar();
});
