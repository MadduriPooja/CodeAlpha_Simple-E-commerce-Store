// Shared utilities for the Neon Store
function showToast(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span>${message}</span>
    <button onclick="this.parentElement.remove()" style="background:none;border:none;color:white;cursor:pointer;margin-left:1rem;opacity:0.6">&times;</button>
  `;

  container.appendChild(toast);

  // Auto-remove after 3 seconds
  setTimeout(() => {
    if (toast.parentElement) toast.remove();
  }, 3000);
}

// Redirect if not logged in
async function checkAuth() {
  const res = await fetch('/api/products');
  if (res.status === 401 && !window.location.pathname.includes('login.html')) {
    window.location.href = '/login.html';
  }
}
