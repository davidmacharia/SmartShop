
export class Products {
  constructor(role   ,cart = null, wishlist = null) {
    this.items = [
      { name: "Smart Watch", price: 65, stock: 32, image: "pic.jpg" },
      { name: "Wireless Earbuds", price: 45, stock: 77, image: "pic.jpg" },
      { name: "Bluetooth Speaker", price: 80, stock: 20, image: "pic.jpg" }
    ];
    this.currentProduct = null;
    this.role = role;

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
            <h3>${item.name}</h3>
            <p class="price">Price: $${item.price}</p>
            <p class="stock">Stock: ${item.stock} units</p>
      `;

      if (this.role === "buyer") {
        text += `
            <button class="cart-btn"><i class="fa-solid fa-cart-plus"></i> Add to Cart</button>
            <button class="wishlist-btn"><i class="fa-solid fa-heart"></i> Save to Wishlist</button>
        `;
      } else {
        text += `
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
        <!-- 🖊️ Edit Modal -->
        <div id="editModal" class="modal">
          <div class="modal-content">
            <span class="close-edit">&times;</span>
            <h2>Edit Product</h2>
            <form id="editForm">
              <label>Name:</label>
              <input type="text" id="editName" required>

              <label>Price:</label>
              <input type="number" id="editPrice" required>

              <label>Stock:</label>
              <input type="number" id="editStock" required>

              <label>Image URL:</label>
              <input type="text" id="editImage">

              <button type="submit">Save Changes</button>
            </form>
          </div>
        </div>

        <!-- 🗑️ Delete Modal -->
        <div id="deleteModal" class="modal">
          <div class="modal-content delete-content">
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to delete this product?</p>
            <div class="actions">
              <button id="confirmDelete" class="confirm">Yes, Delete</button>
              <button id="cancelDelete" class="cancel">Cancel</button>
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
      document.querySelectorAll(".product-card").forEach(card => {
        const title = card.querySelector("h3").textContent.toLowerCase();
        card.style.display = title.includes(query) ? "flex" : "none";
      });
    }

    searchInput.addEventListener("input", searchProducts);
    searchButton.addEventListener("click", searchProducts);
  }

  initControls() {
    if (this.role === "buyer") {
      const cartModal = document.getElementById("cartModal");
      const wishlistModal = document.getElementById("wishlistModal");
      const cartMessage = document.getElementById("cartMessage");
      const wishlistMessage = document.getElementById("wishlistMessage");

      const closeCart = document.getElementById("closeCart");
      const closeWishlist = document.getElementById("closeWishlist");

      // --- CART BUTTONS ---
      document.querySelectorAll(".cart-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          const card = btn.closest(".product-card");
          const index = parseInt(card.dataset.index);
          const product = this.items[index];

          // update cart
          if (this.cart) this.cart.addItem(product);

          // show modal
          cartMessage.innerText = `${product.name} has been added to your cart ✅`;
          cartModal.style.display = "flex";
        });
      });

      // --- WISHLIST BUTTONS ---
      document.querySelectorAll(".wishlist-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          const card = btn.closest(".product-card");
          const index = parseInt(card.dataset.index);
          const product = this.items[index];

          // update wishlist
          if (this.wishlist) this.wishlist.addItem(product);

          // show modal
          wishlistMessage.innerText = `${product.name} has been saved to your wishlist ❤️`;
          wishlistModal.style.display = "flex";
        });
      });

      // Close modals
      closeCart.addEventListener("click", () => (cartModal.style.display = "none"));
      closeWishlist.addEventListener("click", () => (wishlistModal.style.display = "none"));

      window.addEventListener("click", (e) => {
        if (e.target === cartModal) cartModal.style.display = "none";
        if (e.target === wishlistModal) wishlistModal.style.display = "none";
      });

      return;
    }

    // --- SELLER CONTROLS ---
    const editModal = document.getElementById("editModal");
    const deleteModal = document.getElementById("deleteModal");
    const closeEdit = document.querySelector(".close-edit");
    const editForm = document.getElementById("editForm");
    const confirmDeleteBtn = document.getElementById("confirmDelete");
    const cancelDeleteBtn = document.getElementById("cancelDelete");

    document.querySelectorAll(".edit-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        this.currentProduct = btn.closest(".product-card");

        document.getElementById("editName").value =
          this.currentProduct.querySelector("h3").innerText;
        document.getElementById("editPrice").value =
          this.currentProduct.querySelector(".price").innerText.replace("Price: $", "");
        document.getElementById("editStock").value =
          this.currentProduct.querySelector(".stock").innerText
            .replace("Stock: ", "")
            .replace(" units", "");
        document.getElementById("editImage").value =
          this.currentProduct.querySelector("img").src;

        editModal.style.display = "flex";
      });
    });

    editForm.addEventListener("submit", (e) => {
      e.preventDefault();
      this.currentProduct.querySelector("h3").innerText =
        document.getElementById("editName").value;
      this.currentProduct.querySelector(".price").innerText =
        "Price: $" + document.getElementById("editPrice").value;
      this.currentProduct.querySelector(".stock").innerText =
        "Stock: " + document.getElementById("editStock").value + " units";
      this.currentProduct.querySelector("img").src =
        document.getElementById("editImage").value;

      editModal.style.display = "none";
    });

    closeEdit.addEventListener("click", () => (editModal.style.display = "none"));
    window.addEventListener("click", (e) => {
      if (e.target === editModal) editModal.style.display = "none";
      if (e.target === deleteModal) deleteModal.style.display = "none";
    });

    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        this.currentProduct = btn.closest(".product-card");
        deleteModal.style.display = "flex";
      });
    });

    confirmDeleteBtn.addEventListener("click", () => {
      if (this.currentProduct) {
        this.currentProduct.remove();
        this.currentProduct = null;
      }
      deleteModal.style.display = "none";
    });

    cancelDeleteBtn.addEventListener("click", () => {
      deleteModal.style.display = "none";
    });
  }

  productControls() {
    this.initSearch();
    this.initControls();
  }
}
