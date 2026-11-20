import api from "./api";

export async function listarLocacoes() {
  const resposta = await api.get("/locacoes");
  return resposta.data;
}

export async function registrarLocacao(dados) {
  const resposta = await api.post("/locacoes", dados);
  return resposta.data;
}

export async function finalizarLocacao(id) {
  const resposta = await api.patch(`/locacoes/${id}/finalizar`);
  return resposta.data;
}
