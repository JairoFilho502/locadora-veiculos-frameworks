import { Router } from "express";
import { registrar, listar, finalizar } from "../controllers/locacaoController.js";
import { authenticate } from "../middlewares/authenticate.js";

const locacaoRoutes = Router();

locacaoRoutes.use(authenticate);

locacaoRoutes.post("/", registrar);
locacaoRoutes.get("/", listar);
locacaoRoutes.patch("/:id/finalizar", finalizar);

export default locacaoRoutes;
