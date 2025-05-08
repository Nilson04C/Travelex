import express from "express";
import { setDelivery, verifyToken } from "../../firestoreService";

const router = express.Router();

router.post("/setdelivery", async (req, res) => {
  const { offerId, travelerId, content, flightId, status } = req.body;

  if (!offerId || !travelerId || !content || !flightId || !status) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios." });
  }

  const token = req.headers.authorization?.split(" ")[1]; // Extrai o token do cabeçalho Authorization
  if (!token) {
    return res.status(401).json({ error: "Token não fornecido." });
  }



  try {
    const uid = await verifyToken(token);
    // Cria a estrutura da delivery
    const deliveryData = {
      offer: offerId,
      client: uid,
      traveler: travelerId,
      content,
      flight: flightId,
      status,
    };
    console.log("Dados da delivery:", deliveryData);
    // Salva a delivery no Firestore
    await setDelivery(deliveryData);
    res.status(201).json({ message: "Delivery criada com sucesso!" });
  } catch (error) {
    console.error("Erro ao criar delivery:", error);
    res.status(500).json({ error: "Erro ao criar delivery." });
  }
});

export default router;