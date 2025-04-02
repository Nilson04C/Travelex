import { Router } from "express";
import { setOffer } from "../../firestoreService";

const router = Router();

// Endpoint para buscar ofertas por rota
router.post("/setOffer", async (req, res) => {
  const { flight, weight, space, date } = req.body;
  
  const offerData = {
    flight, 
    user: "ola", // Valor fixo 
    user_name: "ola", // Valor 
    weight,
    space,
    date, 
};

  try {
    const offer = await setOffer(offerData);
    res.status(201).json({ message: "Oferta criada com sucesso!", offer });
  } catch (error) {
    console.error("Erro ao buscar entregas:", error);
    res.status(500).json({ error: "Erro ao buscar entregas." });
  }
});

export default router;