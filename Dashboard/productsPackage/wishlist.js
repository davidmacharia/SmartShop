import { changeCurrency } from "../paymentPackage/managePayments.js";

export class Wishlist {
  constructor(cart = null) {
    this.storageKey = "wishlist"; // ✅ localStorage key
    this.items = this.loadFromStorage();
    this.cart = cart; // shared cart instance
    this.onChange = null;
    this.currency = changeCurrency();
  }

  /* ------------------------------
     🔄 Local Storage
  ------------------------------ */
  saveToStorage() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.items));
  }

  loadFromStorage() {
    return JSON.parse(localStorage.getItem(this.storageKey)) || [];
  }

  /* ------------------------------
     🛍️ Core Wishlist Ops
  ------------------------------ */
  addItem(item) {
    this.items.push(item);
    this.saveToStorage();
    this.triggerChange();
    this.renderToDashboard();
  }

  removeItem(index) {
    this.items.splice(index, 1);
    this.saveToStorage();
    this.triggerChange();
    this.renderToDashboard();
  }

  moveToCart(index) {
    const item = this.items.splice(index, 1)[0];
    if (item && this.cart) {
      this.cart.addItem(item);
    }
    this.saveToStorage();
    this.triggerChange();
    this.renderToDashboard();
  }

  triggerChange() {
    if (this.onChange) this.onChange();
  }

  /* ------------------------------
     🖼️ UI Rendering
  ------------------------------ */
  renderWishlist() {
    let text = `<h2 class="heading">❤️ Wishlist (${this.items.length})</h2><hr width="100%">`;

    if (this.items.length === 0) {
      return text + `<p class="empty-wishlist">No items in wishlist.</p>`;
    }

    text += `<section class="wishlist-list">`;
    this.items.forEach((item, i) => {
      text += `
        <div class="wishlist-card">
          <h3>${item.name}</h3>
          <p>Price: ${this.currency} ${item.price}</p>
          <button class="move-to-cart" data-index="${i}">Move to Cart</button>
          <button class="remove-wishlist" data-index="${i}">Remove</button>
        </div>
      `;
    });
    text += `</section>`;

    return text;
  }

  renderToDashboard() {
    const container = document.querySelector(".dashboard-main");
    if (container) {
      container.innerHTML = this.renderWishlist();
      this.initControls(); // rebind buttons
    }
  }

  /* ------------------------------
     🎛️ Controls
  ------------------------------ */
  initControls() {
    document.querySelectorAll(".move-to-cart").forEach(btn => {
      btn.addEventListener("click", e => {
        const i = Number(e.target.dataset.index);
        this.moveToCart(i);
      });
    });

    document.querySelectorAll(".remove-wishlist").forEach(btn => {
      btn.addEventListener("click", e => {
        const i = Number(e.target.dataset.index);
        this.removeItem(i);
      });
    });
  }
}
