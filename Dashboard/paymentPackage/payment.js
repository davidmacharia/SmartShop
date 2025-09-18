// payment.js
import { getTax } from "../taxesPackage/taxes.js";

export class Payment {
  constructor(order, paymentMethods = []) {
    this.order = order;
    this.paymentMethods = paymentMethods.length
      ? paymentMethods
      : ["Credit Card", "PayPal", "M-Pesa", "Bank Transfer"];

    this.history = JSON.parse(localStorage.getItem("paymentHistory")) || [];
  }

  // --- Helpers ---
  getSubtotal() {
    return this.order.items.reduce((sum, item) => sum + item.price * item.qty, 0);
  }

  getTaxAmount() {
    return getTax(this.getSubtotal());
  }

  getFinalTotal() {
    return this.getSubtotal() + this.getTaxAmount();
  }

  saveHistory() {
    localStorage.setItem("paymentHistory", JSON.stringify(this.history));
  }

  clearHistory() {
    this.history = [];
    localStorage.removeItem("paymentHistory");
    this.updateHistoryTable();
  }

  // --- Render Page ---
  renderPaymentPage() {
    return `
      <h2 class="heading">💳 Payment</h2>
      <hr width="100%">

      <div class="payment-container">
        <!-- Receipt -->
        <section class="receipt">
          <h3>🧾 Receipt</h3>
          <ul>
            ${this.order.items
              .map(
                (item) =>
                  `<li><span>${item.qty} × ${item.name}</span> <span>$${(
                    item.price * item.qty
                  ).toFixed(2)}</span></li>`
              )
              .join("")}
          </ul>
          <div class="totals">
            <p><span>Subtotal:</span> <span>$${this.getSubtotal().toFixed(2)}</span></p>
            <p><span>Tax:</span> <span>$${this.getTaxAmount().toFixed(2)}</span></p>
            <p><strong>Total Due:</strong> <strong>$${this.getFinalTotal().toFixed(
              2
            )}</strong></p>
          </div>
          <button class="print-btn" id="printReceipt">🖨 Print Receipt</button>
        </section>

        <!-- Payment Methods -->
        <section class="payment-methods">
          <h3>Select Payment Method</h3>
          <select id="paymentSelect">
            ${this.paymentMethods
              .map((method) => `<option value="${method}">${method}</option>`)
              .join("")}
          </select>
          <div class="payment-actions">
            <button class="confirm" id="confirmPayment">
              <i class="fa-solid fa-check"></i> Confirm Payment
            </button>
          </div>
        </section>
      </div>

      <!-- Payment History -->
      <section class="payment-history">
        <h3>📜 Payment History</h3>
        <table id="paymentHistoryTable">
          <thead>
            <tr>
              <th>Date</th>
              <th>Method</th>
              <th>Amount</th>
              <th>Order ID</th>
            </tr>
          </thead>
          <tbody>
            <tr class="empty">
              <td colspan="4">No payments yet</td>
            </tr>
          </tbody>
        </table>
        <button class="clear-history" id="clearHistory">🗑 Clear History</button>
      </section>

      <!-- Success Modal -->
      <div id="paymentSuccessModal" class="modal">
        <div class="modal-content">
          <h2>✅ Payment Successful</h2>
          <p id="paymentMessage"></p>
          <button id="closePaymentModal">OK</button>
        </div>
      </div>
    `;
  }

  // --- Controls ---
  initControls() {
    const confirmBtn = document.getElementById("confirmPayment");
    const modal = document.getElementById("paymentSuccessModal");
    const closeBtn = document.getElementById("closePaymentModal");
    const printBtn = document.getElementById("printReceipt");
    const clearHistoryBtn = document.getElementById("clearHistory");

    if (!confirmBtn) {
      console.error("⚠️ Confirm button not found. Did you call initControls() after rendering?");
      return;
    }

    // Confirm Payment
    confirmBtn.onclick = () => {
      const selectedMethod = document.getElementById("paymentSelect").value;
      const total = this.getFinalTotal().toFixed(2);

      const paymentRecord = {
        id: Date.now(),
        date: new Date().toLocaleString(),
        method: selectedMethod,
        amount: total,
      };

      this.history.push(paymentRecord);
      this.saveHistory();

      document.getElementById(
        "paymentMessage"
      ).textContent = `Your payment of $${total} was made via ${selectedMethod}.`;

      modal.style.display = "flex";
    };

    // Close modal & update history
    closeBtn.onclick = () => {
      modal.style.display = "none";
      this.updateHistoryTable();
    };

    // Print receipt
    if (printBtn) {
      printBtn.onclick = () => window.print();
    }

    // Clear history
    if (clearHistoryBtn) {
      clearHistoryBtn.onclick = () => this.clearHistory();
    }

    // Close modal when clicking outside
    window.onclick = (e) => {
      if (e.target === modal) {
        modal.style.display = "none";
        this.updateHistoryTable();
      }
    };

    // Load existing history
    this.updateHistoryTable();
  }

  // --- Update History Table ---
  updateHistoryTable() {
    const tbody = document.querySelector("#paymentHistoryTable tbody");
    tbody.innerHTML = "";

    if (this.history.length === 0) {
      tbody.innerHTML =
        '<tr class="empty"><td colspan="4">No payments yet</td></tr>';
      return;
    }

    this.history.forEach((record) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${record.date}</td>
        <td>${record.method}</td>
        <td>$${record.amount}</td>
        <td>${record.id}</td>
      `;
      tbody.appendChild(row);
    });
  }
}
