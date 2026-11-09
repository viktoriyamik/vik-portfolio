#!/usr/bin/env node
/**
 * Check the author name in published HTML/React copy.
 * Historical file names and URLs remain intact to avoid breaking references.
 */
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const published = [
  path.join(root, 'index.html'),
  path.join(root, 'public'),
  path.join(root, 'src'),
];

function walk(entry, collected = []) {
  if (!fs.existsSync(entry)) return collected;
  const stat = fs.statSync(entry);
  if (stat.isDirectory()) {
    for (const name of fs.readdirSync(entry)) {
      if (['node_modules', 'vendor', 'assets'].includes(name)) continue;
      walk(path.join(entry, name), collected);
    }
  } else if (/\.(?:html|tsx|jsx|svg|json|txt)$/i.test(entry)) {
    collected.push(entry);
  }
  return collected;
}

const violations = [];
let checked = 0;
for (const file of published.flatMap((entry) => walk(entry))) {
  const raw = fs.readFileSync(file, 'utf8');
  // Existing Figma, archive and legacy project URLs must not be rewritten.
  const withoutURLs = raw
    .replace(/https?:\/\/[^\s"'<>]+/g, '')
    .replace(/mailto:[^\s"'<>]+/g, '');
  const lines = withoutURLs.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (/\b(?:Mikhaylova|Milkhaylova|Mikhailova)\b/i.test(lines[i])) {
      violations.push(path.relative(root, file) + ':' + (i + 1));
    }
  }
  checked++;
}
if (violations.length) {
  console.error('Old author surname found outside preserved URLs:\n' + violations.join('\n'));
  process.exitCode = 1;
} else {
  console.log('Branding check passed: ' + checked + ' published text files; historical URLs preserved.');
}
