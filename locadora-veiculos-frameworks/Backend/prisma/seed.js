import bcrypt from "bcrypt";
import prisma from "../src/databases/prisma.js";

const usuarioDemo = {
  nome: "Usuário Demonstração",
  email: "demo@locadora.com",
  senha: "123456",
};

const veiculos = [
  { marca: "Fiat", modelo: "Uno", placa: "ABC1234", ano: 2020, valorDiaria: 120.5 },
  { marca: "Volkswagen", modelo: "Gol", placa: "DEF5678", ano: 2021, valorDiaria: 135 },
  { marca: "Chevrolet", modelo: "Onix", placa: "GHI1J23", ano: 2022, valorDiaria: 160 },
  { marca: "Hyundai", modelo: "HB20", placa: "JKL4M56", ano: 2023, valorDiaria: 170 },
  { marca: "Toyota", modelo: "Corolla", placa: "MNO7P89", ano: 2023, valorDiaria: 280 },
  { marca: "Honda", modelo: "Civic", placa: "QRS2T34", ano: 2022, valorDiaria: 260 },
  { marca: "Jeep", modelo: "Compass", placa: "UVW5X67", ano: 2024, valorDiaria: 350 },
  { marca: "Renault", modelo: "Kwid", placa: "YZA8B90", ano: 2021, valorDiaria: 110 },
];

async function main() {
  const senhaHash = await bcrypt.hash(usuarioDemo.senha, 10);

  await prisma.usuario.upsert({
    where: { email: usuarioDemo.email },
    update: {},
    create: {
      nome: usuarioDemo.nome,
      email: usuarioDemo.email,
      senha: senhaHash,
    },
  });

  for (const veiculo of veiculos) {
    await prisma.veiculo.upsert({
      where: { placa: veiculo.placa },
      update: {},
      create: veiculo,
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });