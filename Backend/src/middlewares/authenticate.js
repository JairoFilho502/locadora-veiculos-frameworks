import jwt from "jsonwebtoken";
import { ApiError } from "../errors/ApiError.js";

export function authenticate(request, response, next) {
  const cabecalho = request.headers.authorization;

  if (!cabecalho) {
    return next(new ApiError(401, "Token não informado"));
  }

  const [tipo, token] = cabecalho.split(" ");

  if (tipo !== "Bearer" || !token) {
    return next(new ApiError(401, "Token mal formado"));
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    request.usuarioId = Number(payload.sub);
    return next();
  } catch (error) {
    return next(new ApiError(401, "Token inválido ou expirado"));
  }
}