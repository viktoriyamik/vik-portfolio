import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const data = JSON.parse(fs.readFileSync(path.join(root, "data/archive-projects.json"), "utf8"));
export const ARCHIVED_PROJECTS = Object.freeze(data.projects);

const simplify = (value) => String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const archiveSignal = /\b(older|earlier|archive|archives|archived|historical|previous|past|pdf|pdfs|ixdf|blog|blogs|articles|thesis|bachelor|academic)\b/i;
const otherWorkSignal = /\b(?:other|additional)\s+(?:projects|work|case studies|cases|designs|portfolio)\b/i;
const bothCollectionsSignal = /\b(?:both|including|alongside|together with|current and|new and old)\b/i;

export function isArchiveQuestion(question) {
  const q = String(question || "");
  return archiveSignal.test(q) || otherWorkSignal.test(q) || ARCHIVED_PROJECTS.some((item) => {
    const name = simplify(item.title);
    const value = " " + simplify(q) + " ";
    return name.length > 3 && value.includes(" " + name + " ");
  });
}

export function wantsOnlyArchive(question) {
  return isArchiveQuestion(question) && !bothCollectionsSignal.test(question);
}

export function findArchivedProjects(question) {
  const q = simplify(question);
  const words = " " + q + " ";
  const found = ARCHIVED_PROJECTS.filter((project) =>
    [project.title, ...(project.aliases || [])].some((phrase) => {
      const val = simplify(phrase);
      return val.length > 3 && words.includes(" " + val + " ");
    })
  );
  if (found.length) return found;
  return isArchiveQuestion(question) ? ARCHIVED_PROJECTS : [];
}

export function archivePublicTitle(filename) {
  return String(filename || "")
    .replace(/\.pdf$/i, "")
    .replace(/ - Viktoriya [^\n]+$/i, "")
    .trim();
}

export function archivedPDFUrl(file) {
  return "/docs/" + encodeURIComponent(file);
}

export function getArchiveOverview(question) {
  if (!isArchiveQuestion(question)) return "";
  const selected = findArchivedProjects(question);
  return "EARLIER PORTFOLIO WORK (archived PDF records, separate from the current seven featured case studies):\n" +
    selected.map((project) =>
      "- " + project.title + " | " + project.category + " | Original PDF available in the portfolio archive and Sources"
    ).join("\n");
}

export function archivedProjectSources(question) {
  return findArchivedProjects(question).map((p) => ({
    file: p.title + " - archived project PDF",
    url: archivedPDFUrl(p.filename),
  }));
}
