import { Router } from "express";
import { getDeliverybyUser } from "../../firestoreService";

const router = Router();

// Endpoint para buscar ofertas por rota
router.get("/deliverybyuser", async (req, res) => {
  const { user } = req.query;

  if (!user) {
    return res.status(400).json({ error: "Não foi possivel confirmar o utilizador" });
  }

  try {
    const delivery = await getDeliverybyUser(user as string);
    res.json(delivery);
  } catch (error) {
    console.error("Erro ao buscar entregas:", error);
    res.status(500).json({ error: "Erro ao buscar entregas." });
  }
});

export default router;