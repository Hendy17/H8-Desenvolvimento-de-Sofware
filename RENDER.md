# Render.com Deploy Guide

## 🚀 Deploy do Backend no Render.com

### Passo 1: Acessar Render
1. Vá para: **https://render.com**
2. Clique em **"Get Started"** ou **"Sign Up"**
3. Faça login com **GitHub**

### Passo 2: Criar Web Service
1. No dashboard, clique em **"New +"**
2. Selecione **"Web Service"**
3. Conecte seu repositório: **H8-Desenvolvimento-de-Sofware**
4. Clique em **"Connect"**

### Passo 3: Configurar o Serviço

**Name**: `h8-backend` (ou qualquer nome)

**Region**: `Oregon (US West)` (mais próximo e grátis)

**Branch**: `main`

**Root Directory**: `backend` ⚠️ **IMPORTANTE!**

**Runtime**: `Node`

**Build Command**: 
```
npm install && npm run build
```

**Start Command**:
```
npm run start:prod
```

**Instance Type**: `Free` ✅

### Passo 4: Adicionar Variáveis de Ambiente

Clique em **"Advanced"** e adicione:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `JWT_SECRET` | `h8-dev-software-secret-key-2025-super-secure` |
| `ADMIN_EMAIL` | `admin` |
| `ADMIN_PASSWORD` | `user` |

### Passo 5: Criar PostgreSQL Database

**ANTES DE CLICAR EM "CREATE WEB SERVICE":**

1. Volte ao dashboard principal
2. Clique em **"New +"** → **"PostgreSQL"**
3. **Name**: `h8-database`
4. **Database**: `accounting`
5. **User**: `accounting`
6. **Region**: `Oregon` (mesma do backend)
7. **Instance Type**: `Free`
8. Clique em **"Create Database"**

### Passo 6: Conectar Database ao Backend

1. Aguarde o PostgreSQL ser criado (~2 min)
2. No PostgreSQL, vá em **"Info"**
3. Copie a **"Internal Database URL"**
4. Volte no **Web Service** (backend)
5. Em **"Environment"**, adicione as variáveis:

**Se usar DATABASE_URL (mais fácil):**
| Key | Value |
|-----|-------|
| `DATABASE_URL` | Cole a URL interna do PostgreSQL |

**OU se usar variáveis separadas:**
| Key | Value |
|-----|-------|
| `POSTGRES_HOST` | Cole do PostgreSQL Info |
| `POSTGRES_PORT` | `5432` |
| `POSTGRES_USER` | `accounting` |
| `POSTGRES_PASSWORD` | Cole do PostgreSQL Info |
| `POSTGRES_DB` | `accounting` |

### Passo 7: Deploy!

1. Clique em **"Create Web Service"**
2. Aguarde o build (5-10 minutos na primeira vez)
3. Quando aparecer **"Live"** ✅, está no ar!

### Passo 8: Copiar URL do Backend

1. No topo da página do serviço, você verá a URL
2. Algo como: `https://h8-backend.onrender.com`
3. **Copie essa URL!**

### Passo 9: Testar

Abra no navegador:
```
https://sua-url.onrender.com
```

Deve retornar algo (pode ser erro 404, mas conectou!)

### Passo 10: Configurar CORS

1. No Render, vá em **Environment**
2. Adicione mais uma variável:

| Key | Value |
|-----|-------|
| `FRONTEND_ORIGIN` | `https://seu-app.vercel.app` |

3. Salve e aguarde redeploy automático

## ⚠️ IMPORTANTE: Free Tier

- App hiberna após 15min de inatividade
- Primeiro acesso após hibernar demora ~30-60s
- PostgreSQL grátis por 90 dias
- Depois dos 90 dias, precisa migrar para outro DB ou pagar $7/mês

## ✅ Próximo Passo

Depois que o backend estiver no ar, precisamos atualizar a Vercel com a URL do Render!

---

**Dúvidas?** Me avisa em qual passo você está! 🚀
