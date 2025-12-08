# Railway Deploy Guide

## Instruções para Deploy no Railway

### 1. Acesse Railway
- Vá para: https://railway.app
- Faça login com GitHub

### 2. Criar Novo Projeto
- Clique em "New Project"
- Selecione "Deploy from GitHub repo"
- Escolha o repositório: **H8-Desenvolvimento-de-Sofware**

### 3. Configurar o Serviço Backend
- Railway vai detectar automaticamente o backend
- Se perguntar qual pasta, selecione: **backend**

### 4. Adicionar PostgreSQL
- No projeto, clique em "+ New"
- Selecione "Database" → "Add PostgreSQL"
- Railway vai criar automaticamente e conectar

### 5. Configurar Variáveis de Ambiente
Clique no serviço backend → "Variables" e adicione:

```
NODE_ENV=production
JWT_SECRET=seu-secret-super-seguro-minimo-32-caracteres-aqui
ADMIN_EMAIL=admin
ADMIN_PASSWORD=user
FRONTEND_ORIGIN=https://seu-app.vercel.app
```

**IMPORTANTE**: As variáveis do PostgreSQL são adicionadas automaticamente pelo Railway:
- POSTGRES_HOST
- POSTGRES_PORT
- POSTGRES_USER
- POSTGRES_PASSWORD
- POSTGRES_DB

### 6. Deploy
- Railway vai fazer deploy automaticamente
- Aguarde o build completar (2-3 minutos)
- Copie a URL do backend (ex: `https://accounting-backend-production.up.railway.app`)

### 7. Atualizar Vercel
- Vá para Vercel → Settings → Environment Variables
- Edite `NEXT_PUBLIC_API_URL` com a URL do Railway
- Faça "Redeploy"

### 8. Atualizar CORS no Railway
- Volte no Railway → Variables
- Edite `FRONTEND_ORIGIN` com a URL da Vercel
- Railway vai fazer redeploy automaticamente

## Pronto! 🚀
Seu sistema estará funcionando completamente na nuvem.
