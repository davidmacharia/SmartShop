//###########################################################################################
import { Products } from "../Dashboard/productsPackage/products.js";
class SendData {
    async SubmitData(data) {
        try {
            const res = await fetch("http://192.168.137.146/serverside/", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status} - ${res.statusText}`);
            }

            const text = await res.json();
            this.handleResponse(data, text);
        } catch (error) {
            console.error("Fetch error:", error);
            this.handleError(data.action, error.message);
        }
    }

    handleResponse(data, text) {
        const errorBox = document.querySelector("#error");
        if (!errorBox) return;

        if (data.action === "registration") {
            errorBox.className = "success";
            document.getElementById("phaseone").style.display = "block";
            document.getElementById("phasetwo").style.display = "none";
            errorBox.innerHTML = "✅ Registration successful!";
            setTimeout(() => { location.href = `index.html?username=${text.UserName}`; }, 1000);
        }

        else if (data.action === "login") {
            errorBox.className = "success";
            errorBox.innerHTML = "✅ Login success!";
            new Products(text.role); // <-- Initialize products with role
            setTimeout(() => {
                location.href = `../Dashboard/common/index.html?username=${text.UserName}&role=${text.role}`;
            }, 1000);
        }

        else if (data.action === "forgot") {
            errorBox.className = "success";
            errorBox.innerHTML = `✅ Enter code sent to your Email <br>${text.code}`;

            const verify = document.querySelector("#verify");
            verify.addEventListener("input", () => {
                const email = document.querySelector("#email").value;

                if (verify.value !== text.code || email !== text.email) {
                    errorBox.className = "error";
                    errorBox.innerHTML = "⚠️ Invalid code";
                } else {
                    errorBox.className = "success";
                    errorBox.innerHTML = "✅ Password reset link sent!";
                    setTimeout(() => {
                        location.href = `resetpassword.html?email=${text.email}`;
                    }, 2000);
                }
            });
        }

        else if (data.action === "reset") {
            const resetErrorBox = document.querySelector("#error1");
            resetErrorBox.className = "success";
            resetErrorBox.innerHTML = "✅ Password reset successfully!";
            setTimeout(() => { location.href = "index.html"; }, 1000);
        }
    }

    handleError(action, msg) {
        const errorBox = document.querySelector("#error");
        const errorBox1 = document.querySelector("#error1");

        switch (action) {
            case "registration":
                errorBox.className = "error";
                errorBox.innerHTML = `⚠️ Registration failed: ${msg}`;
                document.getElementById("phaseone").style.display = "block";
                document.getElementById("phasetwo").style.display = "none";
                break;

            case "login":
                errorBox.className = "error";
                errorBox.textContent = "⚠️ Incorrect Email or Password";
                break;

            case "forgot":
                errorBox1.className = "error";
                errorBox1.textContent = "⚠️ Email not found";
                break;

            case "reset":
                errorBox1.className = "error";
                errorBox1.textContent = "⚠️ Failed to reset password";
                break;

            default:
                errorBox.className = "error";
                errorBox.textContent = `⚠️ Unexpected error: ${msg}`;
        }
    }
}

//################################################################################
document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const form = document.querySelector("form");
    if (!form) return;

    // Next/Back button logic for registration
    const nextBtn = document.getElementById("nextphase");
    const backBtn = document.getElementById("backBtn");
    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            document.getElementById("phaseone").style.display = "none";
            document.getElementById("phasetwo").style.display = "";
        });
    }
    if (backBtn) {
        backBtn.addEventListener("click", () => {
            document.getElementById("phaseone").style.display = "";
            document.getElementById("phasetwo").style.display = "none";
        });
    }

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const sendData = new SendData();

        let data = {};
        let email = formData.get("email") ?? "";
        let password = formData.get("password") ?? "";

        if (form.id === "register") {
            const username = formData.get("username") ?? "guest";
            const phone = formData.get("phone") ?? "0";

            if (!username || !email || !phone || !password) {
                document.querySelector("#error").textContent = "⚠️ All fields are required";
                return;
            }

            data = { username, email, phone, password, action: "registration" };
        }

        else if (form.id === "login") {
            if (!email) {
                document.querySelector("#error").textContent = "⚠️ Please enter your Email";
                return;
            }
            if (!password) {
                document.querySelector("#error2").textContent = "⚠️ Password required";
                return;
            }

            data = { email, password, action: "login" };
        }

        else if (form.id === "forgot") {
            if (!email) {
                document.querySelector("#error1").textContent = "⚠️ Please enter your Email";
                return;
            }

            data = { email, action: "forgot" };
        }

        else if (form.id === "reset") {
            if (!password) {
                document.querySelector("#error1").textContent = "⚠️ Password required";
                return;
            }

            data = { email: params.get("email"), password, action: "reset" };
        }

        if (Object.keys(data).length > 0) {
            sendData.SubmitData(data);
        }
    });
});
