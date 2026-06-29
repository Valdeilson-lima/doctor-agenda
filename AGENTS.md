<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Doctor Agenda — Contexto do Projeto

## Visão Geral

Sistema de agendamento de consultas médicas. Stack: Next.js 16 + React 19 + TypeScript 5 (strict) + Tailwind CSS v4 + shadcn/ui v4 (radix-nova) + Drizzle ORM + PostgreSQL + better-auth.

## Arquitetura

```
src/
├── app/                        # App Router (layouts, pages, rotas)
│   ├── layout.tsx              # Root layout: ThemeProvider + Toaster (sonner)
│   ├── page.tsx                # Home page pública
│   ├── globals.css             # Tema shadcn/ui + Tailwind v4
│   ├── api/
│   │   └── auth/
│   │       └── [...all]/route  # better-auth API handler
│   ├── authentication/
│   │   ├── page.tsx            # Login/Register page
│   │   └── components/         # login-form.tsx, register-form.tsx
│   └── dashboard/
│       ├── layout.tsx          # Auth guard — redireciona p/ /authentication se não logado
│       ├── page.tsx            # Dashboard (verifica se usuário tem clínica)
│       └── clinic-form/        # Fluxo de cadastro de clínica
│           ├── page.tsx        # Server component
│           ├── clinic-form.tsx # Client form com useActionState
│           └── actions.ts      # Server action: cria clínica + vincula ao usuário
├── components/                 # Componentes React
│   ├── ui/                     # shadcn/ui primitives (button, card, input, label, dropdown-menu, sonner, tabs)
│   ├── ModeToggle.tsx
│   └── theme-provider.tsx
├── db/                         # Drizzle ORM
│   ├── schema.ts               # 9 tabelas, enums, relations (API legacy `_relations`)
│   └── index.ts                # Conexão: drizzle() + defineRelations()
├── lib/
│   ├── auth.ts                 # Config better-auth (email/password)
│   ├── auth-client.ts          # better-auth client
│   └── utils.ts                # cn() — clsx + tailwind-merge
drizzle/                        # Migrations geradas pelo drizzle-kit
```

## Stack Detalhada

| Tecnologia | Versão | Observações |
|---|---|---|
| Next.js | 16.2.9 | App Router; React Compiler habilitado (`reactCompiler: true`) |
| React | 19.2.4 | Server Components; `"use client"` quando necessário; `useActionState` disponível |
| TypeScript | ^5 | Strict mode; path alias `@/` → `./src/` |
| Tailwind CSS | ^4 | `@tailwindcss/postcss`; sem `tailwind.config` — usa `@theme inline` no CSS |
| shadcn/ui | ^4.12 | Style `radix-nova`; Radix UI via pacote `radix-ui` (v1.6) |
| Drizzle ORM | 1.0.0-rc.4 | PostgreSQL dialect; `drizzle-orm/node-postgres` |
| better-auth | — | Email/password; Drizzle adapter (`@better-auth/drizzle-adapter`) |
| next-themes | 0.4.6 | ThemeProvider DENTRO de `<body>` |
| sonner | — | Toast notifications; Toaster no root layout |
| lucide-react | — | Ícones |
| ESLint | 10 | flat config; simple-import-sort; react plugin |
| Prettier | 3 | prettier-plugin-tailwindcss (ordena classes) |
| Husky | 9 | Commit hooks com commitlint (conventional commits) |

## Database Schema

9 tabelas PostgreSQL:

| Tabela | Export name | Descrição |
|---|---|---|
| `users` | `usersTable` | Usuários (name, email, emailVerified, image) |
| `session` | `sessionsTable` | Sessões better-auth |
| `account` | `accountsTable` | Contas better-auth |
| `verification` | `verificationsTable` | Verificações better-auth |
| `clinic` | `clinicTable` | Clínicas (name, id uuid autogerado) |
| `users_to_clinics` | `usersToClinicsTable` | N:N usuários↔clínicas (userId, clinicId) |
| `doctor` | `doctorTable` | Médicos (specialty, weekDays, time, price) |
| `patients` | `patientsTable` | Pacientes (name, email, phone, sex enum) |
| `appointments` | `appointmentTable` | Consultas (date, clinicId, patientId, doctorId) |

