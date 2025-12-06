# H8 Desenvolvimento de Software - Sistema de Contabilidade

Sistema completo de gestão contábil com análise de despesas, desenvolvido com arquitetura full-stack moderna.

## 🚀 Tecnologias

### Backend
- **NestJS** - Framework Node.js progressivo
- **TypeORM** - ORM para TypeScript/JavaScript
- **PostgreSQL** - Banco de dados relacional
- **JWT** - Autenticação com HttpOnly cookies
- **Multer** - Upload de arquivos
- **XLSX** - Processamento de planilhas Excel/CSV

### Frontend
- **Next.js** - Framework React com SSR
- **Ant Design** - Biblioteca de componentes UI
- **Recharts** - Biblioteca de gráficos
- **Axios** - Cliente HTTP

## 📋 Funcionalidades

### Autenticação e Multi-tenancy
- ✅ Registro de usuários com criação automática de banco de dados isolado
- ✅ Login seguro com JWT em HttpOnly cookies
- ✅ Sistema multi-tenant (cada usuário tem seu próprio banco)

### Gestão de Clientes
- ✅ Cadastro de clientes com validação de CNPJ
- ✅ Busca de clientes por CNPJ com formatação automática
- ✅ Formatação automática: `00.000.000/0000-00`

### Upload e Processamento de Planilhas
- ✅ Upload de múltiplos arquivos (Excel/CSV)
- ✅ Processamento automático de planilhas
- ✅ Extração de dados de despesas (categoria, valor, descrição, data)
- ✅ Suporte a formatos brasileiros de valores: `R$ 1.000,00`
- ✅ Audit trail: rastreamento de quem fez upload
- ✅ Metadados persistidos no banco de dados

### Analytics e Visualização
- ✅ Dashboard com gráfico de pizza mostrando despesas por categoria
- ✅ Cards estatísticos (total de despesas, maior categoria)
- ✅ Agregação automática de valores por categoria
- ✅ Interface responsiva e intuitiva

## 🏗️ Estrutura do Projeto

```
accounting/
├── backend/
│   ├── src/
│   │   ├── auth/          # Autenticação e autorização
│   │   ├── clients/       # Gestão de clientes, anexos e despesas
│   │   ├── users/         # Entidade de usuários
│   │   ├── tenants/       # Sistema multi-tenant
│   │   ├── migrations/    # Migrações do banco
│   │   └── seed/          # Scripts de seed
│   └── uploads/           # Arquivos enviados
├── frontend/
│   ├── components/
│   │   ├── dashboard/     # Dashboard principal
│   │   ├── header-right/  # Menu de ações lateral
│   │   ├── login/         # Componentes de login
│   │   └── register/      # Componentes de registro
│   └── pages/
│       ├── cliente/       # Página de analytics por cliente
│       ├── dashboard/     # Dashboard principal
│       └── login/         # Página de login
└── docker-compose.yml     # PostgreSQL via Docker
```

## 🚀 Quickstart

### 1. Configuração Inicial

```bash
# Clone o repositório
git clone https://github.com/Hendy17/H8-Desenvolvimento-de-software.git
cd H8-Desenvolvimento-de-software

# Configure variáveis de ambiente
cp .env.example .env
# Edite .env com suas credenciais
```

### 2. Inicie o PostgreSQL

```bash
docker-compose up -d
```

### 3. Configure e Inicie o Backend

```bash
cd backend
npm install

# Criar usuário admin inicial
npm run seed

# Iniciar servidor de desenvolvimento
npm run start:dev
```

O backend estará disponível em `http://localhost:3001`

### 4. Configure e Inicie o Frontend

```bash
cd frontend
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

O frontend estará disponível em `http://localhost:3000`

## 👤 Credenciais Padrão

- **Usuário:** `admin`
- **Senha:** `user`

## 📊 Como Usar o Sistema

### 1. Fazer Login
Acesse `http://localhost:3000` e faça login com as credenciais padrão

### 2. Cadastrar Cliente
- Clique no ícone de engrenagem (⚙️) no canto esquerdo
- Selecione "Cadastrar novo cliente"
- Preencha CNPJ, nome e endereço
- O CNPJ será formatado automaticamente

### 3. Buscar Cliente
- Clique no ícone de engrenagem (⚙️)
- Selecione "Buscar CNPJ"
- Digite o CNPJ do cliente
- Você será redirecionado para o dashboard do cliente

