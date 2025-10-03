import { changeCurrency } from "../paymentPackage/managePayments.js";

export class Products {
  constructor(role, cart = null, wishlist = null) {
    this.items = [
      { name: "Smart Watch", price: 65, stock: 32, image: "pic.jpg" },
      { name: "Wireless Earbuds", price: 45, stock: 77, image: "pic.jpg" },
      { name: "Bluetooth Speaker", price: 80, stock: 20, image: "pic.jpg" },
      { name: "Gaming Keyboard", price: 120, stock: 12, image: "pic.jpg" },
      { name: "Smartphone X", price: 650, stock: 18, image: "pic.jpg" },
    ];

    this.role = role;
    this.currency = changeCurrency();
    this.cart = cart;
    this.wishlist = wishlist;
    this.historyKey = "searchHistory"; 
  }

  /* ------------------------------
     🔹 Modal Renderer
  ------------------------------ */
  renderModals() {
    return `
      <!-- 🛒 Cart Modal -->
      <div id="cartModal" class="modal">
        <div class="modal-content">
          <span id="closeCart" class="close">&times;</span>
          <p id="cartMessage"></p>
        </div>
      </div>

      <!-- ❤️ Wishlist Modal -->
      <div id="wishlistModal" class="modal">
        <div class="modal-content">
          <span id="closeWishlist" class="close">&times;</span>
          <p id="wishlistMessage"></p>
        </div>
      </div>

      <!-- ➕ Add Product Modal -->
      <div id="addProductModal" class="modal">
        <div class="modal-content">
          <span class="close" id="closeAddProduct">&times;</span>
          <h2>Add Product</h2>
          <form id="product-form">
            <input type="text" id="product-name" placeholder="Product Name" required />
            <input type="number" id="product-price" placeholder="Price" required />
            <input type="text" id="product-category" placeholder="Category" />
            <button type="submit">Add</button>
          </form>
        </div>
      </div>

      <!-- ✏️ Edit Product Modal -->
      <div id="editProductModal" class="modal">
        <div class="modal-content">
          <span class="close" id="closeEditProduct">&times;</span>
          <h2>Edit Product</h2>
          <form id="edit-form">
            <input type="text" id="edit-name" required />
            <input type="number" id="edit-price" required />
            <input type="text" id="edit-category" />
            <button type="submit">Save Changes</button>
          </form>
        </div>
      </div>

      <!-- 🗑️ Delete Product Modal -->
      <div id="deleteProductModal" class="modal">
        <div class="modal-content">
          <span class="close" id="closeDeleteProduct">&times;</span>
          <h2>Confirm Delete</h2>
          <p>Are you sure you want to delete this product?</p>
          <button id="confirmDelete">Yes, Delete</button>
          <button id="cancelDelete">Cancel</button>
        </div>
      </div>
    `;
  }

  /* ------------------------------
     🔎 Search + History
  ------------------------------ */
  saveSearch(term) {
    term = term.trim().toLowerCase();
    if (!term) return;

    let history = JSON.parse(localStorage.getItem(this.historyKey)) || [];
    history = [term, ...history.filter(h => h !== term)];
    if (history.length > 20) history = history.slice(0, 20);

    localStorage.setItem(this.historyKey, JSON.stringify(history));
  }

