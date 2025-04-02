import { Router } from "express";
import offersRoutes from "./firestore/Getofferbyroute"; // Importa as rotas de "offers"
// Você pode adicionar mais rotas aqui, como "usersRoutes", etc.

const router = Router();

// Use as rotas de "offers"
router.use("/api", offersRoutes);

// Adicione outras rotas aqui, se necessário
// router.use("/api/users", usersRoutes);

export default router;