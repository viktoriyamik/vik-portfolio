# vik.ooo public-name audit

The displayed author name on vik.ooo is **Viktoriya Lihvoinen**.

Run the published-page branding test after updating case studies or interactive prototypes:

```bash
cd /home/lihvool/viki
npm run test:branding
npm run build
```

The test inspects homepage sources and published static HTML, TSX, SVG, JSON, and TXT under `public/` and `src/`. It flags old-name text outside unchanged URLs.

The historical domain `viktoriyamikhaylova.net`, Figma URLs with former-name slugs, GitHub account names, and original archive PDF filenames intentionally remain unchanged to avoid breaking references. These are addresses and original documents, not the public display name. PDF interior pages and embedded raster artwork are not modified by this audit.

The credit in `public/haesiivooja-prototype.html` and its author metadata now use the current name.

This update affects only static site content; no portfolio AI service restart is required.
