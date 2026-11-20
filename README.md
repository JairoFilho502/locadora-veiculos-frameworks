# Sistema de Locação de Veículos

Projeto da disciplina Programação com Frameworks Web.

## API

URL base: `http://localhost:3000`

### Convenções

- Requisições e respostas usam JSON (`Content-Type: application/json`).
- Rotas protegidas exigem o header `Authorization: Bearer <token>`, com o token retornado pelo login.
- Erros sempre retornam `{ "error": "mensagem" }`.
- Datas são enviadas e recebidas em formato ISO 8601 (ex.: `2026-11-10T10:00:00Z`).
- Campos monetários (`valorDiaria`, `valorTotal`) são retornados como **string** (ex.: `"300"`); converta com `Number(...)` para exibir ou calcular.

### Resumo

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| GET | `/health` | Não | Verifica se a API está no ar |
| POST | `/auth/register` | Não | Cadastra usuário |
| POST | `/auth/login` | Não | Autentica e retorna o token |
| GET | `/auth/me` | Sim | Retorna o usuário autenticado |
| POST | `/locacoes` | Sim | Registra uma locação |
| GET | `/locacoes` | Sim | Lista as locações do usuário autenticado |
| PATCH | `/locacoes/:id/finalizar` | Sim | Finaliza uma locação |

### Autenticação

#### `POST /auth/register`

Body:

```json
{
  "nome": "Jorge",
  "email": "jorge@teste.com",
  "senha": "123456"
}
```

Regras: `nome` com pelo menos 2 caracteres, `email` válido e único, `senha` com pelo menos 6 caracteres.

Resposta `201`:

```json
{
  "id": 1,
  "nome": "Jorge",
  "email": "jorge@teste.com",
  "createdAt": "2026-11-06T03:29:49.031Z"
}
```

Erros: `400` dados inválidos, `409` e-mail já cadastrado.

#### `POST /auth/login`

Body:

```json
{
  "email": "jorge@teste.com",
  "senha": "123456"
}
```

Resposta `200`:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": 1,
    "nome": "Jorge",
    "email": "jorge@teste.com",
    "createdAt": "2026-11-06T03:29:49.031Z"
  }
}
```

O token expira em 1 dia.

Erros: `400` dados inválidos, `401` credenciais inválidas.

#### `GET /auth/me`

Resposta `200`: mesmo formato de `usuario` retornado no login.

Erros: `401` token ausente, mal formado, inválido ou expirado.

### Locações

Todas as rotas exigem autenticação. O usuário da locação é sempre o dono do token; não envie `usuarioId` no body.

#### `POST /locacoes`

Body:

```json
{
  "veiculoId": 1,
  "dataInicio": "2026-11-10T10:00:00Z",
  "dataPrevistaDevolucao": "2026-11-12T11:00:00Z"
}
```

Regras:

- `dataPrevistaDevolucao` deve ser posterior a `dataInicio`.
- O veículo deve existir e estar disponível.
- O valor é calculado pela API: cada fração de 24 horas conta como uma diária completa (no exemplo, 49h = 3 diárias).
- Ao registrar, o veículo passa a `disponivel: false`.

Resposta `201`:

```json
{
  "id": 1,
  "usuarioId": 1,
  "veiculoId": 1,
  "dataInicio": "2026-11-10T10:00:00.000Z",
  "dataPrevistaDevolucao": "2026-11-12T11:00:00.000Z",
  "dataDevolucao": null,
  "valorTotal": "300",
  "status": "ATIVA",
  "veiculo": {
    "id": 1,
    "marca": "Fiat",
    "modelo": "Uno",
    "placa": "ABC1D23",
    "ano": 2020,
    "valorDiaria": "100",
    "disponivel": false
  }
}
```

Erros: `400` dados ou datas inválidos, `401` não autenticado, `404` veículo não encontrado, `409` veículo indisponível para locação.

#### `GET /locacoes`

Retorna as locações do usuário autenticado (ativas e finalizadas), da mais recente para a mais antiga, cada uma com o objeto `veiculo` incluído.

Resposta `200`: array de locações no mesmo formato da resposta de `POST /locacoes`.

Erros: `401` não autenticado.

#### `PATCH /locacoes/:id/finalizar`

Sem body. Registra a data de devolução, altera o status para `FINALIZADA` e torna o veículo disponível novamente.

Resposta `200`: a locação atualizada, com `status: "FINALIZADA"`, `dataDevolucao` preenchida e `veiculo.disponivel: true`.

Erros: `400` id inválido, `401` não autenticado, `403` locação pertence a outro usuário, `404` locação não encontrada, `409` locação já finalizada.

### Veículos

Rotas em desenvolvimento.