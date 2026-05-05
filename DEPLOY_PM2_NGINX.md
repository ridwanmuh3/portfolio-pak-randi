# PM2 + Nginx Deploy

Run frontend and backend on host with `pm2`. Use `nginx` only as reverse proxy. Keep PostgreSQL outside Docker too if you want lowest memory use.

## 1. Install runtime

```bash
sudo apt update
sudo apt install -y nginx postgresql postgresql-contrib
sudo npm install -g pm2
corepack enable
```

Node 24 required for both apps.

## 2. Set env

Frontend env in `frontend/.env.production`:

```dotenv
NODE_ENV=production
STRAPI_URL=http://127.0.0.1:1337
NEXT_PUBLIC_STRAPI_URL=https://your-domain.com
STRAPI_API_TOKEN=replace_me
```

Backend env in `backend/.env`:

```dotenv
NODE_ENV=production
HOST=127.0.0.1
PORT=1337
URL=https://your-domain.com
PROXY=true

APP_KEYS=replace_me_1,replace_me_2,replace_me_3,replace_me_4
API_TOKEN_SALT=replace_me
ADMIN_JWT_SECRET=replace_me
TRANSFER_TOKEN_SALT=replace_me
JWT_SECRET=replace_me
ENCRYPTION_KEY=replace_me

DATABASE_CLIENT=postgres
DATABASE_HOST=127.0.0.1
DATABASE_PORT=5432
DATABASE_NAME=strapi
DATABASE_USERNAME=strapi
DATABASE_PASSWORD=replace_me
DATABASE_SCHEMA=public
DATABASE_SSL=false
DATABASE_POOL_MIN=1
DATABASE_POOL_MAX=5

ALLOWED_ORIGINS=https://your-domain.com
```

`NEXT_PUBLIC_STRAPI_URL` must be public domain because browser uses it for media URLs. `STRAPI_URL` stays local because frontend server fetches backend over loopback.

## 3. Install deps and build

```bash
cd /shared/projects/works/portfolio-pak-randi/frontend
pnpm install --frozen-lockfile
pnpm build
```

```bash
cd /shared/projects/works/portfolio-pak-randi/backend
npm ci
npm run build
```

## 4. Start with pm2

From repo root:

```bash
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

Or use Task:

```bash
task deploy
```

Task shortcuts:

```bash
task deploy:build
task deploy:pm2:restart
task deploy:nginx:reload
task health
```

Useful commands:

```bash
pm2 status
pm2 logs portfolio-frontend
pm2 logs portfolio-backend
pm2 restart ecosystem.config.cjs
```

## 5. Enable nginx

Copy nginx vhost:

```bash
sudo cp deploy/nginx/portfolio-pak-randi.conf /etc/nginx/sites-available/portfolio-pak-randi
sudo ln -s /etc/nginx/sites-available/portfolio-pak-randi /etc/nginx/sites-enabled/portfolio-pak-randi
sudo nginx -t
sudo systemctl reload nginx
```

Replace `server_name _;` with real domain before reload.

## 6. Health checks

- Frontend: `http://127.0.0.1:3000/api/health`
- Backend: `http://127.0.0.1:1337/_health`
- Public via nginx: `http://your-domain/api/health`, `http://your-domain/_health`

## Notes

- Remove `output: "export"` from Next config. `pm2` now runs real Next server via `next start`.
- Strapi now respects `URL` and `PROXY`, needed behind nginx.
- Docker files stay untouched. You can still use them later.
