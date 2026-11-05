#!/usr/bin/env python3
"""Import the original SAKUstars 2022 project gallery + video into the Vite public folder.

Run at repository root: python3 scripts/import_sakustars_2022.py
No third-party Python packages; FFmpeg is required for GIF.
Only uploads publicly available in the author's source project page are copied.
"""
from __future__ import annotations
import hashlib
import html
from html.parser import HTMLParser
import json
import re
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
from urllib.parse import urljoin, unquote, urlsplit
from urllib.request import Request, urlopen

SOURCE = "https://viktoriyamikhaylova.net/sakustars-2022/"
VIDEO = "https://viktoriyamikhaylova.net/portfolio/wp-content/uploads/2025/03/SAKUstars2022_AnimationAwardCeremony.mp4"
OUT = Path(__file__).resolve().parents[1] / "public" / "cases" / "sakustars-2022"
MEDIA = OUT / "media"
UA = "Mozilla/5.0 (compatible; SAKUstars2022PortfolioImport/1.0; +https://vik.ooo)"
IMAGE_TYPES = {".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg", ".avif", ".tif", ".tiff"}
SOURCE_HOST = urlsplit(SOURCE).hostname
SIZE_PATTERN = re.compile(r"-(?:\d{2,5}x\d{2,5})(?=\.[^.]+$)", re.I)
URL_IN_STYLE = re.compile(r"url\(['\"]?([^)'\"]+)['\"]?\)", re.I)
EXT_PATTERN = re.compile(r"\.(?:jpe?g|png|webp|gif|svg|avif|tiff?)(?:$|[?#])", re.I)

def fetch(url: str) -> bytes:
    req = Request(url, headers={"User-Agent": UA, "Accept": "*/*"})
    with urlopen(req, timeout=65) as response:
        return response.read()

def normalize(value: str) -> str | None:
    if not value or value.startswith(("data:", "blob:", "#", "javascript:")):
        return None
    value = html.unescape(value.strip().strip("\"'"))
    if not value or value.startswith("data:"): return None
    absolute = urljoin(SOURCE, value)
    parsed = urlsplit(absolute)
    if parsed.scheme not in {"http", "https"}: return None
    return absolute

def key_for(url: str) -> str:
    url_path = unquote(urlsplit(url).path)
    return SIZE_PATTERN.sub("", url_path).lower()

def select_largest_srcset(srcset: str) -> str | None:
    items = []
    for candidate in srcset.split(","):
        part = candidate.strip().split()
        if not part: continue
        candidate_url = normalize(part[0])
        if not candidate_url: continue
        width = 0
        if len(part) > 1 and part[1].endswith("w"):
            try: width = int(part[1][:-1])
            except ValueError: pass
        items.append((width, candidate_url))
    return max(items, key=lambda t: t[0])[1] if items else None

class ProjectMediaParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.stack: list[tuple[str, set[str]]] = []
        self.records: list[dict] = []
        self.current_link: str | None = None

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]):
        a = {k: (v or "") for k,v in attrs}
        classes = set(a.get("class","").split())
        self.stack.append((tag, classes))
        scopes = self.current_scopes()
        if tag == "a":
            href = normalize(a.get("href",""))
            self.current_link = href if href and EXT_PATTERN.search(href) else None
        if tag in {"img", "source"}:
            source = select_largest_srcset(a.get("data-srcset","") or a.get("srcset",""))
            source = source or normalize(a.get("data-lazy-src","") or a.get("data-src","") or a.get("src",""))
            if source and EXT_PATTERN.search(source):
                width = a.get("width","").strip()
                height = a.get("height","").strip()
                if width.isdigit() and height.isdigit() and int(width)<8 and int(height)<8:return
                if self.current_link and key_for(self.current_link)==key_for(source):
                    source = self.current_link
                self.records.append({"url": source, "alt": a.get("alt","").strip(), "scope": scopes})
        if "style" in a:
            for found in URL_IN_STYLE.findall(a["style"]):
                source = normalize(found)
                if source and EXT_PATTERN.search(source):
                    self.records.append({"url":source, "alt":"SAKUstars 2022 event design", "scope": scopes})

    def current_scopes(self) -> int:
        score = 0
        for tag, classes in self.stack:
            if tag == "main": score = max(score,1)
            if tag == "article" or classes.intersection({"entry-content","post-content","wp-block-post-content","elementor-widget-theme-post-content"}):
                score = max(score,2)
        return score

    def handle_endtag(self, tag: str):
        if tag == "a": self.current_link = None
        # Recover from potentially irregular HTML, without requiring valid tag nesting.
        for i in range(len(self.stack)-1,-1,-1):
            if self.stack[i][0] == tag:
                self.stack = self.stack[:i]
                break

