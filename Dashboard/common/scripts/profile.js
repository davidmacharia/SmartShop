import { userData } from "../controls/control.js";
export class Profile {
  constructor() {
    this.name = new userData().loginData().username;
    this.profile = {
      name: this.name,
      email: "john.seller@example.com",
      phone: "+1 555-123-4567",
      shopName: "Doe's SmartShop",
      shopDesc: "We provide the best digital and physical products online.",
      address: "123 Market Street, New York, NY",
      bank: "Chase Bank",
      account: "**** 4567",
      avatar: "pic.jpg"
    };
  }

  render() {
    return `
      <div class="profile-page">
        <h2 class="heading">Seller Profile</h2>
        <hr>

        <!-- Profile Header + Shop Info in a row -->
        <div class="profile-row">
          <section class="profile-header">
            <!-- Avatar (clickable) -->
            <div class="avatar-wrapper">
              <img src="${this.profile.avatar}" alt="Avatar" class="profile-avatar" id="profileAvatar">
              <input type="file" id="avatarInput" accept="image/*" style="display: none;">
              <div class="avatar-overlay"><i class="fa-solid fa-camera"></i></div>
            </div>

            <div>
              <h3>${this.profile.name}</h3>
              <p>${this.profile.email}</p>
              <p>${this.profile.phone}</p>
            </div>
          </section>

          <section class="profile-section">
            <h3>Shop Information</h3>
            <p><strong>Shop Name:</strong> ${this.profile.shopName}</p>
            <p><strong>Description:</strong> ${this.profile.shopDesc}</p>
          </section>
        </div>

        <!-- Editable Info + Password Update side by side -->
        <div class="profile-row">
          <section class="profile-section">
            <h3>Edit Profile</h3>
            <form id="profileForm">
              <label>Full Name:</label>
              <input type="text" id="name" value="${this.profile.name}">
              
              <label>Phone:</label>
              <input type="text" id="phone" value="${this.profile.phone}">
              
              <label>Shop Description:</label>
              <textarea id="shopDesc">${this.profile.shopDesc}</textarea>
              
              <label>Address:</label>
              <input type="text" id="address" value="${this.profile.address}">
              
              <label>Bank Name:</label>
              <input type="text" id="bank" value="${this.profile.bank}">
              
              <label>Account Number:</label>
              <input type="text" id="account" value="${this.profile.account}">
              
              <button type="submit">Save Changes</button>
            </form>
          </section>

          <section class="profile-section">
            <h3>Change Password</h3>
            <form id="passwordForm">
              <label>Current Password:</label>
              <input type="password" id="currentPassword" required>
              
              <label>New Password:</label>
              <input type="password" id="newPassword" required>
              
              <label>Confirm Password:</label>
              <input type="password" id="confirmPassword" required>
              
              <button type="submit" class="danger-btn">Update Password</button>
            </form>
          </section>
        </div>
      </div>
    `;
  }

  initControls() {
    const profileForm = document.getElementById("profileForm");
    const passwordForm = document.getElementById("passwordForm");
    const avatarInput = document.getElementById("avatarInput");
    const avatarImg = document.getElementById("profileAvatar");

    // Handle profile update
    profileForm.onsubmit = (e) => {
      e.preventDefault();
      alert("✅ Profile updated successfully!");
    };

    // Handle password update
    passwordForm.onsubmit = (e) => {
      e.preventDefault();
      const newPass = document.getElementById("newPassword").value;
      const confirmPass = document.getElementById("confirmPassword").value;
      if (newPass !== confirmPass) {
        alert("❌ Passwords do not match!");
        return;
      }
      alert("🔑 Password updated successfully!");
    };

    // Handle avatar click
    avatarImg.onclick = () => {
      avatarInput.click();
    };

    // Preview new avatar
    avatarInput.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          avatarImg.src = event.target.result; // preview image
        };
        reader.readAsDataURL(file);
      }
    };
  }
}
