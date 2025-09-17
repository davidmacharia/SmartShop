export class Orders {
  constructor() {
    this.orders = [
      { id: 1001, customer: "Alice Johnson", product: "Smart Watch", qty: 1, total: 120, status: "pending", date: "2025-09-10" },
      { id: 1002, customer: "Bob Smith", product: "Wireless Earbuds", qty: 2, total: 160, status: "shipped", date: "2025-09-11" }
    ];
  }

  render() {
    let html = `
      <div class="orders-page">
        <h2 class="heading">Track Orders</h2>
        <hr width="100%">

        <!-- Orders Table -->
        <section class="orders-list">
          <h3>Customer Orders</h3>
          <button id="exportOrders" class="export-btn"><i class="fa-solid fa-file-export"></i> Export Orders</button>
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Product</th>
                <th>Qty</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>`;

    this.orders.forEach(o => {
      html += `
        <tr data-id="${o.id}">
          <td>#${o.id}</td>
          <td>${o.customer}</td>
          <td>${o.product}</td>
          <td>${o.qty}</td>
          <td>$${o.total}</td>
          <td><span class="status ${o.status}">${o.status.charAt(0).toUpperCase() + o.status.slice(1)}</span></td>
          <td>${o.date}</td>
          <td>
            ${o.status === "pending" ? `<button class="ship-btn"><i class="fa-solid fa-truck"></i> Ship</button>` : ""}
            ${o.status === "shipped" ? `<button class="deliver-btn"><i class="fa-solid fa-check"></i> Deliver</button>` : ""}
            ${o.status !== "cancelled" && o.status !== "delivered" ? `<button class="cancel-btn"><i class="fa-solid fa-ban"></i> Cancel</button>` : ""}
            <button class="view-btn"><i class="fa-solid fa-eye"></i></button>
          </td>
        </tr>`;
    });

    html += `
            </tbody>
          </table>
        </section>

        <!-- View Modal -->
        <div id="orderModal" class="modal">
          <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h2>Order Details</h2>
            <div id="orderDetails"></div>
          </div>
        </div>
      </div>`;

    return html;
  }

  initControls() {
    // Export orders
    document.getElementById("exportOrders").onclick = () => {
      let csv = "Order ID,Customer,Product,Qty,Total,Status,Date\n";
      this.orders.forEach(o => {
        csv += `${o.id},${o.customer},${o.product},${o.qty},${o.total},${o.status},${o.date}\n`;
      });
      const blob = new Blob([csv], { type: "text/csv" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "orders.csv";
      link.click();
    };

    // Delegation for actions
    document.querySelector(".orders-list table").onclick = (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;
      const row = btn.closest("tr");
      const id = row.dataset.id;
      const order = this.orders.find(o => o.id == id);

      if (btn.classList.contains("ship-btn")) {
        order.status = "shipped";
      }
      if (btn.classList.contains("deliver-btn")) {
        order.status = "delivered";
      }
      if (btn.classList.contains("cancel-btn")) {
        order.status = "cancelled";
      }
      if (btn.classList.contains("view-btn")) {
        this.showOrderDetails(order);
      }

      document.getElementById("dashboard-content").innerHTML = this.render();
      this.initControls();
    };

    // Modal close
    const modal = document.getElementById("orderModal");
    modal.querySelector(".close-modal").onclick = () => modal.style.display = "none";
    window.onclick = (e) => { if (e.target === modal) modal.style.display = "none"; };
  }

  showOrderDetails(order) {
    const modal = document.getElementById("orderModal");
    const details = document.getElementById("orderDetails");

    details.innerHTML = `
      <p><strong>Order ID:</strong> #${order.id}</p>
      <p><strong>Customer:</strong> ${order.customer}</p>
      <p><strong>Product:</strong> ${order.product}</p>
      <p><strong>Quantity:</strong> ${order.qty}</p>
      <p><strong>Total:</strong> $${order.total}</p>
      <p><strong>Status:</strong> ${order.status}</p>
      <p><strong>Date:</strong> ${order.date}</p>
    `;

    modal.style.display = "flex";
  }
}
