import express from "express";
import cors from "cors";
import router from "./API/index"; // Importa as rotas consolidadas

const app = express();
const port = 3000;

app.use(cors());
// Usa as rotas consolidadas
app.use(router);

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
