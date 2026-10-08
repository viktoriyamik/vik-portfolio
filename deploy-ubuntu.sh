#!/usr/bin/env bash
# Run as root on the VPS. Back up the current site before touching its source.
set -euo pipefail
umask 077
site=/home/lihvool/viki
stamp=$(date -u +%Y%m%dT%H%M%SZ)
backup="/root/vik-backups/$stamp"
mkdir -p "$backup"
cd "$site"
# Stop before changing anything if tracked local edits would be overwritten.
if ! git diff --quiet || ! git diff --cached --quiet; then
  echo 'Tracked local changes found. Commit or safely preserve them before deploying.' >&2
  exit 1
fi
git rev-parse HEAD > "$backup/commit.txt"
# Includes source, current dist, local .env files and data; excludes reinstallable dependencies.
tar --exclude='./node_modules' --exclude='./.deploy-*' --exclude='./dist-before-*' --exclude='./dist-rejected-*' -czf "$backup/site.tar.gz" .
tar -czf "$backup/nginx.tar.gz" -C /etc nginx
nginx -T > "$backup/nginx-effective.txt" 2>&1
if command -v pm2 >/dev/null; then pm2 jlist > "$backup/pm2-processes.json"; fi
printf 'BACKUP=%s\n' "$backup"
if [[ "${1:-}" == '--backup-only' ]]; then
  echo 'Backup complete. No site changes made.'
  exit 0
fi
printf 'Backup complete. Deploying GitHub main.\n'
git fetch origin main
git switch main
git pull --ff-only origin main
# Vite 8 requires Node 20.19+ or 22.12+. Use the same Node installation as your current build.
node --version
npm ci --no-audit --no-fund
staging="$site/.deploy-$stamp"
trap 'rm -rf -- "$staging"' EXIT
npm run build -- --outDir "$staging"
test -s "$staging/index.html"
# Backups remain private; compiled public assets must be readable by Nginx.
chmod -R a+rX "$staging"
nginx -t
# Keep the previous compiled site next to dist for immediate rollback.
previous="$site/dist-before-$stamp"
mv "$site/dist" "$previous"
if ! mv "$staging" "$site/dist"; then mv "$previous" "$site/dist"; exit 1; fi
printf '\nDeployed. Verify https://vik.ooo/#case-haesiivooja\n'
printf 'Previous compiled site: %s\nFull backup: %s\n' "$previous" "$backup"
# Frontend-only change: Nginx and portfolio-ai do not require a restart.
