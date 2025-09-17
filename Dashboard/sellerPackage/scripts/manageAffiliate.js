export class Affiliate {
  constructor() {
    this.affiliates = [
      { id: 1, name: "John Doe", clicks: 1200, sales: 54, commission: 340, status: "active" },
      { id: 2, name: "Sarah Lee", clicks: 890, sales: 41, commission: 280, status: "pending" },
      { id: 3, name: "Mark Smith", clicks: 510, sales: 18, commission: 120, status: "blocked" }
    ];

    this.links = [
      { product: "Smart Watch", url: "https://smartshop.com/p/smartwatch?ref=AFF123" },
      { product: "Wireless Earbuds", url: "https://smartshop.com/p/earbuds?ref=AFF123" },
      { product: "Bluetooth Speaker", url: "https://smartshop.com/p/speaker?ref=AFF123" }
    ];

    this.currentAffiliate = null;
  }

  render() {
    let html = `
      <div class="affiliate-page">
        <h2 class="heading">Affiliate Program</h2>
        <hr width="100%">

        <!-- Metrics -->
        <section class="metrics">
          <div class="card"><i class="fa-solid fa-link"></i><h3>Total Affiliates</h3><p>${this.affiliates.length}</p></div>
          <div class="card"><i class="fa-solid fa-mouse-pointer"></i><h3>Total Clicks</h3><p>${this.affiliates.reduce((a, b) => a + b.clicks, 0)}</p></div>
          <div class="card"><i class="fa-solid fa-shopping-cart"></i><h3>Sales via Affiliates</h3><p>${this.affiliates.reduce((a, b) => a + b.sales, 0)}</p></div>
          <div class="card"><i class="fa-solid fa-dollar-sign"></i><h3>Commission Paid</h3><p>$${this.affiliates.reduce((a, b) => a + b.commission, 0)}</p></div>
        </section>

        <!-- Affiliate List -->
        <section class="affiliate-list">
          <h3>Manage Affiliates</h3>
          <button id="addAffiliate" class="add-btn"><i class="fa-solid fa-user-plus"></i> Add Affiliate</button>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Clicks</th>
                <th>Sales</th>
                <th>Commission</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>`;

    this.affiliates.forEach(a => {
      html += `
        <tr data-id="${a.id}">
          <td>${a.name}</td>
          <td>${a.clicks}</td>
          <td>${a.sales}</td>
          <td>$${a.commission}</td>
          <td><span class="status ${a.status}">${a.status.charAt(0).toUpperCase() + a.status.slice(1)}</span></td>
          <td>
            <button class="edit-btn"><i class="fa-solid fa-pen"></i></button>
            <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
            <button class="status-btn"><i class="fa-solid fa-toggle-on"></i></button>
            <button class="more-btn"><i class="fa-solid fa-ellipsis"></i></button>
          </td>
        </tr>
        <!-- Hidden Links Row -->
        <tr class="affiliate-links-row" data-id="${a.id}" style="display:none;">
          <td colspan="6">
            <div class="affiliate-links">`;

      this.links.forEach(link => {
        html += `
              <div class="affiliate-card">
                <p><strong>${link.product}</strong></p>
                <input type="text" readonly value="${link.url}">
                <button class="copy-btn"><i class="fa-regular fa-copy"></i> Copy</button>
              </div>`;
      });

      html += `
            </div>
          </td>
        </tr>`;
    });

    html += `
            </tbody>
          </table>
        </section>

        <!-- Add/Edit Modal -->
        <div id="affiliateModal" class="modal">
          <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h2 id="modalTitle">Add Affiliate</h2>
            <form id="affiliateForm">
              <label>Name:</label>
              <input type="text" id="affName" required>
              <label>Commission ($):</label>
              <input type="number" id="affCommission" required>
              <label>Status:</label>
              <select id="affStatus">
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="blocked">Blocked</option>
              </select>
              <button type="submit">Save</button>
            </form>
          </div>
        </div>
      </div>`;

    return html;
  }

  initControls() {
    const modal = document.getElementById("affiliateModal");
    const closeModal = modal.querySelector(".close-modal");
    const form = document.getElementById("affiliateForm");
    const addBtn = document.getElementById("addAffiliate");

    // Event delegation for all buttons inside table
    document.querySelector("table").onclick = (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;
      const row = btn.closest("tr");
      const id = row?.dataset.id;
      const aff = this.affiliates.find(a => a.id == id);

      // Edit affiliate
      if (btn.classList.contains("edit-btn")) {
        this.currentAffiliate = aff;
        document.getElementById("modalTitle").innerText = "Edit Affiliate";
        document.getElementById("affName").value = aff.name;
        document.getElementById("affCommission").value = aff.commission;
        document.getElementById("affStatus").value = aff.status;
        modal.style.display = "flex";
      }

      // Delete affiliate
      if (btn.classList.contains("delete-btn")) {
        this.affiliates = this.affiliates.filter(a => a.id != id);
        row.nextElementSibling.remove();
        row.remove();
      }

      // Toggle status
      if (btn.classList.contains("status-btn")) {
        aff.status = aff.status === "active" ? "blocked" : "active";
        row.querySelector(".status").innerText =
          aff.status.charAt(0).toUpperCase() + aff.status.slice(1);
        row.querySelector(".status").className = "status " + aff.status;
      }

      // Toggle links
      if (btn.classList.contains("more-btn")) {
        const linksRow = document.querySelector(`.affiliate-links-row[data-id="${id}"]`);
        linksRow.style.display = linksRow.style.display === "none" ? "table-row" : "none";
      }

      // Copy link
      if (btn.classList.contains("copy-btn")) {
        const input = btn.previousElementSibling;
        input.select();
        document.execCommand("copy");
        btn.innerHTML = "<i class='fa-solid fa-check'></i> Copied!";
        setTimeout(() => { btn.innerHTML = "<i class='fa-regular fa-copy'></i> Copy"; }, 2000);
      }
    };

    // Add affiliate
    addBtn.onclick = () => {
      this.currentAffiliate = null;
      document.getElementById("modalTitle").innerText = "Add Affiliate";
      form.reset();
      modal.style.display = "flex";
    };

    // Save (Add/Edit) affiliate
    form.onsubmit = (e) => {
      e.preventDefault();
      const name = document.getElementById("affName").value;
      const commission = parseFloat(document.getElementById("affCommission").value);
      const status = document.getElementById("affStatus").value;

      if (this.currentAffiliate) {
        this.currentAffiliate.name = name;
        this.currentAffiliate.commission = commission;
        this.currentAffiliate.status = status;
      } else {
        this.affiliates.push({
          id: Date.now(),
          name, clicks: 0, sales: 0, commission, status
        });
      }

      modal.style.display = "none";
      document.getElementById("dashboard-content").innerHTML = this.render();
      this.initControls(); // rebind delegation
    };

    // Close modal
    closeModal.onclick = () => modal.style.display = "none";
    window.onclick = (e) => { if (e.target === modal) modal.style.display = "none"; };
  }
}
