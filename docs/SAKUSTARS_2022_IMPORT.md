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

The corrected portfolio PDF is already committed in GitHub at:
`public/cases/sakustars-2022/SAKUstars_2022_Visual_Identity_Web_Design_Corrected.pdf`

Do **not** download the PDF from the chat or copy it separately. Pull the current main branch and build Vite. If the website returns its homepage instead of the PDF, that means the server is not serving the expected build/file; check the path and content type.

### The second animation (award ceremony with fireworks)

The original URL supplied for the second video was:

`http://vmi394276.contaboserver.net/SAKUstars2022/SAKUstars2022_AnimationAwardCeremonyWithSalut.mp4`

This file has **not** been committed to GitHub, and its availability on the old server has not been independently verified. If the old server still has it, fetch and validate the MP4 from the Ubuntu VPS:

```bash
cd /home/lihvool/viki
mkdir -p public/cases/sakustars-2022
curl -fL --retry 3 --connect-timeout 15 \
  'http://vmi394276.contaboserver.net/SAKUstars2022/SAKUstars2022_AnimationAwardCeremonyWithSalut.mp4' \
  -o public/cases/sakustars-2022/SAKUstars2022_AnimationAwardCeremonyWithSalut.mp4
file public/cases/sakustars-2022/SAKUstars2022_AnimationAwardCeremonyWithSalut.mp4
ffprobe -v error -show_entries format=duration:format_tags=encoder -of default=noprint_wrappers=1 \
  public/cases/sakustars-2022/SAKUstars2022_AnimationAwardCeremonyWithSalut.mp4
```

If the download returns an error or the file command reports HTML rather than MP4 media, do not publish it. Instead, obtain the original file from your old VPS backup or your local archive and copy it into that exact destination using SFTP/SCP. The case automatically reveals the second video once the real MP4 is served by the site.

### Deploy the updated case

```bash
cd /home/lihvool/viki
git status --short
git pull --ff-only origin main
npm ci
npm run build

# Verify the built case, original PDF and first MP4:
test -s dist/case-studies/sakustars-2022/index.html && echo "Case OK"
test -s dist/cases/sakustars-2022/SAKUstars_2022_Visual_Identity_Web_Design_Corrected.pdf && echo "PDF OK"
test -s dist/cases/sakustars-2022/SAKUstars2022_AnimationAwardCeremony.mp4 && echo "Video 1 OK"

# If you have retrieved the second MP4 before building:
test -s dist/cases/sakustars-2022/SAKUstars2022_AnimationAwardCeremonyWithSalut.mp4 && echo "Video 2 OK"

# Check the public responses:
curl -sSI https://vik.ooo/cases/sakustars-2022/SAKUstars_2022_Visual_Identity_Web_Design_Corrected.pdf | grep -Ei 'HTTP/|content-type|content-length'
curl -sSI https://vik.ooo/cases/sakustars-2022/SAKUstars2022_AnimationAwardCeremony.mp4 | grep -Ei 'HTTP/|content-type|content-length'
```

Expect `application/pdf` for the PDF and `video/mp4` for the first video. An `text/html` response to the PDF means a single-page-app fallback rather than the file itself.

If the second MP4 is valid and under GitHub's regular 100-MB file limit, commit it as a separate media update:

```bash
git add public/cases/sakustars-2022/SAKUstars2022_AnimationAwardCeremonyWithSalut.mp4
git commit -m "Add original SAKUstars award ceremony fireworks animation"
git push origin main
```

The case HTML and original project PDF are already in the repository. There is no need to restart Nginx if it is already serving `/home/lihvool/viki/dist`.
