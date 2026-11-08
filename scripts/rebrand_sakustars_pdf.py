#!/usr/bin/env python3
"""Update SAKUstars 2022 PDF credits without rebuilding the original artwork.

Requires: pip install pymupdf
Run from the vik-portfolio repository root. This script changes text-layer
surnames and author metadata only. It intentionally does not alter images.
"""
from __future__ import annotations
import argparse
import shutil
import sys
from pathlib import Path

try:
    import fitz  # PyMuPDF
except ImportError:
    sys.exit("Install PyMuPDF: python3 -m pip install pymupdf")

DEFAULT = Path('public/cases/sakustars-2022/SAKUstars_2022_Visual_Identity_Web_Design_Corrected.pdf')


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--pdf', type=Path, default=DEFAULT)
    parser.add_argument('--output', type=Path, help='Save here instead of replacing the existing PDF')
    args = parser.parse_args()
    src = args.pdf
    if not src.is_file():
        sys.exit(f'Missing PDF: {src}')
    doc = fitz.open(src)
    n_pages = len(doc)
    changes = []
    for page_number, page in enumerate(doc, start=1):
        rects = page.search_for('Mikhaylova')
        if not rects:
            continue
        blocks = page.get_text('dict')['blocks']
        spans = [s for b in blocks if 'lines' in b for line in b['lines'] for s in line['spans']]
        edits = []
        for rect in rects:
            match = next((s for s in spans if 'mikhaylova' in s['text'].casefold()
                          and fitz.Rect(s['bbox']).intersects(rect)), None)
            original = match['text'] if match else ''
            name = 'LIHVOINEN' if 'MIKHAYLOVA' in original else 'lihvoinen' if 'mikhaylova' in original else 'Lihvoinen'
            size = float(match['size']) if match else 10.0
            baseline = float(match['origin'][1]) if match and 'origin' in match else rect.y1 - 1
            color_num = int(match['color']) if match else 0
            color = ((color_num >> 16 & 255)/255, (color_num >> 8 & 255)/255, (color_num & 255)/255)
            source_font = (match['font'] if match else '').lower()
            font = 'hebo' if 'bold' in source_font else 'tiro' if any(k in source_font for k in ['times', 'serif', 'georgia']) else 'helv'
            edits.append((rect, name, size, baseline, color, font))
            page.add_redact_annot(rect, fill=False, cross_out=False)
        page.apply_redactions(images=fitz.PDF_REDACT_IMAGE_NONE,
                              graphics=fitz.PDF_REDACT_LINE_ART_NONE,
                              text=fitz.PDF_REDACT_TEXT_REMOVE)
        for rect, name, size, baseline, color, font in edits:
            while size > 5 and fitz.get_text_length(name, fontname=font, fontsize=size) > rect.width + 1:
                size -= .25
            if size <= 5:
                sys.exit(f'Unable to fit replacement text on PDF page {page_number}')
            page.insert_text((rect.x0, baseline), name, fontsize=size, fontname=font, color=color, overlay=True)
            changes.append(page_number)
    metadata = doc.metadata.copy()
    for k, v in list(metadata.items()):
        if isinstance(v, str):
            metadata[k] = v.replace('Viktoriya Mikhaylova', 'Viktoriya Lihvoinen').replace('Mikhaylova', 'Lihvoinen')
    metadata['author'] = 'Viktoriya Lihvoinen'
    doc.set_metadata({k: v for k, v in metadata.items() if v is not None})
    output = args.output or src.with_name(src.stem + '-VL.tmp.pdf')
    output.parent.mkdir(parents=True, exist_ok=True)
    doc.save(output, garbage=4, deflate=True)
    doc.close()
    verified = fitz.open(output)
    remaining = [i+1 for i,p in enumerate(verified) if 'mikhaylova' in p.get_text().casefold()]
    okay = len(verified) == n_pages and not remaining and verified.metadata.get('author') == 'Viktoriya Lihvoinen'
    verified.close()
    if not okay:
        sys.exit(f'PDF failed validation; remaining names on pages: {remaining}. Output: {output}')
    if args.output is None:
        if not changes:
            output.unlink(missing_ok=True)
            sys.exit('No editable Mikhaylova text found. It may be embedded in artwork; do not overwrite without reviewing.')
        backup_dir = Path.home() / 'sakustars-pdf-backups'
        backup_dir.mkdir(parents=True, exist_ok=True)
        backup = backup_dir / (src.name + '.before-lihvoinen.bak')
        shutil.copy2(src, backup)
        output.replace(src)
        print(f'Updated {src}; backup at {backup}.')
    else:
        print(f'Updated PDF saved to {output}')
    print(f'Pages preserved: {n_pages}; surnames edited: {len(changes)}; pages: {sorted(set(changes))}.')
    print('Review changed pages visually before committing. Original page images were not rasterized.')
    return 0


if __name__ == '__main__':
    sys.exit(main())
