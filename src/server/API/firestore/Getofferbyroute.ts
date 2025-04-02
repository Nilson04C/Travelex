import { Router } from "express";
import { getOffersByRoute } from "../../firestoreService";

const router = Router();

// Endpoint para buscar ofertas por rota
router.get("/offerbyroute", async (req, res) => {
  const { origin, destination } = req.query;

  if (!origin || !destination) {
    return res.status(400).json({ error: "Nenhum voo encontrado" });
  }

  try {
    const offers = await getOffersByRoute(origin as string, destination as string);
    res.json(offers);
  } catch (error) {
    console.error("Erro ao buscar ofertas:", error);
    res.status(500).json({ error: "Erro ao buscar ofertas." });
  }
});

export default router;