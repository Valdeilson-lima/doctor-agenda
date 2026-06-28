# Doctor Agenda

Sistema de agendamento de consultas médicas desenvolvido com Next.js 16.

## Funcionalidades

- **Clínicas** — Gerenciamento de múltiplas clínicas
- **Médicos** — Cadastro com horários disponíveis, especialidades e preços
- **Pacientes** — Cadastro de pacientes com dados de contato
- **Consultas** — Agendamento de consultas vinculadas a médico, paciente e clínica
- **Usuários** — Controle de acesso de usuários às clínicas

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Framework | Next.js 16 (App Router) |
| Linguagem | TypeScript |
| Banco de Dados | PostgreSQL |
| ORM | Drizzle ORM |
| Estilização | Tailwind CSS v4 + shadcn/ui |
| Tema | next-themes |
| UI Primitives | Radix UI |
| Commit Lint | commitlint + husky |

## Pré-requisitos

- Node.js 20+
- PostgreSQL

## Configuração

1. Clone o repositório:

```bash
git clone https://github.com/Valdeilson-lima/doctor-agenda.git
cd doctor-agenda
```

2. Instale as dependências:

```bash
npm install
```

3. Crie um arquivo `.env` na raiz do projeto:

```env
DATABASE_URL=postgresql://usuario:senha@localhost:5432/doctor_agenda
```

4. Execute as migrations:

```bash
npm run drizzle:migrate
```

5. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run start` | Inicia o servidor de produção |
| `npm run drizzle:generate` | Gera migrations |
| `npm run drizzle:migrate` | Aplica migrations |

## Projeto

```
src/
├── app/          # Next.js App Router (páginas e layouts)
├── components/   # Componentes React (ui, shared)
├── db/           # Schema Drizzle ORM e conexão com banco
└── lib/          # Utilitários
drizzle/          # Migrations geradas
```
