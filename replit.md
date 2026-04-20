# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## Artifacts

### Steve Analiz.web (`artifacts/steve-analiz`)
- React + Vite frontend, served at `/`
- Turkish financial analysis blog platform
- Pages: `/` (Home), `/blog` (Blog listing), `/blog/:slug` (Post detail), `/about` (Vision/roadmap)

### API Server (`artifacts/api-server`)
- Express 5 server, served at `/api`
- Blog CRUD: GET/POST `/api/blog`, GET `/api/blog/:slug`, GET `/api/blog/stats`

## Database Schema

- `blog_posts` table: id, title, slug, author, summary, content, tags (text[]), createdAt, updatedAt
  - Seeded with 5 sample Turkish financial analysis posts

## API Endpoints

- `GET /api/healthz` — health check
- `GET /api/blog` — list all blog posts (optional `?tag=` filter)
- `POST /api/blog` — create a new blog post `{ title, slug, author, summary, content, tags }`
- `GET /api/blog/:slug` — get a single blog post by slug
- `GET /api/blog/stats` — get total post count and tag distribution
