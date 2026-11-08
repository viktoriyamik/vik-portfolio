# Portfolio AI Assistant - seven current case studies

## Current source of truth

The homepage assistant runs the Node API in `server/server.mjs`, not directly in the React build.

- `data/current-cases.json` lists seven featured cases, their canonical URLs, their role/status summaries and search aliases.
- `server/portfolio-context.mjs` loads the HTML of the published case pages from `public/case-studies/<slug>/index.html` when a visitor asks about a case. Detailed current case information is not re-embedded.
- `data/index/portfolio-index.json` remains the legacy embedding index for older PDF projects, archived portfolio documents, blog articles, and academic work.
- The backend uses the professional name **Viktoriya Lihvoinen**, but leaves historical PDF filenames and old Figma URLs intact to avoid breaking links.
- It intentionally distinguishes prototypes, proposed research and completed live products, and does not claim invented business or accessibility metrics.

If a current case's facts change, update its HTML and (if needed) the brief catalogue JSON, then restart the API process. For historical PDF changes, re-ingestion is a separate operation using `server/ingest.mjs` and requires an API key; **do not regenerate the old PDF index just to update the seven current cases**.

## Earlier PDF work and suggested questions

The homepage displays only seven featured case studies; there is no separate visible PDF archive section. The original PDFs are still accessible through the assistant's source links when relevant, and the older embedding index remains available for historical projects, blogs and IxDF studies.

The homepage AI shortcuts are deliberately the original four questions:

- Tell me about your projects
- Tell me about your accessibility experience
- Tell me about your IxDF studies
- Show blog articles

`data/archive-projects.json` still curates eight historic PDF records for older-work questions, but it is a backend knowledge catalogue rather than an additional homepage grid. The assistant always uses the professional name **Viktoriya Lihvoinen** in visible output and keeps original PDF filenames unchanged so historical links continue to work.

## PM2 discovery and safe startup

An empty `pm2 list` means the current user has no PM2 apps; the backend may be managed under another account or through systemd. Before creating a duplicate, inspect the listener and service owner:

```bash
sudo ss -ltnp '( sport = :3001 )'
systemctl list-units --type=service --all | grep -Ei 'portfolio|vik|pm2' || true
sudo nginx -T 2>/dev/null | grep -n -E 'location.*api|proxy_pass|3001'
pm2 list
```

If port 3001 already has a listener, identify and restart that owner/service rather than launching another process. If no listener exists and no systemd unit or other owner exists, verify `OPENAI_API_KEY` is available in your private `.env`, and only then launch a single PM2 process as the site user:

```bash
cd /home/lihvool/viki
node --input-type=module -e 'import "dotenv/config"; if(!process.env.OPENAI_API_KEY) process.exit(1)'
pm2 start server/server.mjs --name portfolio-ai --cwd /home/lihvool/viki
pm2 save
curl -fsS http://127.0.0.1:3001/api/health
```

Never publish the API key or `.env` in GitHub.

## Publish on Ubuntu VPS

From the website checkout:

```bash
cd /home/lihvool/viki
git status --short
git pull --ff-only origin main
npm ci
npm run test:assistant
npm run build
node --check server/server.mjs
pm2 list
# Only if the process already exists for your current PM2 user:
# pm2 restart portfolio-ai --update-env
# Otherwise use the discovery/startup steps above.
```

The PM2 restart is necessary because the backend loads the old PDF embeddings at startup and imports the current-case catalogue. `npm run build` alone does not update the running API. Do not restart unrelated processes.

If the process is not called `portfolio-ai`, inspect `pm2 list` and `pm2 describe portfolio-ai` before changing any process. The API normally listens on loopback port 3001.

## Tests to try in the browser

1. "Tell me about your projects" - should describe all seven current cases, not three.
2. "What did you design for SAKUstars 2022?" - should describe the owl identity, WordPress and media work.
3. "Tell me about AccessBloom" - should identify the accessibility application and note illustrative sample results.
4. "What did you build for Laurea Digital Living Lab?" - should describe the responsive website, icons, photography and development.
5. "Tell me about your older SATO project" - should use the historical PDF knowledge base.

For basic availability:

```bash
curl -sS -X POST https://vik.ooo/api/ask -H 'Content-Type: application/json' -d '{"question":"Tell me about all seven case studies"}'
```

This is a real AI request and consumes API usage. Run sparingly; public API rate limits still apply.
