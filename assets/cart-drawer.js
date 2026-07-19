class CartDrawer {
  constructor() {
    this.drawer = document.getElementById('CartDrawer');
    this.body = document.body;
    this.cartIcon = document.getElementById('HeaderCartIcon');
    this.closeButtons = document.querySelectorAll('[data-drawer-close]');

    if (!this.drawer) return;

    this.bindEvents();
    this.interceptAddToCart();
  }

  bindEvents() {
    // Open Drawer
    if (this.cartIcon) {
      this.cartIcon.addEventListener('click', (e) => {
        e.preventDefault();
        this.open();
      });
    }

    // Close Drawer
    this.closeButtons.forEach(button => {
      button.addEventListener('click', () => {
        this.close();
      });
    });

    // Handle Quantity and Remove in Drawer
    this.drawer.addEventListener('click', (e) => {
      // Remove Item
      if (e.target.matches('.cart-drawer__item-remove')) {
        e.preventDefault();
        const key = e.target.dataset.key;
        this.updateItem(key, 0);
      }

      // Quantity Buttons
      if (e.target.matches('.qty-btn')) {
        e.preventDefault();
        const input = e.target.parentNode.querySelector('.qty-input');
        let qty = parseInt(input.value);
        const action = e.target.dataset.action;
        const key = e.target.dataset.key;

        if (action === 'plus') {
          qty += 1;
        } else if (action === 'minus') {
          qty = qty > 0 ? qty - 1 : 0;
        }

        input.value = qty;
        this.updateItem(key, qty);
      }
    });
  }

  interceptAddToCart() {
    // Attach listener to document so it works for dynamically rendered forms too
    document.addEventListener('submit', (e) => {
      const form = e.target;
      if (form.getAttribute('action') === '/cart/add' || form.getAttribute('action') === '/cart/add.js') {
        e.preventDefault();

        const submitButton = form.querySelector('[type="submit"]');
        if (submitButton) {
          submitButton.disabled = true;
          submitButton.classList.add('loading');
        }

        const formData = new FormData(form);

        fetch(window.Shopify.routes.root + 'cart/add.js', {
          method: 'POST',
          body: formData,
          headers: {
            'X-Requested-With': 'XMLHttpRequest'
          }
        })
          .then(response => {
            if (!response.ok) throw new Error('Error adding to cart');
            return response.json();
          })
          .then(() => {
            this.refreshCart();
            this.open();
          })
          .catch((error) => {
            console.error('Error:', error);
            alert('Failed to add item to cart.');
          })
          .finally(() => {
            if (submitButton) {
              submitButton.disabled = false;
              submitButton.classList.remove('loading');
            }
          });
      }
    });
  }

  updateItem(key, quantity) {
    this.drawer.classList.add('is-loading');

    const body = JSON.stringify({
      id: key,
      quantity: quantity
    });

    fetch(window.Shopify.routes.root + 'cart/change.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: body
    })
      .then(response => response.json())
      .then(() => {
        this.refreshCart();
      })
      .catch((error) => {
        console.error('Error updating cart:', error);
        this.drawer.classList.remove('is-loading');
      });
  }

  refreshCart() {
    // Fetch the updated cart snippet via Section API
    fetch(window.Shopify.routes.root + '?section_id=cart-drawer')
      .then(response => response.text())
      .then(html => {
        // Since we cannot easily render snippets directly via section rendering api unless it's a section,
        // We will fallback to fetching /cart.js and building HTML, OR we can fetch /cart and parse it.
        // Wait, standard Shopify method: Fetch /cart.js and update UI.
        return fetch(window.Shopify.routes.root + 'cart.js');
      })
      .then(response => response.json())
      .then(cart => {
        this.renderCart(cart);
      })
      .catch((error) => {
        console.error('Error fetching cart:', error);
      });
  }

  formatMoney(cents) {
    const value = (cents / 100).toFixed(2);
    // Hardcoded currency symbol for simplicity. In production, use theme settings.
    return 'Rs ' + value;
  }

  renderCart(cart) {
    // Update Header Count
    const countEl = document.getElementById('HeaderCartCount');
    if (countEl) {
      if (cart.item_count > 0) {
        countEl.innerHTML = `<span aria-hidden="true">${cart.item_count}</span>`;
        countEl.style.display = 'flex';
      } else {
        countEl.style.display = 'none';
      }
    }

    // Update Drawer Count
    const drawerCount = this.drawer.querySelector('.cart-drawer__count');
    if (drawerCount) drawerCount.textContent = cart.item_count;

    // Update Body
    const bodyEl = document.getElementById('CartDrawerBody');
    if (cart.item_count === 0) {
      bodyEl.innerHTML = `
        <div class="cart-drawer__empty">
          <p>Your cart is currently empty.</p>
          <a href="/collections/all" class="button button--primary" data-drawer-close>Continue Shopping</a>
        </div>
      `;
      // Re-bind close event for the new button
      bodyEl.querySelector('[data-drawer-close]').addEventListener('click', () => this.close());
    } else {
      let html = '';
      cart.items.forEach(item => {
        const img = item.image ? `<img src="${item.image}" alt="${item.title}">` : '';
        const variantText = item.variant_title ? `<p class="cart-drawer__item-variant">${item.variant_title}</p>` : '';

        html += `
          <div class="cart-drawer__item" data-key="${item.key}">
            <div class="cart-drawer__item-image">
              <a href="${item.url}">${img}</a>
            </div>
            <div class="cart-drawer__item-details">
              <a href="${item.url}" class="cart-drawer__item-title">${item.product_title}</a>
              ${variantText}
              <div class="cart-drawer__item-price">${this.formatMoney(item.final_price)}</div>
              
              <div class="cart-drawer__item-qty">
                <button class="qty-btn" type="button" data-action="minus" data-key="${item.key}">-</button>
                <input class="qty-input" type="number" value="${item.quantity}" min="0" data-key="${item.key}" readonly>
                <button class="qty-btn" type="button" data-action="plus" data-key="${item.key}">+</button>
              </div>
              
              <a href="${item.url_to_remove}" class="cart-drawer__item-remove" data-key="${item.key}" aria-label="Remove item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 20px; height: 20px;">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  <line x1="10" y1="11" x2="10" y2="17"></line>
                  <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
              </a>
            </div>
          </div>
        `;
      });
      bodyEl.innerHTML = html;
    }

    // Update Subtotal
    const subtotalEl = this.drawer.querySelector('.cart-drawer__subtotal-price');
    if (subtotalEl) {
      subtotalEl.textContent = this.formatMoney(cart.total_price);
    }

    this.drawer.classList.remove('is-loading');
  }

  open() {
    this.drawer.setAttribute('aria-hidden', 'false');
    this.drawer.classList.add('is-active');
    this.body.style.overflow = 'hidden';
  }

  close() {
    this.drawer.setAttribute('aria-hidden', 'true');
    this.drawer.classList.remove('is-active');
    this.body.style.overflow = '';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.cartDrawer = new CartDrawer();
});
