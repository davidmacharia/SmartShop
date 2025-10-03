import { Payment } from "../paymentPackage/payment.js";
import { changeCurrency } from "../paymentPackage/managePayments.js";

export class ManageOrders {
  constructor() {
    this.onChange = null;
    this.currency = changeCurrency();

    const savedOrders = JSON.parse(localStorage.getItem("orders")) || [];
    this.orders = savedOrders.map(o => ({
      ...o,
      customerId: o.customerId || null
    }));
  }

  saveOrders() {
    localStorage.setItem("orders", JSON.stringify(this.orders));
  }

  addOrder(order) {
    if (!order.customerId) order.customerId = null;
    this.orders.push(order);
    this.saveOrders();
    this.triggerChange();
  }

  updateOrder(id, newData) {
    const index = this.orders.findIndex(o => o.id == id);
    if (index !== -1) {
      this.orders[index] = { ...this.orders[index], ...newData };
      this.saveOrders();
      this.triggerChange();
    }
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
          <p><strong>Customer ID:</strong> ${order.customerId || "N/A"}</p>
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
    const container = document.querySelector(".dashboard-main");
    if (!container) return;

    container.addEventListener("click", (e) => {
      if (e.target.classList.contains("pay-now")) {
        const orderId = e.target.dataset.id;
        const order = this.orders.find(o => o.id == orderId);
        if (order) {
          const payment = new Payment(order);

          payment.onComplete = () => {
            this.updateOrder(order.id, { status: "Paid" });
          };

          container.innerHTML = payment.renderPaymentPage();
          payment.initControls();
        }
      }
    });
  }
}
