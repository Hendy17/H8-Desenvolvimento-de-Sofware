# Accounting (Full-stack scaffold)

Projeto full-stack TypeScript:
- `backend/` — NestJS + TypeORM + PostgreSQL (API)
- `frontend/` — Next.js + Ant Design (UI)

Objetivo inicial: página de login única usando Ant Design Layout.

Quickstart (macOS / zsh):

1. Copie variáveis de ambiente:

```bash
cp .env.example .env
# edite .env se quiser
```

2. Inicie PostgreSQL:

```bash
docker-compose up -d
```

3. Instale dependências e rode seed (backend):

```bash
cd backend
npm install
# criar usuário inicial
npm run seed
npm run start:dev
```

4. Inicie frontend:

```bash
cd ../frontend
npm install
npm run dev
```

Frontend disponível em `http://localhost:3000` e backend em `http://localhost:3001`.

Observações:
- O login inicial é o usuário único definido em `.env` (`ADMIN_EMAIL`/`ADMIN_PASSWORD`).
- Ant Design é a biblioteca principal do frontend (Layout e componentes).
