import prisma from "../databases/prisma.js";
import { ApiError } from "../errors/ApiError.js";
import {
  criarVeiculoSchema,
  listarVeiculosSchema,
} from "../schemas/veiculoSchema.js";

export async function cadastrarVeiculo(dados) {
  const { marca, modelo, placa, ano, valorDiaria } =
    criarVeiculoSchema.parse(dados);

  const veiculoExistente = await prisma.veiculo.findUnique({
    where: { placa },
  });

  if (veiculoExistente) {
    throw new ApiError(409, "Placa já cadastrada");
  }

  try {
    return await prisma.veiculo.create({
      data: { marca, modelo, placa, ano, valorDiaria },
    });
  } catch (error) {
    if (error.code === "P2002") {
      throw new ApiError(409, "Placa já cadastrada");
    }
    throw error;
  }
}

export async function listarVeiculos(filtros) {
  const { disponivel } = listarVeiculosSchema.parse(filtros);

  return prisma.veiculo.findMany({
    where: disponivel === undefined ? {} : { disponivel },
    orderBy: { id: "asc" },
  });
}