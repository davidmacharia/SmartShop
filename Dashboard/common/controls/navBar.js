import { SellerDashboard } from "../../sellerPackage/scripts/dashboard.js";   
import { Products } from "../../productsPackage/products.js";
import { cart, wishlist, orders, BuyerDashboard } from "../../buyerPackage/dashboard.js"; // ✅ use singletons
import { Affiliate } from "../../sellerPackage/scripts/manageAffiliate.js";
import { Orders } from "../../sellerPackage/scripts/orders.js";
import { Promotions } from "../../sellerPackage/scripts/promotions.js";
import { Earnings } from "../../sellerPackage/scripts/earnings.js";
import { Profile } from "../scripts/profile.js"; 
import { Payment } from "../../paymentPackage/payment.js";    

class Main {
  static initApp(navBar) {
    const name = new URLSearchParams(window.location.search).get("username");
    const role = new URLSearchParams(window.location.search).get("role");

    document.getElementById("Welcomemessage").innerHTML =
      "Welcome " + (name ?? "Guest") + "<br>  " + role;

  const nav = document.querySelector(navBar);
  nav.style.height = document.documentElement.scrollHeight + "px";

    let list = [];
    switch (role) {
      case "buyer":
        list = [
          { text: "Home", icon: "fa-house" },
          { text: "Marketplace", icon: "fa-boxes-stacked" },
          { text: "Cart", icon: "fa-shopping-cart" },
          { text: "Orders", icon: "fa-box" },
          { text: "Wish List", icon: "fa-heart" },
          { text: "Payments", icon: "fa-credit-card" },
          { text: "Profile", icon: "fa-user" }
        ];
        break;
      case "affiliate":
        list = [
          { text: "Home", icon: "fa-house" },
          { text: "Select Products", icon: "fa-hand-pointer" },
          { text: "Manage shop", icon: "fa-store" },
          { text: "Track Commission", icon: "fa-chart-line" },
          { text: "Social Sharing", icon: "fa-share-nodes" },
          { text: "Profile", icon: "fa-user" }
        ];
        break;
      case "seller":
        list = [
          { text: "Home", icon: "fa-house" },
          { text: "Manage Products", icon: "fa-boxes-stacked" },
          { text: "Affiliate Settings", icon: "fa-users" },
          { text: "Track Orders", icon: "fa-truck" },
          { text: "Earnings & Payouts", icon: "fa-sack-dollar" },
          { text: "Promotion Campaigns", icon: "fa-bullhorn" },
          { text: "Profile", icon: "fa-user" }
        ];
        break;
      case "admin":
        list = [
          { text: "Home", icon: "fa-house" },
          { text: "Manage Users", icon: "fa-users" },
          { text: "Product moderation", icon: "fa-clipboard-check" },
          { text: "Order Oversight", icon: "fa-truck-ramp-box" },
          { text: "Commission Control", icon: "fa-scale-balanced" },
          { text: "Analytics", icon: "fa-chart-pie" },
          { text: "System Management", icon: "fa-gears" },
          { text: "Profile", icon: "fa-user" }
        ];
        break;
    }

    nav.innerHTML += "";

    let products, buyerDashboard;
    if (role === "buyer") {
      products = new Products(role, cart, wishlist);
      buyerDashboard = new BuyerDashboard(cart, wishlist, orders);

      cart.onChange = () => buyerDashboard.refreshMetrics();
      wishlist.onChange = () => buyerDashboard.refreshMetrics();
      orders.onChange = () => buyerDashboard.refreshMetrics();
    } else {
      products = new Products(role);
    }

    // Build nav buttons
    list.forEach((item, index) => {
      const button = document.createElement("button");
      button.innerHTML = `<i class="fa-solid ${item.icon}"></i> ${item.text}`;
      if (index === 0) button.classList.add("active");
      nav.appendChild(button);

      button.addEventListener("click", async () => {
        nav.querySelectorAll("button").forEach(b => b.classList.remove("active"));
        button.classList.add("active");

        switch (role) {
          case "seller":
            switch (item.text) {
              case "Home":
                document.querySelector(".dashboard-main").innerHTML =
                  new SellerDashboard().initSellerDashboard();
                products.productControls();
                break;
              case "Manage Products":
                document.querySelector(".dashboard-main").innerHTML =
                  products.showProducts();
                products.productControls();
                break;
              case "Affiliate Settings":
                document.querySelector(".dashboard-main").innerHTML =
                  new Affiliate().render();
                break;
              case "Track Orders":
                document.querySelector(".dashboard-main").innerHTML =
                  new Orders().render();
                break;
              case "Promotion Campaigns":
                document.querySelector(".dashboard-main").innerHTML =
                  new Promotions().render();
                break;
              case "Earnings & Payouts":
                document.querySelector(".dashboard-main").innerHTML =
                  new Earnings().render();
                break;
              case "Profile":
                document.querySelector(".dashboard-main").innerHTML =
                  new Profile().render();
                break;
            }
            break;

          case "buyer":
            switch (item.text) {
              case "Home":
                document.querySelector(".dashboard-main").innerHTML =
                  buyerDashboard.initBuyerDashboard();
                products.productControls();
                break;
                case "Marketplace":
                document.querySelector(".dashboard-main").innerHTML =
                  products.showProducts();
                products.productControls();
                break;
              case "Cart":
                document.querySelector(".dashboard-main").innerHTML =
                  cart.renderCart();
                cart.initControls();
                break;
              case "Orders":
                document.querySelector(".dashboard-main").innerHTML =
                  orders.renderOrders();
                break;
              case "Wish List":
                document.querySelector(".dashboard-main").innerHTML =
                  wishlist.renderWishlist();
                wishlist.initControls();
                break;
              case "Payments":
                const payment = new Payment(cart, orders, ["M-Pesa", "Visa", "PayPal"]);
                document.querySelector(".dashboard-main").innerHTML =
                  payment.renderPaymentPage();
                payment.initControls();
                break;
              case "Profile":
                document.querySelector(".dashboard-main").innerHTML =
                  new Profile().render();
                break;
            }
            break;

          case "affiliate":
            switch (item.text) {
              case "Home":
                document.querySelector(".dashboard-main").innerHTML = "<h2>Affiliate Home</h2>";
                break;
              case "Select Products":
                document.querySelector(".dashboard-main").innerHTML = "<h2>Select Products</h2>";
                break;
              case "Manage shop":
                document.querySelector(".dashboard-main").innerHTML = "<h2>Manage Shop</h2>";
                break;
              case "Track Commission":
                document.querySelector(".dashboard-main").innerHTML = "<h2>Track Commission</h2>";
                break;
              case "Social Sharing":
                document.querySelector(".dashboard-main").innerHTML = "<h2>Social Sharing</h2>";
                break;
              case "Profile":
                document.querySelector(".dashboard-main").innerHTML = new Profile().render();
                break;
            }
            break;

          case "admin":
            switch (item.text) {
              case "Home":
                document.querySelector(".dashboard-main").innerHTML = "<h2>Admin Home</h2>";
                break;
              case "Manage Users":
                document.querySelector(".dashboard-main").innerHTML = "<h2>Manage Users</h2>";
                break;
              case "Product moderation":
                document.querySelector(".dashboard-main").innerHTML = "<h2>Product Moderation</h2>";
                break;
              case "Order Oversight":
                document.querySelector(".dashboard-main").innerHTML = "<h2>Order Oversight</h2>";
                break;
              case "Commission Control":
                document.querySelector(".dashboard-main").innerHTML = "<h2>Commission Control</h2>";
                break;
              case "Analytics":
                document.querySelector(".dashboard-main").innerHTML = "<h2>Analytics</h2>";
                break;
              case "System Management":
                document.querySelector(".dashboard-main").innerHTML = "<h2>System Management</h2>";
                break;
              case "Profile":
                document.querySelector(".dashboard-main").innerHTML = new Profile().render();
                break;
            }
            break;
        }
      });
    });

    // Auto-load the first dashboard (Home)
    const firstButton = nav.querySelector("button");
    if (firstButton) firstButton.click();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  Main.initApp("nav");
});
