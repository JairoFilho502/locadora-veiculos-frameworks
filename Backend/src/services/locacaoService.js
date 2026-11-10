import prisma from "../databases/prisma.js";
import { ApiError } from "../errors/ApiError.js";
import {
  registrarLocacaoSchema,
  locacaoIdSchema,
} from "../schemas/locacaoSchema.js";

const MS_POR_DIA = 24 * 60 * 60 * 1000;

export function calcularQuantidadeDiarias(dataInicio, dataPrevistaDevolucao) {
  const duracao = dataPrevistaDevolucao.getTime() - dataInicio.getTime();
  return Math.ceil(duracao / MS_POR_DIA);
}

export async function registrarLocacao(usuarioId, dados) {
  const { veiculoId, dataInicio, dataPrevistaDevolucao } =
    registrarLocacaoSchema.parse(dados);

  return prisma.$transaction(async (tx) => {
    const veiculo = await tx.veiculo.findUnique({
      where: { id: veiculoId },
    });

    if (!veiculo) {
      throw new ApiError(404, "Veículo não encontrado");
    }

    const reserva = await tx.veiculo.updateMany({
      where: { id: veiculoId, disponivel: true },
      data: { disponivel: false },
    });

    if (reserva.count === 0) {
      throw new ApiError(409, "Veículo indisponível para locação");
    }

    const diarias = calcularQuantidadeDiarias(dataInicio, dataPrevistaDevolucao);
    const valorTotal = veiculo.valorDiaria.mul(diarias);

    return tx.locacao.create({
      data: {
        usuarioId,
        veiculoId,
        dataInicio,
        dataPrevistaDevolucao,
        valorTotal,
      },
      include: { veiculo: true },
    });
  });
}

export async function listarLocacoesDoUsuario(usuarioId) {
  return prisma.locacao.findMany({
    where: { usuarioId },
    include: { veiculo: true },
    orderBy: { dataInicio: "desc" },
  });
}

export async function finalizarLocacao(usuarioId, id) {
  const locacaoId = locacaoIdSchema.parse(id);

  return prisma.$transaction(async (tx) => {
    const locacao = await tx.locacao.findUnique({
      where: { id: locacaoId },
    });

    if (!locacao) {
      throw new ApiError(404, "Locação não encontrada");
    }

    if (locacao.usuarioId !== usuarioId) {
      throw new ApiError(403, "Você não tem permissão para finalizar esta locação");
    }

    const finalizacao = await tx.locacao.updateMany({
      where: { id: locacaoId, status: "ATIVA" },
      data: { status: "FINALIZADA", dataDevolucao: new Date() },
    });

    if (finalizacao.count === 0) {
      throw new ApiError(409, "Locação já finalizada");
    }

    await tx.veiculo.update({
      where: { id: locacao.veiculoId },
      data: { disponivel: true },
    });

    return tx.locacao.findUnique({
      where: { id: locacaoId },
      include: { veiculo: true },
    });
  });
}
