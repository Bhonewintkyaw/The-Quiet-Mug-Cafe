// ===== DOM ELEMENTS =====
const cartSidebar = document.getElementById('cartSidebar');
const cartContent = document.getElementById('cartContent');
const closeCart = document.getElementById('closeCart');
const checkoutBtn = document.getElementById('checkoutBtn');

// ===== CART LOGIC =====
let cart = JSON.parse(localStorage.getItem('cart')) || {};
let totalPrice = 0;

closeCart.onclick = () => cartSidebar.classList.remove('active');

const buttons = document.querySelectorAll('.btn-add');
buttons.forEach(button => {
  button.addEventListener('click', () => {
    let name = button.dataset.name;
    let price = parseFloat(button.dataset.price);

    if (!name || isNaN(price)) {
      const card = button.closest('.card');
      if (card) {
        const nameElem = card.querySelector('h3');
        if (nameElem) name = nameElem.textContent.trim();
        const priceElem = card.querySelector('.price');
        if (priceElem) {
          let priceText = priceElem.textContent.trim().replace(/[^\d.]/g, '');
          price = parseFloat(priceText);
        }
      }
    }

    let quantity = 1;
    const qtyInput = button.previousElementSibling;
    if (qtyInput && qtyInput.tagName === 'INPUT') {
      quantity = parseInt(qtyInput.value) || 1;
    }

    // --- Buy 1 Get 1 Latte Free (September only) ---
    const now = new Date();
    const isSeptember = now.getMonth() === 8; // JS months: 0=Jan, 8=Sep
    if (isSeptember && name.toLowerCase().includes('latte')) {
      // Paid Latte
      if (cart[name]) {
        cart[name].quantity += quantity;
      } else {
        cart[name] = { price, quantity };
      }
      // Free Latte (show as "Latte (Free)")
      const freeLatteName = name + " (Free)";
      if (cart[freeLatteName]) {
        cart[freeLatteName].quantity += quantity;
      } else {
        cart[freeLatteName] = { price: 0, quantity: quantity };
      }
    } else {
      if (cart[name]) {
        cart[name].quantity += quantity;
      } else {
        cart[name] = { price, quantity };
      }
    }

    updateCart();
    cartSidebar.classList.add('active');
  });
});

function updateCart() {
  cartContent.innerHTML = '';
  totalPrice = 0;

  for (const item in cart) {
    const div = document.createElement('div');
    div.style.display = 'flex';
    div.style.flexDirection = 'column';
    div.style.alignItems = 'flex-start';
    div.style.marginBottom = '16px';
    div.style.borderBottom = '1px solid #e9e4d4';
    div.style.paddingBottom = '8px';

    const itemName = document.createElement('span');
    itemName.className = 'cart-item-name';
    itemName.textContent = item;
    itemName.style.fontWeight = 'bold';
    itemName.style.marginBottom = '6px';

    const row = document.createElement('span');
    row.className = 'cart-item-row';
    row.style.display = 'flex';
    row.style.flexDirection = 'row';
    row.style.alignItems = 'center';
    row.style.gap = '12px';
    row.style.width = '100%';

    const actions = document.createElement('span');
    actions.className = 'cart-item-actions';
    actions.style.display = 'flex';
    actions.style.alignItems = 'center';
    actions.style.gap = '10px';

    const qtyControls = document.createElement('span');
    qtyControls.className = 'quantity-controls';
    qtyControls.style.display = 'flex';
    qtyControls.style.flexDirection = 'row';
    qtyControls.style.alignItems = 'center';
    qtyControls.style.gap = '4px';

    const qtySpan = document.createElement('span');
    qtySpan.className = 'cart-item-qty';
    qtySpan.textContent = cart[item].quantity;

    if (item.endsWith('(Free)')) {
      // Only show quantity for free latte, no buttons
      qtyControls.appendChild(qtySpan);
      actions.appendChild(qtyControls);
      // No remove button for free latte
    } else {
      const minusBtn = document.createElement('button');
      minusBtn.textContent = "-";
      minusBtn.onclick = () => { changeQty(item, -1); };

      const plusBtn = document.createElement('button');
      plusBtn.textContent = "+";
      plusBtn.onclick = () => { changeQty(item, 1); };

      qtyControls.appendChild(minusBtn);
      qtyControls.appendChild(qtySpan);
      qtyControls.appendChild(plusBtn);

      const removeBtn = document.createElement('button');
      removeBtn.className = 'remove-btn';
      removeBtn.textContent = "×";
      removeBtn.onclick = () => { removeItem(item); };

      actions.appendChild(qtyControls);
      actions.appendChild(removeBtn);
    }

    const priceSpan = document.createElement('span');
    priceSpan.className = 'cart-item-price';
    priceSpan.textContent = cart[item].price === 0
      ? "Free"
      : `MMK${(cart[item].price * cart[item].quantity).toFixed(2)}`;

    row.appendChild(actions);
    row.appendChild(priceSpan);

    div.appendChild(itemName);
    div.appendChild(row);

    cartContent.appendChild(div);

    totalPrice += cart[item].price * cart[item].quantity;
  }

  document.getElementById('totalPrice').textContent = totalPrice.toFixed(2);
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Sync paid latte and free latte quantities
function changeQty(item, delta) {
  cart[item].quantity += delta;
  if(cart[item].quantity <= 0) {
    removeItem(item);
    return;
  }
  // If paid latte, sync free latte
  if (item.toLowerCase().includes('latte') && !item.endsWith('(Free)')) {
    const freeLatteName = item + " (Free)";
    if (cart[freeLatteName]) {
      cart[freeLatteName].quantity = cart[item].quantity;
      if (cart[freeLatteName].quantity <= 0) delete cart[freeLatteName];
    }
  }
  updateCart();
}

function removeItem(item) {
  // If paid latte, also remove free latte
  if (item.toLowerCase().includes('latte') && !item.endsWith('(Free)')) {
    const freeLatteName = item + " (Free)";
    if (cart[freeLatteName]) delete cart[freeLatteName];
  }
  delete cart[item];
  updateCart();
}

checkoutBtn.onclick = () => {
  if (totalPrice === 0) return alert("Your cart is empty!");

  localStorage.setItem('checkout_cart', JSON.stringify(cart));
  localStorage.setItem('checkout_total', totalPrice);

  window.location.href = "checkout.html";
};

updateCart();

// ===== SLIDER FUNCTIONALITY =====
const slides = document.querySelectorAll('.slide');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');
let currentSlide = 0;

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === index);
  });
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
}

function prevSlide() {
  currentSlide = (currentSlide - 1 + slides.length) % slides.length;
  showSlide(currentSlide);
}

if (nextBtn && prevBtn && slides.length > 0) {
  nextBtn.addEventListener('click', nextSlide);
  prevBtn.addEventListener('click', prevSlide);

  // Auto-slide every 5 seconds
  setInterval(nextSlide, 5000);
}

// ===== NAVBAR SCROLL EFFECT =====
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});