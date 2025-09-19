import { Payment } from "../paymentPackage/payment.js";
import { changeCurrency } from "../paymentPackage/managePayments.js";

export class ManageOrders {
  constructor() {
    this.orders = [];
    this.onChange = null;
    this.currency = changeCurrency();
  }

  addOrder(order) {
    this.orders.push(order);
    this.triggerChange();
  }

  triggerChange() {
    if (this.onChange) this.onChange();
  }

  renderOrders() {
    let text = `<h2 class="heading">📦 Orders (${this.orders.length})</h2><hr width="100%">`;

    if (this.orders.length === 0) {
      return text + `<p class="empty-orders">No orders yet.</p>`;
    }

    text += `<section class="orders-list">`;
    this.orders.forEach(order => {
      text += `
        <div class="order-card">
          <h3>Order #${order.id}</h3>
          <p>Date: ${order.date}</p>
          <p>Status: ${order.status}</p>
          <p>Total: ${this.currency} ${order.total}</p>
          <ul>
            ${order.items.map(i => `<li>${i.name} x${i.qty}</li>`).join("")}
          </ul>
          <button class="pay-now" data-id="${order.id}">💳 Pay Now</button>
        </div>
      `;
    });
    text += `</section>`;

    return text;
  }

  renderToDashboard() {
    const container = document.querySelector(".dashboard-main");
    if (container) {
      container.innerHTML = this.renderOrders();
      this.initControls();
    }
  }

  initControls() {
    document.querySelectorAll(".pay-now").forEach(btn => {
      btn.addEventListener("click", e => {
        const orderId = e.target.dataset.id;
        const order = this.orders.find(o => o.id == orderId);
        if (order) {
          const payment = new Payment(order);
          const container = document.querySelector(".dashboard-main");
          container.innerHTML = payment.renderPaymentPage();
          payment.initControls();
        }
      });
    });
  }
}
