import { Router } from "express";
import { create, list } from "../controllers/veiculoController.js";
import { authenticate } from "../middlewares/authenticate.js";

const veiculoRoutes = Router();

veiculoRoutes.use(authenticate);
veiculoRoutes.post("/", create);
veiculoRoutes.get("/", list);

export default veiculoRoutes;