**Relações (API legacy `drizzle-orm/_relations`):**
- `usersTableRelations`: one → many (sessions, accounts, usersToClinics)
- `clinicTableRelations`: one → many (doctors, patients, appointments, usersToClinics)
- `doctorTableRelations`: one → one (clinic)
- `patientTableRelations`: one → one (clinic), one → many (appointments)
- `appointmentTableRelations`: one → one (clinic, patient, doctor)
- `sessionRelations`: one → one (user)
- `accountRelations`: one → one (user)
- `usersToClinicsTableRelations`: one → one (user, clinic)

## Drizzle v1 RC — Inicialização

```ts
// src/db/index.ts
import { drizzle } from "drizzle-orm/node-postgres";
import { defineRelations } from "drizzle-orm/relations";
import * as schema from "./schema";

const relations = defineRelations(schema);

const db = drizzle(process.env.DATABASE_URL!, { relations });
```

- `drizzle()` v1 RC NÃO aceita `schema` no config — a propriedade foi removida do tipo via `Omit`.
- `defineRelations` extrai automaticamente as tabelas (filtra não-tabelas como enums e `Relations` antigos).
- Para `db.query.*` com joins, é necessário definir relations usando a nova API de `drizzle-orm/relations` (ainda não feito).
- Consultas simples e joins manuais (`db.select().from().innerJoin()`) funcionam normalmente.

## Fluxos da Aplicação

### Autenticação
- `/authentication` → página de login/registro
- `better-auth` com Drizzle adapter; tabelas: users, session, account, verification
- API handler em `/api/auth/[...all]`

### Dashboard (rota protegida)
1. `layout.tsx` verifica sessão → redireciona para `/authentication` se não autenticado
2. `page.tsx` consulta `usersToClinicsTable` pelo `userId`
3. Se **não tem** clínica → redireciona para `/dashboard/clinic-form`
4. Se **tem** clínica → renderiza dashboard com nome da clínica (join com `clinicTable`)

### Cadastro de Clínica
- `clinic-form/clinic-form.tsx`: Client component com card, input de nome, `useActionState`
- `clinic-form/actions.ts`: Server action — insere em `clinicTable` + `usersToClinicsTable`, redireciona para `/dashboard`

## Convenções de Código

- **Componentes**: Server Components por padrão; `"use client"` apenas quando necessário
- **Server Actions**: Em arquivos separados (`actions.ts`) com `"use server"` no topo, ou exportadas inline
- **Form handling**: React 19 `useActionState` para estado + pending + erro
- **Auth em Server Components**: `auth.api.getSession({ headers: await headers() })`
- **Import ordering**: `simple-import-sort` (autofix com ESLint). Ordem: libs externas → internas → CSS
- **Tailwind**: Usar `cn()` de `@/lib/utils` para combinar classes
- **Prefixo**: `data-slot` e `data-variant` nos componentes (convenção shadcn/ui radix-nova)
- **Commits**: Conventional Commits. Ex: `feat:`, `fix:`, `chore:`, `docs:`

## Scripts Disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Build produção |
| `npm run start` | Start produção |
| `npm run prepare` | Husky setup |
| `npx drizzle-kit generate` | Gerar migrations |
| `npx drizzle-kit migrate` | Executar migrations |

## Ambiente

```env
DATABASE_URL=postgresql://postgres:senha@localhost:5432/DB_Doctor?schema=public
BETTER_AUTH_SECRET=<secret>
```

## Observações Importantes

- **next-themes**: ThemeProvider DENTRO de `<body>`, `<html>` com `suppressHydrationWarning`.
- **Radix UI**: Importar de `"radix-ui"` (pacote monolítico v1.6). Ex: `import { Slot } from "radix-ui"`.
- **shadcn/ui v4 (radix-nova)**: `data-slot` attributes, `cva`, classes Tailwind v4. Componentes em `src/components/ui/`.
- **Tailwind v4**: `@import "tailwindcss"` em vez de `@tailwind`. Tema via `@theme inline {}`. Sem `tailwind.config.js`.
- **Drizzle v1 RC**: `db.query.*` no `node-postgres` só funciona passando `relations` (não `schema`). Usar `defineRelations()` de `drizzle-orm/relations`. As relations antigas (`drizzle-orm/_relations`) são apenas tipagem, não afetam o runtime.
- **React Compiler**: Habilitado no `next.config.ts`.
- **Fontes**: Geist Sans, Geist Mono, Plus Jakarta Sans.
