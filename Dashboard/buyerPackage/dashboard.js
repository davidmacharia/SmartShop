// dashboard.js
import { Products } from "../productsPackage/products.js";
import { userData } from "../common/controls/control.js";   
import { Cart } from "../productsPackage/cart.js";
import { Wishlist } from "../productsPackage/wishlist.js";
import { ManageOrders } from "../productsPackage/manageOrders.js";
import { Payment } from "../paymentPackage/payment.js"; 

export class BuyerDashboard {
  constructor(cart, wishlist, orders) {
    // shared data stores
    this.cart = cart;
    this.wishlist = wishlist;
    this.orders = orders;

    const { role } = new userData().loginData();
    this.products = new Products(role, this.cart, this.wishlist);

    // use shared orders when checking payment methods
    this.availablePaymentmethods = new Payment(this.orders).paymentMethods.length;
  }

  // ✅ dynamic stats
  getMetrics() {
  const cartItems = this.cart?.items || [];
  const wishlistItems = this.wishlist?.items || [];
  const orderItems = this.orders?.orders || [];
  const cartTotal = this.cart?.getTotal ? this.cart.getTotal() : 0;

  return [
    { 
      icon: "fa-solid fa-shopping-cart fa-2x", 
      title: "Cart", 
      info: `${cartItems.length} items ($${cartTotal})` 
    },
    { 
      icon: "fa-solid fa-box fa-2x", 
      title: "Orders", 
      info: `${orderItems.length} placed` 
    },
    { 
      icon: "fa-solid fa-heart fa-2x", 
      title: "Wish List", 
      info: `${wishlistItems.length} saved` 
    },
    { 
      icon: "fa-solid fa-credit-card fa-2x", 
      title: "Payments", 
      info: `${this.availablePaymentmethods || 0} methods` 
    }
  ];
}

  // render metrics + products
  initBuyerDashboard() {
    let text = `
      <h3>Buyer Overview</h3>
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

  // ✅ refresh metrics dynamically
  refreshMetrics() {
    const cards = document.querySelectorAll(".metrics .card p");
    const metrics = this.getMetrics();
    cards.forEach((card, i) => {
      card.textContent = metrics[i].info;
    });
  }
}

// --- Shared instances (singleton style) ---
export const cart = new Cart();
export const wishlist = new Wishlist();
export const orders = new ManageOrders();

// initialize dashboard with shared instances
const dashboard = new BuyerDashboard(cart, wishlist, orders);

document.addEventListener("DOMContentLoaded", () => {
  document.querySelector(".dashboard-main").innerHTML = dashboard.initBuyerDashboard();

  // enable product controls (buyer actions)
  dashboard.products.productControls();

  // hook into changes (update dashboard automatically)
  cart.onChange = () => dashboard.refreshMetrics();
  wishlist.onChange = () => dashboard.refreshMetrics();
  orders.onChange = () => dashboard.refreshMetrics();
});
