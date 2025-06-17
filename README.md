# Short URL API

API para encurtar URLs que permite uso por usuários autenticados e não autenticados. Usuários autenticados podem criar, listar, editar, deletar URLs e ver estatísticas de cliques. Usuários não autenticados podem apenas criar e acessar URLs.

## Tecnologias

- Node.js v23.9.0
- NestJS v11.1.3
- PostgreSQL (via Docker Compose)
- Redis (cache)
- Yarn v1.22.22
- Swagger
## Instalação

- Clone o repositório:
   ```bash
   git clone https://github.com/miguelleite21/short-url.git
   cd short-url
   ```
## Configuração

- Copie o arquivo `.env.example` para `.env` e ajuste as variáveis conforme necessário:
   ```bash
   cp .env.example .env
   ```

   As variáveis disponíveis são:
   - `PORT`: Porta da aplicação (padrão: 3000)
   - `DB_HOST`: Host do banco de dados (use `db` para Docker Compose, ou `localhost` para desenvolvimento local)
   - `DB_PORT`: Porta do banco de dados (padrão: 5432)
   - `DB_NAME`: Nome do banco de dados (padrão: shorturl)
   - `DB_USER`: Usuário do banco de dados (padrão: postgres)
   - `DB_PASS`: Senha do banco de dados (padrão: postgres)
   - `JWT_SECRET`: Chave secreta para tokens JWT (exemplo: sua_chave_super_secreta)
   - `JWT_EXPIRES_IN`: Tempo de expiração dos tokens JWT (padrão: 12h)
   - `BASE_URL`: URL base da aplicação (padrão: http://localhost:3000)
   - `CACHE_HOST`: Host do Redis (padrão: localhost)
   - `CACHE_PORT`: Porta do Redis (padrão: 6379)
   - `CACHE_USERNAME`: Usuário do Redis (opcional)
   - `CACHE_PASSWORD`: Senha do Redis (opcional)

## Execução

1. Para rodar a aplicação junto com o banco de dados e o Redis usando containers, utilize o Docker Compose:

```bash
docker compose up --build -d
```

2. E depois para executar as migrations:
```bash
docker compose exec app yarn migrate
```

## Documentação da API

A API é documentada usando Swagger, que fornece uma interface interativa para explorar e testar os endpoints. Para acessar a documentação:

1. Inicie a aplicação:
   ```bash
   yarn start:dev
   ```
2. Acesse `http://localhost:3000/api` no seu navegador ou ferramenta de requisições HTTP.

Na interface do Swagger, você pode:
- Visualizar todos os endpoints disponíveis, incluindo esquemas de entrada e saída.
- Testar requisições diretamente, incluindo autenticação com tokens JWT.
- Ver exemplos de payloads e respostas esperadas.

## Testes

- Para rodar testes unitários:
  ```bash
  yarn test
  ```




