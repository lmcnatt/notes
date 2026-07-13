# McNotes

A cozy, distraction-free, self-hosted markdown notes and outlining app. Write
books, novels, and outlines in a clean editor with a file-tree, per-project
organization, full-text search, and offline (PWA) support — all backed by plain
markdown files you own.

- **Your data, your files** — notes are stored as ordinary `.md` files on disk.
- **Multi-user** — first account becomes the admin; registration can be toggled.
- **Self-hostable** — single Docker image, works everywhere (Linux, macOS, Windows).
- **Installable PWA** — works offline and installs to your device.

---

## Getting Started (5 minutes)

### Step 1: Get the docker-compose file

```bash
mkdir mcnotes && cd mcnotes
curl -O https://raw.githubusercontent.com/lmcnatt/notes/main/docker-compose.yml
curl -O https://raw.githubusercontent.com/lmcnatt/notes/main/Caddyfile
```

Or clone the repo:
```bash
git clone https://github.com/lmcnatt/notes.git && cd notes
```

### Step 2: Start locally (no domain needed)

```bash
docker compose up -d
```

Open <http://localhost:3010> and create your first account. **This account becomes the admin.**

That's it. Your notes are stored in `mcnotes-data/` (visible on your machine).

### Step 3: Optional — expose to the internet with a domain

If you want to access McNotes from anywhere using a domain (like `notes.example.com`):

**3a. Edit docker-compose.yml**

Uncomment the `caddy` service (lines 21–44) and set your domain:

```yaml
caddy:
  # ... uncomment this section
  environment:
    DOMAIN: notes.example.com  # Change to your domain
```

**3b. Point your domain's DNS to your server**

In your domain registrar (GoDaddy, Cloudflare, Route53, etc.), create an **A record**:
```
notes.example.com  A  <your-server-ip>
```

**3c. Restart**

```bash
docker compose down
docker compose up -d
```

Caddy automatically generates HTTPS certificates (Let's Encrypt). Your app is now at `https://notes.example.com` with auto-renewing certificates.

---

## Configuration

All settings are in `docker-compose.yml` environment section. Common options:

| Option                | Default    | What it does                                                                  |
| --------------------- | ---------- | ----------------------------------------------------------------------------- |
| `JWT_SECRET`          | auto-gen   | Secret for session tokens. Auto-generated on first run if unset.              |
| `ALLOW_REGISTRATION`  | `"false"`  | Toggle public self-registration. First account always allowed.               |
| `DOMAIN` (Caddy)      | `localhost` | Your domain for HTTPS. Only used if Caddy service is uncommented.            |

### Managing users

- **First account**: Always allowed, becomes admin (even if registration is closed).
- **Other accounts**: Gated by `ALLOW_REGISTRATION` toggle.
- **Toggle registration**: Admin can enable/disable from **Admin Settings** (gear icon next to Logout).

---

## Backups

Your data lives in `mcnotes-data/`. This folder contains everything:
```
mcnotes-data/
├── users.db          # all accounts + metadata
├── .jwt_secret       # signing key (auto-generated)
└── users/            # markdown files for each user
    ├── alice/...
    └── bob/...
```

### Backup to a file (easy)

```bash
# Stop the container
docker compose stop

# Create a tar file
tar czf mcnotes-backup-$(date +%Y-%m-%d).tar.gz mcnotes-data/

# Restart
docker compose start
```

### Backup to cloud (AWS S3, etc.)

```bash
# Install AWS CLI, then sync
aws s3 sync mcnotes-data s3://my-bucket/mcnotes-backup --delete

# Or use rclone for other cloud providers
rclone sync mcnotes-data remote:mcnotes-backup
```

### Restore from backup

```bash
# Stop the container
docker compose stop

# Extract backup (creates/overwrites mcnotes-data/)
tar xzf mcnotes-backup-2026-07-13.tar.gz

# Restart
docker compose start
```

---

## Upgrading

```bash
docker compose pull
docker compose up -d
```

New versions apply database migrations automatically. Your data is safe.

---

## Troubleshooting

### Container won't start
```bash
docker compose logs mcnotes
```

### Check if it's running
```bash
curl http://localhost:3010/api/health
```

### Stop everything
```bash
docker compose down
```

### Reset (delete all data!)
```bash
docker compose down -v
docker volume rm mcnotes-data
docker compose up -d
```

---

## For developers

Requires Node.js 20+.

```bash
# Install deps
npm install

# Start dev server (hot reload)
npm run dev
```

Open <http://localhost:3010>. Local data goes to `./data/`.

Build and test the production Docker image:

```bash
docker build -t mcnotes:local .
docker compose -f docker-compose.yml up -d  # uses local image if built
```

---

## License

[MIT](LICENSE)


