import { Router } from "express";
import { getDeliverybyUser, getOffer, getFlight, verifyToken, getUserRelation} from "../../firestoreService";

const router = Router();

// Endpoint para buscar entregas por usuário
router.get("/deliverybyuser", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extrai o token do cabeçalho Authorization
  if (!token) {
    return res.status(401).json({ error: "Token não fornecido." });
  }

  try {
    // Valida o token e obtém o UID do usuário
    const uid = await verifyToken(token);
    
    // Passo 1: Buscar as entregas do usuário
    const deliveries = await getDeliverybyUser(uid as string);

    if (!deliveries || deliveries.length === 0) {
      return res.status(404).json({ error: "Nenhuma entrega encontrada para o usuário." });
    }

    // Passo 2: Buscar as offers e flights correspondentes
    const enrichedDeliveries = await Promise.all(
      deliveries.map(async (delivery) => {
        const offer = await getOffer([delivery.offer]); // Busca a oferta correspondente
        if (!offer) {
          console.error(`Nenhuma oferta encontrada para a entrega com ID: ${delivery.id}`);
          return null; // Ignora entregas sem oferta
        }

        const flight = await getFlight(offer.flight); // Busca o voo correspondente
        if (flight === undefined || flight === null) {
          console.error(`Nenhum voo encontrado para a oferta com ID: ${offer}`);
          return null; // Ignora entregas sem voo
        }
        

        // Determina a relação do usuário com a entrega
        const relacaoEncomenda = getUserRelation(uid, delivery.client, delivery.traveler);

        // Retorna apenas os dados necessários para a interface
        return {
          id: delivery.id,
          origin: flight.origin,
          destination: flight.destination,
          client: delivery.client,
          departureDate: flight.departureDate,
          arrivalDate: flight.arrivalDate,
          space: offer.space,
          weight: offer.weight,
          disponibilidade: delivery.status,
          relacao_encomenda: relacaoEncomenda, // Adiciona o campo relacao_encomenda
        };
      })
    );

    // Remove valores nulos do array
    const filteredDeliveries = enrichedDeliveries.filter((delivery) => delivery !== null);

    res.json(filteredDeliveries); // Retorna os dados filtrados para o frontend
  } catch (error) {
    console.error("Erro ao buscar entregas:", error);
    res.status(500).json({ error: "Erro ao buscar entregas." });
  }
});

export default router;