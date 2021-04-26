// Récupération du product id dans l'URL
const idUrl = window.location.search;
const urlParams = new URLSearchParams(idUrl);
const idProduct = urlParams.get("productid");

// Affichage du produit dans sa page produit
function displayProduct(nounours) {
  // Constantes et création des éléments
  const productImage = document.querySelector("#product__img");
  const productName = document.querySelector("#product__name");
  const productDescription = document.querySelector("#product__description");
  const productPrice = document.querySelector("#product__price");
  const productColors = document.querySelector("#product__colors");
  const productQuantity = document.querySelector("#product__quantity");
  const addButton = document.querySelector("#product__add");

  // Ajout attribut
  productImage.setAttribute("src", nounours.imageUrl);
  productImage.setAttribute("alt", `Ours en peluche ${nounours.name}`);

  // Injection contenu JS dans le HTML
  productName.innerText = nounours.name;
  productDescription.innerText = nounours.description;
  productPrice.innerText = `${nounours.price / 100}€`;

  // Boucle pour la liste des couleurs
  for (i = 0; i < nounours.colors.length; i++) {
    const colorsOptions = document.createElement("option");
    colorsOptions.innerText = nounours.colors[i];
    colorsOptions.setAttribute("value", nounours.colors[i]);
    productColors.appendChild(colorsOptions);
  }
  // Boucle pour la quantité
  for (let i = 1; i <= 30; i++) {
    const quantityOption = document.createElement("option");
    quantityOption.innerText = i;
    quantityOption.setAttribute("value", i);
    productQuantity.appendChild(quantityOption);
  }

  //Fonction pour ajouter produit au panier
  addButton.onclick = function () {
    const colors = document.querySelector("#product__colors");
    const colorSelected = colors.value;
    const quantity = document.querySelector("#product__quantity");
    const quantitySelected = quantity.value;
    const idName = idProduct;

    // Récupération des données du localStorage
    const productInCart = JSON.parse(localStorage.getItem(idName));

    // Fonction pour savoir si produit avec une couleur est déjà dans le localStorage
    function isInTheCart(array, valueToDetect) {
      for (let elem of array) {
        if (elem.color === valueToDetect) {
          return true;
        }
      }
      return false;
    }

    // Initialise le localStorage avec l'ajout d'un premier produit
    function initCart() {
      const productInCart = [
        { color: colorSelected, quantity: Number(quantitySelected) },
      ];
      const objLinearize = JSON.stringify(productInCart);
      localStorage.setItem(idName, objLinearize);
    }

    // Ajouter produit identique mais couleur différente
    function addTocart() {
      productInCart.push({
        color: colorSelected,
        quantity: Number(quantitySelected),
      });
      const objLinearize = JSON.stringify(productInCart);
      localStorage.setItem(idName, objLinearize);
    }

    /* ========== APPEL DES FONCTIONS ========== */

    if (productInCart === null) {
      initCart();
    } else if (isInTheCart(productInCart, colorSelected)) {
      productInCart.forEach((item) => {
        if (item.color === colorSelected) {
          item.quantity += Number(quantitySelected);
          const objLinearize = JSON.stringify(productInCart);
          localStorage.setItem(idName, objLinearize);
        }
      });
    } else {
      addTocart();
    }
  };
}

async function fillProductView() {
  try {
    await fetch("http://localhost:3000/api/teddies/" + idProduct)
      .then((response) => response.json()) // will return info, in json format
      .then((nounours) => displayProduct(nounours)); // main code here, using json info
  } catch (err) {
    alert("Erreur du serveur, veuillez réessayer ultérieurement.");
  }
}
fillProductView();
