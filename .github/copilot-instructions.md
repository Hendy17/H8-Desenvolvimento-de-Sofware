# Sistema de Contabilidade - AI Coding Instructions

## Architecture Overview

This is a **multi-tenant accounting system** with strict tenant isolation - each user gets their own database. The architecture consists of:

- **Backend**: NestJS with TypeORM, SQLite (production fallback), JWT auth with HttpOnly cookies
- **Frontend**: Next.js 15 with Mantine UI components, shared types via workspace
- **Shared**: TypeScript types shared between frontend/backend via `@shared/types`

### Key Architectural Patterns

**Multi-tenancy via Database Isolation**: Each user gets a unique database (`accounting_${timestamp}_${random}`) created during registration. Auth service handles tenant database provisioning in [auth.service.ts](backend/src/auth/auth.service.ts#L48).

**Excel Processing Queue**: Asynchronous Excel/CSV processing with queue management in [excel-processor.service.ts](backend/src/services/excel-processor.service.ts). Supports Brazilian number formats (`R$ 1.000,00`) and flexible column mapping.

**TypeORM Entity Relationships**: Client → Attachments (1:many), Client → Expenses (1:many). See [client.entity.ts](backend/src/clients/client.entity.ts), [attachment.entity.ts](backend/src/clients/attachment.entity.ts), [expense.entity.ts](backend/src/clients/expense.entity.ts).

## Development Workflow

### Setup Commands
```bash
# Start PostgreSQL (optional - SQLite fallback works)
docker-compose up -d

# Install all dependencies (monorepo)
npm install

# Run both frontend & backend concurrently
npm run dev

# Create admin user
cd backend && npm run seed
```

### File Upload Pattern
File uploads go to [clients.controller.ts](backend/src/clients/clients.controller.ts) → [clients.service.ts](backend/src/clients/clients.service.ts#L37) → Excel processor queue. Files are stored in `backend/uploads/` with metadata in `attachment` entity.

### Authentication Flow
1. Login/register hits [auth.controller.ts](backend/src/auth/auth.controller.ts)
2. JWT token stored in localStorage (frontend) + HttpOnly cookies (backend)
3. Frontend checks auth via [useDashboard.ts](frontend/components/dashboard/useDashboard.ts#L8)
4. All API calls use `withCredentials: true` for cookie auth

## Project-Specific Conventions

### CNPJ Handling
Always normalize CNPJ: `cnpj.replace(/\D/g, '')` before database operations. See [clients.service.ts](backend/src/clients/clients.service.ts#L18).

### Brazilian Data Formats
- Values: `R$ 1.000,00` → parse with comma as decimal separator
- Dates: Support both `YYYY-MM-DD` and Brazilian `DD/MM/YYYY` formats
- Excel columns: Flexible mapping - accepts `categoria/category`, `valor/amount/price`, etc.

### Frontend Component Structure
Components follow pattern: `index.tsx` (main), `styles.module.css`, `use*.ts` (hooks), `types.ts`. See [dashboard component](frontend/components/dashboard/).

### Database Configuration
Production uses SQLite fallback (not PostgreSQL) due to deployment constraints. See [database.module.ts](backend/src/database/database.module.ts#L20) - this is intentional.

### Shared Types
Always import from `@shared/types` for cross-boundary types. Never duplicate interfaces between frontend/backend. See [shared types](shared/src/types/index.ts).

## Critical Integration Points

### Excel Processing Headers
Expected columns (case-insensitive): `categoria/category`, `valor/amount/price`, `descricao/description`, `data/date`. Only category + value are required. See [FORMATO_PLANILHA.md](FORMATO_PLANILHA.md).

### API Authentication
All protected routes require:
- `withCredentials: true` in axios calls
- Optional `Authorization: Bearer ${token}` header from localStorage
- Backend validates both cookies and Bearer tokens

### Period Filtering
Dashboard supports `monthly` (YYYY-MM) and `quarterly` (YYYY-Q1) filtering. Implementation in [clients.service.ts](backend/src/clients/clients.service.ts#L48).

### Environment Variables
- Frontend: `NEXT_PUBLIC_API_URL` (defaults to `http://localhost:3001`)
- Backend: `DATABASE_URL` (optional), `JWT_SECRET`, PostgreSQL vars
- See [DEPLOY.md](DEPLOY.md) for production configuration

## Common Patterns

- **Error Handling**: Use Mantine notifications on frontend, NestJS exceptions on backend
- **State Management**: Custom hooks (`use*.ts`) with local state - no external state manager
- **File Paths**: Always use absolute paths in tools/imports
- **TypeScript**: Strict typing enabled - no `any` types in new code
- **CSS**: CSS modules pattern with Mantine theming
- **Validation**: class-validator on backend DTOs, Mantine form validation on frontend