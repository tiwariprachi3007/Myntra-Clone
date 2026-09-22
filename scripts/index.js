let bagItems = [];
let wishlistItems = [];
let currentCategory = 'all';
let currentSearchQuery = '';
let isWishlistView = false;

// Initialize on document ready or script execution
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHomePage);
} else {
  initHomePage();
}

function initHomePage() {
  loadSavedData();
  setupEventListeners();
  displayBagIcon();
  displayWishlistIcon();
  displayItemsOnHomePage();
}

function loadSavedData() {
  try {
    const bagItemsStr = localStorage.getItem('bagItems');
    bagItems = bagItemsStr ? JSON.parse(bagItemsStr) : [];
  } catch (e) {
    console.error('Error reading bagItems from localStorage', e);
    bagItems = [];
  }

  try {
    const wishlistStr = localStorage.getItem('wishlistItems');
    wishlistItems = wishlistStr ? JSON.parse(wishlistStr) : [];
  } catch (e) {
    console.error('Error reading wishlistItems from localStorage', e);
    wishlistItems = [];
  }
}

function setupEventListeners() {
  const searchInput = document.getElementById('search-input');
  const clearSearchBtn = document.getElementById('clear-search');

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearchQuery = e.target.value.trim().toLowerCase();
      if (clearSearchBtn) {
        clearSearchBtn.style.display = currentSearchQuery ? 'block' : 'none';
      }
      isWishlistView = false;
      displayItemsOnHomePage();
    });
  }

  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
      if (searchInput) {
        searchInput.value = '';
      }
      currentSearchQuery = '';
      clearSearchBtn.style.display = 'none';
      displayItemsOnHomePage();
    });
  }

  const navLinks = document.querySelectorAll('.nav_bar .nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const category = link.getAttribute('data-category') || 'all';
      filterByCategory(category);
    });
  });
}

