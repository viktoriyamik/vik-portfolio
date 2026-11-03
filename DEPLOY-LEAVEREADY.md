# LeaveReady deployment — vik.ooo

The portfolio is a React + Vite site in `viktoriyamik/vik-portfolio`. Existing VPS checkout: `/home/lihvool/viki`. Nginx serves the compiled `dist` directory. LeaveReady is included in this repository as a standalone case study and interactive demonstration.

## Routes

- `https://vik.ooo/case-studies/leaveready/` — dedicated case study
- `https://vik.ooo/leaveready-prototype/` — independent, interactive prototype
- `https://vik.ooo/#work` — portfolio listing with LeaveReady first

The static folders `public/case-studies/leaveready/` and `public/leaveready-prototype/` are copied to `dist` by Vite. The case page includes navigation back to selected projects and to HaeSiivooja.

## Deploy on the VPS

SSH as the user who currently administers the site, with root access, and run:

```bash
ssh root@YOUR_VPS_IP
cd /home/lihvool/viki
git status --short
bash ./deploy-ubuntu.sh --backup-only
bash ./deploy-ubuntu.sh
```

The script refuses tracked local edits, backs up source, `.env` files, compiled files and Nginx, fast-forwards `main`, installs locked dependencies, builds into staging, validates Nginx and only then swaps the new `dist`. Use Node >=20.19 or >=22.12 for Vite 8.

Verify:

```bash
curl -fsS https://vik.ooo/case-studies/leaveready/ | grep -q 'Make the right move'
curl -fsS https://vik.ooo/leaveready-prototype/ | grep -q 'LeaveReady'
```

Visit the URLs in a browser, check mobile layout, critical-state tabs and the case/prototype/back navigation. Do not call a GitHub commit a completed VPS deployment.

## Separate source repository

The connected GitHub tool can edit existing repos but cannot create a new repo. Create `viktoriyamik/leaveready-prototype` yourself once, preferably on your local computer with GitHub CLI:

```bash
gh auth login
git clone https://github.com/viktoriyamik/vik-portfolio.git
mkdir -p leaveready-prototype-source
cp vik-portfolio/public/leaveready-prototype/index.html leaveready-prototype-source/index.html
cp vik-portfolio/public/leaveready-prototype/README.md leaveready-prototype-source/README.md
cd leaveready-prototype-source
git init -b main
git add .
git commit -m "Initial LeaveReady interactive prototype"
gh repo create viktoriyamik/leaveready-prototype --public --source=. --remote=origin --push
```

After the new repository exists, change the GitHub source links in `src/App.tsx`, `public/case-studies/leaveready/index.html` and `public/leaveready-prototype/index.html` from the current in-portfolio source URL to `https://github.com/viktoriyamik/leaveready-prototype`, commit and push to `main`, and run `bash ./deploy-ubuntu.sh` again on the VPS.

Keep the site-local prototype files: they are how vik.ooo serves the demo independently from GitHub Pages.

## Rollback

The deploy script prints `dist-before-TIMESTAMP` and a private backup path. See `DEPLOY-UBUNTU.md` for the verified rollback procedure. Do not force-push or delete the original dist before validation.
