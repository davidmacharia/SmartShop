class Main {
  static initApp(navBar,) {
    const nav = document.querySelector(navBar);
    let role = "admin"; // 🚨 later replace with URLSearchParams.get("role")
    const params = new URLSearchParams(window.location.search);
    const username = params.get("username") || "User";
    document.getElementById("Welcomemessage").innerText = `Welcome ${username}`;
    // ✅ Define menu items + icons per role
    const roleMenus = {
      buyer: [
        { label: "Home", icon: "fa-house" },
        { label: "Cart", icon: "fa-shopping-cart" },
        { label: "Orders", icon: "fa-receipt" },
        { label: "Wish List", icon: "fa-heart" },
        { label: "Payments", icon: "fa-credit-card" },
        { label: "Profile", icon: "fa-user" }
      ],
      affiliate: [
        { label: "Home", icon: "fa-house" },
        { label: "Select Products", icon: "fa-box" },
        { label: "Manage Shop", icon: "fa-store" },
        { label: "Track Commission", icon: "fa-chart-line" },
        { label: "Social Sharing", icon: "fa-share-nodes" },
        { label: "Profile", icon: "fa-user" }
      ],
      seller: [
        { label: "Home", icon: "fa-house" },
        { label: "Manage Products", icon: "fa-box-open" },
        { label: "Affiliate Settings", icon: "fa-handshake" },
        { label: "Track Orders", icon: "fa-truck" },
        { label: "Earnings & Payouts", icon: "fa-dollar-sign" },
        { label: "Promotion Campaigns", icon: "fa-bullhorn" },
        { label: "Profile", icon: "fa-user" }
      ],
      admin: [
        { label: "Home", icon: "fa-house" },
        { label: "Manage Users", icon: "fa-users" },
        { label: "Product Moderation", icon: "fa-boxes-stacked" },
        { label: "Order Oversight", icon: "fa-clipboard-list" },
        { label: "Commission Control", icon: "fa-scale-balanced" },
        { label: "Analytics", icon: "fa-chart-pie" },
        { label: "System Management", icon: "fa-gears" },
        { label: "Profile", icon: "fa-user-shield" }
      ]
    };

    // ✅ Build nav dynamically
    nav.innerHTML = "";
    if (roleMenus[role]) {
      roleMenus[role].forEach(item => {
        nav.innerHTML += `
          <button>
            <i class="fa-solid ${item.icon}"></i> ${item.label}
          </button>
        `;
      });
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  Main.initApp("nav");
});
