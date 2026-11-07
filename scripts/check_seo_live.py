#!/usr/bin/env python3
"""Check the live SEO fundamentals after deploying vik.ooo.

Usage:
    python3 scripts/check_seo_live.py

This performs real HTTP GETs (not a simulated Lighthouse audit).
No third-party Python dependencies or API keys are required.
"""
from html.parser import HTMLParser
from urllib.request import Request, urlopen
from urllib.error import HTTPError, URLError
from xml.etree import ElementTree as ET
import sys

BASE = "https://vik.ooo"
SLUGS = [
    "leaveready", "haesiivooja", "aura", "cleanpeer",
    "accessbloom", "laurea", "sakustars-2022",
]
URLS = [BASE + "/"] + [f"{BASE}/case-studies/{slug}/" for slug in SLUGS]


class HeadParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.title = False
        self.meta = {}
        self.canonical = None
        self.schema = False

    def handle_starttag(self, tag, attrs):
        values = dict(attrs)
        if tag == "title":
            self.title = True
        elif tag == "link" and values.get("rel") == "canonical":
            self.canonical = values.get("href")
        elif tag == "meta":
            name = values.get("name") or values.get("property")
            if name:
                self.meta[name.lower()] = values.get("content", "")
        elif tag == "script" and values.get("type") == "application/ld+json":
            self.schema = True


def get(url):
    request = Request(url, headers={"User-Agent": "VikPortfolioSEOCheck/1.0"})
    with urlopen(request, timeout=20) as response:
        return response.status, response.headers, response.read()


def report(label, ok, detail=""):
    print(f"{'PASS' if ok else 'FAIL'} {label}" + (f" — {detail}" if detail else ""))
    return ok


def main():
    failures = 0
    try:
        code, headers, body = get(BASE + "/robots.txt")
        robots = body.decode("utf-8", "replace")
        valid = code == 200 and "text/plain" in headers.get("Content-Type", "") and (
            f"Sitemap: {BASE}/sitemap.xml" in robots
        )
        failures += not report("robots.txt", valid, headers.get("Content-Type", ""))
    except (HTTPError, URLError, TimeoutError) as e:
        failures += not report("robots.txt", False, str(e))

    try:
        code, headers, body = get(BASE + "/sitemap.xml")
        root = ET.fromstring(body)
        locs = {item.text for item in root.iter() if item.tag.endswith("}loc") or item.tag == "loc"}
        valid = code == 200 and set(URLS) == locs
        failures += not report("sitemap.xml includes homepage + 7 cases", valid, f"{len(locs)} URL(s)")
    except (HTTPError, URLError, TimeoutError, ET.ParseError) as e:
        failures += not report("sitemap.xml", False, str(e))

    # Optional emerging AI-discovery conventions: valid MIME, Markdown and JSON.
    try:
        code, headers, body = get(BASE + "/llms.txt")
        markdown = body.decode("utf-8", "replace")
        valid = (code == 200
                 and not markdown.lstrip().lower().startswith("<!doctype")
                 and markdown.lstrip().startswith("# ")
                 and markdown.count("](https://vik.ooo/case-studies/") == 7)
        failures += not report("llms.txt is genuine Markdown with 7 case links", valid, headers.get("Content-Type", ""))
    except (HTTPError, URLError, TimeoutError) as e:
        failures += not report("llms.txt", False, str(e))

    try:
        import json
        code, headers, body = get(BASE + "/.well-known/ard.json")
        manifest = json.loads(body)
        valid = (code == 200
                 and isinstance(manifest, dict)
                 and isinstance(manifest.get("entries"), list)
                 and not body.lstrip().startswith(b"<"))
        failures += not report("ARD manifest is valid JSON", valid, headers.get("Content-Type", ""))
    except (HTTPError, URLError, TimeoutError, ValueError) as e:
        failures += not report("ARD manifest", False, str(e))

    for url in URLS:
        try:
            code, headers, body = get(url)
            parser = HeadParser()
            parser.feed(body.decode("utf-8", "replace"))
            noindex = ("noindex" in headers.get("X-Robots-Tag", "").lower()
                       or "noindex" in parser.meta.get("robots", "").lower())
            good = all([
                code == 200,
                "text/html" in headers.get("Content-Type", ""),
                parser.title,
                bool(parser.meta.get("description")),
                parser.canonical == url,
                bool(parser.meta.get("og:image")),
                parser.schema,
                not noindex,
            ])
            failures += not report(url, good, (
                f"HTTP {code}, canonical={parser.canonical}, "
                f"meta-description={bool(parser.meta.get('description'))}, "
                f"schema={parser.schema}, noindex={noindex}"
            ))
        except (HTTPError, URLError, TimeoutError) as e:
            failures += not report(url, False, str(e))

    print(f"\n{len(URLS) + 4 - failures}/{len(URLS) + 4} checks passed")
    if failures:
        print("Fix the reported live URL or response before requesting indexing.")
    return 1 if failures else 0


if __name__ == "__main__":
    sys.exit(main())
