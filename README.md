# 🔐 API de Autenticação com Node.js, Express e Prisma

API RESTful de autenticação utilizando Node.js, Express e Prisma. Implementa autenticação baseada em JSON Web Tokens (JWT), com proteção de rotas via middleware.

---

## 🚀 Funcionalidades

- ✅ Registro de usuário
- ✅ Login com geração de Access Token e Refresh Token
- ✅ Proteção de rotas com middleware JWT

---

## 🛠️ Tecnologias e Ferramentas

- Node.js
- Express
- Prisma + SQLite (ou outro banco)
- JWT (jsonwebtoken)
- dotenv
- bcrypt (para hash de senhas)
- nodemon (para desenvolvimento)

---

## 📦 Instalação

1. Clone o repositório:

```bash
git clone https://github.com/seu-usuario/seu-repositorio.git
```

2. instale as dependências:  
``` bash
npm install
```

3. configure o arquivo .env:
```bash
DATABASE_URL="file:./dev.db"
JWT_SECRET=suaChaveSecreta
JWT_REFRESH_SECRET=suaOutraChaveSecreta
```

4. Configure e execute as migrations do banco:
```bash
npx prisma migrate dev --name init
```

5. Rode o projeto:
```bash
npm run dev
```

