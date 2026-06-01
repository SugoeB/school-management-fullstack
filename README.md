# Sistema de Gestão Escolar

Sistema Full Stack desenvolvido para gerenciamento de usuários, escolas, professores e alunos.

O projeto foi desenvolvido utilizando **Angular**, **NestJS**, **PostgreSQL** e **JWT**, seguindo uma arquitetura baseada em API REST, autenticação segura e separação entre frontend e backend.

---

# Funcionalidades

## Usuários

* Cadastro de usuários
* Login utilizando CPF e senha
* Armazenamento seguro de senha com bcrypt
* Autenticação utilizando JWT

## Escolas

* Cadastro de escolas
* Listagem de escolas

## Professores

* Cadastro de professores
* Associação de professores a uma escola
* Listagem de professores

## Alunos

* Cadastro de alunos
* Associação de alunos a um professor
* Relacionamento indireto com escola
* Listagem de alunos

## Segurança

* Rotas protegidas por JWT
* Angular Guard para proteção de páginas
* HTTP Interceptor para envio automático do token
* Validação de dados no frontend e backend

---

# Tecnologias Utilizadas

## Backend

* Node.js
* NestJS
* PostgreSQL
* JWT
* bcrypt
* pg
* class-validator

## Frontend

* Angular
* Angular Material
* SCSS
* Reactive Forms
* Angular Standalone Components

---

# Arquitetura

O projeto foi dividido em duas aplicações independentes:

## Backend (NestJS)

Responsável por:

* Autenticação
* Regras de negócio
* Persistência de dados
* Integração com PostgreSQL
* Validação dos dados

## Frontend (Angular)

Responsável por:

* Interface do usuário
* Consumo da API
* Controle de autenticação
* Navegação entre telas
* Experiência do usuário

---

# Pré-requisitos

Antes de executar o projeto, é necessário possuir instalado:

* Node.js
* npm
* Angular CLI
* PostgreSQL

Verificar instalações:

```bash
node -v
npm -v
ng version
psql --version
```

---

# Como Executar o Projeto

## 1. Clonar o repositório

```bash
git clone URL_DO_REPOSITORIO
cd desafio-estagio
```

---

## 2. Configurar o PostgreSQL

Acessar o PostgreSQL:

```bash
sudo -u postgres psql
```

Criar banco e usuário:

```sql
CREATE DATABASE school_management;

CREATE USER school_user
WITH PASSWORD '123456';

GRANT ALL PRIVILEGES
ON DATABASE school_management
TO school_user;

ALTER DATABASE school_management
OWNER TO school_user;

\q
```

---

## 3. Configurar o Backend

Entrar na pasta:

```bash
cd backend
```

Instalar dependências:

```bash
npm install
```

Criar arquivo `.env`:

```env
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_USER=school_user
DB_PASSWORD=123456
DB_NAME=school_management

JWT_SECRET=super_secret_key_123456
JWT_EXPIRES=1d
```

Executar o script SQL:

```bash
psql -U school_user -d school_management -f sql/database.sql
```

Caso ocorram problemas de permissão:

```bash
sudo -u postgres psql -d school_management
```

Executar:

```sql
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO school_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO school_user;
GRANT ALL PRIVILEGES ON SCHEMA public TO school_user;

\q
```

Executar novamente:

```bash
psql -U school_user -d school_management -f sql/database.sql
```

Iniciar o backend:

```bash
npm run start:dev
```

Backend disponível em:

```txt
http://localhost:3000
```

---

## 4. Configurar o Frontend

Abrir novo terminal.

Entrar na pasta:

```bash
cd frontend
```

Instalar dependências:

```bash
npm install
```

Caso necessário:

```bash
npm install @angular/animations
npm install zone.js
```

Verificar o arquivo:

```txt
src/environments/environment.ts
```

Conteúdo esperado:

```ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
};
```

Executar o frontend:

```bash
ng serve
```

Frontend disponível em:

```txt
http://localhost:4200
```

---

## 5. Primeiro Acesso

Acessar:

```txt
http://localhost:4200/register
```

Criar usuário:

```txt
Nome: Administrador
CPF: 11111111111
Senha: 123456
Data de nascimento: 2000-01-01
```

Após o cadastro:

```txt
http://localhost:4200/login
```

Entrar utilizando:

```
CPF: 11111111111
Senha: 123456
```

---

# Fluxo de Utilização

Após autenticação:

```
Dashboard
   ↓
Escolas
   ↓
Professores
   ↓
Alunos
```

Fluxo recomendado:

1. Criar uma escola.
2. Criar um professor associado à escola.
3. Criar um aluno associado ao professor.
4. Consultar as listagens.

---

# Principais Endpoints

## Autenticação

```http
POST /api/login
GET /api/profile
```

## Usuários

```http
POST /api/users
GET /api/users
```

## Escolas

```http
POST /api/schools
GET /api/schools
```

## Professores

```http
POST /api/teachers
GET /api/teachers
```

## Alunos

```http
POST /api/students
GET /api/students
```

---


# Segurança

O projeto implementa:

* Hash de senhas com bcrypt.
* Autenticação via JWT.
* Proteção de rotas no backend.
* Proteção de rotas no frontend.
* Interceptor para envio automático do token.
* Validação de DTOs com class-validator.
* Validação de formulários Angular.

---

# Autor

Desenvolvido por Alberto Felix como solução para desafio técnico de estágio.

---
