import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (request, response) => {
  response.json({ status: "ok" });
});

app.use("/auth", authRoutes);

app.use(errorHandler);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});