export class ManageOrders {
  constructor() {
    this.items = []; // standardized to items
    this.onChange = null;
  }

  addItem(order) {
    this.items.push(order);
    if (this.onChange) this.onChange();
    this.showOrderAddedModal(order.id);
  }

  removeItem(id) {
    this.items = this.items.filter(o => o.id !== id);
    if (this.onChange) this.onChange();
  }

  renderOrders() {
    let text = `<h2 class="heading">📦 Your Orders</h2><hr width="100%">`;

    if (this.items.length === 0) {
      text += `<p class="empty-orders">No orders placed yet.</p>`;
      return text;
    }

    text += `<section class="order-list">`;
    this.items.forEach(order => {
      text += `
        <div class="order-card">
          <h3>Order #${order.id}</h3>
          <p><strong>Date:</strong> ${order.date}</p>
          <p><strong>Status:</strong> 
             <span class="status ${order.status.toLowerCase()}">${order.status}</span>
          </p>
          <p><strong>Total:</strong> $${order.total}</p>
          <details>
            <summary>Items</summary>
            <ul>
              ${order.items.map(item =>
                `<li>${item.qty} × ${item.name} - $${item.price * item.qty}</li>`
              ).join("")}
            </ul>
          </details>
          <button class="remove-order-btn" data-id="${order.id}">
            <i class="fa-solid fa-trash"></i> Remove
          </button>
        </div>
      `;
    });
    text += `</section>`;
    return text;
  }

  initControls() {
    document.querySelectorAll(".remove-order-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        this.removeItem(parseInt(btn.dataset.id, 10));
        this.renderToDashboard();
      });
    });
  }

  renderToDashboard() {
    const container = document.querySelector(".dashboard-main");
    if (container) {
      container.innerHTML = this.renderOrders();
      this.initControls();
    }
  }

  showOrderAddedModal(orderId) {
    let modal = document.getElementById("orderModalAdded");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "orderModalAdded";
      modal.className = "modal";
      modal.innerHTML = `
        <div class="modal-content">
          <h2>✅ Order Added</h2>
          <p id="orderMessage"></p>
          <button id="closeOrderModalAdded">OK</button>
        </div>
      `;
      document.body.appendChild(modal);

      modal.querySelector("#closeOrderModalAdded").addEventListener("click", () => {
        modal.style.display = "none";
      });
    }

    modal.querySelector("#orderMessage").innerText = `Order #${orderId} was placed successfully!`;
    modal.style.display = "flex";
  }
}
