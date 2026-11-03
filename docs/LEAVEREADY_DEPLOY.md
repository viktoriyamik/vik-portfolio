# LeaveReady case study — Ubuntu deployment

## Repository layout

- Portfolio homepage (LeaveReady featured first): `src/App.tsx`
- Standalone case study: `public/case-studies/leaveready/index.html`
- Internal interactive prototype: `public/leaveready-prototype/index.html`
- Portfolio cover: `public/cases/leaveready-cover.svg`
- High-resolution comparison illustration: `public/cases/leaveready-audit.svg`

Expected paths after the Vite build:
- `https://vik.ooo/`
- `https://vik.ooo/case-studies/leaveready/`
- `https://vik.ooo/leaveready-prototype/`

## Deploy on the Ubuntu VPS

First connect to the VPS and identify the actual checkout and Nginx webroot. **Do not replace paths blindly.**

```bash
ssh YOUR_USER@YOUR_VPS
sudo nginx -T 2>/dev/null | grep -n -A 24 -B 6 'server_name.*vik\.ooo'
```

In the commands below, substitute the actual repository directory and the actual Nginx `root` value. Use the repository checkout that normally deploys vik.ooo.

```bash
cd /PATH/TO/vik-portfolio
git status --short
git pull --ff-only origin main
npm ci
npm run build
test -f dist/case-studies/leaveready/index.html
test -f dist/leaveready-prototype/index.html
test -f dist/cases/leaveready-cover.svg
test -f dist/cases/leaveready-audit.svg
```

Make a dated backup of the current web root **before** copying, and confirm that it belongs exclusively to this portfolio site:

```bash
WEBROOT=/PATH/FROM/NGINX/ROOT
sudo mkdir -p /var/backups/vik-ooo
sudo tar -C "$WEBROOT" -czf "/var/backups/vik-ooo/site-$(date +%Y%m%d-%H%M%S).tar.gz" .
sudo rsync -av dist/ "$WEBROOT"/
sudo nginx -t
sudo systemctl reload nginx
```

Do **not** use `rsync --delete` unless the web root contains only this build and you intentionally want to remove old files.

Test:

```bash
curl -I https://vik.ooo/
curl -I https://vik.ooo/case-studies/leaveready/
curl -I https://vik.ooo/leaveready-prototype/
```

For static directories, an Nginx configuration with `index index.html;` and `try_files $uri $uri/ /index.html;` usually serves both standalone pages and the React home page. Do not overwrite an existing Nginx configuration if it has reverse-proxy rules for other apps.

## Prototype source repository

The standalone interactive prototype is now in [viktoriyamik/leaveready-human-ai-prototype](https://github.com/viktoriyamik/leaveready-human-ai-prototype). The portfolio case and internal prototype link to that repository. The internal page at `/leaveready-prototype/` remains part of the portfolio's Vite `public` directory, so no additional reverse proxy or application process is required.

## Evidence boundary

LeaveReady uses **scripted scenario responses** and **illustrative travel data** for its interactive UX validation. It is not connected to live transport feeds, taxi booking, payment or persistent memory.
