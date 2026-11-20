import { z } from "zod";

export const registrarLocacaoSchema = z
  .object({
    veiculoId: z.coerce
      .number("Veículo é obrigatório")
      .int("Veículo inválido")
      .positive("Veículo inválido"),
    dataInicio: z.coerce.date("Data de início inválida"),
    dataPrevistaDevolucao: z.coerce.date("Data prevista de devolução inválida"),
  })
  .refine((dados) => dados.dataPrevistaDevolucao > dados.dataInicio, {
    message: "Data prevista de devolução deve ser posterior à data de início",
    path: ["dataPrevistaDevolucao"],
  });

export const locacaoIdSchema = z.coerce
  .number("ID da locação inválido")
  .int("ID da locação inválido")
  .positive("ID da locação inválido");
