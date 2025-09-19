import { changeCurrency } from "../paymentPackage/managePayments.js";
export class Products {
  constructor(role, cart = null, wishlist = null) {
    this.items = [
      { name: "Smart Watch", price: 65, stock: 32, image: "pic.jpg" },
      { name: "Wireless Earbuds", price: 45, stock: 77, image: "pic.jpg" },
      { name: "Bluetooth Speaker", price: 80, stock: 20, image: "pic.jpg" },
    ];
    this.currentProduct = null;
    this.role = role;
    this.currency = changeCurrency();
    // Shared cart & wishlist (buyer only)
    this.cart = cart;
    this.wishlist = wishlist;
  }

  showProducts() {
    let text = `
      <h2 class="heading">High Demand Products</h2>
      <hr width="100%">

      <!-- Search bar -->
      <div class="product-search">
        <input type="text" placeholder="Search products..." />
        <button><i class="fa-solid fa-magnifying-glass"></i></button>
      </div>

      <section class="product-list">`;

    this.items.forEach((item, index) => {
      text += `
        <div class="product-card" data-index="${index}">
          <img src="${item.image}" alt="${item.name}" />
          <div class="product-info">
            <h3> ${item.name}</h3>
            <p class="price">Price: ${this.currency} ${item.price}</p>
      `;

      if (this.role === "buyer") {
        text += `
            <button class="cart-btn"><i class="fa-solid fa-cart-plus"></i> Add to Cart</button>
            <button class="wishlist-btn"><i class="fa-solid fa-heart"></i> Save to Wishlist</button>
        `;
      } else {
        text += `
            <p class="stock">Stock: ${item.stock} units</p>
            <button class="edit-btn"><i class="fa-solid fa-pen"></i> Edit</button>
            <button class="delete-btn"><i class="fa-solid fa-trash"></i> Delete</button>
        `;
      }

      text += `
          </div>
        </div>`;
    });

    text += `</section>`;

    // Buyer Modals
    if (this.role === "buyer") {
      text += `
        <!-- 🛒 Add to Cart Modal -->
        <div id="cartModal" class="modal">
          <div class="modal-content cart-content">
            <h2>Added to Cart</h2>
            <p id="cartMessage"></p>
            <div class="actions">
              <button id="closeCart" class="confirm">OK</button>
            </div>
          </div>
        </div>

        <!-- ❤️ Wishlist Modal -->
        <div id="wishlistModal" class="modal">
          <div class="modal-content wishlist-content">
            <h2>Saved to Wishlist</h2>
            <p id="wishlistMessage"></p>
            <div class="actions">
              <button id="closeWishlist" class="confirm">OK</button>
            </div>
          </div>
        </div>
      `;
    } else {
      // Seller Modals
      text += `
        <!-- ✏️ Edit Product Modal -->
        <div id="editProductModal" class="modal">
          <div class="modal-content">
            <h2>Edit Product</h2>
            <form id="editProductForm">
              <label>Name:</label>
              <input type="text" id="editName" required />
              
              <label>Price:</label>
              <input type="number" id="editPrice" required />
              
              <label>Stock:</label>
              <input type="number" id="editStock" required />

              <label>Image URL:</label>
              <input type="text" id="editImage" />

              <div class="actions">
                <button type="submit" class="confirm">Save</button>
                <button type="button" id="cancelEdit">Cancel</button>
              </div>
            </form>
          </div>
        </div>

        <!-- 🗑️ Delete Confirmation Modal -->
        <div id="deleteProductModal" class="modal">
          <div class="modal-content">
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to delete this product?</p>
            <div class="actions">
              <button id="confirmDelete" class="confirm">Yes, Delete</button>
              <button id="cancelDelete">Cancel</button>
            </div>
          </div>
        </div>
      `;
    }

    return text;
  }

