# Myntra Functional Clone 👗🛒

A modern, fully functional front-end clone of **Myntra** built using **HTML5, Vanilla CSS3, and JavaScript (ES6+)**.  
This project replicates core e-commerce interactions including dynamic product browsing, real-time search, category filtering, a full wishlist system, interactive shopping bag, and checkout confirmation.

---

## ✨ Key Features

- **🛍️ Dynamic Product Catalog**: Rendered dynamically from structured data (`data/items.js`) with ratings, original prices, discount percentages, and return period info.
- **🔍 Real-Time Live Search**: Instant product and brand filtering with an integrated search clear button.
- **🏷️ Category Filtering**: Filter catalog by Men, Women, Beauty, and All products directly from the header navigation.
- **❤️ Interactive Wishlist**:
  - Heart icon button on every product card.
  - Persistent state in browser `localStorage`.
  - Header wishlist counter badge.
  - Dedicated Wishlist view mode.
- **👜 Shopping Bag & Cart Management**:
  - Add items to bag with real-time count badges.
  - Individual item removal with immediate price recalculation.
  - State persisted across sessions using `localStorage`.
- **💰 Smart Price Breakdown**:
  - Automatically calculates Total MRP, Discounts, and Convenience Fees.
  - Convenience fees are conditionally charged only when items are in the bag (₹0 when empty).
- **🎉 Interactive Checkout Modal**:
  - "Place Order" flow with an animated order confirmation popup and summary.
  - Automatically clears cart after successful checkout.
- **🔔 Toast Feedback Notifications**: Smooth animated toast notifications for adding/removing items to bag or wishlist.
- **📦 Empty States & Breadcrumbs**: Illustrated empty state views for both empty search results and empty shopping bag, with "Continue Shopping" navigation.

---

## 📂 Project Structure

```text
Myntra-Clone/
├── css/
│   ├── bag.css           # Styling for shopping bag, checkout steps & order modal
│   └── index.css         # Main design system, navbar, cards, wishlist & toasts
├── data/
│   └── items.js          # Product data catalog (ratings, pricing, categories)
├── images/
│   ├── 1.jpg ... 8.jpg   # Product images
│   └── myntra_logo.webp  # Myntra brand logo
├── pages/
│   └── bag.html          # Shopping bag & checkout page
├── scripts/
│   ├── bag.js            # Bag rendering, calculations & place-order modal
│   └── index.js          # Main page logic, search, category filter & wishlist
├── index.html            # Main storefront homepage
└── README.md             # Documentation
```

---

## ⚡ Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/tiwariprachi3007/Myntra-Clone.git
cd Myntra-Clone
```

### 2. Run the project

You can open `index.html` directly in any modern web browser, or serve it using a local HTTP server:

**Using Python:**
```bash
python -m http.server 3000
```
Then navigate to `http://localhost:3000` in your browser.

**Using Node / npx:**
```bash
npx serve .
```

---

## 🛠️ Built With

- **HTML5**: Semantic markup, accessible structure.
- **Vanilla CSS3**: Modern layouts with Flexbox, Google Material Symbols, responsive design, and CSS animations.
- **JavaScript (ES6+)**: Dynamic DOM manipulation, array methods, event listeners, and `localStorage` API.

---

## ⚠️ Disclaimer

> This project is an open-source front-end clone created purely for educational and portfolio demonstration purposes.  
> All product images, logos, and brand trademarks belong to their respective copyright owners (Myntra Designs Pvt. Ltd.).
