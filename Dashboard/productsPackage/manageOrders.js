export class ManageOrders {
  constructor() {
    this.orders = [];
  }

  addOrder(order) {
    this.orders.push(order);
  }

  renderOrders() {
    let text = `<h2 class="heading">📦 Your Orders</h2><hr width="100%">`;

    if (this.orders.length === 0) {
      text += `<p class="empty-orders">No orders placed yet.</p>`;
      return text;
    }

    text += `<section class="order-list">`;
    this.orders.forEach(order => {
      text += `
        <div class="order-card">
          <h3>Order #${order.id}</h3>
          <p><strong>Date:</strong> ${order.date}</p>
          <p><strong>Status:</strong> ${order.status}</p>
          <p><strong>Total:</strong> $${order.total}</p>
          <details>
            <summary>Items</summary>
            <ul>
              ${order.items.map(item =>
                `<li>${item.qty} × ${item.name} - $${item.price * item.qty}</li>`
              ).join("")}
            </ul>
          </details>
        </div>
      `;
    });
    text += `</section>`;

    return text;
  }
}
