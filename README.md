# AIhub — Multi‑Tenant AI Operations Platform

> A production‑grade, portfolio‑ready platform that centralizes company operations with AI: specialized agents, document chat (RAG), automations, calendar, analytics, realtime notifications, billing, and an admin panel — built with Next.js + NestJS + PostgreSQL/Prisma + Redis + WebSockets.

[ES] AIhub es una plataforma profesional y lista para portfolio que centraliza operaciones empresariales con IA: agentes especializados, chat con documentos (RAG), automatizaciones, calendario, analítica, notificaciones en tiempo real, billing y panel de administración — construida con Next.js + NestJS + PostgreSQL/Prisma + Redis + WebSockets.

---
## Screenshots

<img width="1877" height="887" alt="Captura de pantalla 2026-07-04 152500" src="https://github.com/user-attachments/assets/ce4d05ea-4eb5-4b60-822a-ac6002e61b17" />


## ✨ Features / Funcionalidades

### Core
- **Multi‑tenant architecture** (organization/workspace per tenant)
- **Authentication & Roles (RBAC)** (owner/admin/member + specialized roles)
- **Professional dashboard** with actionable modules
- **Admin panel** (tenant + memberships + roles)
- **Realtime notifications** via WebSockets (Socket.IO)

### AI
- **Specialized AI agents** (Support, Sales, HR) with a live “agent console”
- **Chat with documents (RAG)** (demo-ready, extensible to embeddings + pgvector)

### Ops
- **Automations / Tasks** (create, list, demo seeded data)
- **Calendar events** (create, list)
- **Reports & analytics** (KPIs + charts)

### Billing
- **Subscriptions & payments (Stripe-ready skeleton)** (works in demo mode without secrets; ready to activate with keys)

---

## 🧱 Tech Stack / Tecnologías

- **Frontend**: Next.js (App Router) + TypeScript
- **Backend**: NestJS + TypeScript
- **Database**: PostgreSQL + Prisma (optional in demo mode)
- **Cache/Queue**: Redis (optional in demo mode)
- **Realtime**: WebSockets (Socket.IO)
- **Containers**: Docker Compose (Postgres + Redis)
- **CI/CD**: GitHub Actions (build + lint + typecheck)
- **AI Provider**: OpenAI‑compatible (configurable)

---

## 🗂 Monorepo Structure / Estructura

- `apps/web` — Next.js app (UI: dashboard, agents, docs, RAG chat, admin, billing)
- `apps/api` — NestJS API (auth, tenants, RAG, agents, tasks, calendar, reports, notifications)
- `packages/*` — shared packages (optional / future growth)
- `docker-compose.yml` — Postgres (pgvector) + Redis for local development

---

## ⚡ Quickstart (Demo Mode) / Inicio rápido (Modo Demo)

This project can run **without Docker/Postgres** in **demo mode** (in‑memory) so you can showcase it instantly.

Este proyecto puede correr **sin Docker/Postgres** en **modo demo** (en memoria) para poder mostrarlo al instante.

### 1) Install / Instalar
```bash
npm install
