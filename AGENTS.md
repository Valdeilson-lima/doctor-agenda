<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Doctor Agenda — Contexto do Projeto

## Visão Geral

Sistema de agendamento de consultas médicas. Stack: Next.js 16 + React 19 + TypeScript 5 (strict) + Tailwind CSS v4 + shadcn/ui v4 (radix-nova) + Drizzle ORM + PostgreSQL.

## Arquitetura

```
src/
├── app/            # App Router (layouts, pages, rotas)
│   ├── layout.tsx  # Root layout com ThemeProvider
│   ├── page.tsx    # Home page
│   └── globals.css # Tema shadcn/ui + Tailwind v4
├── components/     # Componentes React
│   ├── ui/         # shadcn/ui primitives (button, dropdown-menu, etc.)
│   ├── ModeToggle.tsx
│   └── theme-provider.tsx
├── db/             # Drizzle ORM
│   ├── schema.ts   # Tabelas, enums, relations
│   └── index.ts    # Conexão com banco
└── lib/
    └── utils.ts    # cn() — clsx + tailwind-merge
drizzle/            # Migrations geradas pelo drizzle-kit
```

## Stack Detalhada

| Tecnologia | Versão | Observações |
|---|---|---|
| Next.js | 16.2.9 | App Router; React Compiler habilitado (`reactCompiler: true`) |
| React | 19.2.4 | Server Components por padrão; `"use client"` quando necessário |
| TypeScript | ^5 | Strict mode; path alias `@/` → `./src/` |
| Tailwind CSS | ^4 | `@tailwindcss/postcss`; sem `tailwind.config` — usa `@theme inline` no CSS |
| shadcn/ui | ^4.12 | Style `radix-nova`; Radix UI via pacote `radix-ui` (v1.6) |
| Drizzle ORM | 1.0.0-rc.4 | PostgreSQL dialect; `drizzle-orm/node-postgres` |
| next-themes | 0.4.6 | ThemeProvider DENTRO de `<body>` (Next.js 16) |
| ESLint | 10 | flat config; simple-import-sort; react plugin |
| Prettier | 3 | prettier-plugin-tailwindcss (ordena classes) |
| Husky | 9 | Commit hooks com commitlint (conventional commits) |

## Database Schema

6 tabelas no schema PostgreSQL:

- **users** — Usuários do sistema (name, email)
- **clinic** — Clínicas (name)
- **users_to_clinics** — Relação N:N entre usuários e clínicas
- **doctor** — Médicos vinculados a uma clínica (specialty, horários disponíveis em dias da semana 0-6, appointment_price_in_cents)
- **patients** — Pacientes vinculados a uma clínica (name, email, phone, sex: enum male/female)
- **appointments** — Consultas (date, clinic_id, patient_id, doctor_id)

Todas as tabelas têm `id` (uuid, defaultRandom), `created_at` e `updatedAt` (com `$onUpdate`).

## Convenções de Código

- **Componentes**: Server Components por padrão; `"use client"` apenas quando necessário (hooks, eventos, estado)
- **Import ordering**: `simple-import-sort` (autofix com ESLint). Ordem: libs externas → internas → CSS
- **Tailwind**: Usar `cn()` de `@/lib/utils` para combinar classes. `prettier-plugin-tailwindcss` ordena automaticamente
- **Prefixo**: `data-slot` e `data-variant` nos componentes (convenção shadcn/ui radix-nova)
- **Commits**: Conventional Commits (commitlint). Ex: `feat:`, `fix:`, `chore:`, `docs:`
- **Atributo de tema**: `class` no `<html>` (Tailwind dark mode via `.dark`)

## Scripts Disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Build produção |
| `npm run start` | Start produção |
| `npm run prepare` | Husky setup |

Não há scripts Drizzle configurados no package.json. Usar `npx drizzle-kit generate` e `npx drizzle-kit migrate`.

## Ambiente

```env
DATABASE_URL=postgresql://postgres:senha@localhost:5432/DB_Doctor?schema=public
```

## Observações Importantes

- **next-themes**: O `<ThemeProvider>` deve ficar DENTRO de `<body>`, não entre `<html>` e `<body>`. O `<html>` precisa de `suppressHydrationWarning`.
- **Radix UI**: Importar de `"radix-ui"` (pacote monolítico v1.6), não de pacotes individuais (`@radix-ui/*`). Ex: `import { Slot } from "radix-ui"`.
- **shadcn/ui v4 (radix-nova)**: Usa `data-slot` attributes, `cva` da `class-variance-authority`, e classes Tailwind v4. Os componentes gerados ficam em `src/components/ui/`.
- **Tailwind v4**: Usa `@import "tailwindcss"` em vez de `@tailwind base/components/utilities`. Tema via `@theme inline {}` no CSS. Variants customizadas com `@custom-variant`. Sem `tailwind.config.js`.
- **Drizzle v1 RC**: A API pode ter diferenças da v0. Verificar `node_modules/drizzle-orm/` para referência.
- **React Compiler**: Habilitado. Babel plugin está em devDependencies.
