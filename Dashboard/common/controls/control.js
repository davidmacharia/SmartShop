export class userData{
  loginData(){
    const params = new URLSearchParams(window.location.search);
    return {
      username: params.get("username") || "Guest",
      role: params.get("role") || "buyer"
    };
  }
}

document.addEventListener("DOMContentLoaded", () => {
  
  const closeSidebarBtn = document.querySelector(".close");
  const sidebar = document.querySelector("nav");
  const dashboardMain = document.querySelector(".dashboard-main");
  // 📌 TOGGLE SIDEBAR
  closeSidebarBtn.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");

    if (sidebar.classList.contains("collapsed")) {
     document.querySelector(".dashboard-header .card ").style.display = "none";
      dashboardMain.style.left = "50px";
      closeSidebarBtn.style.left = "0px";
      closeSidebarBtn.innerHTML = "&#9776";
      sidebar.style.width = "45px"; 
      sidebar.style.overflow = "hidden";
      sidebar.style.top = "11vh";
    } else {
      dashboardMain.style.left = "300px";
       sidebar.style.width = "300px";
       document.querySelector(".dashboard-header .card ").style.display = "";
      dashboardMain.style.left = "";
      closeSidebarBtn.style.left = "";
      closeSidebarBtn.innerHTML = "X";
      sidebar.style.width = ""; 
      sidebar.style.overflow = "";
      sidebar.style.top = "";  // default
    }
  });
});