def discover(raw_html: str) -> list[dict]:
    parser = ProjectMediaParser()
    parser.feed(raw_html)
    recs = parser.records
    for required_scope in (2,1,0):
        choices = [r for r in recs if r["scope"] >= required_scope]
        if choices: break
    unique: dict[str,dict] = {}
    for item in choices:
        u = item["url"]
        parts = urlsplit(u)
        if not parts.path or not EXT_PATTERN.search(parts.path): continue
        if any(x in parts.path.lower() for x in ("/plugins/","/themes/","/gravatar/","/avatar/","/elementor/assets/","/favicon")): continue
        k=key_for(u)
        old=unique.get(k)
        # Prefer a direct attachment/original URL, and preserve helpful alt text.
        if old is None or (len(urlsplit(u).path) < len(urlsplit(old["url"]).path)):
            unique[k]=item
    return list(unique.values())

def download_image(url: str, used: set[str]) -> tuple[str,int]:
    parsed = urlsplit(url)
    basename = re.sub(r"[^a-zA-Z0-9_.-]+","-",unquote(Path(parsed.path).name))[:105] or "image.png"
    stem = Path(basename).stem
    suffix = Path(basename).suffix.lower()
    if suffix not in IMAGE_TYPES: suffix=".jpg"
    short = hashlib.sha1(url.encode()).hexdigest()[:9]
    name=f"{stem[:75]}-{short}{suffix}"
    if name in used: return name,(MEDIA/name).stat().st_size
    destination=MEDIA/name
    if not destination.exists():
        data=fetch(url)
        if not data or len(data)>55_000_000: raise RuntimeError("Image empty/too large: "+url)
        destination.write_bytes(data)
    used.add(name)
    return name,destination.stat().st_size

def run(cmd: list[str]):
    subprocess.run(cmd, check=True)

def import_video():
    if not shutil.which("ffmpeg"):
        raise RuntimeError("ffmpeg is required. Install it with: sudo apt-get install ffmpeg")
    target = OUT / "SAKUstars2022_AnimationAwardCeremony.mp4"
    preview = OUT / "award-ceremony-preview.gif"
    if not target.exists():
        print("Downloading original award-ceremony animation...")
        data = fetch(VIDEO)
        if not data or len(data)<4096: raise RuntimeError("Video download returned no usable bytes")
        target.write_bytes(data)
        print("Video: %.1f MiB" % (len(data)/1048576))
    if target.stat().st_size>95_000_000:
        print("Video is too large for a normal Git push; compressing a web-playable copy.")
        temp=target.with_suffix(".optimized.mp4")
        run(["ffmpeg","-hide_banner","-loglevel","error","-y","-i",str(target),
             "-vf","scale=min(1280\\,iw):-2","-c:v","libx264","-preset","medium",
             "-crf","27","-c:a","aac","-b:a","128k","-movflags","+faststart",str(temp)])
        if temp.stat().st_size>95_000_000:
            temp.unlink();raise RuntimeError("Compressed video exceeds GitHub 95MB limit. Use Git LFS or compress further.")
        temp.replace(target)
    if not preview.exists():
        print("Generating an animated GIF from the original MP4 frames...")
        run(["ffmpeg","-hide_banner","-loglevel","error","-y",
             "-ss","1.5","-t","4","-i",str(target),
             "-filter_complex","[0:v]fps=9,scale=600:360:force_original_aspect_ratio=increase,crop=600:360,split[a][b];[a]palettegen=stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=3",
             "-loop","0",str(preview)])
    print("Video and GIF ready:",target.name,preview.name)
    return target,preview

def main():
    MEDIA.mkdir(parents=True,exist_ok=True)
    print("Reading original project:", SOURCE)
    try: page=fetch(SOURCE).decode("utf-8","replace")
    except Exception as exc:
        raise RuntimeError("Original project page unavailable from VPS; no media was imported. "+str(exc)) from exc
    if len(page)<1000: raise RuntimeError("Source page response is suspiciously short")
    found=discover(page)
    print("Image candidates in article/main:",len(found))
    if not found:
        raise RuntimeError("No project images were discovered. Inspect source HTML or WordPress lazy-loading attributes.")
    used:set[str]=set()
    imgs=[]
    for i,item in enumerate(found,1):
        url=item["url"]
        try:
            name,bytes_count=download_image(url,used)
            alt=item["alt"] or f"SAKUstars 2022 project design {i}"
            imgs.append({"src":f"/cases/sakustars-2022/media/{name}","alt":alt,"caption":alt,"original":url})
            print(f"  [{i}/{len(found)}] {name} ({bytes_count//1024} KiB)")
        except Exception as exc:
            print("  WARNING: image failed:",url,str(exc),file=sys.stderr)
    if not imgs:
        raise RuntimeError("No original images could be downloaded; refusing an empty manifest")
    manifest={"project":"SAKUstars 2022","source":SOURCE,"images":imgs,
              "video":"/cases/sakustars-2022/SAKUstars2022_AnimationAwardCeremony.mp4",
              "gif":"/cases/sakustars-2022/award-ceremony-preview.gif"}
    (OUT/"manifest.json").write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    import_video()
    print(f"COMPLETE: {len(imgs)} gallery images; MP4 + animated listing GIF.")

if __name__=="__main__":
    try: main()
    except Exception as exc:
        print("IMPORT ERROR:",exc,file=sys.stderr)
        sys.exit(1)
