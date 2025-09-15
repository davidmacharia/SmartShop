document.addEventListener("DOMContentLoaded", () => {
  const editModal = document.getElementById("editModal");
  const closeEdit = document.querySelector(".close-edit");
  const editForm = document.getElementById("editForm");
  const searchInput = document.querySelector(".product-search input");
  const searchButton = document.querySelector(".product-search button");
  const closeSidebarBtn = document.querySelector(".close");
  const sidebar = document.querySelector("nav");
  const dashboardMain = document.querySelector(".dashboard-main");

  let currentProduct = null;

  // 🔎 SEARCH PRODUCTS
  function searchProducts() {
    const query = searchInput.value.toLowerCase();
    document.querySelectorAll(".product-card").forEach(card => {
      const title = card.querySelector("h3").textContent.toLowerCase();
      card.style.display = title.includes(query) ? "flex" : "none";
    });
  }
  searchInput.addEventListener("input", searchProducts);
  searchButton.addEventListener("click", searchProducts);

  // 🖊️ EDIT PRODUCT (open modal)
  document.querySelectorAll(".product-info button:first-child").forEach(btn => {
    btn.addEventListener("click", () => {
      currentProduct = btn.closest(".product-card");

      // Fill modal with existing product data
      document.getElementById("editName").value = currentProduct.querySelector("h3").innerText;
      document.getElementById("editPrice").value = currentProduct.querySelector("p:nth-of-type(1)").innerText.replace("Price: $", "");
      document.getElementById("editStock").value = currentProduct.querySelector("p:nth-of-type(2)").innerText.replace("Stock: ", "").replace(" units", "");
      document.getElementById("editImage").value = currentProduct.querySelector("img").src;

      editModal.style.display = "flex";
    });
  });

  // 💾 SAVE CHANGES
  editForm.addEventListener("submit", (e) => {
    e.preventDefault();

    currentProduct.querySelector("h3").innerText = document.getElementById("editName").value;
    currentProduct.querySelector("p:nth-of-type(1)").innerText = "Price: $" + document.getElementById("editPrice").value;
    currentProduct.querySelector("p:nth-of-type(2)").innerText = "Stock: " + document.getElementById("editStock").value + " units";
    currentProduct.querySelector("img").src = document.getElementById("editImage").value;

    editModal.style.display = "none";
    updateMetrics();
  });

  // ❌ CLOSE EDIT MODAL
  closeEdit.addEventListener("click", () => editModal.style.display = "none");
  window.addEventListener("click", (e) => {
    if (e.target === editModal) editModal.style.display = "none";
  });

  // 🗑️ DELETE PRODUCT
  document.querySelectorAll(".product-info button:last-child").forEach(button => {
    button.addEventListener("click", (e) => {
      const productCard = e.target.closest(".product-card");
      if (confirm("Are you sure you want to delete this product?")) {
        productCard.remove();
        updateMetrics();
      }
    });
  });

  // 📌 TOGGLE SIDEBAR
  closeSidebarBtn.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");

    if (sidebar.classList.contains("collapsed")) {
     document.querySelector(".dashboard-header .card ").style.display = "none";
      dashboardMain.style.left = "50px";
      closeSidebarBtn.style.left = "0px";
      closeSidebarBtn.innerHTML = "&#9776";
      sidebar.style.width = "45px"; 
      sidebar.style.overflow = "hidden";
      sidebar.style.top = "11vh";
    } else {
      dashboardMain.style.left = "300px";
       sidebar.style.width = "300px";
       document.querySelector(".dashboard-header .card ").style.display = "";
      dashboardMain.style.left = "";
      closeSidebarBtn.style.left = "";
      closeSidebarBtn.innerHTML = "X";
      sidebar.style.width = ""; 
      sidebar.style.overflow = "";
      sidebar.style.top = "";  // default
    }
  });

  // 📊 UPDATE METRICS
  function updateMetrics() {
    const totalProducts = document.querySelectorAll(".product-card").length;
    document.querySelector(".metrics .card:nth-child(1) p").textContent = totalProducts + " listed";
  }

  // Initialize counts
  updateMetrics();
});
