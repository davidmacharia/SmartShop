import {Begin} from "./dashboard.js";
export class Products{

async fetchProducts() {
    try {
      const response = await fetch("https://fakestoreapi.com/products");
      const products = await response.json();
      return products;
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    }
  }
  
  //method to load products
   async loadProducts(){
    const beg = new Begin();
    const adverts = beg.acquire(".market")||beg.acquire(".profilepg") ||beg.acquire(".adverts");
      if(adverts){
        const mark = beg.acquire(".labels");
        mark.firstChild.textContent = "Recent"; // Reset label to default
        mark.lastChild.textContent = "Market"; // Reset label to default
  beg.acquire(".labels").style.display="flex";
        beg.acquire(".categories").style.display = ""; // Make categories visible
        beg.acquire(".nlabels").style.display = "flex"; // Make nlabels visible
  
        
        adverts.innerHTML = ""; // Clear current content
        if(!adverts.classList.replace("market", "adverts")){
          adverts.classList.replace("profilepg", "adverts");
           // Replace 'market' with 'adverts' class
        }
      }
      
      const products = await this.fetchProducts(); 

      products.forEach((product) => {
        const productDiv= beg.create();
        productDiv.setAttribute("class","ads");
        const img = beg.create("img");
        img.setAttribute("src", product.image);
        const price = beg.create();
      price.setAttribute("class", "price");
    
      const h1 = beg.create("h1");
      h1.textContent = product.title;
      //
      const h2 = beg.create("h2");
      h2.textContent = `Price: $${product.price}`;
      
      price.appendChild(h1);
      price.appendChild(h2);
      productDiv.appendChild(img);
      productDiv.appendChild(price);
      adverts.appendChild(productDiv);
      
      });
  }
   
  ///
   ProductsLoop(product) {
    const beg = new Begin();
    const marketDiv = beg.acquire(".market");
    if (!marketDiv) return;
    const productDiv = beg.create();
    productDiv.classList.add("adds");
    const img = beg.create("img");
    img.src = product.image;
    img.alt = product.title;
  //
    const price = beg.create("div");
    price.classList.add("price");
  //
    const h1 = beg.create("h1");
    h1.textContent = product.title;
  //
    const h2 = beg.create("h2");
    h2.textContent = `Price: $${product.price}`;
  //
    price.appendChild(h1);
    price.appendChild(h2);

    productDiv.appendChild(img);
    productDiv.appendChild(price);
  
    marketDiv.appendChild(productDiv);
  }
  //load Markert
    async loadMarkert() {
      const start = new Begin();
    const mark = start.acquire(".labels");
    const foot = start.acquire("footer");
    foot.style.display = "block";
    foot.style.display = "";
    if(mark){
mark.firstChild.textContent = mark.lastChild.textContent;
    mark.lastChild.textContent = "🏠";

    start.hidding();

    }
    
    const adverts = start.acquire(".adverts") || start.acquire(".profilepg");
    if (adverts) {
      adverts.style.marginTop = "";
      adverts.innerHTML = "";
      if (!adverts.classList.replace("adverts", "market")) {
        adverts.classList.replace("profilepg", "market"); 
      }
    }
    start.acquire(".labels").style.display = "flex";

    //////////////////////
    const productsobj = new Products();
    const products = await productsobj.fetchProducts();

    products.forEach((product) => {
     this.ProductsLoop(product);
    });
    //////////////////////////////////////
  }
  //filter 
  displayFilteredProducts(selectedCategory, products) {
    const beg = new Begin();
    const marketDiv = beg.acquire(".market");
    marketDiv.innerHTML = ""; 
    
    const filteredProducts = products.filter(product =>
        product.category.toLowerCase().includes(selectedCategory.toLowerCase())
    );
  ///////////////////

    filteredProducts.forEach(product => {
      this.ProductsLoop(product);

    });
  
    if (filteredProducts.length === 0) {
        marketDiv.textContent = `No products found for  "${selectedCategory}"`;
    }
    
  }
}