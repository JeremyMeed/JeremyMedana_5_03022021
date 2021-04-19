function displayCart(nounours) {
  // Déclaration de const
  const clearButton = document.createElement("button");
  const productTotalPrice = document.createElement("div");
  const cartEmptyDiv = document.createElement("div");
  const cartEmptyText = document.createElement("p");
  const cartList = document.querySelector("#cart__list");
  const breakLine = document.createElement("hr");

  let totalCartPrice = 0;
  // Récupération de la liste des produit mis dans le panier et création de la liste dans le HTML
  function constructCart() {
    let totalQuantity = 0;

    // Boucle d'itération des objets dans le localStorage pour récupérer les keys
    for (let i = 0; i < localStorage.length; i++) {
      const objIncart = localStorage.key(i);
      for (let p = 0; p < nounours.length; p++) {
        if (objIncart === nounours[p]._id) {
          let productInCart = JSON.parse(localStorage.getItem(nounours[p]._id));
          const productContainer = document.createElement("div");
          const productName = document.createElement("h3");
          const productPrice = document.createElement("p");
          const productImg = document.createElement("img");
          const productLink = document.createElement("a");
          const name = nounours[p].name;
          const price = `${nounours[p].price / 100}€`;
          let totalPriceProduct = 0;
          let sum = 0;

          productContainer.className = "product-container";
          productPrice.innerText = `${price}`;
          productName.innerText = name;
          productName.className = "product-name";
          productImg.className = "product-img";
          productPrice.className = "product-price";
          productImg.setAttribute("src", nounours[p].imageUrl);
          productImg.setAttribute("alt", `Ours en peluche ${nounours[p].name}`);
          productLink.setAttribute(
            "href",
            `product.html?productid=${nounours[p]._id}`
          );

          productContainer.appendChild(productLink);
          productLink.appendChild(productImg);
          productContainer.appendChild(productName);
          cartList.appendChild(productContainer);
          productContainer.appendChild(productPrice);

          for (let n = 0; n < productInCart.length; n++) {
            // Boucle de création des éléments de la liste
            const productColor = document.createElement("p");
            const productQuantity = document.createElement("span");
            const quantity = productInCart[n].quantity;
            const color = productInCart[n].color;
            productQuantity.innerText = `Quantité ${quantity}`;
            productColor.innerText = `Couleur : ${color}`;
            productQuantity.className = "product-quantity";
            productColor.className = "product-color";

            productContainer.appendChild(productColor);
            productColor.appendChild(productQuantity);

            sum += parseInt(quantity); // Conversion de la quantité en entier et ajout à chaque tour de boucle de sa propre quantité
            totalPriceProduct = sum * nounours[p].price; // Multiplication de la somme par le prix de chaque nounours
          }
          // Ajout à chaque tour de boucle du prix total de chaque type de nounours
          totalCartPrice += totalPriceProduct;

          // Récuperation de la quantité totale dans le panier
          totalQuantity += sum;
          document.querySelector("#cart__quantity").innerText = totalQuantity;
        }
      }
    }
    cartList.appendChild(breakLine);
    productTotalPrice.className = "total-price";
    cartList.appendChild(productTotalPrice);
    productTotalPrice.innerText = `Total : ${totalCartPrice / 100}€`; // Affichage du prix total
  }

  // Fonction permettant d'afficher un message pour signaler que le panier est vide
  function cartIsEmpty() {
    document.querySelector("#cart").appendChild(cartEmptyDiv);
    cartEmptyDiv.appendChild(cartEmptyText);
    cartEmptyText.innerHTML = `<div class="empty-cart">
        <p>Votre panier est vide.</p>
        <a href="index.html" class="btn-index">Retour</a>
      </div>`;
  }

  function isTheCartEmpty(nounours) {
    if (localStorage.length <= 0) {
      // Si localstorage vide (donc panier vide), on appelle la fonction pour afficher panier vide
      cartIsEmpty();
    } else {
      // Sinon on appelle la fonction pour afficher le contenu du panier
      constructCart(nounours);

      // Bouton vider le panier
      clearButton.setAttribute("id", "btn__clear");
      cartList.appendChild(clearButton);
      clearButton.innerText = "Vider le panier";
      clearButton.onclick = function () {
        localStorage.clear();
        const cart = document.querySelector("#cart__list");
        const quantityCart = document.querySelector("#cart__quantity");
        cart.remove();
        quantityCart.remove();
        cartIsEmpty();
      };
    }
  }
  isTheCartEmpty();

  // FORMULAIRE
  function checkForm() {
    // Vérification du formulaire
    const regexText = /^[a-zA-ZÀ-ÖØ-öø-ÿ\s-]+$/;
    const regexAddress = /^[a-zA-ZÀ-ÖØ-öø-ÿ0-9\s-]+$/;
    const regexEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    formIsComplete = true;

    if (
      formIsComplete &&
      regexText.test(lastName.value) &&
      regexText.test(firstName.value) &&
      regexAddress.test(address.value) &&
      regexText.test(city.value) &&
      regexEmail.test(email.value) === true
    ) {
      formIsComplete = true;
    } else {
      alert("Erreur : Veuillez remplir correctement les champs du formulaire.");
      formIsComplete = false;
    }
  }

  let form = document.querySelector("#contact__form");

  // Envoi au back
  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    checkForm(form); // Appelle la fonction pour vérifier la validité du formulaire
    if (localStorage.length > 0) {
      // On récupère les id des produits du panier
      let product_id = [];
      function productList() {
        for (i = 0; i < localStorage.length; i++) {
          let getObj = localStorage.getItem(localStorage.key(i));
          getObj = JSON.parse(getObj);
          product_id.push(localStorage.key(i));
        }
      }
      productList();
      let data = new FormData(form); // On construit un ensemble de paires clé/valeur pour les inputs du formulaire et leur valeur
      if (formIsComplete === true) {
        let objectForm = {};
        data.forEach((value, key) => {
          objectForm[key] = value;
        });

        const options = {
          method: "POST",
          body: JSON.stringify({ contact: objectForm, products: product_id }),
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        };
        fetch("http://localhost:3000/api/teddies/order", options)
          .then((response) => response.json())
          .then((datas) => {
            const orderId = datas.orderId;
            window.location.href = `order.html?orderid=${orderId}&total=${
              totalCartPrice / 100
            }`;
          });
      }
    } else {
      alert("Impossible de passer commande pour un panier vide !");
    }
  });
}

async function productsInCart() {
  await fetch("http://localhost:3000/api/teddies")
    .then((response) => response.json())
    .then((nounours) => displayCart(nounours));
}
productsInCart();
