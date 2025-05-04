import { Router } from "express";
import { getDeliverybyUser, getOffer, getFlight } from "../../firestoreService";

const router = Router();

// Endpoint para buscar entregas por usuário
router.get("/deliverybyuser", async (req, res) => {
  const { user } = req.query;

  if (!user) {
    return res.status(400).json({ error: "Não foi possível confirmar o utilizador" });
  }

  try {
    // Passo 1: Buscar as entregas do usuário
    const deliveries = await getDeliverybyUser(user as string);

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
          console.error(`Nenhum voo encontrado para a oferta com ID: ${offer.id}`);
          return null; // Ignora entregas sem voo
        }

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