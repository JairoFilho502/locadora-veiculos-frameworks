import {
  registrarLocacao,
  listarLocacoesDoUsuario,
  finalizarLocacao,
} from "../services/locacaoService.js";

export async function registrar(request, response, next) {
  try {
    const locacao = await registrarLocacao(request.usuarioId, request.body);
    return response.status(201).json(locacao);
  } catch (error) {
    next(error);
  }
}

export async function listar(request, response, next) {
  try {
    const locacoes = await listarLocacoesDoUsuario(request.usuarioId);
    return response.status(200).json(locacoes);
  } catch (error) {
    next(error);
  }
}

export async function finalizar(request, response, next) {
  try {
    const locacao = await finalizarLocacao(request.usuarioId, request.params.id);
    return response.status(200).json(locacao);
  } catch (error) {
    next(error);
  }
}
