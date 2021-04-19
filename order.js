// On vide le localStorage
localStorage.clear();

// Récupération du numéro de commande dans l'URL
let orderNumber = document.querySelector("#order_id");
const orderId = new URLSearchParams(window.location.search).get("orderid");
orderNumber.textContent = orderId;

//Récupération du prix total dans l'URL
let totalPrice = document.querySelector("#total");
const total = new URLSearchParams(window.location.search).get("total");
totalPrice.textContent = total;

// Bouton retour à l'accueil
const buttonBackToIndex = document.querySelector("#btn__return");
buttonBackToIndex.onclick = function () {
  document.location.href = "index.html";
};
