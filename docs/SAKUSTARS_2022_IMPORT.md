# Import original SAKUstars 2022 project media

The new case at `/case-studies/sakustars-2022/` is committed as static HTML. The original gallery, MP4 and an animated GIF derived from its frames must be imported once from the old WordPress portfolio.

## Requirements

- Python 3 (standard library only)
- FFmpeg (for the actual video-to-GIF conversion)
- Network access to `viktoriyamikhaylova.net` from your VPS
- Git write access to `viktoriyamik/vik-portfolio` from the VPS

## Import

```bash
cd /home/lihvool/viki
git pull --ff-only origin main
sudo apt-get update
sudo apt-get install -y ffmpeg
python3 scripts/import_sakustars_2022.py

# Check originals have been downloaded before committing.
find public/cases/sakustars-2022 -type f -printf '%p (%k KB)\n'
```

The script parses images inside the original project article (or main region if no article), downloads the highest image sources available, generates a `manifest.json` used by the case gallery, downloads the supplied MP4, and uses palette-based FFmpeg conversion to produce a 4-second looping GIF for the homepage card. It never invents or redraws the original event artwork.

If the old website is inaccessible from the VPS, **stop**. The importer reports an error and cannot truthfully claim to have transferred all pictures.

## Commit media and build

```bash
git add public/cases/sakustars-2022/
git commit -m "Import original SAKUstars 2022 images, video and GIF"
git push origin main

npm ci
npm run build
test -s dist/cases/sakustars-2022/manifest.json
test -s dist/cases/sakustars-2022/award-ceremony-preview.gif
test -s dist/cases/sakustars-2022/SAKUstars2022_AnimationAwardCeremony.mp4
test -s dist/case-studies/sakustars-2022/index.html
```

Nginx already serves `/home/lihvool/viki/dist`, so no new webroot or vhost is needed.

### Check

- https://vik.ooo/ — SAKUstars card directly after Laurea, with GIF preview
- https://vik.ooo/case-studies/sakustars-2022/ — complete project, image gallery and MP4
- https://vik.ooo/cases/sakustars-2022/manifest.json — source image index

**GitHub media limit:** The importer compresses the web-playable copy of the video if the original exceeds 95 MB. GitHub's ordinary push limit is 100 MB per file. Keep a separate original in archival storage if compression was necessary.
## Finish the revised SAKUstars case (2026 refresh)

The live case source is `public/case-studies/sakustars-2022/index.html`. The redesigned page uses the lilac colour scheme and includes the official event website, improved nav, original gallery, animation, and embedded corrected PDF.

### Missing Instagram screenshot

The original first import missed one screenshot. Fetch that specific original PNG (without running the full importer again):

```bash
cd /home/lihvool/viki
git pull --ff-only origin main
python3 scripts/add_sakustars_instagram.py
```

This adds `public/cases/sakustars-2022/media/SAKUstars2022_Instagram_2022-04-28.png` and updates gallery captions from "AKUstars" to "SAKUstars". If the original domain times out, do not claim the image was imported; supply the original PNG separately or retry once the source is available.

### Corrected PDF (47 pages)

The revised PDF was generated from the author's supplied PDF and preserves its original artwork, improves captions, corrects the repeated "Autor" header and removes outdated personal contact information from the final page.

**File name:** `SAKUstars_2022_Visual_Identity_Web_Design_Corrected.pdf`

**Publish to:** `/home/lihvool/viki/public/cases/sakustars-2022/SAKUstars_2022_Visual_Identity_Web_Design_Corrected.pdf`

Download the generated file from the ChatGPT conversation to your own computer, then upload it to the VPS with SFTP, SCP or the GitHub repository upload UI. The PDF is a binary artifact; adding its link to the source code does not upload its contents.

Once the file is present on the VPS:

```bash
cd /home/lihvool/viki
ls -lh public/cases/sakustars-2022/SAKUstars_2022_Visual_Identity_Web_Design_Corrected.pdf
git add public/cases/sakustars-2022/
git diff --cached --stat
git commit -m "Import missing SAKUstars Instagram image and corrected project portfolio PDF"
git push origin main
npm run build

test -s dist/cases/sakustars-2022/SAKUstars_2022_Visual_Identity_Web_Design_Corrected.pdf && echo "PDF OK"
test -s dist/cases/sakustars-2022/media/SAKUstars2022_Instagram_2022-04-28.png && echo "Instagram OK"
```

No Nginx restart is necessary because `vik.ooo` serves the Vite `dist` folder. Do not commit unrelated VPS backup files, and do not force-push.
