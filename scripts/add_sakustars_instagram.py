#!/usr/bin/env python3
"""Download the specific missed original Instagram screenshot and update gallery captions.

Run from the repository root: python3 scripts/add_sakustars_instagram.py
Does not need to rerun the full SAKUstars 2022 media import.
"""
from pathlib import Path
import json
import re
import sys
from urllib.request import Request, urlopen
from urllib.parse import quote, urlsplit, urlunsplit

URL = ("https://viktoriyamikhaylova.net/portfolio/wp-content/uploads/2025/03/"
       "Screenshot-2022-04-28-at-16-11-11-@sakustars-on-Instagramissa-"
       "%E2%80%A2-Tililla-on-602-seuraajaa.png")
ROOT = Path(__file__).resolve().parents[1]
FOLDER = ROOT / "public/cases/sakustars-2022"
OUTPUT = FOLDER / "media/SAKUstars2022_Instagram_2022-04-28.png"
MANIFEST = FOLDER / "manifest.json"
RELATIVE = "/cases/sakustars-2022/media/" + OUTPUT.name
CAPTION = "SAKUstars 2022 Instagram account, 28 April 2022"

def fetch_original():
    parsed = urlsplit(URL)
    path = quote(parsed.path, safe="/%@-_.~")
    safe_url = urlunsplit((parsed.scheme, parsed.netloc, path, parsed.query, parsed.fragment))
    req = Request(safe_url, headers={"User-Agent": "Mozilla/5.0", "Accept": "image/png,image/*;q=0.8"})
    with urlopen(req, timeout=65) as response:
        data = response.read()
        content_type = response.headers.get("Content-Type", "")
    if not data.startswith(b"\x89PNG\r\n\x1a\n"):
        raise RuntimeError("Source did not return a PNG image (type: " + content_type + ")")
    if not (1000 <= len(data) <= 50_000_000):
        raise RuntimeError("Unexpected image file size: " + str(len(data)))
    return data

def main():
    OUTPUT.parent.mkdir(parents=True,exist_ok=True)
    if not OUTPUT.exists():
        print("Downloading original Instagram screenshot...")
        OUTPUT.write_bytes(fetch_original())
    elif not OUTPUT.read_bytes().startswith(b"\x89PNG\r\n\x1a\n"):
        raise RuntimeError("Existing image is not a valid PNG: " + str(OUTPUT))
    print("Original image:", OUTPUT, "(", OUTPUT.stat().st_size, "bytes)")
    if not MANIFEST.exists():
        raise RuntimeError("Missing original gallery manifest: " + str(MANIFEST))
    data = json.loads(MANIFEST.read_text(encoding="utf-8"))
    photos = data.get("images")
    if not isinstance(photos,list): raise RuntimeError("Expected images array in gallery manifest")
    for item in photos:
        for field in ("alt", "caption"):
            if isinstance(item.get(field),str):
                item[field] = re.sub(r"\bAKUstars\b", "SAKUstars", item[field])
    if not any(item.get("src")==RELATIVE for item in photos):
        photos.append({"src":RELATIVE, "alt":CAPTION, "caption":CAPTION, "original":URL})
    MANIFEST.write_text(json.dumps(data,indent=2,ensure_ascii=False)+"\n",encoding="utf-8")
    print("Gallery now includes",len(photos),"original images; AKUstars captions corrected.")

if __name__=="__main__":
    try: main()
    except Exception as exc:
        print("ERROR:",exc,file=sys.stderr)
        sys.exit(1)
