# Short URL API

API para encurtar URLs que permite uso por usuários autenticados e não autenticados. Usuários autenticados podem criar, listar, editar, deletar URLs e ver estatísticas de cliques. Usuários não autenticados podem apenas criar e acessar URLs.

## Tecnologias

- Node.js v23.9.0
- NestJS v11.1.3
- PostgreSQL (via Docker Compose)
- Yarn v1.22.22

## Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/miguelleite21/shortURL
   cd short-url
   ```

2. Instale as dependências:
   ```bash
   yarn install
   ```

3. Inicie o banco de dados PostgreSQL via Docker Compose:
   ```bash
   docker-compose up -d
   ```

## Configuração

1. Copie o arquivo `.env.example` para `.env` e ajuste as variáveis conforme necessário:
   ```bash
   cp .env.example .env
   ```

   As variáveis disponíveis são:
   - `PORT`: Porta da aplicação (padrão: 3000)
   - `DB_HOST`: Host do banco de dados (padrão: localhost)
   - `DB_PORT`: Porta do banco de dados (padrão: 5432)
   - `DB_NAME`: Nome do banco de dados (padrão: shorturl)
   - `DB_USER`: Usuário do banco de dados (padrão: postgres)
   - `DB_PASS`: Senha do banco de dados (padrão: postgres)
   - `JWT_SECRET`: Chave secreta para tokens JWT (exemplo: sua_chave_super_secreta)
   - `JWT_EXPIRES_IN`: Tempo de expiração dos tokens JWT (padrão: 12h)
   - `BASE_URL`: URL base da aplicação (padrão: http://localhost:3000)

2. Aplique as migrações do banco de dados:
   ```bash
   yarn migrate
   ```

## Execução

- Para rodar em modo de desenvolvimento:
  ```bash
  yarn start:dev
  ```

- Para rodar em modo de produção:
  ```bash
  yarn start:prod
  ```

A aplicação estará disponível em `http://localhost:3000` por padrão.

## Uso

### Autenticação

- **Registro**:
  - Endpoint: `POST /auth/register`
  - Requisitos: Email válido e senha com no mínimo 6 caracteres.
  - Exemplo:
    ```bash
    curl -X POST http://localhost:3000/auth/register -H "Content-Type: application/json" -d '{"email": "user@example.com", "password": "strongpassword"}'
    ```

- **Login**:
  - Endpoint: `POST /auth/login`
  - Requisitos: Email válido e senha correta.
  - Exemplo:
    ```bash
    curl -X POST http://localhost:3000/auth/login -H "Content-Type: application/json" -d '{"email": "user@example.com", "password": "strongpassword"}'
    ```

### Endpoints

#### Criar URL encurtada

- **Método**: `POST /urls/shorten`
- **Descrição**: Cria uma nova URL encurtada a partir de uma URL original fornecida. Usuários autenticados podem associar a URL à sua conta, mas a autenticação é opcional.
- **Autenticação**: Não requerida (autenticação opcional com token JWT no header `Authorization`).
- **Payload**:
  ```json
  { "url": "https://example.com" }
  ```
- **Exemplo (sem autenticação)**:
  ```bash
  curl -X POST http://localhost:3000/urls/shorten -H "Content-Type: application/json" -d '{"url": "https://example.com"}'
  ```
- **Exemplo (com autenticação)**:
  ```bash
  curl -X POST http://localhost:3000/urls/shorten -H "Content-Type: application/json" -H "Authorization: Bearer seu_token" -d '{"url": "https://example.com"}'
  ```

#### Acessar URL encurtada

- **Método**: `GET /:slug`
- **Descrição**: Redireciona para a URL original associada ao slug fornecido e incrementa o contador de cliques da URL.
- **Autenticação**: Não requerida.
- **Exemplo**:
  ```bash
  curl http://localhost:3000/abc123
  ```
- **Nota**: Este endpoint realiza um redirecionamento HTTP para a URL original.

#### Listar URLs do usuário

- **Método**: `GET /urls/list`
- **Descrição**: Retorna uma lista de todas as URLs encurtadas criadas pelo usuário autenticado.
- **Autenticação**: Requerida (use o token JWT no header `Authorization`).
- **Exemplo**:
  ```bash
  curl -X GET http://localhost:3000/urls/list -H "Authorization: Bearer seu_token"
  ```

#### Atualizar URL encurtada

- **Método**: `PUT /urls/:id`
- **Descrição**: Atualiza a URL original associada a um ID específico. Apenas o criador da URL pode modificá-la.
- **Autenticação**: Requerida (use o token JWT no header `Authorization`).
- **Payload**:
  ```json
  { "url": "https://new-url.com" }
  ```
- **Exemplo**:
  ```bash
  curl -X PUT http://localhost:3000/urls/1 -H "Authorization: Bearer seu_token" -H "Content-Type: application/json" -d '{"url": "https://new-url.com"}'
  ```

#### Deletar URL encurtada

- **Método**: `DELETE /urls/:id`
- **Descrição**: Deleta uma URL encurtada pelo ID. Apenas o criador da URL pode deletá-la.
- **Autenticação**: Requerida (use o token JWT no header `Authorization`).
- **Exemplo**:
  ```bash
  curl -X DELETE http://localhost:3000/urls/1 -H "Authorization: Bearer seu_token"
  ```

## Testes

- Para rodar testes unitários:
  ```bash
  yarn test
  ```


