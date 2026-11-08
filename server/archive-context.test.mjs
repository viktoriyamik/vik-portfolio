import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ARCHIVED_PROJECTS, archivePublicTitle, archivedPDFUrl, findArchivedProjects, archivedProjectSources, isArchiveQuestion, wantsOnlyArchive } from "./archive-context.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

test("earlier work lists eight verified downloadable PDFs", () => {
  assert.equal(ARCHIVED_PROJECTS.length, 8);
  for (const p of ARCHIVED_PROJECTS) {
    assert.ok(fs.existsSync(path.join(root, "public/docs", p.filename)), p.title);
  }
});

test("archive intent separates past projects from seven featured cases", () => {
  assert.equal(isArchiveQuestion("Show your earlier portfolio PDFs"), true);
  assert.equal(wantsOnlyArchive("Show your earlier portfolio PDFs"), true);
  assert.equal(isArchiveQuestion("Tell me about all seven case studies"), false);
  assert.equal(wantsOnlyArchive("Show all work including older projects"), false);
});

test("specific historical project produces an accessible reference", () => {
  const selected = findArchivedProjects("Tell me about The SATO Project");
  assert.equal(selected.length, 1);
  assert.equal(selected[0].title, "The SATO Project");
  assert.ok(archivedProjectSources("Tell me about The SATO Project")[0].url.startsWith("/docs/"));
});

test("user-visible archive source titles contain only a project name", () => {
  const filename = ARCHIVED_PROJECTS[0].filename;
  assert.equal(archivePublicTitle(filename), "The Gym Booking App");
  assert.match(archivedPDFUrl(filename), /^\/docs\//);
});
