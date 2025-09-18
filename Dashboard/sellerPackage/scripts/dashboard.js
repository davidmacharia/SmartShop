import { Products } from "../../productsPackage/products.js";

export const SellerDashboard = class {
  constructor() {
    this.products = new Products("seller");

    // hook into Products change events
    this.products.onChange = () => this.renderToDashboard();
  }

  getMetrics() {
    return [
      {
        icon: "fa-solid fa-box-open fa-2x",
        title: "Products",
        info: `${this.products.items.length} listed`
      },
      {
        icon: "fa-solid fa-receipt fa-2x",
        title: "Orders",
        info: "5 pending"
      },
      {
        icon: "fa-solid fa-dollar-sign fa-2x",
        title: "Revenue",
        info: "$1,250"
      }
    ];
  }

  render() {
    let text = `
      <h3>Overview Metrics</h3>
      <hr class="ruler" width="100%">
      <section class="metrics">`;

    this.getMetrics().forEach(item => {
      text += `
        <div class="card">
          <i class="${item.icon}"></i>
          <h2>${item.title}</h2>
          <p>${item.info}</p>
        </div>`;
    });

    text += `</section>`;
    text += this.products.showProducts();
    return text;
  }

  renderToDashboard() {
    const container = document.querySelector(".dashboard-main");
    if (container) {
      container.innerHTML = this.render();
      this.products.productControls();
    }
  }

  initSellerDashboard() {
    return this.render();
  }
};
