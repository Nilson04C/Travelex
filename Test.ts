import { getUser, getFlight, getOffer, getDelivery, getTransaction, getOffersByRoute } from "./src/server/firestoreService";

/* // Testar a função de buscar usuário
const userId = "YcH8obUMSZYjFuYrhNRc";
getUser(userId).then(() => {
  console.log("Usuário buscado com sucesso!");
});

// Testar a função de buscar voo
const flightId = "jCWhLy6wAocMMgQftu84";
getFlight(flightId).then(() => {
  console.log("Voo buscado com sucesso!");
});

// Testar a função de buscar oferta
const offerId = ["7rU8Yn4UBD6XUe7zV92t"];
getOffer(offerId).then(() => {
  console.log("Oferta buscada com sucesso!");
});

// Testar a função de buscar entrega
const deliveryId = "YxiQTArp7frQD6YzMrUF";
getDelivery(deliveryId).then(() => {
  console.log("Entrega buscada com sucesso!");
});

// Testar a função de buscar transação
const transactionId = "wWRNtrPyFUcmUsSckLke";
getTransaction(transactionId).then(() => {
  console.log("Transação buscada com sucesso!");
}); 


// Testar a função de buscar ofertas por rota
getOffersByRoute("Madrid", "Luanda")*/

// Testar a função de buscar oferta via API
/* fetch(`http://localhost:3000/api/offerbyroute?origin=Madrid&destination=Luanda`)
  .then((response) => {
    if (!response.ok) {
      throw new Error("Erro ao buscar oferta");
    }
    return response.json();
  })
  .then((data) => {
    console.log("Oferta buscada com sucesso!", data);
  })
  .catch((error) => {
    console.error("Erro:", error);
  }); */

  fetch(`http://localhost:3000/api/deliverybyuser?user=YcH8obUMSZYjFuYrhNRc`)
  .then((response) => {
    if (!response.ok) {
      throw new Error("Erro ao buscar entrega");
    }
    return response.json(); 
  }) 
  .then((data) => {
    console.log("Entrega buscada com sucesso!", data);
  })
  .catch((error) => {
    console.error("Erro:", error);
  });