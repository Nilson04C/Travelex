import { Router } from "express";
import { setOffer, getUser, verifyToken } from "../../firestoreService"; // Importa verifyToken diretamente

const router = Router();

// Endpoint para criar uma oferta
router.post("/setOffer", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extrai o token do cabeçalho Authorization
  if (!token) {
    return res.status(401).json({ error: "Token não fornecido." });
  }

  try {
    // Valida o token e obtém o UID do usuário
    const uid = await verifyToken(token);

    // Busca o nome do usuário no Firestore
    const userData = await getUser(uid);
    if (!userData || !userData.name) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }



    const { flightNumber, weight, space, origin, destination, departureDate, arrivalDate } = req.body; // Dados da oferta
    const offerData = {
      flight: "",
      user: uid, // Usa o UID do usuário autenticado
      user_name: userData.name, // Usa o nome do usuário
      weight,
      space,
    };

    const flightData = {
      flightNumber,
      origin,
      destination,
      departureDate,
      arrivalDate,
    };


    const offer = await setOffer(offerData, flightData);
    res.status(201).json({ message: "Oferta criada com sucesso!", offer });
  } catch (error) {
    console.error("Erro ao criar oferta:", error);
    res.status(500).json({ error: "Erro ao criar oferta." });
  }
});

export default router;