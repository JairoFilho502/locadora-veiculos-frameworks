import { ZodError } from "zod";
import { ApiError } from "../errors/ApiError.js";

export function errorHandler(error, request, response, next) {
  if (error instanceof ApiError) {
    return response.status(error.statusCode).json({ error: error.message });
  }

  if (error instanceof ZodError) {
    const mensagem = error.issues.map((issue) => issue.message).join("; ");
    return response.status(400).json({ error: mensagem });
  }

  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    return response.status(400).json({ error: "JSON inválido" });
  }

  console.dir(error, { depth: null });
  return response.status(500).json({ error: "Erro interno do servidor" });
}