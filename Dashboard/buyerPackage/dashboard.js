import { Products } from "../productsPackage/products.js";
import { userData } from "../common/controls/control.js";   
import { Cart } from "../productsPackage/cart.js";
import { Wishlist } from "../productsPackage/wishlist.js";
import { ManageOrders } from "../productsPackage/manageOrders.js";
import { Payment } from "../paymentPackage/payment.js"; 
import { changeCurrency } from "../paymentPackage/managePayments.js";

// --- Shared instances (singleton style) ---
export const orders = new ManageOrders();
export const cart = new Cart(orders);
export const wishlist = new Wishlist(cart);

export class BuyerDashboard {
  constructor(cart, wishlist, orders) {
    this.cart = cart;
    this.wishlist = wishlist;
    this.orders = orders;
    this.currency = changeCurrency();

    const { role } = new userData().loginData();
    this.products = new Products(role, this.cart, this.wishlist);

    // count available payment methods from Payment class
    this.availablePaymentmethods = new Payment(this.orders).paymentMethods.length;
  }

  getMetrics() {
    const cartItems = this.cart?.items || [];
    const wishlistItems = this.wishlist?.items || [];
    const orderItems = this.orders?.orders || [];
    const cartTotal = this.cart?.getTotal ? this.cart.getTotal() : 0;

    return [
      { icon: "fa-solid fa-shopping-cart fa-2x", title: "Cart", info: `${cartItems.length} items (${this.currency} ${cartTotal})` },
      { icon: "fa-solid fa-box fa-2x", title: "Orders", info: `${orderItems.length} placed` },
      { icon: "fa-solid fa-heart fa-2x", title: "Wish List", info: `${wishlistItems.length} saved` },
      { icon: "fa-solid fa-credit-card fa-2x", title: "Payments", info: `${this.availablePaymentmethods || 0} methods` }
    ];
  }

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

    // recommendations will render dynamically
    text += this.products.renderRecommendations();

    return text;
  }

  attachControls() {
    // ✅ Attach controls AFTER DOM exists
    this.products.productControls();
  }

  refreshMetrics() {
    const cards = document.querySelectorAll(".metrics .card p");
    const metrics = this.getMetrics();
    cards.forEach((card, i) => {
      card.textContent = metrics[i].info;
    });
  }
}
