# Environment Variables Reference

Analysis based on actual code usage. **Essential** = required for the app to work. **Superfluous** = redundant when another var is set.

---

## Essential (always needed)

| Variable | Used by |
|----------|---------|
| `NODE_ENV` | Auth, CORS, envValidator, logger |
| `DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME`, `DB_PORT` | DB connection, backup script |
| `JWT_SECRET`, `JWT_REFRESH_SECRET` | Auth tokens |
| `OPENAI_API_KEY` | AI parsing (documentClassifier, aiSemanticParser) |
| `EMAIL_FROM` | All emails (sender address) |
| `FRONTEND_URL` | Export links, emails, OAuth redirects, CORS |
| `BASE_URL` | Avatar URL, delete link, verify link, OAuth |

---

## Redis: choose ONE of these

| Option | Variables | Notes |
|--------|-----------|-------|
| **A** | `REDIS_URL` | Single connection string. **Takes precedence** over B. |
| **B** | `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD` | Used only when `REDIS_URL` is not set. |

**→ If you have `REDIS_URL`:** `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD` are **superfluous** (ignored by `config/redis.js`).

---

## Email: choose ONE of these

| Option | Variables | Notes |
|--------|-----------|-------|
| **A** | `BREVO_API_KEY` | Brevo HTTP API. Used first if set. No SMTP needed for app emails. |
| **B** | `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` | Used when Brevo is not set. |

**→ If you use Brevo:** `SMTP_*` are **not used** by the app or the backup script. Both use Brevo when `BREVO_API_KEY` is set.

---

## Optional (app works without them)

| Variable | Used by |
|----------|---------|
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Google OAuth login |
| `GOOGLE_REDIRECT_URI`, `GOOGLE_FRONTEND_REDIRECT` | Google OAuth redirects |
| `BACKUP_ALERT_EMAIL` | Backup script: email on failure |
| `CONSOLE_LOGS` | Logger: `"true"` = console output in prod |
| `UPLOAD_DIR` | Custom path for uploaded PDFs (default: `backend/src/uploads`) |

---

## Summary for your Railway setup

**Superfluous (can remove if you prefer):**
- `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD` — you have `REDIS_URL`, so Redis uses that only.

**If using Brevo:**
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` — not used (app and backup both use Brevo).

The envValidator accepts either `REDIS_URL` or `REDIS_HOST`, and either `BREVO_API_KEY` or `SMTP_*`.
