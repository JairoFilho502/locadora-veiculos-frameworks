# Sistema de Locação de Veículos

Projeto final da disciplina Programação com Frameworks Web. O sistema permite que uma locadora cadastre veículos, controle a disponibilidade e registre as locações feitas por usuários autenticados, com API REST em Node.js e interface em React.

## Integrantes

| Nome completo | Responsabilidade |
|---|---|
| Jairo George Gama Filho | Base do projeto e autenticação |
| Arthur Dias de Azevedo | Veículos, dados de exemplo e README |
| Jorge | Locações (backend) |
| Joao Vitor Fujarra de Santana Santos | Locações (frontend) e interface geral |

## Tecnologias

- Node.js e Express
- Prisma ORM com MySQL
- JWT (jsonwebtoken) e bcrypt
- Zod para validação de entradas
- React

## Funcionalidades

- Cadastro e login de usuários, com senha armazenada como hash e autenticação por token JWT.
- Cadastro de veículos com placa única e valor da diária positivo.
- Listagem de veículos, com filtro de disponibilidade.
- Registro, consulta do histórico e finalização de locações, com cálculo do valor total no backend.

## Requisitos

- Node.js 20.19 ou superior
- npm
- MySQL 8 ou superior em execução na máquina
- Git

## Instalação e execução do backend

1. Clone o repositório e entre na pasta do backend:

```bash
git clone <URL_DO_REPOSITORIO>
cd locadora-veiculos-frameworks/Backend
```

2. Instale as dependências:

```bash
npm install
```

3. Crie o arquivo `.env` a partir do modelo e preencha com os dados do seu MySQL:

```bash
cp .env.example .env
```

No Windows (PowerShell):

```powershell
Copy-Item .env.example .env
```

Variáveis do `.env`:

```
DATABASE_URL="mysql://USUARIO:SENHA@localhost:3306/locadora"
DB_HOST=localhost
DB_USER=USUARIO
DB_PASSWORD=SENHA
DB_NAME=locadora
PORT=3000
JWT_SECRET=um_texto_longo_e_secreto
```

Os valores de `DATABASE_URL` e de `DB_HOST`, `DB_USER`, `DB_PASSWORD` e `DB_NAME` devem ser equivalentes. Caracteres especiais na senha precisam ser codificados na `DATABASE_URL`. O arquivo `.env` não é versionado.

4. Crie o banco e as tabelas aplicando as migrations, e gere o Prisma Client:

```bash
npx prisma migrate dev
npx prisma generate
```

O Prisma cria o banco `locadora` caso ele não exista. Se o usuário do MySQL não tiver permissão para isso, crie o banco manualmente com `CREATE DATABASE locadora;` e rode os comandos novamente.

5. Popule o banco com os dados de exemplo:

```bash
npm run seed
```

6. Inicie a API:

```bash
npm run dev
```

A API fica disponível em `http://localhost:3000`. Para verificar, acesse `http://localhost:3000/health`, que deve responder `{"status":"ok"}`.

## Dados de exemplo

O comando `npm run seed` cria um usuário de demonstração e 8 veículos. Ele pode ser executado várias vezes sem duplicar registros.

| Campo | Valor |
|---|---|
| E-mail | `demo@locadora.com` |
| Senha | `123456` |

## Endpoints

Todas as rotas, exceto cadastro, login e `/health`, exigem o cabeçalho `Authorization: Bearer <token>`.

### Autenticação

| Método | Rota | Descrição |
|---|---|---|
| POST | `/auth/register` | Cadastra um usuário (`nome`, `email`, `senha`) |
| POST | `/auth/login` | Autentica e retorna `token` e `usuario` |
| GET | `/auth/me` | Retorna os dados do usuário autenticado |

### Veículos

| Método | Rota | Descrição |
|---|---|---|
| POST | `/veiculos` | Cadastra um veículo (`marca`, `modelo`, `placa`, `ano`, `valorDiaria`) |
| GET | `/veiculos` | Lista todos os veículos |
| GET | `/veiculos?disponivel=true` | Lista apenas os veículos disponíveis |
| GET | `/veiculos?disponivel=false` | Lista apenas os veículos indisponíveis |

Exemplo de corpo para cadastro de veículo:

```json
{
  "marca": "Fiat",
  "modelo": "Uno",
  "placa": "ABC-1234",
  "ano": 2020,
  "valorDiaria": 120.5
}
```

### Códigos de resposta

| Código | Situação |
|---|---|
| 200 | Consulta realizada |
| 201 | Registro criado |
| 400 | Dados inválidos |
| 401 | Token ausente, inválido ou expirado, ou credenciais incorretas |
| 409 | Conflito, como e-mail ou placa já cadastrados |
| 500 | Erro interno do servidor |

As respostas de erro seguem o formato `{ "error": "mensagem" }`.

## Testando a API no VS Code

O arquivo `Backend/requests/api.http` reúne as requisições de exemplo (cadastro, login, veículos e filtros). Para usá-lo, instale a extensão REST Client, envie primeiro a requisição de **Login** e depois as demais, que reaproveitam o token retornado.

## Organização do backend

```
Backend/
  prisma/          schema.prisma, migrations e seed.js
  requests/        requisições de exemplo (api.http)
  src/
    routes/        mapeamento dos endpoints
    controllers/   entrada e resposta HTTP
    services/      validações e regras de negócio
    schemas/       validação das entradas com Zod
    middlewares/   autenticação e tratamento de erros
    errors/        ApiError
    databases/     instância do Prisma Client
```

## Modelagem do banco

- **Usuario**: id, nome, e-mail (único), senha (hash) e data de cadastro.
- **Veiculo**: id, marca, modelo, placa (única), ano, valor da diária e disponibilidade.
- **Locacao**: id, usuário, veículo, data de início, data prevista de devolução, data efetiva de devolução (opcional), valor total e status.
- Um usuário possui várias locações e um veículo possui várias locações (relacionamentos 1:N definidos no `schema.prisma`, com chaves estrangeiras e migrations).

## Decisões de implementação

- Route, Controller e Service são separados. As rotas apenas mapeiam os endpoints, os controllers cuidam da requisição e da resposta HTTP, e os services concentram validações e regras de negócio.
- As entradas são validadas com Zod nos services. Os erros de validação são convertidos em resposta `400` por um middleware de tratamento de erros.
- As senhas são armazenadas com bcrypt e nunca retornam nas respostas da API, porque as consultas selecionam apenas os campos públicos do usuário.
- O login retorna um JWT com validade de 1 dia, que leva o id do usuário. O middleware de autenticação valida o token e disponibiliza o id do usuário na requisição, de modo que a identificação do usuário vem do token e não de um campo enviado pelo cliente.
- Todas as rotas de veículos são protegidas pelo middleware de autenticação.
- A placa é normalizada antes de ser salva, em maiúsculas e sem hífen (`abc-1234` vira `ABC1234`), e aceita os formatos antigo e Mercosul. Com isso, a regra de placa única não é burlada por diferenças de formatação.
- A unicidade da placa e do e-mail é verificada no service, para devolver uma mensagem clara, e também garantida pelo índice único do banco. Se duas requisições simultâneas passarem pela verificação, o erro de violação de unicidade do banco é convertido em resposta `409`.
- O valor da diária é armazenado como `Decimal(10,2)`. O Prisma o serializa como texto na resposta JSON (por exemplo, `"120.5"`), e o frontend deve convertê-lo para número ao exibir ou calcular.
- Todo veículo cadastrado começa como disponível.
- O seed usa `upsert`, o que o torna idempotente: executá-lo novamente não duplica usuários nem veículos.
