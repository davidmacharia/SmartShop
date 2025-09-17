import { Products } from "../productsPackage/products.js";
import { userData } from "../common/controls/control.js";   
export const BuyerDashboard = class {
  constructor() {
    this.items = [
      { icon: "fa-solid fa-shopping-cart fa-2x", title: "Cart", info: "3 items" },
      { icon: "fa-solid fa-box fa-2x", title: "Orders", info: "5 delivered" },
      { icon: "fa-solid fa-heart fa-2x", title: "Wish List", info: "8 saved" },
      { icon: "fa-solid fa-credit-card fa-2x", title: "Payments", info: "2 methods" }
    ];

    // keep reference to products instance
    const { role } = new userData().loginData();
    this.products = new Products(role);
  }

  initBuyerDashboard() {
    let text = `
      <h3>Buyer Overview</h3>
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

    // Insert recommended products section
    const productsHTML = this.products.showProducts();

    text += `
      ${productsHTML}
    `;

    return text;
  }
};

const dashboard = new BuyerDashboard();
const elements = dashboard.initBuyerDashboard();

document.addEventListener("DOMContentLoaded", () => {
  document.querySelector(".dashboard-main").innerHTML = elements;

  // enable controls for product cards (edit/delete/search)
  dashboard.products.productControls();
  
});
