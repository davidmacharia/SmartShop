//###########################################################################################
import { Products } from "../Dashboard/productsPackage/products.js";

class SendData {
  async SubmitData(data) {
    const API_URL = "http://192.168.0.210/serverside/";
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status} - ${res.statusText}`);

      const response = await res.json();
      this.handleResponse(data, response);
    } catch (error) {
      console.error("Fetch error:", error);
      this.handleError(data.action, error.message || "Network error");
    }
  }

  $(selector) {
    return document.querySelector(selector);
  }

  showMsg(selector, msg, cls = "success") {
    const el = typeof selector === "string" ? this.$(selector) : selector;
    if (!el) return;
    el.className = cls;
    el.innerHTML = msg;
    el.style.display = "block";
  }

  handleResponse(data, response) {
    switch (data.action) {
      case "registration":
        this.showMsg("#register-error", "✅ Registration successful!");
        setTimeout(() => {
          this.$("#register-section").style.display = "none";
          this.$("#login-section").style.display = "block";
          this.$("#loginEmail").value = data.Email || "";
          this.$("#loginPassword").value = data.Password || "";
          this.showMsg("#loginError", "✅ You can now log in.");
        }, 1200);
        break;

      case "login":
        this.showMsg("#loginError", "✅ Login successful!");
        new Products(response.role);
        setTimeout(() => {
          location.href = `../Dashboard/common/index.html?username=${response.UserName}&role=${response.role}`;
        }, 1000);
        break;

      case "forgot": {
        const errorBox = this.$("#error");
        const verify = this.$("#verify");
        const email = this.$("#email");

        this.showMsg(errorBox, `✅ Code sent to ${response.email}. Check your inbox.`, "success");

        localStorage.setItem("resetEmail", response.email);
        localStorage.setItem("resetCode", response.code);

        const newVerify = verify.cloneNode(true);
        verify.parentNode.replaceChild(newVerify, verify);

        newVerify.addEventListener("input", () => {
          const entered = newVerify.value.trim();
          const savedCode = localStorage.getItem("resetCode");
          const savedEmail = localStorage.getItem("resetEmail");

          if (entered === savedCode && email.value === savedEmail) {
            this.showMsg(errorBox, "✅ Code verified. Redirecting...", "success");
            setTimeout(() => {
              window.location.href = `resetpassword.html?email=${savedEmail}`;
            }, 1500);
          } else if (entered.length >= 4) {
            this.showMsg(errorBox, "⚠️ Invalid verification code", "error");
          }
        });
        break;
      }

      case "reset":
        this.showMsg("#error1", "✅ Password reset successful!");
        setTimeout(() => (window.location.href = "index.html"), 1200);
        break;

      default:
        this.showMsg("#loginError", `⚠️ Unknown action: ${data.action}`, "error");
    }
  }

  handleError(action, msg) {
    switch (action) {
      case "registration":
        this.showMsg("#registerError", `⚠️ Registration failed: ${msg}`, "error");
        this.$("#phaseone").style.display = "block";
        this.$("#phasetwo").style.display = "none";
        break;

      case "login":
        this.showMsg("#loginError", "⚠️ Incorrect email or password", "error");
        break;

      case "forgot":
        this.showMsg("#error1", "⚠️ Email not found", "error");
        break;

      case "reset":
        this.showMsg("#error1", "⚠️ Failed to reset password", "error");
        break;

      default:
        this.showMsg("#loginError", `⚠️ Unexpected error: ${msg}`, "error");
    }
  }
}

//###########################################################################################

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const form = document.querySelector("form");
  if (!form) return;

  const sendData = new SendData();

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const fd = new FormData(form);
    const action = form.id;
    let data = {};

    switch (action) {
      case "register": {
        const UserName = fd.get("username");
        const Email = fd.get("email");
        const Contact = fd.get("phone");
        const Password = fd.get("password");
        const confirmPassword = fd.get("confirmPassword");

        if (![UserName, Email, Contact, Password, confirmPassword].every(Boolean))
          return sendData.showMsg("#registerError", "⚠️ All fields are required", "error");

        if (Password !== confirmPassword)
          return sendData.showMsg("#registerError", "⚠️ Passwords do not match", "error");

        data = { UserName, Email, Contact, Password, confirmPassword, action: "registration" };
        break;
      }

      case "login": {
        const email = fd.get("email");
        const password = fd.get("password");
        if (!email) return sendData.showMsg("#loginError", "⚠️ Enter your email", "error");
        if (!password) return sendData.showMsg("#loginError", "⚠️ Password required", "error");
        data = { email, password, action: "login" };
        break;
      }

      case "forgot": {
        const forgotEmail = fd.get("email");
        if (!forgotEmail) return sendData.showMsg("#error1", "⚠️ Enter your email", "error");
        data = { email: forgotEmail, action: "forgot" };
        break;
      }

      case "reset": {
        const newPassword = fd.get("password");
        if (!newPassword) return sendData.showMsg("#error1", "⚠️ Password required", "error");
        data = { email: params.get("email"), password: newPassword, action: "reset" };
        break;
      }
    }

    if (Object.keys(data).length) sendData.SubmitData(data);
  });
});
