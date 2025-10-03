import { changeCurrency } from "../paymentPackage/managePayments.js";

export class Cart {
  constructor(orders = null) {
    // ✅ Restore saved cart from localStorage
    const savedCart = JSON.parse(localStorage.getItem("cartItems")) || {};
    this.items = savedCart.items || [];
    this.customerId = savedCart.customerId || null;

    this.onChange = null;
    this.manageOrders = orders;
    this.currency = changeCurrency();
  }

  saveCart() {
    localStorage.setItem("cartItems", JSON.stringify({
      items: this.items,
      customerId: this.customerId
    }));
  }

  setCustomerId(id) {
    this.customerId = id;
    this.saveCart();
  }

  addItem(item) {
    const existing = this.items.find(i => i.name === item.name);
    if (existing) {
      existing.qty += item.qty ?? 1;
    } else {
      this.items.push({ ...item, qty: item.qty ?? 1 });
    }
    this.triggerChange();
    this.saveCart();
    this.renderToDashboard();
  }

  getTotal() {
    return this.items.reduce((sum, i) => sum + i.price * (i.qty ?? 1), 0);
  }

  removeItem(index) {
    this.items.splice(index, 1);
    this.triggerChange();
    this.saveCart();
    this.renderToDashboard();
  }

  clearCart() {
    this.items = [];
    this.triggerChange();
    this.saveCart();
    this.renderToDashboard();
  }

  placeOrder(customerId = this.customerId) {
    if (this.items.length === 0) {
      this.showModal("Cart Empty", "Your cart is empty. Add items before placing an order.");
      return;
    }

    const order = {
      id: Date.now(),
      customerId: customerId || null,
      date: new Date().toLocaleString(),
      status: "Pending",
      total: this.getTotal(),
      items: [...this.items]
    };

    if (this.manageOrders) {
      this.manageOrders.addOrder(order);
    }

    this.clearCart();

    this.showModal("✅ Order Placed", `Order #${order.id} has been placed successfully!`, () => {
      const container = document.querySelector(".dashboard-main");
      if (container && this.manageOrders) {
        container.innerHTML = this.manageOrders.renderOrders();
        this.manageOrders.initControls();
      }
    });
  }

  triggerChange() {
    if (this.onChange) this.onChange();
  }

  renderCart() {
    let text = `<h2 class="heading">🛒 Cart (${this.items.length})</h2><hr width="100%">`;

    if (this.items.length === 0) {
      return text + `<p class="empty-cart">Your cart is empty.</p>`;
    }

    text += `<section class="cart-list">`;
    this.items.forEach((item, i) => {
      text += `
        <div class="cart-card">
          <h3>${item.name}</h3>
          <p>Price: ${this.currency} ${item.price}</p>
          <p>Qty: ${item.qty ?? 1}</p>
          <button class="remove-cart" data-index="${i}">Remove</button>
        </div>
      `;
    });
    text += `</section>`;

    text += `
      <div class="cart-summary">
        <p><strong>Total:</strong> ${this.currency} ${this.getTotal()}</p>
        <button id="placeOrderBtn">✅ Place Order</button>
      </div>
    `;

    return text;
  }

  renderToDashboard() {
    const container = document.querySelector(".dashboard-main");
    if (container) {
      container.innerHTML = this.renderCart();
      this.initControls();
    }
  }

  initControls() {
    document.querySelectorAll(".remove-cart").forEach(btn => {
      btn.addEventListener("click", e => {
        const i = Number(e.target.dataset.index);
        this.removeItem(i);
      });
    });

    const placeOrderBtn = document.getElementById("placeOrderBtn");
    if (placeOrderBtn) {
      placeOrderBtn.addEventListener("click", () => this.placeOrder(this.customerId));
    }
  }

  showModal(title, message, onClose = null) {
    let modal = document.getElementById("orderModal");

    if (!modal) {
      modal = document.createElement("div");
      modal.id = "orderModal";
      modal.className = "modal";
      modal.innerHTML = `
        <div class="modal-content">
          <h2 id="orderModalTitle"></h2>
          <p id="orderModalMessage"></p>
          <button id="closeOrderModal">OK</button>
        </div>
      `;
      document.body.appendChild(modal);
    }

    modal.querySelector("#orderModalTitle").innerText = title;
    modal.querySelector("#orderModalMessage").innerText = message;
    modal.style.display = "flex";

    const closeBtn = modal.querySelector("#closeOrderModal");
    closeBtn.onclick = () => {
      modal.style.display = "none";
      if (onClose) onClose();
    };
  }
}
