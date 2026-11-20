import {
  cadastrarVeiculo,
  listarVeiculos,
} from "../services/veiculoService.js";

export async function create(request, response, next) {
  try {
    const veiculo = await cadastrarVeiculo(request.body);
    return response.status(201).json(veiculo);
  } catch (error) {
    next(error);
  }
}

export async function list(request, response, next) {
  try {
    const veiculos = await listarVeiculos(request.query);
    return response.status(200).json(veiculos);
  } catch (error) {
    next(error);
  }
}