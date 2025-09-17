export class Earnings {
  constructor() {
    this.summary = {
      totalEarnings: 12890,
      availableBalance: 3490,
      pendingBalance: 5400,
      lastPayout: 2500
    };

    this.payouts = [
      { id: 1, date: "2025-08-10", amount: 2500, method: "Bank Transfer", status: "completed" },
      { id: 2, date: "2025-07-01", amount: 1800, method: "PayPal", status: "completed" },
      { id: 3, date: "2025-06-12", amount: 2200, method: "Bank Transfer", status: "pending" }
    ];
  }

  render() {
    let html = `
      <div class="earnings-page">
        <h2 class="heading">Earnings & Payouts</h2>
        <hr>

        <!-- Earnings Metrics -->
        <section class="metrics">
          <div class="card"><i class="fa-solid fa-sack-dollar"></i><h3>Total Earnings</h3><p>$${this.summary.totalEarnings}</p></div>
          <div class="card"><i class="fa-solid fa-wallet"></i><h3>Available Balance</h3><p>$${this.summary.availableBalance}</p></div>
          <div class="card"><i class="fa-solid fa-hourglass-half"></i><h3>Pending Balance</h3><p>$${this.summary.pendingBalance}</p></div>
          <div class="card"><i class="fa-solid fa-money-check-dollar"></i><h3>Last Payout</h3><p>$${this.summary.lastPayout}</p></div>
        </section>

        <!-- Payout Controls -->
        <section class="payout-actions">
          <button id="requestPayout" class="add-btn"><i class="fa-solid fa-credit-card"></i> Request Payout</button>
        </section>

        <!-- Payout History -->
        <section class="payout-list">
          <h3>Payout History</h3>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>`;
    
    this.payouts.forEach(p => {
      html += `
        <tr>
          <td>${p.date}</td>
          <td>$${p.amount}</td>
          <td>${p.method}</td>
          <td><span class="status ${p.status}">${p.status}</span></td>
        </tr>`;
    });

    html += `
            </tbody>
          </table>
        </section>

        <!-- Request Payout Modal -->
        <div id="payoutModal" class="modal">
          <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h2>Request Payout</h2>
            <form id="payoutForm">
              <label>Amount ($):</label>
              <input type="number" id="payoutAmount" max="${this.summary.availableBalance}" required>
              <label>Method:</label>
              <select id="payoutMethod">
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="PayPal">PayPal</option>
              </select>
              <button type="submit">Submit Request</button>
            </form>
          </div>
        </div>
      </div>`;

    return html;
  }

  initControls() {
    const modal = document.getElementById("payoutModal");
    const closeModal = modal.querySelector(".close-modal");
    const form = document.getElementById("payoutForm");
    const requestBtn = document.getElementById("requestPayout");

    // Open modal
    requestBtn.onclick = () => { modal.style.display = "flex"; };

    // Close modal
    closeModal.onclick = () => { modal.style.display = "none"; };
    window.onclick = (e) => { if (e.target === modal) modal.style.display = "none"; };

    // Handle payout request
    form.onsubmit = (e) => {
      e.preventDefault();
      const amount = parseFloat(document.getElementById("payoutAmount").value);
      const method = document.getElementById("payoutMethod").value;

      if (amount > this.summary.availableBalance) {
        alert("Amount exceeds available balance.");
        return;
      }

      // Deduct balance
      this.summary.availableBalance -= amount;
      this.summary.pendingBalance += amount;

      // Add payout record
      this.payouts.unshift({
        id: Date.now(),
        date: new Date().toISOString().split("T")[0],
        amount,
        method,
        status: "pending"
      });

      modal.style.display = "none";
      document.getElementById("dashboard-content").innerHTML = this.render();
      this.initControls(); // rebind controls
    };
  }
}
