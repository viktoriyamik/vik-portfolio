# HaeSiivooja case deployment

The website uses `/home/lihvool/viki/dist` as its Nginx root. This update changes only the frontend. The AI prompt and backend remain unchanged.

## Before deploying

Use root on the existing VPS. Your build needs Node 20.19+ or 22.12+ for Vite 8. Preserve local `.env` files; never put them in GitHub. The backup contains secrets and is private under `/root/vik-backups` with root-only permissions. Copy a backup to secure storage off the VPS as well.

## Publish the prepared changes

The redesign has been built and checked locally but has **not yet been uploaded to GitHub**. The downloadable update package includes `haesiivooja-redesign.patch` and `deploy-ubuntu.sh`. A source backup is saved separately from GitHub commit `d260e5664df59431572753a13ae819918c689aa1`. GitHub also has a `backup-before-haesiivooja-20261008` branch. These source backups do not contain your VPS environment or Nginx configuration.

Download and unzip the update package on your computer. From the extracted directory, copy the patch and script to the VPS (replace `YOUR_VPS_IP`):

```bash
scp haesiivooja-redesign.patch deploy-ubuntu.sh root@YOUR_VPS_IP:/root/
```

On Ubuntu, back up the currently deployed site **before applying the patch**:

```bash
bash /root/deploy-ubuntu.sh --backup-only
```

Then publish the changes on a new Git branch:

```bash
cd /home/lihvool/viki
git fetch origin
git switch main
git pull --ff-only origin main
git switch -c haesiivooja-case-update
git apply --check /root/haesiivooja-redesign.patch
git apply /root/haesiivooja-redesign.patch
git add src/App.tsx src/HaesiivoojaCase.tsx src/HaesiivoojaCase.css public/cases/haesiivooja-cleaner.png public/cases/haesiivooja-login.png public/cases/haesiivooja-services.png public/haesiivooja-prototype.html deploy-ubuntu.sh DEPLOY-UBUNTU.md
git commit -m "Expand HaeSiivooja UX/UI case and add interactive prototype"
git push -u origin haesiivooja-case-update
```

Create a pull request to `main` in GitHub and merge it after the repository's required checks. If `git apply --check` fails, stop; the checkout differs from the version the patch was prepared against. Preserve local edits rather than forcing the patch.

## Deploy after merging

```bash
bash /root/deploy-ubuntu.sh
```

The script saves the current source, `.git`, `dist`, `.env` files and data; Nginx configuration; current Git commit; and PM2 process details. It then pulls main, installs locked dependencies, builds in a staging directory, checks Nginx and replaces `dist` only after a successful build. It prints the full backup path and previous compiled directory. No AI restart is needed.

Verify the homepage, AI Ask twice, all case links, images, the embedded walkthrough and its customer/cleaner confirmation flow. Also check a narrow mobile screen. Do not delete backups until satisfied.

## Immediate website rollback

Use the exact `dist-before-...` path printed by the deployment. This restores the old compiled site without rebuilding:

```bash
cd /home/lihvool/viki
previous=/home/lihvool/viki/dist-before-REPLACE_WITH_TIMESTAMP
[ -s "$previous/index.html" ] || exit 1
mv dist "dist-rejected-$(date -u +%Y%m%dT%H%M%SZ)"
mv "$previous" dist
```

Nginx serves the restored files automatically. No Nginx or AI restart is needed. This rolls back what visitors see; it does not change GitHub or the source checkout.

## Restore compiled files from the full backup

If the previous compiled directory is missing, replace the backup path below with the printed path:

```bash
cd /home/lihvool/viki
backup=/root/vik-backups/REPLACE_WITH_TIMESTAMP
[ -s "$backup/site.tar.gz" ] || exit 1
mv dist "dist-rejected-$(date -u +%Y%m%dT%H%M%SZ)"
tar -xzf "$backup/site.tar.gz" -C /home/lihvool/viki ./dist
```

## Roll back source and GitHub

For a published redesign commit, use `git revert COMMIT_SHA` and `git push origin main`, or GitHub's Revert button on the merged pull request. Revert only the redesign commit(s), preserving unrelated later work. With branch rules, open a rollback PR. After merging, run the deployment script again. Avoid `git reset --hard` or force-pushing shared main.

The interactive prototype is a standalone portfolio demonstration using sample data. It performs no live bookings and calls no backend. The original Android images are sourced from the public Google Play listing.
