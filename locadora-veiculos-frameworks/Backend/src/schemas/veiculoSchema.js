import { z } from "zod";

const anoAtual = new Date().getFullYear();

export const criarVeiculoSchema = z.object({
  marca: z
    .string("Marca é obrigatória")
    .trim()
    .min(2, "Marca deve ter pelo menos 2 caracteres"),
  modelo: z
    .string("Modelo é obrigatório")
    .trim()
    .min(1, "Modelo é obrigatório"),
  placa: z
    .string("Placa é obrigatória")
    .trim()
    .toUpperCase()
    .regex(/^[A-Z]{3}-?\d[A-Z0-9]\d{2}$/, "Placa inválida")
    .transform((placa) => placa.replace("-", "")),
  ano: z.coerce
    .number("Ano é obrigatório")
    .int("Ano deve ser um número inteiro")
    .min(1950, "Ano inválido")
    .max(anoAtual + 1, "Ano inválido"),
  valorDiaria: z.coerce
    .number("Valor da diária é obrigatório")
    .positive("Valor da diária deve ser maior que zero")
    .max(99999999.99, "Valor da diária excede o limite permitido"),
});

export const listarVeiculosSchema = z.object({
  disponivel: z
    .enum(["true", "false"], "O filtro disponivel deve ser true ou false")
    .optional()
    .transform((valor) => (valor === undefined ? undefined : valor === "true")),
});