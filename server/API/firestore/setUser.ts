import { Router } from "express";
import { setUser } from "../../firestoreService";
import { addUser } from "../../firestoreService"; // Importa a função addUser do authService
const router = Router();

router.post("/setUser", async (req, res) => {
  const { name, email, phone, password } = req.body;

  if (!name || !email || !phone || !password) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios." });
  }

  //id do utilizador
  let uid;

  try {
    // Chama a função addUser para criar o usuário
    uid = await addUser(email, password);

    // Retorna o UID do usuário criado
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    res.status(500).json({ error: "Erro ao registrar usuário." });
  }

  //adcionar o usuário no firestore
  try {
    const userData = {
      name,
      email,
      phone_number: phone,
      created_at: new Date(),
    };

    await setUser(userData,uid );
    res.status(201).json({ message: "Usuário registrado com sucesso." });
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    res.status(500).json({ error: "Erro ao registrar usuário." });
  }
});

export default router;
