import api from "./api";

export async function listarVeiculos(disponivel) {
  const params = disponivel === undefined ? {} : { disponivel };
  const resposta = await api.get("/veiculos", { params });
  return resposta.data;
}

export async function cadastrarVeiculo(dados) {
  const resposta = await api.post("/veiculos", dados);
  return resposta.data;
}
