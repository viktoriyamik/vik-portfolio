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
## Finish the SAKUstars case

The project page in `public/case-studies/sakustars-2022/index.html` now contains a static gallery of the original image files, so it does not depend on JavaScript to render the gallery. The facts identify the design role and tools separately. It contains no site-maintenance or file-import notes.

### Corrected original project PDF (43 pages)

The corrected PDF preserves the original 43-page artwork and event documentation, fixes the recurring "Autor" header, corrects the introductory text and removes the old personal contact details from page 43.

**File:** `SAKUstars_2022_Visual_Identity_Web_Design_Corrected.pdf`

The PDF is a binary file and is **not yet committed to the repository**. Download the 43-page PDF from the ChatGPT conversation and copy it to the VPS via SCP or SFTP:

```powershell
scp "$env:USERPROFILE\Downloads\SAKUstars_2022_Visual_Identity_Web_Design_Corrected.pdf" lihvool@vmi3282280.contaboserver.net:/home/lihvool/viki/public/cases/sakustars-2022/
```

The case's PDF section and its navigation item are automatically shown only when that URL serves an actual PDF. The page intentionally hides the viewer if Nginx returns SPA HTML as a fallback for a missing file.

### Check and build

```bash
cd /home/lihvool/viki
git pull --ff-only origin main
file public/cases/sakustars-2022/SAKUstars_2022_Visual_Identity_Web_Design_Corrected.pdf
pdfinfo public/cases/sakustars-2022/SAKUstars_2022_Visual_Identity_Web_Design_Corrected.pdf | grep Pages
git add public/cases/sakustars-2022/SAKUstars_2022_Visual_Identity_Web_Design_Corrected.pdf
git commit -m "Add corrected original SAKUstars portfolio PDF"
git push origin main
npm run build
test -s dist/cases/sakustars-2022/SAKUstars_2022_Visual_Identity_Web_Design_Corrected.pdf && echo "PDF OK"
test -s dist/cases/sakustars-2022/manifest.json && echo "Gallery manifest OK"
curl -sSI https://vik.ooo/cases/sakustars-2022/SAKUstars_2022_Visual_Identity_Web_Design_Corrected.pdf | grep -i content-type
```

Expected content type: `application/pdf`. `text/html` indicates the wrong file or a missing path. Do not restart Nginx: it serves the existing Vite `dist` directory.

All 19 image paths, including the Instagram screenshot, are already stored in the GitHub `public/cases/sakustars-2022/media` directory. No media-import rerun is needed.
