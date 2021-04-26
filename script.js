// Cartes produits
function fillProductsList(nounours) {
  for (let elem of nounours) {
    // Const et création des éléments
    const productDiv = document.querySelector(".product__div");
    const card = document.createElement("div");
    const productImage = document.createElement("img");
    const productName = document.createElement("h3");
    const productPrice = document.createElement("p");
    const productBtn = document.createElement("a");

    // Ajout du contenu et des attributs
    productImage.setAttribute("src", `${elem.imageUrl}`);
    productName.innerText = `${elem.name}`;
    productPrice.innerText = `${elem.price / 100}€`;
    productBtn.id = elem._id;
    productBtn.setAttribute("href", `product.html?productid=${elem._id}`);
    productBtn.innerText = "Voir Produit";

    // Ajout des classes
    card.className = "card";
    productName.className = "products-title";
    productImage.className = "products-img";
    productPrice.className = "products-text";
    productBtn.className = "products-btn";

    // Placement du contenu
    productDiv.appendChild(card);
    card.appendChild(productImage);
    card.appendChild(productName);
    card.appendChild(productPrice);
    card.appendChild(productBtn);
  }
}

async function fillProducts() {
  try {
    await fetch("http://localhost:3000/api/teddies") // will return info, but in wrong format
      .then((response) => response.json()) // will return info, in json format
      .then((nounours) => fillProductsList(nounours)); // main code here, using json info
  } catch (err) {
    alert("Erreur du serveur, veuillez réessayer ultérieurement.");
  }
}
fillProducts();
