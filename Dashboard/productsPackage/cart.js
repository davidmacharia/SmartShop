export class Cart {
  constructor(manageOrders = null) {
    this.items = [
      { name: "Smart Watch", price: 65, stock: 32, image: "pic.jpg", qty: 1 },
      { name: "Wireless Earbuds", price: 45, stock: 77, image: "pic.jpg", qty: 1 }
    ];
    this.orders = []; // local reference
    this.manageOrders = manageOrders; // ✅ link to ManageOrders
  }

  addItem(product) {
    const existing = this.items.find(p => p.name === product.name);
    if (existing) {
      existing.qty += 1;
    } else {
      this.items.push({ ...product, qty: 1 });
    }
    this.showAddedModal(product.name);
  }

  removeItem(name) {
    this.items = this.items.filter(p => p.name !== name);
  }

  getTotal() {
    return this.items.reduce((sum, item) => sum + (item.price * item.qty), 0);
  }

  renderCart() {
    let text = `<h2 class="heading">🛒 Your Cart</h2><hr width="100%">`;
    if (this.items.length === 0) {
      text += `<p class="empty-cart">Your cart is empty.</p>`;
      return text;
    }

    text += `<section class="cart-list">`;
    this.items.forEach(item => {
      text += `
        <div class="cart-card">
          <img src="${item.image}" alt="${item.name}" />
          <div class="cart-info">
            <h3>${item.name}</h3>
            <p>Price: $${item.price}</p>
            <p>Quantity: ${item.qty}</p>
            <p>Subtotal: $${item.price * item.qty}</p>
            <button class="remove-btn" data-name="${item.name}">
              <i class="fa-solid fa-trash"></i> Remove
            </button>
          </div>
        </div>`;
    });
    text += `</section>`;
    text += `<div class="cart-summary">
               <h3>Total: $${this.getTotal()}</h3>
               <button class="checkout-btn">
                 <i class="fa-solid fa-credit-card"></i> Place Order
               </button>
             </div>`;

    // ✅ Order Modal
    text += `
      <div id="orderModal" class="modal">
        <div class="modal-content order-content">
          <h2>Confirm Order</h2>
          <p>Total Amount: $${this.getTotal()}</p>
          <div class="actions">
            <button id="confirmOrder" class="confirm">Confirm</button>
            <button id="cancelOrder" class="cancel">Cancel</button>
          </div>
        </div>
      </div>
    `;

    return text;
  }

  initControls() {
    document.querySelectorAll(".remove-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        this.removeItem(btn.dataset.name);
        document.querySelector(".dashboard-main").innerHTML = this.renderCart();
        this.initControls();
      });
    });

    const checkoutBtn = document.querySelector(".checkout-btn");
    if (checkoutBtn) {
      const orderModal = document.getElementById("orderModal");
      const confirmOrder = document.getElementById("confirmOrder");
      const cancelOrder = document.getElementById("cancelOrder");

      checkoutBtn.addEventListener("click", () => {
        orderModal.style.display = "flex";
      });

      confirmOrder.addEventListener("click", () => {
        this.placeOrder();
        orderModal.style.display = "none";
      });

      cancelOrder.addEventListener("click", () => {
        orderModal.style.display = "none";
      });

      window.addEventListener("click", (e) => {
        if (e.target === orderModal) orderModal.style.display = "none";
      });
    }
  }

  placeOrder() {
    if (this.items.length === 0) return;

    const newOrder = {
      id: Date.now(),
      items: [...this.items],
      total: this.getTotal(),
      date: new Date().toLocaleString(),
      status: "Pending"
    };

    // ✅ Save into ManageOrders
    if (this.manageOrders) {
      this.manageOrders.addOrder(newOrder);
    }

    // Save locally too
    this.orders.push(newOrder);

    this.items = [];
    document.querySelector(".dashboard-main").innerHTML = this.renderCart();
    this.initControls();

    this.showOrderPlacedModal();
  }

  showAddedModal(productName) {
    let modal = document.getElementById("cartModal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "cartModal";
      modal.className = "modal";
      modal.innerHTML = `
        <div class="modal-content">
          <h2>Item Added</h2>
          <p id="cartMessage"></p>
          <button id="closeCartModal">OK</button>
        </div>
      `;
      document.body.appendChild(modal);

      modal.querySelector("#closeCartModal").addEventListener("click", () => {
        modal.style.display = "none";
      });
    }

    modal.querySelector("#cartMessage").innerText = `${productName} was added to your cart!`;
    modal.style.display = "flex";
  }

  showOrderPlacedModal() {
    let modal = document.getElementById("orderPlacedModal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "orderPlacedModal";
      modal.className = "modal";
      modal.innerHTML = `
        <div class="modal-content">
          <h2>🎉 Order Placed</h2>
          <p>Your order has been placed successfully!</p>
          <button id="closeOrderPlaced">OK</button>
        </div>
      `;
      document.body.appendChild(modal);

      modal.querySelector("#closeOrderPlaced").addEventListener("click", () => {
        modal.style.display = "none";
      });
    }

    modal.style.display = "flex";
  }
}
