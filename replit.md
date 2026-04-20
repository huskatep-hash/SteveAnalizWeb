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

## Production Deployment

In production, the Express API serves the compiled React frontend as static files from `dist/public/`. Everything runs as a single Node.js process.

### Option A — Replit Deploy (easiest, 1-click)
Click "Deploy" in the Replit UI. No configuration needed.

### Option B — Render.com
1. Push this repo to GitHub
2. Go to render.com → "New Blueprint" → connect the repo
3. Render reads `render.yaml` automatically
4. A PostgreSQL database + web service are provisioned
5. After first deploy, run: `pnpm --filter @workspace/db run push` (or exec into the container and run the push command)
6. Dify can POST to `https://your-app.onrender.com/api/blog`

### Option C — VPS + Docker
```bash
# 1. Copy repo to server (git clone or rsync)
# 2. Set secrets
cp .env.example .env
nano .env   # fill DB_PASSWORD and SESSION_SECRET

# 3. Build & start
docker compose up -d --build

# 4. Push DB schema (first time only)
docker compose exec api node -e "
  const { execSync } = require('child_process');
  execSync('pnpm --filter @workspace/db run push', { stdio: 'inherit' });
"

# 5. (Optional) Enable SSL with nginx
# See nginx.conf — update domain name, run certbot
```

### Dify Integration (Phase 2)
Once deployed, point your Dify HTTP POST action to:
- **Render:** `https://your-app.onrender.com/api/blog`
- **VPS:** `https://steveanalizweb.com/api/blog`
- **Replit Deploy:** `https://steveanalizweb.replit.app/api/blog`

Payload format:
```json
{
  "title": "...",
  "slug": "unique-slug",
  "author": "Devrim Çağlayan",
  "summary": "Short description...",
  "content": "<p>HTML content...</p>",
  "tags": ["kripto", "analiz"]
}
```

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
