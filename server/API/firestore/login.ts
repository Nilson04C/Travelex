import { Router } from "express";
import { authenticateUser } from "../../firestoreService"; // Importa a função authenticateUser

const router = Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email e senha são obrigatórios." });
  }

  try {
    const token = await authenticateUser(email, password); // Chama a função de autenticação
    res.status(200).json({ message: "Login bem-sucedido.", token });
  } catch (error) {
    console.error("Erro ao autenticar usuário:", error.message);
    res.status(401).json({ error: "Credenciais inválidas." });
  }
});

export default router;
