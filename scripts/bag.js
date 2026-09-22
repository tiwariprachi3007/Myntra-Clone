const CONVENIENCE_FEES = 99;
let bagItemObjects = [];

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initBagPage);
} else {
  initBagPage();
}

function initBagPage() {
  loadSavedData();
  loadBagItemObjects();
  displayBagIcon();
  displayWishlistIcon();
  displayBagItems();
  displayBagSummary();
}

function loadBagItemObjects() {
  loadSavedData();
  if (typeof items === 'undefined' || !Array.isArray(items)) {
    bagItemObjects = [];
    return;
  }

  bagItemObjects = bagItems
    .map(itemId => items.find(item => String(item.id) === String(itemId)))
    .filter(Boolean); // Safeguard against missing or outdated items
}

function displayBagItems() {
  const containerElement = document.querySelector('.bag-items-container');
  if (!containerElement) return;

  if (bagItemObjects.length === 0) {
    containerElement.innerHTML = `
      <div class="empty-bag-card">
        <div class="empty-bag-icon-wrapper">
          <span class="material-symbols-outlined empty-bag-icon">shopping_bag</span>
        </div>
        <h3 class="empty-bag-title">Hey, it feels so light!</h3>
        <p class="empty-bag-desc">There is nothing in your bag. Let's add some items.</p>
        <a href="../index.html" class="btn-shop-now">ADD ITEMS FROM HOME</a>
      </div>
    `;
    return;
  }

  let innerHTML = '';
  bagItemObjects.forEach((bagItem, index) => {
    innerHTML += generateItemHTML(bagItem, index);
  });
  containerElement.innerHTML = innerHTML;
}

function generateItemHTML(item, index) {
  const returnDays = item.return_period !== undefined ? item.return_period : 14;
  const deliveryDate = item.delivery_date || 'Standard Delivery (2-4 business days)';

  return `
  <div class="bag-item-container">
    <div class="item-left-part">
      <img class="bag-item-img" src="../${item.image}" alt="${item.item_name}">
    </div>
    <div class="item-right-part">
      <div class="company">${item.company}</div>
      <div class="item-name">${item.item_name}</div>
      <div class="price-container">
        <span class="current-price">Rs ${item.current_price}</span>
        <span class="original-price">Rs ${item.original_price}</span>
        <span class="discount-percentage">(${item.discount_percentage}% OFF)</span>
      </div>
      <div class="return-period">
        <span class="return-period-days">${returnDays} days</span> return available
      </div>
      <div class="delivery-details">
        <span class="material-symbols-outlined delivery-truck-icon">local_shipping</span>
        Delivery by
        <span class="delivery-details-days">${deliveryDate}</span>
      </div>
    </div>

    <button class="remove-from-cart" onclick="removeFromBagByIndex(${index})" title="Remove item">&times;</button>
  </div>`;
}

function removeFromBagByIndex(index) {
  if (index >= 0 && index < bagItems.length) {
    const removedId = bagItems[index];
    const removedItem = items ? items.find(i => String(i.id) === String(removedId)) : null;
    const itemName = removedItem ? removedItem.company : 'Item';

    bagItems.splice(index, 1);
    localStorage.setItem('bagItems', JSON.stringify(bagItems));
    
    loadBagItemObjects();
    displayBagIcon();
    displayBagItems();
    displayBagSummary();

    showToast(`Removed "${itemName}" from Bag`, 'info');
  }
}

function displayBagSummary() {
  const bagSummaryElement = document.querySelector('.bag-summary');
  if (!bagSummaryElement) return;

  const totalItem = bagItemObjects.length;

  if (totalItem === 0) {
    bagSummaryElement.innerHTML = `
      <div class="empty-summary-placeholder">
        <p>No items in bag to calculate order summary.</p>
      </div>
    `;
    return;
  }

  let totalMRP = 0;
  let totalDiscount = 0;

  bagItemObjects.forEach(bagItem => {
    totalMRP += Number(bagItem.original_price) || 0;
    totalDiscount += (Number(bagItem.original_price) || 0) - (Number(bagItem.current_price) || 0);
  });

  const finalPayment = totalMRP - totalDiscount + CONVENIENCE_FEES;

  bagSummaryElement.innerHTML = `
    <div class="bag-details-container">
      <div class="price-header">PRICE DETAILS (${totalItem} ${totalItem === 1 ? 'Item' : 'Items'})</div>
      <div class="price-item">
        <span class="price-item-tag">Total MRP</span>
        <span class="price-item-value">₹${totalMRP}</span>
      </div>
      <div class="price-item">
        <span class="price-item-tag">Discount on MRP</span>
        <span class="price-item-value priceDetail-base-discount">-₹${totalDiscount}</span>
      </div>
      <div class="price-item">
        <span class="price-item-tag">Convenience Fee</span>
        <span class="price-item-value">₹${CONVENIENCE_FEES}</span>
      </div>
      <hr>
      <div class="price-footer">
        <span class="price-item-tag">Total Amount</span>
        <span class="price-item-value">₹${finalPayment}</span>
      </div>
    </div>
    <button class="btn-place-order" onclick="placeOrder(${totalItem}, ${finalPayment})">
      <div class="css-xjhrni">PLACE ORDER</div>
    </button>
  `;
}

function placeOrder(totalItem, finalAmount) {
  const modal = document.getElementById('order-modal');
  const summaryBox = document.getElementById('modal-order-summary');

  if (summaryBox) {
    summaryBox.innerHTML = `
      <div class="modal-summary-row"><span>Total Items:</span> <strong>${totalItem}</strong></div>
      <div class="modal-summary-row"><span>Amount Paid:</span> <strong>₹${finalAmount}</strong></div>
      <div class="modal-summary-row"><span>Estimated Delivery:</span> <strong>Within 3-5 days</strong></div>
    `;
  }

  if (modal) {
    modal.style.display = 'flex';
  }

  // Clear Bag after placing order
  bagItems = [];
  localStorage.setItem('bagItems', JSON.stringify(bagItems));
  loadBagItemObjects();
  displayBagIcon();
  displayBagItems();
  displayBagSummary();

  showToast('Order placed successfully!', 'success');
}

function closeOrderModal() {
  const modal = document.getElementById('order-modal');
  if (modal) {
    modal.style.display = 'none';
  }
  window.location.href = '../index.html';
}