### 4. Anexar Planilhas de Despesas
- Na página do cliente, clique em "Anexar Planilhas"
- Selecione uma ou mais planilhas Excel (.xlsx, .xls) ou CSV
- O sistema processará automaticamente e extrairá os dados
- Os gráficos serão atualizados automaticamente

### 5. Visualizar Analytics
O dashboard do cliente mostra:
- Total de despesas em R$
- Maior categoria de gasto
- Gráfico de pizza com distribuição por categoria
- Lista detalhada de categorias com valores e percentuais

## 📄 Formato da Planilha

Para que o sistema processe automaticamente suas planilhas, use o seguinte formato:

### Colunas Aceitas

| Coluna | Nomes Aceitos | Obrigatório | Exemplo |
|--------|---------------|-------------|---------|
| **Categoria** | categoria, Categoria, category, "Categoria de Gasto" | ✅ Sim | Salários |
| **Valor** | valor, Valor, amount, "Valor (R$)" | ✅ Sim | 45000 ou R$ 45.000,00 |
| **Descrição** | descricao, descrição, description, Descrição | ❌ Não | Folha de pagamento |
| **Data** | data, Data, date | ❌ Não | 05/05 ou 15/01/2024 |

### Exemplo de Planilha

```
| Data  | Descrição                 | Categoria de Gasto | Valor (R$) |
|-------|---------------------------|-------------------|------------|
| 05/05 | Aluguel do Escritório     | Operacionais      | 4.500,00   |
| 07/05 | Salários (Mês Anterior)   | Pessoal           | 15.200,00  |
| 10/05 | Material de Escritório    | Administrativos   | 350        |
| 15/05 | Campanha Google Ads       | Marketing         | 2.100,00   |
| 20/05 | Conta de Energia          | Operacionais      | 680        |
```

### Formatos de Valor Aceitos
- `45000` ou `45000.00` (numérico)
- `R$ 45.000,00` (formato brasileiro)
- `45,000.00` (formato internacional)
- `1.000,00` (com separadores BR)

## 🗄️ Banco de Dados

### Entidades Principais

- **User**: Usuários do sistema com seus bancos isolados
- **Client**: Clientes cadastrados (CNPJ, nome, endereço)
- **Expense**: Despesas dos clientes (categoria, valor, descrição, data)
- **Attachment**: Metadados dos arquivos enviados

### Multi-tenancy
Cada usuário que se registra recebe:
- Um banco de dados PostgreSQL isolado
- Execução automática de migrações
- Namespace próprio para seus dados

## 🔒 Segurança

- ✅ Senhas hasheadas com bcrypt
- ✅ JWT armazenado em HttpOnly cookies (protegido contra XSS)
- ✅ CORS configurado com credenciais
- ✅ Validação de CNPJ (14 dígitos)
- ✅ Isolamento de dados por tenant

## 🧪 Dados de Teste

Execute o seed para criar dados de exemplo:

```bash
cd backend

# Criar usuário admin
npm run seed

# Criar cliente de teste (CNPJ: 00000000000191)
npx ts-node src/seed/create_client.ts

# Criar despesas de teste
npx ts-node src/seed/create_expenses.ts
```

## 🛠️ Scripts Disponíveis

### Backend
```bash
npm run start:dev    # Desenvolvimento com hot-reload
npm run build        # Build para produção
npm run start        # Iniciar produção
npm run seed         # Criar usuário admin
```

### Frontend
```bash
npm run dev          # Desenvolvimento
npm run build        # Build para produção
npm run start        # Iniciar produção
```

## 📦 Dependências Principais

### Backend
- `@nestjs/core` ^10.0.0
- `@nestjs/typeorm` ^10.0.0
- `typeorm` ^0.3.17
- `pg` ^8.11.3
- `bcrypt` ^5.1.1
- `@nestjs/jwt` ^10.1.1
- `multer` ^1.4.5-lts.1
- `xlsx` ^0.18.5

### Frontend
- `next` ^14.0.0
- `react` ^18.2.0
- `antd` ^5.11.0
- `recharts` ^2.10.0
- `axios` ^1.6.0

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto é desenvolvido por **H8 Desenvolvimento de Software**.

## 👨‍💻 Autor

Hendy Vorpagel - [GitHub](https://github.com/Hendy17)

## 🔗 Links

- [Repositório](https://github.com/Hendy17/H8-Desenvolvimento-de-software)
- [Documentação de Formato de Planilha](./FORMATO_PLANILHA.md)
