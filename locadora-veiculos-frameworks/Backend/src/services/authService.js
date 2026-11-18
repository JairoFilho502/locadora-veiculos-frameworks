import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../databases/prisma.js";
import { ApiError } from "../errors/ApiError.js";
import { registerSchema, loginSchema } from "../schemas/authSchema.js";

const SALT_ROUNDS = 10;

const usuarioPublico = {
  id: true,
  nome: true,
  email: true,
  createdAt: true,
};

export async function registrarUsuario(dados) {
  const { nome, email, senha } = registerSchema.parse(dados);

  const usuarioExistente = await prisma.usuario.findUnique({
    where: { email },
  });

  if (usuarioExistente) {
    throw new ApiError(409, "E-mail já cadastrado");
  }

  const senhaHash = await bcrypt.hash(senha, SALT_ROUNDS);

  try {
    return await prisma.usuario.create({
      data: { nome, email, senha: senhaHash },
      select: usuarioPublico,
    });
  } catch (error) {
    if (error.code === "P2002") {
      throw new ApiError(409, "E-mail já cadastrado");
    }
    throw error;
  }
}

export async function autenticarUsuario(dados) {
  const { email, senha } = loginSchema.parse(dados);

  const usuario = await prisma.usuario.findUnique({
    where: { email },
  });

  if (!usuario) {
    throw new ApiError(401, "Credenciais inválidas");
  }

  const senhaConfere = await bcrypt.compare(senha, usuario.senha);

  if (!senhaConfere) {
    throw new ApiError(401, "Credenciais inválidas");
  }

  const token = jwt.sign({ sub: usuario.id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  return {
    token,
    usuario: {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      createdAt: usuario.createdAt,
    },
  };
}

export async function buscarUsuarioPorId(id) {
  const usuario = await prisma.usuario.findUnique({
    where: { id },
    select: usuarioPublico,
  });

  if (!usuario) {
    throw new ApiError(401, "Usuário não encontrado");
  }

  return usuario;
}