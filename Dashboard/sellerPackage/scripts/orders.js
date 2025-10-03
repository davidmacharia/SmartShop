import { ManageOrders } from "../../productsPackage/manageOrders.js";

export class Orders {
  constructor() {
    this.manageOrders = new ManageOrders();
    this.orders = this.manageOrders.orders;
    this.filteredOrders = null; // for filtered views
  }

  // Helper: get status color
  getStatusColor(status) {
    switch(status.toLowerCase()) {
      case "pending": return "orange";
      case "shipped": return "dodgerblue";
      case "delivered": return "green";
      case "cancelled": return "red";
      default: return "black";
    }
  }

  render() {
    this.orders = this.manageOrders.orders;
    const displayOrders = this.filteredOrders || this.orders;

    let html = `
      <div class="orders-page">
        <h2 class="heading">Track Orders</h2>
        <hr width="100%">

        <!-- Filter Section -->
        <div class="orders-filter">
          <input type="number" id="filterCustomerId" placeholder="Enter Customer ID">
          <button id="filterBtn">Filter</button>
          <button id="resetFilterBtn">Reset</button>
        </div>

        <!-- Orders Actions -->
        <div class="orders-actions">
          <button id="exportOrders" class="export-btn"><i class="fa-solid fa-file-export"></i> Export Orders</button>
          <button id="clearOrders" class="clear-btn"><i class="fa-solid fa-trash"></i> Clear All Orders</button>
        </div>

        <!-- Orders Table -->
        <section class="orders-list">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer ID</th>
                <th>Products</th>
                <th>Qty</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>`;

    displayOrders.forEach(o => {
      html += `
        <tr data-id="${o.id}">
          <td>#${o.id}</td>
          <td>${o.customerId || "N/A"}</td>
          <td><ul>${o.items.map(i => `<li>${i.name}</li>`).join("")}</ul></td>
          <td>${o.items.reduce((sum, i) => sum + i.qty, 0)}</td>
          <td>$${o.total}</td>
          <td><span class="status" style="font-weight:bold; color:${this.getStatusColor(o.status)};">
            ${o.status.charAt(0).toUpperCase() + o.status.slice(1)}
          </span></td>
          <td>${o.date}</td>
          <td class="action-buttons">
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
      const exportOrders = this.filteredOrders || this.orders;
      let csv = "Order ID,Customer ID,Products,Qty,Total,Status,Date\n";
      exportOrders.forEach(o => {
        const productNames = o.items.map(i => i.name).join(" | ");
        const totalQty = o.items.reduce((sum, i) => sum + i.qty, 0);
        csv += `${o.id},${o.customerId || "N/A"},${productNames},${totalQty},${o.total},${o.status},${o.date}\n`;
      });
      const blob = new Blob([csv], { type: "text/csv" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "orders.csv";
      link.click();
    };

    // Clear all orders
    document.getElementById("clearOrders").onclick = () => {
      if (confirm("Are you sure you want to delete all orders?")) {
        this.manageOrders.orders = [];
        localStorage.removeItem("orders"); // clear local storage
        this.filteredOrders = null;
        document.getElementById("dashboard-content").innerHTML = this.render();
        this.initControls();
      }
    };

    // Filter orders
    document.getElementById("filterBtn").onclick = () => {
      const id = Number(document.getElementById("filterCustomerId").value);
      this.filteredOrders = this.orders.filter(o => o.customerId === id);
      document.getElementById("dashboard-content").innerHTML = this.render();
      this.initControls();
    };

    // Reset filter
    document.getElementById("resetFilterBtn").onclick = () => {
      this.filteredOrders = null;
      document.getElementById("filterCustomerId").value = "";
      document.getElementById("dashboard-content").innerHTML = this.render();
      this.initControls();
    };

    // Delegated table click handling
    document.querySelector(".orders-list table").onclick = (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;
      const row = btn.closest("tr");
      const id = row.dataset.id;
      const order = (this.filteredOrders || this.orders).find(o => o.id == id);
      if (!order) return;

      if (btn.classList.contains("ship-btn")) order.status = "shipped";
      if (btn.classList.contains("deliver-btn")) order.status = "delivered";
      if (btn.classList.contains("cancel-btn")) order.status = "cancelled";
      if (btn.classList.contains("view-btn")) this.showOrderDetails(order);

      this.manageOrders.updateOrder(order.id, { status: order.status });

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
      <p><strong>Customer ID:</strong> ${order.customerId || "N/A"}</p>
      <p><strong>Products:</strong></p>
      <ul>${order.items.map(i => `<li>${i.name} x${i.qty}</li>`).join("")}</ul>
      <p><strong>Total:</strong> $${order.total}</p>
      <p><strong>Status:</strong> ${order.status}</p>
      <p><strong>Date:</strong> ${order.date}</p>
    `;

    modal.style.display = "flex";
  }
}
