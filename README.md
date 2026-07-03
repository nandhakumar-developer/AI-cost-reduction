# MarkItDown SaaS

Production-ready SaaS application that converts uploaded files into Markdown using Microsoft's MarkItDown library.

## Features

- Google OAuth authentication (dev mode available)
- Single active session per user
- File conversion via MarkItDown (PDF, DOCX, PPTX, XLSX, images, and more)
- Free: 8MB upload/quota, 42-hour reset
- Pro: 15MB upload, 10 conversion cycles, manual subscription approval
- Conversion history with search and pagination
- Admin panel for user and subscription management
- Dark/light theme, responsive UI

## Tech Stack

- **Frontend:** React, TypeScript, TailwindCSS, Zustand, Framer Motion, React Router
- **Backend:** Node.js, Express, TypeScript, Prisma
- **Database:** SQLite (dev) / PostgreSQL (production)
- **Conversion:** Microsoft MarkItDown (Python)

## Quick Start

### Prerequisites

- Node.js 20+
- pnpm (`npm install -g pnpm`)
- Python 3.10+ with `pip install markitdown`

### Install

```bash
pnpm install
cd backend
cp .env.example .env
pnpm db:push
pnpm db:seed
cd ..
```

### Run Development

```bash
pnpm dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:4000

### Dev Login

With `ALLOW_DEV_AUTH=true` in `backend/.env`, use **Continue with Google (Dev Mode)** on the login page.

For admin access, log in with email `admin@markitdown.local` (modify dev login or use Google OAuth with that account).

### Google OAuth (Production)

1. Create OAuth credentials in Google Cloud Console
2. Set `GOOGLE_CLIENT_ID` in `backend/.env` and `VITE_GOOGLE_CLIENT_ID` in `frontend/.env`
3. Set `ALLOW_DEV_AUTH=false`

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | /auth/google | Google OAuth login |
| POST | /auth/logout | Logout |
| GET | /auth/me | Current user + usage |
| POST | /convert | Upload & convert files |
| GET | /history | Conversion history |
| GET | /subscription | Subscription info |
| POST | /subscription/request | Submit payment |
| GET | /admin/dashboard | Admin stats |

## Docker

```bash
docker compose up --build
```

## Project Structure

```
├── backend/          Express API + Prisma
├── frontend/         React SPA
├── docker-compose.yml
└── pnpm-workspace.yaml
```
