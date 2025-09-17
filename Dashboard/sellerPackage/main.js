import {Begin} from "./scripts/dashboard.js";
import{toplabels,categoryLabels,category,icon,footerLabels,footerIcons, profileCategory, ProfileIcons,image,name,legend} from "./data.js";
import {Products} from "./scripts/products.js";
 function topLables(){
    const beg =new Begin();
    
      for (const lab of toplabels) {
        const labels = beg.acquire(".labels");
        const tlabels = beg.create();
        tlabels.setAttribute("class", "label");
        tlabels.textContent = `${lab}`;
        labels.appendChild(tlabels);
       
      }
      
  }

//method for middle labels
 function middleLabel(){
    const beg =new Begin();
      categoryLabels.forEach((lab) => {
        const clabel = beg.acquire(".nlabels");
        const catlabels = beg.create();
        catlabels.classList.add("label");
        catlabels.textContent = lab;
        clabel.appendChild(catlabels);
      });
  }

  //bottom Labels 

  function bottomLabels(){
    const beg = new Begin();
    category.forEach((categ, index) => {
  const categories = beg.acquire(".categories");
  const categor = beg.create();
  categor.classList.add("category");

  const span = beg.create("span");
  span.textContent = icon[index];

  const url = beg.create();
  url.textContent = categ;
  url.classList.add("category-item");
  url.addEventListener("click", async () => {
      // Replace 'adverts' class with 'market' to display filtered products
      const disitem=beg.acquire(".adverts")||beg.acquire(".profilepg");
    if(!disitem.classList.replace("adverts", "market")){
    disitem.classList.replace("ptofilepg", "market");
    }
      beg.hidding();
      // Fetch products and filter by clicked category
      const productsobj =new Products();
      const products = await productsobj.fetchProducts();
      productsobj.displayFilteredProducts(categ, products);
  });

  categor.appendChild(span);
  categor.appendChild(url);
  categories.appendChild(categor);
});
  }
  //footer
  function footerHome(){
    
    const beg = new Begin();
    const parent = beg.acquire("body");
    
    const footer = beg.create("footer");
    parent.appendChild(footer);

    footerLabels.forEach((label, index) => {
      const footItem = beg.create();
      footItem.classList.add("footer-item");

      const iconSpan = beg.create("span");
      iconSpan.classList.add("footer-icon");
      iconSpan.textContent = footerIcons[index];

      const labelText = beg.create();
      labelText.classList.add("footer-label");
      labelText.textContent = label;

      footItem.appendChild(iconSpan);
      footItem.appendChild(labelText);
      footer.appendChild(footItem);
    });
  }

  function profilePage() {
    const beg = new Begin();
    beg.acquire("footer :nth-child(3)").onclick = function () {
      beg.acquire("footer").style.display = "none";
      const par = beg.acquire(".adverts") || beg.acquire(".market");
      if (par) {
        par.innerHTML = ""; // Clear the current content
        par.style.marginTop = "7vh";
        if (!par.classList.replace("adverts", "profilepg")) {
          par.classList.replace("market", "profilepg"); // Replace 'adverts' or 'market' with 'profilepg'
        }
      }

      beg.acquire(".labels").style.display = "none";
      beg.hidding();
      const profh = beg.create();
      const img = beg.create("img");
      img.classList.add("img");
      img.src = `${image}`;
      const proftext = beg.create();
      proftext.classList.add("proftext");
      const notification = beg.create();
      notification.textContent = "🔔";
      notification.classList.add("notification");
      proftext.textContent = `Hi ${name}`;
      profh.classList.add("profhead");
      profh.appendChild(img);
      profh.appendChild(proftext);
      profh.appendChild(notification);
      const fieldset = beg.create("fieldset");
      const leg = beg.create("legend");

      leg.textContent = `${legend}`;
      fieldset.classList.add("fieldset");

      profileCategory.forEach((categ, index) => {
        const categor = beg.create();
        categor.classList.add("category");

        const span = beg.create("span");
        span.textContent = ProfileIcons[index];

        const url = beg.create();
        url.textContent = categ;
        url.classList.add("category-item");
        url.addEventListener("click", async () => {
          switch (url.textContent) {
            case "Home":
              location.reload();
              break;
            case "Logout":
              location.href = "index.html";
              break;
            case "Market":
              const productsobj = new Products();
        productsobj.loadMarkert();
              break;
            default:
              alert("error");
              break;
          }
        });

        categor.appendChild(span);
        categor.appendChild(url);
        fieldset.appendChild(categor);
      });

      fieldset.appendChild(leg);
      par.appendChild(profh);
      par.appendChild(fieldset);
    };
  }
  
   export{topLables,middleLabel,bottomLabels,footerHome,profilePage};