function filterByCategory(category) {
  currentCategory = category;
  isWishlistView = false;

  // Update active state in nav bar
  const navLinks = document.querySelectorAll('.nav_bar .nav-link');
  navLinks.forEach(link => {
    if (link.getAttribute('data-category') === category) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  displayItemsOnHomePage();
}

function toggleWishlistView() {
  isWishlistView = !isWishlistView;
  displayItemsOnHomePage();
}

function resetFilters() {
  currentCategory = 'all';
  currentSearchQuery = '';
  isWishlistView = false;

  const searchInput = document.getElementById('search-input');
  const clearSearchBtn = document.getElementById('clear-search');
  if (searchInput) searchInput.value = '';
  if (clearSearchBtn) clearSearchBtn.style.display = 'none';

  const navLinks = document.querySelectorAll('.nav_bar .nav-link');
  navLinks.forEach(link => {
    if (link.getAttribute('data-category') === 'all') {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  displayItemsOnHomePage();
}

function addToBag(itemId) {
  // Convert to string representation to ensure consistency
  itemId = String(itemId);
  bagItems.push(itemId);
  localStorage.setItem('bagItems', JSON.stringify(bagItems));
  displayBagIcon();

  const item = items.find(i => String(i.id) === itemId);
  const itemName = item ? item.company : 'Item';
  showToast(`Added "${itemName}" to Bag!`, 'success');
}

function toggleWishlist(itemId) {
  itemId = String(itemId);
  const index = wishlistItems.indexOf(itemId);
  const item = items.find(i => String(i.id) === itemId);
  const itemName = item ? item.company : 'Item';

  if (index > -1) {
    wishlistItems.splice(index, 1);
    showToast(`Removed "${itemName}" from Wishlist`, 'info');
  } else {
    wishlistItems.push(itemId);
    showToast(`Added "${itemName}" to Wishlist!`, 'success');
  }

  localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));
  displayWishlistIcon();

  // Re-render to update the heart icon and items if in wishlist view
  displayItemsOnHomePage();
}

function displayBagIcon() {
  const bagItemCountElements = document.querySelectorAll('.bag-item-count');
  bagItemCountElements.forEach(el => {
    if (bagItems.length > 0) {
      el.style.visibility = 'visible';
      el.innerText = bagItems.length;
    } else {
      el.style.visibility = 'hidden';
    }
  });
}

function displayWishlistIcon() {
  const wishlistCountElements = document.querySelectorAll('.wishlist-item-count');
  wishlistCountElements.forEach(el => {
    if (wishlistItems.length > 0) {
      el.style.visibility = 'visible';
      el.innerText = wishlistItems.length;
    } else {
      el.style.visibility = 'hidden';
    }
  });
}

function getFilteredItems() {
  if (typeof items === 'undefined' || !Array.isArray(items)) {
    return [];
  }

  return items.filter(item => {
    // If in Wishlist View, only show items in wishlist
    if (isWishlistView) {
      if (!wishlistItems.includes(String(item.id))) {
        return false;
      }
    }

    // Category Filter
    if (currentCategory !== 'all') {
      if (item.category && item.category !== currentCategory) {
        return false;
      }
    }

    // Search Query Filter
    if (currentSearchQuery) {
      const matchCompany = item.company.toLowerCase().includes(currentSearchQuery);
      const matchName = item.item_name.toLowerCase().includes(currentSearchQuery);
      const matchCategory = item.category ? item.category.toLowerCase().includes(currentSearchQuery) : false;
      if (!matchCompany && !matchName && !matchCategory) {
        return false;
      }
    }

    return true;
  });
}

function displayItemsOnHomePage() {
  const itemsContainerElement = document.querySelector('.items-container');
  if (!itemsContainerElement) {
    return;
  }

  const filteredItems = getFilteredItems();
  updateStatusBar(filteredItems.length);

  if (filteredItems.length === 0) {
    if (isWishlistView) {
      itemsContainerElement.innerHTML = `
        <div class="empty-state-container">
          <span class="material-symbols-outlined empty-icon">favorite_border</span>
          <h3>Your Wishlist is Empty</h3>
          <p>Explore more and shortlist some items you love!</p>
          <button class="btn-primary" onclick="resetFilters()">Explore Products</button>
        </div>
      `;
    } else {
      itemsContainerElement.innerHTML = `
        <div class="empty-state-container">
          <span class="material-symbols-outlined empty-icon">search_off</span>
          <h3>No Products Found</h3>
          <p>We couldn't find any items matching your filters.</p>
          <button class="btn-primary" onclick="resetFilters()">Reset All Filters</button>
        </div>
      `;
    }
    return;
  }

  let innerHtml = '';
  filteredItems.forEach(item => {
    const isWishlisted = wishlistItems.includes(String(item.id));
    innerHtml += `
    <div class="item-container">
      <div class="item-image-wrapper">
        <img class="item-image" src="${item.image}" alt="${item.item_name}">
        <button class="wishlist-heart-btn ${isWishlisted ? 'wishlisted' : ''}" 
                onclick="toggleWishlist('${item.id}')" 
                title="${isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}">
          <span class="material-symbols-outlined">${isWishlisted ? 'favorite' : 'favorite_border'}</span>
        </button>
      </div>
      <div class="rating">
          ${item.rating.stars} ⭐ | ${item.rating.count}
      </div>
      <div class="company-name">${item.company}</div>
      <div class="item-name" title="${item.item_name}">${item.item_name}</div>
      <div class="price">
          <span class="current-price">Rs ${item.current_price}</span>
          <span class="original-price">Rs ${item.original_price}</span>
          <span class="discount">(${item.discount_percentage}% OFF)</span>
      </div>
      <button class="btn-add-bag" onclick="addToBag('${item.id}')">
        <span class="material-symbols-outlined btn-bag-icon">shopping_bag</span> Add to Bag
      </button>
    </div>`;
  });

  itemsContainerElement.innerHTML = innerHtml;
}

function updateStatusBar(count) {
  const viewTitle = document.getElementById('view-title');
  const countBadge = document.getElementById('product-count-badge');
  const resetBtn = document.getElementById('reset-filter-btn');

  if (!viewTitle || !countBadge) return;

  if (isWishlistView) {
    viewTitle.innerText = 'My Wishlist';
  } else if (currentSearchQuery) {
    viewTitle.innerText = `Search results for "${currentSearchQuery}"`;
  } else if (currentCategory !== 'all') {
    viewTitle.innerText = `${currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1)}'s Collection`;
  } else {
    viewTitle.innerText = 'All Products';
  }

  countBadge.innerText = `${count} ${count === 1 ? 'item' : 'items'}`;

  if (resetBtn) {
    if (isWishlistView || currentSearchQuery || currentCategory !== 'all') {
      resetBtn.style.display = 'inline-block';
    } else {
      resetBtn.style.display = 'none';
    }
  }
}

function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast-item toast-${type}`;
  toast.innerHTML = `
    <span class="material-symbols-outlined toast-icon">${type === 'success' ? 'check_circle' : 'info'}</span>
    <span class="toast-message">${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('fade-out');
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, 2500);
}