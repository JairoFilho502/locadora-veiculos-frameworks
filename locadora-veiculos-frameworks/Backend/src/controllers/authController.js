import {
  registrarUsuario,
  autenticarUsuario,
  buscarUsuarioPorId,
} from "../services/authService.js";

export async function register(request, response, next) {
  try {
    const usuario = await registrarUsuario(request.body);
    return response.status(201).json(usuario);
  } catch (error) {
    next(error);
  }
}

export async function login(request, response, next) {
  try {
    const resultado = await autenticarUsuario(request.body);
    return response.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
}

export async function me(request, response, next) {
  try {
    const usuario = await buscarUsuarioPorId(request.usuarioId);
    return response.status(200).json(usuario);
  } catch (error) {
    next(error);
  }
}