  getRecommendations(limit = 5) {
    const history = JSON.parse(localStorage.getItem(this.historyKey)) || [];
    if (!history.length) return [];

    return this.items
      .map(p => ({
        ...p,
        score: history.reduce(
          (s, term) => s + (p.name.toLowerCase().includes(term) ? 1 : 0),
          0
        ),
      }))
      .filter(p => p.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  /* ------------------------------
     🖼️ Rendering
  ------------------------------ */
  renderCard(item, index) {
    return `
      <div class="product-card" data-index="${index}">
        <img src="${item.image}" alt="${item.name}" />
        <div class="product-info">
          <h3>${item.name}</h3>
          <p class="price">Price: ${this.currency} ${item.price}</p>
          ${
            this.role === "buyer"
              ? `
              <button class="cart-btn"><i class="fa-solid fa-cart-plus"></i> Add to Cart</button>
              <button class="wishlist-btn"><i class="fa-solid fa-heart"></i> Save to Wishlist</button>
            `
              : `
              <p class="stock">Stock: ${item.stock} units</p>
              <button class="edit-btn" data-index="${index}"><i class="fa-solid fa-pen"></i> Edit</button>
              <button class="delete-btn" data-index="${index}"><i class="fa-solid fa-trash"></i> Delete</button>
            `
          }
        </div>
      </div>
    `;
  }

  renderRecommendations() {
    const recs = this.getRecommendations();
    if (!recs.length) {
      return `<h3>🔎 Recommended for You</h3><p>No recommendations yet. Start searching products!</p>`;
    }
    return `
      <h3>🔎 Recommended for You</h3>
      <section class="product-list">
        ${recs
          .map(item =>
            this.renderCard(item, this.items.findIndex(p => p.name === item.name))
          )
          .join("")}
      </section>
    `;
  }
  renderTableRow(item, index) {
  return `
    <tr data-index="${index}">
      <td>${item.name}</td>
      <td>${this.currency} ${item.price}</td>
      <td>${item.stock} units</td>
      <td>
        <button class="edit-btn" data-index="${index}"><i class="fa-solid fa-pen"></i> Edit</button>
        <button class="delete-btn" data-index="${index}"><i class="fa-solid fa-trash"></i> Delete</button>
      </td>
    </tr>
  `;
}


  showProducts() {
  let productContent = "";

  if (this.role === "buyer") {
    productContent = `
      <section class="product-list">
        ${this.items.map((item, i) => this.renderCard(item, i)).join("")}
      </section>
    `;
  } else {
    productContent = `
      <table class="product-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${this.items.map((item, i) => this.renderTableRow(item, i)).join("")}
        </tbody>
      </table>
      <!-- Floating Add Product Button -->
      <button id="addProductBtn" class="floating-btn">
        <i class="fa-solid fa-plus"></i>
      </button>
    `;
  }

  return `
    <h2 class="heading">High Demand Products</h2>
    <hr>
    <div class="product-search">
      <input type="text" placeholder="Search products..." />
      <button><i class="fa-solid fa-magnifying-glass"></i></button>
    </div>
    ${productContent}
    ${this.renderModals()}
  `;
}


  /* ------------------------------
     🔍 Search
  ------------------------------ */
  initSearch() {
    const searchInput = document.querySelector(".product-search input");
    const searchButton = document.querySelector(".product-search button");

    if (!searchInput || !searchButton) return;

    const doSearch = () => {
      const query = searchInput.value.toLowerCase();
      this.saveSearch(query);

      document.querySelectorAll(".product-card").forEach(card => {
        const title = card.querySelector("h3").textContent.toLowerCase();
        card.style.display = title.includes(query) ? "flex" : "none";
      });

      const recSection = document.querySelector(".recommended");
      if (recSection) {
        recSection.innerHTML = this.renderRecommendations();
        this.initControls();
      }
    };

    searchInput.addEventListener("input", doSearch);
    searchButton.addEventListener("click", doSearch);
  }

  /* ------------------------------
     🛒 Buyer Controls
  ------------------------------ */
  initBuyerControls() {
    const cartModal = document.getElementById("cartModal");
    const wishlistModal = document.getElementById("wishlistModal");
    const cartMessage = document.getElementById("cartMessage");
    const wishlistMessage = document.getElementById("wishlistMessage");
    const closeCart = document.getElementById("closeCart");
    const closeWishlist = document.getElementById("closeWishlist");

    document.querySelectorAll(".cart-btn").forEach((btn) => {
      btn.onclick = () => {
        const index = btn.closest(".product-card").dataset.index;
        const product = this.items[index];
        if (this.cart) this.cart.addItem(product);
        if (cartMessage) cartMessage.innerText = `${product.name} added to cart ✅`;
        if (cartModal) cartModal.style.display = "flex";
      };
    });

    document.querySelectorAll(".wishlist-btn").forEach((btn) => {
      btn.onclick = () => {
        const index = btn.closest(".product-card").dataset.index;
        const product = this.items[index];
        if (this.wishlist) this.wishlist.addItem(product);
        if (wishlistMessage) wishlistMessage.innerText = `${product.name} saved ❤️`;
        if (wishlistModal) wishlistModal.style.display = "flex";
      };
    });

    if (closeCart && cartModal) closeCart.onclick = () => (cartModal.style.display = "none");
    if (closeWishlist && wishlistModal) closeWishlist.onclick = () => (wishlistModal.style.display = "none");
  }

  /* ------------------------------
     🏪 Seller Controls
  ------------------------------ */
  initSellerControls() {
    const addBtn = document.getElementById("addProductBtn");
    const addModal = document.getElementById("addProductModal");
    const closeAdd = document.getElementById("closeAddProduct");

    if (addBtn) {
      addBtn.onclick = () => (addModal.style.display = "flex");
    }
    if (closeAdd) {
      closeAdd.onclick = () => (addModal.style.display = "none");
    }

    const form = document.getElementById("product-form");
    if (form) {
      form.onsubmit = (e) => {
        e.preventDefault();
        const nameInput = document.getElementById("product-name");
        const priceInput = document.getElementById("product-price");
        const categoryInput = document.getElementById("product-category");

        this.items.push({
          name: nameInput.value,
          price: parseFloat(priceInput.value),
          category: categoryInput?.value || "Uncategorized",
          stock: 10,
          image: "pic.jpg"
        });

        form.reset();
        addModal.style.display = "none";
        this.onChange?.();
      };
    }

    // edit buttons
    document.querySelectorAll(".edit-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const index = btn.dataset.index;
        const product = this.items[index];
        document.getElementById("edit-name").value = product.name;
        document.getElementById("edit-price").value = product.price;
        document.getElementById("edit-category").value = product.category || "";
        const modal = document.getElementById("editProductModal");
        modal.style.display = "flex";

        document.getElementById("edit-form").onsubmit = (e) => {
          e.preventDefault();
          product.name = document.getElementById("edit-name").value;
          product.price = parseFloat(document.getElementById("edit-price").value);
          product.category = document.getElementById("edit-category").value;
          modal.style.display = "none";
          this.onChange?.();
        };
      });
    });

    // delete buttons
    document.querySelectorAll(".delete-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const index = btn.dataset.index;
        const modal = document.getElementById("deleteProductModal");
        modal.style.display = "flex";
        document.getElementById("confirmDelete").onclick = () => {
          this.items.splice(index, 1);
          modal.style.display = "none";
          this.onChange?.();
        };
        document.getElementById("cancelDelete").onclick = () => {
          modal.style.display = "none";
        };
      });
    });
  }

  /* ------------------------------
     🚀 Init
  ------------------------------ */
  initControls() {
    if (this.role === "buyer") {
      this.initBuyerControls();
    } else {
      this.initSellerControls();
    }
  }

  productControls() {
    this.initSearch();
    this.initControls();
  }
}
