# ============================================================
# Steve Analiz.web — Production Docker Image
# Single Node.js container: Express API + React static files
# ============================================================
FROM node:24-slim

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@9

# Copy entire workspace (pnpm needs all manifests for symlink resolution)
COPY . .

# Install all workspace deps (frozen lockfile for reproducibility)
# Note: esbuild overrides in pnpm-workspace.yaml are linux-x64 only — matches this image
RUN pnpm install --frozen-lockfile

# Build React frontend (BASE_PATH=/ PORT=3000 required by vite.config.ts)
RUN BASE_PATH=/ PORT=3000 NODE_ENV=production \
    pnpm --filter @workspace/steve-analiz run build

# Build Express API server (esbuild bundle)
RUN pnpm --filter @workspace/api-server run build

# Copy compiled React output into api-server dist so Express can serve it
RUN cp -r artifacts/steve-analiz/dist/public artifacts/api-server/dist/public

# Clean up source files and devDeps to reduce image size
RUN find . -name "*.ts" -not -path "*/node_modules/*" -delete \
 && find . -name "*.tsx" -not -path "*/node_modules/*" -delete

ENV NODE_ENV=production \
    PORT=3000

EXPOSE 3000

CMD ["node", "--enable-source-maps", "./artifacts/api-server/dist/index.mjs"]
