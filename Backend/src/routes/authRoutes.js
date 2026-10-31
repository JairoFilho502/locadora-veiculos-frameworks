import { Router } from "express";
import { register, login, me } from "../controllers/authController.js";
import { authenticate } from "../middlewares/authenticate.js";

const authRoutes = Router();

authRoutes.post("/register", register);
authRoutes.post("/login", login);
authRoutes.get("/me", authenticate, me);

export default authRoutes;