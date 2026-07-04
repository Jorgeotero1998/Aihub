# AIhub (Multi-tenant Ops Platform)

Plataforma profesional para empresas que centraliza operaciones con IA:

- Autenticación con roles y arquitectura multiempresa (multi-tenant)
- Dashboard y reportes
- Agentes de IA especializados (soporte, ventas, RR. HH.)
- Chat con documentos (RAG)
- Automatización de tareas
- Notificaciones en tiempo real
- Suscripciones y pagos
- Panel de administración

## Stack

- Web: Next.js + TypeScript
- API: NestJS + TypeScript
- DB: PostgreSQL + Prisma
- Cache/queue: Redis
- Realtime: WebSockets
- AI: proveedor compatible con OpenAI API (configurable)
- Infra local: Docker Compose

## Arranque local (sin secretos en Git)

Este repo **no** commitea contraseñas. Todo se gestiona con variables de entorno.

Requisitos:
- Docker Desktop
- Node.js 20+

Pasos:
1. Generar `.env` locales (autogenera passwords/secrets):

```bash
npm run setup
```

2. Levantar servicios:

```bash
docker compose up -d
```

3. Instalar dependencias:

```bash
npm install
```

4. Preparar la base (Prisma):

```bash
npm run prisma:migrate -w @aihub/api
```

5. Correr (web+api en paralelo):

```bash
npm run dev
```

## Estructura

- `apps/web`: Next.js (dashboard, admin, chat)
- `apps/api`: NestJS (auth, tenants, RAG, agents, billing)
- `packages/shared`: tipos/validaciones compartidas