  initSearch() {
    const searchInput = document.querySelector(".product-search input");
    const searchButton = document.querySelector(".product-search button");

    function searchProducts() {
      const query = searchInput.value.toLowerCase();
      document.querySelectorAll(".product-card").forEach((card) => {
        const title = card.querySelector("h3").textContent.toLowerCase();
        card.style.display = title.includes(query) ? "flex" : "none";
      });
    }

    searchInput.addEventListener("input", searchProducts);
    searchButton.addEventListener("click", searchProducts);
  }

  initControls() {
    if (this.role === "buyer") {
      // Buyer modals logic (unchanged)
      const cartModal = document.getElementById("cartModal");
      const wishlistModal = document.getElementById("wishlistModal");
      const cartMessage = document.getElementById("cartMessage");
      const wishlistMessage = document.getElementById("wishlistMessage");

      const closeCart = document.getElementById("closeCart");
      const closeWishlist = document.getElementById("closeWishlist");

      document.querySelectorAll(".cart-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          const card = btn.closest(".product-card");
          const index = parseInt(card.dataset.index);
          const product = this.items[index];

          if (this.cart) this.cart.addItem(product);
          cartMessage.innerText = `${product.name} has been added to your cart ✅`;
          cartModal.style.display = "flex";
        });
      });

      document.querySelectorAll(".wishlist-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          const card = btn.closest(".product-card");
          const index = parseInt(card.dataset.index);
          const product = this.items[index];

          if (this.wishlist) this.wishlist.addItem(product);
          wishlistMessage.innerText = `${product.name} has been saved to your wishlist ❤️`;
          wishlistModal.style.display = "flex";
        });
      });

      closeCart.addEventListener("click", () => (cartModal.style.display = "none"));
      closeWishlist.addEventListener("click", () => (wishlistModal.style.display = "none"));

      window.addEventListener("click", (e) => {
        if (e.target === cartModal) cartModal.style.display = "none";
        if (e.target === wishlistModal) wishlistModal.style.display = "none";
      });
    } else {
      // Seller modals logic
      const editModal = document.getElementById("editProductModal");
      const deleteModal = document.getElementById("deleteProductModal");

      let currentIndex = null;

      // --- EDIT ---
      document.querySelectorAll(".edit-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          const card = btn.closest(".product-card");
          currentIndex = parseInt(card.dataset.index);
          const product = this.items[currentIndex];

          document.getElementById("editName").value = product.name;
          document.getElementById("editPrice").value = product.price;
          document.getElementById("editStock").value = product.stock;
          document.getElementById("editImage").value = product.image;

          editModal.style.display = "flex";
        });
      });

      document.getElementById("editProductForm").addEventListener("submit", (e) => {
        e.preventDefault();
        this.items[currentIndex] = {
          name: document.getElementById("editName").value,
          price: parseFloat(document.getElementById("editPrice").value),
          stock: parseInt(document.getElementById("editStock").value),
          image: document.getElementById("editImage").value || "pic.jpg",
        };

        editModal.style.display = "none";
        document.querySelector(".dashboard-main").innerHTML = this.showProducts();
        this.productControls();
      });

      document.getElementById("cancelEdit").addEventListener("click", () => {
        editModal.style.display = "none";
      });

      // --- DELETE ---
      document.querySelectorAll(".delete-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          const card = btn.closest(".product-card");
          currentIndex = parseInt(card.dataset.index);
          deleteModal.style.display = "flex";
        });
      });

      document.getElementById("confirmDelete").addEventListener("click", () => {
  this.items.splice(currentIndex, 1);
  deleteModal.style.display = "none";

  // 🔥 Let SellerDashboard refresh metrics + products
  if (this.onChange) {
    this.onChange();
  } else {
    alert("failed");
    // fallback if no dashboard is linked
    document.querySelector(".dashboard-main").innerHTML = this.showProducts();
    this.productControls();
  }
});


      document.getElementById("cancelDelete").addEventListener("click", () => {
        deleteModal.style.display = "none";
      });

      window.addEventListener("click", (e) => {
        if (e.target === editModal) editModal.style.display = "none";
        if (e.target === deleteModal) deleteModal.style.display = "none";
      });
    }
  }

  productControls() {
    this.initSearch();
    this.initControls();
  }
}
