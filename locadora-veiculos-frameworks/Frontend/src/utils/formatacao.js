const MS_POR_DIA = 24 * 60 * 60 * 1000;

export function formatarMoeda(valor) {
  return Number(valor).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function formatarDataHora(valor) {
  if (!valor) {
    return "—";
  }

  return new Date(valor).toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

export function paraInputDataHora(data) {
  const ajustada = new Date(data.getTime() - data.getTimezoneOffset() * 60000);
  return ajustada.toISOString().slice(0, 16);
}

export function paraISO(valor) {
  if (!valor) {
    return "";
  }

  const data = new Date(valor);
  return Number.isNaN(data.getTime()) ? valor : data.toISOString();
}

export function calcularDiarias(inicio, fim) {
  const dataInicio = new Date(inicio);
  const dataFim = new Date(fim);
  const duracao = dataFim.getTime() - dataInicio.getTime();

  if (Number.isNaN(duracao) || duracao <= 0) {
    return 0;
  }

  return Math.ceil(duracao / MS_POR_DIA);
}

export function mensagemDeErro(error) {
  return error.response?.data?.error || "Não foi possível conectar à API";
}
