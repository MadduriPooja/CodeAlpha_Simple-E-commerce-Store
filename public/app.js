async function loadProducts() {
  try {
    const res = await fetch('/api/products');
    
    // Redirect to login if unauthorized
    if (res.status === 401) {
      window.location.href = '/login.html';
      return;
    }
    
    const products = await res.json();
    const list = document.getElementById('product-list');
    
    list.innerHTML = products.map(p => `
      <article class="product glass-panel">
        <div class="product-image-container">
          <img src="${p.image || '/images/placeholder.png'}" alt="${p.name}">
        </div>
        <h2>${p.name}</h2>
        <div class="product-desc">${p.description}</div>
        <div class="product-price">$${p.price.toFixed(2)}</div>
        <div class="product-actions">
          <button class="btn-sm btn-cart" onclick="addToCart(${p.id})">Add to Cart</button>
          <a href="/product.html?id=${p.id}" class="btn-sm btn-details">Details</a>
        </div>
      </article>
    `).join('');
  } catch (err) {
    console.error("Failed to load products:", err);
    if (typeof showToast === 'function') showToast("Error loading products", "error");
  }
}

async function addToCart(id) {
  const res = await fetch('/api/cart', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId: id })
  });
  
  if (res.ok) {
    if (typeof showToast === 'function') showToast("Added to cart!", "success");
    else alert("Added to cart!");
  } else if (res.status === 401) {
    window.location.href = '/login.html';
  }
}

loadProducts();
