import { Router } from "express";
import { authenticateUser, verifyToken } from "../../firestoreService"; // Importa a função verifyToken

const router = Router();

// Middleware para validar o token
const authenticateMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extrai o token do cabeçalho Authorization
  if (!token) {
    return res.status(401).json({ error: "Token não fornecido." });
  }

  try {
    const uid = await verifyToken(token); // Verifica o token e obtém o UID
    req.user = { uid }; // Armazena o UID no objeto req para uso posterior
    next(); // Continua para a próxima função
  } catch (error) {
    console.error("Erro ao validar token:", error.message);
    res.status(401).json({ error: "Token inválido." });
  }
};

// Rota de login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email e senha são obrigatórios." });
  }

  try {
    // Chama a função authenticateUser para gerar o ID Token
    const idToken = await authenticateUser(email, password);

    // Envia o ID Token ao cliente
    res.status(200).json({ message: "Login bem-sucedido.", token: idToken });
  } catch (error) {
    console.error("Erro ao autenticar usuário:", error.message);
    res.status(401).json({ error: "Credenciais inválidas." });
  }
});

// Rota para validar o token
router.get("/validateToken", authenticateMiddleware, (req, res) => {
  res.status(200).json({ message: "Token válido." });
});

export default router;
