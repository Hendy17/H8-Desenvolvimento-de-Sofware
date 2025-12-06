# Guia de Deploy - Sistema de Contabilidade H8

Este guia explica como fazer o deploy da aplicação para produção usando Vercel (frontend) e Railway (backend).

## ✅ Preparação Concluída

O código já está preparado para deploy com:
- ✅ Variáveis de ambiente configuradas
- ✅ Scripts de build prontos
- ✅ CORS configurado para produção
- ✅ Arquivos `.env.example` criados
- ✅ `Procfile` para Railway
- ✅ `vercel.json` para Vercel

---

## Variáveis de Ambiente para Vercel

## Frontend (Next.js)
Adicione estas variáveis no painel da Vercel:

```
NEXT_PUBLIC_API_URL=https://seu-backend.up.railway.app
```

## Backend (Railway)
Adicione estas variáveis no painel do Railway:

```
# Banco de Dados (Railway provê automaticamente)
POSTGRES_HOST=containers-us-west-xxx.railway.app
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=xxx
POSTGRES_DB=railway

# JWT
JWT_SECRET=seu-secret-super-seguro-aqui-min-32-caracteres

# Admin inicial
ADMIN_EMAIL=admin
ADMIN_PASSWORD=user

# CORS
FRONTEND_URL=https://seu-site.vercel.app
```

## Como Configurar:

### 1. Deploy do Backend no Railway:
1. Acesse https://railway.app
2. Login com GitHub
3. New Project → Deploy from GitHub repo
4. Selecione seu repositório
5. Configure as variáveis de ambiente acima
6. Railway vai detectar automaticamente o NestJS
7. Adicione um PostgreSQL service
8. Copie a URL do backend (algo como https://seu-backend.up.railway.app)

### 2. Deploy do Frontend na Vercel:
1. Acesse https://vercel.com
2. Login com GitHub
3. Import Project → selecione seu repositório
4. Configure:
   - Framework Preset: Next.js
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `.next`
5. Adicione a variável de ambiente:
   - `NEXT_PUBLIC_API_URL` = URL do seu backend no Railway
6. Deploy!

### 3. Atualizar CORS no Backend:
Depois do deploy, adicione a URL da Vercel nas variáveis do Railway:
```
FRONTEND_URL=https://seu-app.vercel.app
```
