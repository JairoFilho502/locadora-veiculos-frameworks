import { z } from "zod";

export const registerSchema = z.object({
  nome: z
    .string("Nome é obrigatório")
    .trim()
    .min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z
    .string("E-mail é obrigatório")
    .trim()
    .toLowerCase()
    .email("E-mail inválido"),
  senha: z
    .string("Senha é obrigatória")
    .min(6, "Senha deve ter pelo menos 6 caracteres"),
});

export const loginSchema = z.object({
  email: z
    .string("E-mail é obrigatório")
    .trim()
    .toLowerCase()
    .email("E-mail inválido"),
  senha: z.string("Senha é obrigatória").min(1, "Senha é obrigatória"),
});