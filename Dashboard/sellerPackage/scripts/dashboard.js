import { Products } from "../../productsPackage/products.js";

export const SellerDashboard = class {
  constructor() {
    this.items = [
      { icon: "fa-solid fa-box-open fa-2x", title: "Products", info: "18 listed" },
      { icon: "fa-solid fa-receipt fa-2x", title: "Orders", info: "5 pending" },
      { icon: "fa-solid fa-dollar-sign fa-2x", title: "Revenue", info: "$1,250" }
    ];

    // keep reference to products instance
    this.products = new Products();
  }

  initSellerDashboard() {
    this.products.initSearch();
    this.products.initControls();
    let text = `
      <h3>Overview Metrics</h3>
      <hr class="ruler" width="100%">
      <section class="metrics">`;

    // Add metric cards
    this.items.forEach(item => {
      text += `
        <div class="card">
          <i class="${item.icon}"></i>
          <h2>${item.title}</h2>
          <p>${item.info}</p>
        </div>`;
    });

    // ✅ Close metrics section before adding products
    text += `</section>`;

    // Insert product section
    const productsHTML = this.products.showProducts();

    text += `
      ${productsHTML}
    `;

    return text;
  }
}

