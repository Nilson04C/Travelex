import { Router } from "express";
import offersRoutes from "./firestore/Getofferbyroute"; // Importa as rotas de "offers"
import deliveryRoutes from "./firestore/Getdeliverybyuser"; // Importa as rotas de "delivery"
import setOffer from "./firestore/setOffer"; // Importa as rotas de "setOffer"
import registerUser from "./firestore/setUser"; // Importa as rotas de "register"
// Você pode adicionar mais rotas aqui, como "usersRoutes", etc.

const router = Router();

// Use as rotas de "offers"
router.use("/api", offersRoutes);
// Use as rotas de "delivery"
router.use("/api", deliveryRoutes);
// Use as rotas de "setOffer"
router.use("/api", setOffer);
// Use as rotas de "register"
router.use("/api", registerUser);

// Adicione outras rotas aqui, se necessário
// router.use("/api/users", usersRoutes);

export default router;