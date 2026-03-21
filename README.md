# InvParser

Parse, manage and export invoice data from PDF documents. Upload invoices, extract structured data with AI, and track spending.

## Features

- **PDF upload** — Drag & drop or select invoice PDFs
- **AI extraction** — OpenAI parses document type, amounts, due dates, VAT, and supplier info
- **Dashboard** — Spending trends, due-date distribution, document statistics
- **Documents list** — Filter by status, date, supplier, tags; bulk actions
- **Export** — CSV and Excel export with document links
- **Suppliers** — Auto-extracted from invoices; link documents to suppliers
- **Tags** — Due-date tags (60/30/10 days, overdue); Paid tag
- **Authentication** — Email/password and Google OAuth; email verification
- **GDPR** — Export user data; delete account via email link

## Tech Stack

| Layer     | Stack                          |
| --------- | ------------------------------ |
| Frontend  | React 19, Vite, Tailwind 4, Redux |
| Backend   | Express 5, Node 20            |
| Database  | MySQL 8                        |
| Queue     | BullMQ + Redis                |
| AI        | OpenAI API                    |
| Auth      | JWT, Google OAuth, nodemailer |
| Security  | Helmet (HTTP headers on API) |

## Documentation

- **`docs/API.md`** — REST API reference (auth, documents, health, …)  
- **`docs/presentazione-invparser.md`** — Slide-by-slide outline for Google Slides / PowerPoint (Italian)

## Prerequisites

- **Node.js** ≥ 18
- **MySQL** 8
- **Redis**
- **OpenAI API key**
- (Optional) SMTP for emails, Google OAuth credentials

## Quick Start

### 1. Clone and install

```bash
git clone https://github.com/brandijsen/invParser.git
cd invParser
npm install
```

### 2. Start MySQL and Redis (Docker)

```bash
docker-compose up -d
```

MySQL: `localhost:3309` (user `root`, pass `root`)  
Redis: `localhost:6379`

### 3. Database setup

```bash
mysql -h 127.0.0.1 -P 3309 -u root -proot invParserDb < backend/migrations/db.sql
```

### 4. Environment variables

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Edit `backend/.env`:

- `DB_HOST=127.0.0.1`, `DB_PORT=3309`, `DB_USER=root`, `DB_PASS=root`, `DB_NAME=invParserDb`
- `REDIS_HOST=127.0.0.1`, `REDIS_PORT=6379`
- `OPENAI_API_KEY=sk-...`
- `JWT_SECRET` and `JWT_REFRESH_SECRET` (random strings)
- `SMTP_*` for email (or skip for local dev)
- `FRONTEND_URL=http://localhost:5173`, `BASE_URL=http://localhost:5000`

Edit `frontend/.env`:

- `VITE_API_URL=http://localhost:5000/api`

### 5. Run the app

**Terminal 1 — Backend**

```bash
cd backend && npm run dev
```

**Terminal 2 — Frontend**

```bash
cd frontend && npm run dev
```

- Backend: http://localhost:5000  
- Frontend: http://localhost:5173

## Development

| Command        | Description                 |
| -------------- | --------------------------- |
| `npm install`  | Install root + backend deps |
| `cd backend && npm run dev`   | Backend with nodemon   |
| `cd frontend && npm run dev`  | Frontend with Vite     |
| `cd frontend && npm run build`| Production build       |
| `cd backend && npm test`      | Backend unit tests (Vitest) |
| `cd frontend && npm test`     | Frontend unit tests (Vitest) |

## Known limitations

- **PDF text only** — Extraction uses `pdf-parse` (text embedded in the PDF). Scanned image-only PDFs without a text layer yield little or no text; parsing and AI quality suffer. The pipeline adds a **low-text warning** when extracted text is very short.
- **OpenAI dependency** — Classification and structured extraction require a working `OPENAI_API_KEY` and quota. On failure, the app stores **minimal data** and flags **extraction failed** so you can retry after fixing configuration.
- **Uploaded files** — PDFs are validated with a **magic-byte** check (`%PDF`) to reduce renamed non-PDF uploads. This is not antivirus scanning; treat uploads like any untrusted file in hardened deployments.

## Operations & monitoring

- **Health check** — `GET /api/health` returns JSON with `mysql` and `redis` status (`up` / `down`). HTTP **503** if a required dependency fails. Use for load balancers or uptime monitors (no authentication).

## Production / Deployment

The project is set up for Railway (Nixpacks):

- `nixpacks.toml` builds the backend from the monorepo root
- Set env vars in the Railway dashboard
- Frontend: build with Vite and serve the `dist` folder (e.g. via Railway static service or Vercel)

## Database Backup

The backup script (`backend/scripts/backup-database.js`) dumps MySQL, compresses, saves locally, and optionally uploads to S3. Failure alerts are sent via Brevo (or SMTP if `BREVO_API_KEY` is not set).

**Run manually:**
```bash
cd backend && npm run backup
```

**Scheduling:** The backup is not automatic. Schedule it on the server where the app runs:
- **Windows:** `backend/scripts/setup-task-scheduler.ps1` (daily at 3:00)
- **Linux/Mac:** Add to crontab: `0 3 * * * cd /path/to/invParser/backend && node scripts/backup-database.js`

**Note:** On Railway, the container has no `mysqldump` or cron. Run the backup from a local machine or a separate server that can reach the database.

## Environment Variables

See `backend/.env.example` for full list. Main groups:

| Variable           | Required | Description                 |
| ----------------- | -------- | --------------------------- |
| `DB_*`             | ✓        | MySQL connection            |
| `REDIS_*`          | ✓        | Redis for BullMQ            |
| `OPENAI_API_KEY`   | ✓        | Invoice parsing             |
| `JWT_SECRET`       | ✓        | Session tokens             |
| `FRONTEND_URL`     | ✓        | Export links, emails, OAuth, CORS. **In production: must be your real frontend URL (not localhost)** |
| `SMTP_*`           |          | Emails (verification, reset)|
| `GOOGLE_CLIENT_*`  |          | OAuth login                 |

## Project Structure

```
invParser/
├── frontend/          # React + Vite
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── store/
│   │   └── context/
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── services/
│   │   ├── queues/
│   │   └── routes/
│   ├── migrations/
│   └── scripts/       # backup, backfill, etc.
├── docs/              # API reference, presentation outline
├── docker-compose.yml # MySQL + Redis
└── nixpacks.toml      # Railway build
```

## License

MIT © 2025 Andrea Brandetti
