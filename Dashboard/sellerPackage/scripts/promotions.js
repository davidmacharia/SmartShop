export class Promotions {
  constructor() {
    this.promotions = [
      { 
        id: 1, 
        name: "Holiday Sale", 
        discount: 20, 
        type: "percentage", 
        start: "2025-09-20", 
        end: "2025-09-30", 
        status: "active" 
      },
      { 
        id: 2, 
        name: "Flash Deal", 
        discount: 15, 
        type: "flat", 
        start: "2025-09-18", 
        end: "2025-09-19", 
        status: "expired" 
      }
    ];

    this.currentPromo = null;
  }

  render() {
    let html = `
      <div class="promotions-page">
        <h2 class="heading">Promotions & Campaigns</h2>
        <hr width="100%">

        <!-- Metrics -->
        <section class="metrics">
          <div class="card"><i class="fa-solid fa-bullhorn"></i><h3>Total Campaigns</h3><p>${this.promotions.length}</p></div>
          <div class="card"><i class="fa-solid fa-check-circle"></i><h3>Active Campaigns</h3><p>${this.promotions.filter(p => p.status === "active").length}</p></div>
          <div class="card"><i class="fa-solid fa-clock"></i><h3>Upcoming</h3><p>${this.promotions.filter(p => p.status === "upcoming").length}</p></div>
          <div class="card"><i class="fa-solid fa-ban"></i><h3>Expired</h3><p>${this.promotions.filter(p => p.status === "expired").length}</p></div>
        </section>

        <!-- Campaign List -->
        <section class="promotion-list">
          <h3>Manage Campaigns</h3>
          <button id="addPromo" class="add-btn"><i class="fa-solid fa-plus"></i> Create Campaign</button>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Discount</th>
                <th>Type</th>
                <th>Duration</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>`;

    this.promotions.forEach(p => {
      html += `
        <tr data-id="${p.id}">
          <td>${p.name}</td>
          <td>${p.type === "percentage" ? p.discount + "%" : "$" + p.discount}</td>
          <td>${p.type.charAt(0).toUpperCase() + p.type.slice(1)}</td>
          <td>${p.start} → ${p.end}</td>
          <td><span class="status ${p.status}">${p.status.charAt(0).toUpperCase() + p.status.slice(1)}</span></td>
          <td>
            <button class="edit-btn"><i class="fa-solid fa-pen"></i></button>
            <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
            <button class="toggle-btn"><i class="fa-solid fa-toggle-on"></i></button>
          </td>
        </tr>`;
    });

    html += `
            </tbody>
          </table>
        </section>

        <!-- Modal -->
        <div id="promoModal" class="modal">
          <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h2 id="modalTitle">Create Campaign</h2>
            <form id="promoForm">
              <label>Campaign Name:</label>
              <input type="text" id="promoName" required>

              <label>Discount Value:</label>
              <input type="number" id="promoDiscount" required>

              <label>Type:</label>
              <select id="promoType">
                <option value="percentage">Percentage</option>
                <option value="flat">Flat ($)</option>
              </select>

              <label>Start Date:</label>
              <input type="date" id="promoStart" required>

              <label>End Date:</label>
              <input type="date" id="promoEnd" required>

              <label>Status:</label>
              <select id="promoStatus">
                <option value="active">Active</option>
                <option value="upcoming">Upcoming</option>
                <option value="expired">Expired</option>
              </select>

              <button type="submit">Save</button>
            </form>
          </div>
        </div>
      </div>`;
    
    return html;
  }

  initControls() {
    const modal = document.getElementById("promoModal");
    const closeModal = modal.querySelector(".close-modal");
    const form = document.getElementById("promoForm");
    const addBtn = document.getElementById("addPromo");

    // Add campaign
    addBtn.onclick = () => {
      this.currentPromo = null;
      document.getElementById("modalTitle").innerText = "Create Campaign";
      form.reset();
      modal.style.display = "flex";
    };

    // Edit campaign
    document.querySelectorAll(".edit-btn").forEach(btn => {
      btn.onclick = () => {
        const row = btn.closest("tr");
        const id = row.dataset.id;
        this.currentPromo = this.promotions.find(p => p.id == id);

        document.getElementById("modalTitle").innerText = "Edit Campaign";
        document.getElementById("promoName").value = this.currentPromo.name;
        document.getElementById("promoDiscount").value = this.currentPromo.discount;
        document.getElementById("promoType").value = this.currentPromo.type;
        document.getElementById("promoStart").value = this.currentPromo.start;
        document.getElementById("promoEnd").value = this.currentPromo.end;
        document.getElementById("promoStatus").value = this.currentPromo.status;

        modal.style.display = "flex";
      };
    });

    // Delete campaign
    document.querySelectorAll(".delete-btn").forEach(btn => {
      btn.onclick = () => {
        const row = btn.closest("tr");
        const id = row.dataset.id;
        this.promotions = this.promotions.filter(p => p.id != id);
        row.remove();
      };
    });

    // Toggle status
    document.querySelectorAll(".toggle-btn").forEach(btn => {
      btn.onclick = () => {
        const row = btn.closest("tr");
        const id = row.dataset.id;
        const promo = this.promotions.find(p => p.id == id);

        promo.status = promo.status === "active" ? "expired" : "active";
        row.querySelector(".status").innerText = promo.status.charAt(0).toUpperCase() + promo.status.slice(1);
        row.querySelector(".status").className = "status " + promo.status;
      };
    });

    // Save form
    form.onsubmit = (e) => {
      e.preventDefault();
      const name = document.getElementById("promoName").value;
      const discount = parseFloat(document.getElementById("promoDiscount").value);
      const type = document.getElementById("promoType").value;
      const start = document.getElementById("promoStart").value;
      const end = document.getElementById("promoEnd").value;
      const status = document.getElementById("promoStatus").value;

      if (this.currentPromo) {
        // Update
        this.currentPromo.name = name;
        this.currentPromo.discount = discount;
        this.currentPromo.type = type;
        this.currentPromo.start = start;
        this.currentPromo.end = end;
        this.currentPromo.status = status;
      } else {
        // Add new
        this.promotions.push({
          id: Date.now(),
          name, discount, type, start, end, status
        });
      }

      modal.style.display = "none";
      document.getElementById("dashboard-content").innerHTML = this.render();
      this.initControls();
    };

    // Close modal
    closeModal.onclick = () => modal.style.display = "none";
    window.onclick = (e) => { if (e.target === modal) modal.style.display = "none"; };
  }
}
