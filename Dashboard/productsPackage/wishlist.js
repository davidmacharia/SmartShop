export class Wishlist {
  constructor(cart = null) {
    this.items = [];
    this.cart = cart; // optional link to cart
    this.onChange = null; // ✅ callback for dashboard updates
  }

  addItem(product) {
    const exists = this.items.find(p => p.name === product.name);
    if (!exists) {
      this.items.push(product);
      this.triggerChange();
      this.showAddedModal(product.name);
    } else {
      this.showAlreadyExistsModal(product.name);
    }
  }

  removeItem(name) {
    this.items = this.items.filter(p => p.name !== name);
    this.triggerChange();
  }

  // ✅ new reusable trigger for dashboard updates
  triggerChange() {
    if (this.onChange) this.onChange();
  }

  renderWishlist() {
    let text = `<h2 class="heading">❤️ Your Wishlist (${this.items.length} items)</h2><hr width="100%">`;

    if (this.items.length === 0) {
      text += `<p class="empty-wishlist">Your wishlist is empty.</p>`;
      return text;
    }

    text += `<section class="wishlist-list">`;
    this.items.forEach(item => {
      text += `
        <div class="wishlist-card">
          <img src="${item.image}" alt="${item.name}" />
          <div class="wishlist-info">
            <h3>${item.name}</h3>
            <p>Price: $${item.price}</p>
            <button class="move-to-cart-btn" data-name="${item.name}">
              <i class="fa-solid fa-cart-plus"></i> Move to Cart
            </button>
            <button class="remove-btn" data-name="${item.name}">
              <i class="fa-solid fa-trash"></i> Remove
            </button>
          </div>
        </div>
      `;
    });
    text += `</section>`;

    return text;
  }

  initControls() {
    // Remove button
    document.querySelectorAll(".wishlist-card .remove-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        this.removeItem(btn.dataset.name);
        document.querySelector(".dashboard-main").innerHTML = this.renderWishlist();
        this.initControls();
      });
    });

    // Move to cart
    document.querySelectorAll(".move-to-cart-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const product = this.items.find(p => p.name === btn.dataset.name);
        if (product && this.cart) {
          this.cart.addItem(product);
          this.removeItem(product.name);
          document.querySelector(".dashboard-main").innerHTML = this.renderWishlist();
          this.initControls();
        }
      });
    });
  }

  // ✅ Modal for added to wishlist
  showAddedModal(productName) {
    let modal = document.getElementById("wishlistModal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "wishlistModal";
      modal.className = "modal";
      modal.innerHTML = `
        <div class="modal-content">
          <h2>Saved to Wishlist</h2>
          <p id="wishlistMessage"></p>
          <button id="closeWishlistModal">OK</button>
        </div>
      `;
      document.body.appendChild(modal);

      modal.querySelector("#closeWishlistModal").addEventListener("click", () => {
        modal.style.display = "none";
      });
    }

    modal.querySelector("#wishlistMessage").innerText = `${productName} was saved to your wishlist!`;
    modal.style.display = "flex";
  }

  // ✅ Modal for already exists
  showAlreadyExistsModal(productName) {
    let modal = document.getElementById("wishlistExistsModal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "wishlistExistsModal";
      modal.className = "modal";
      modal.innerHTML = `
        <div class="modal-content">
          <h2>Already in Wishlist</h2>
          <p id="wishlistExistsMessage"></p>
          <button id="closeWishlistExistsModal">OK</button>
        </div>
      `;
      document.body.appendChild(modal);

      modal.querySelector("#closeWishlistExistsModal").addEventListener("click", () => {
        modal.style.display = "none";
      });
    }

    modal.querySelector("#wishlistExistsMessage").innerText = `${productName} is already in your wishlist.`;
    modal.style.display = "flex";
  }
}
