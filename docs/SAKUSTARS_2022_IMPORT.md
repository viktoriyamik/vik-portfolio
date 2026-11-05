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