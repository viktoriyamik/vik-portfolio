import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const catalogue = JSON.parse(fs.readFileSync(path.join(root, "data/current-cases.json"), "utf8"));

export const CURRENT_CASES = Object.freeze(catalogue.cases);
export const CURRENT_PORTFOLIO_OWNER = catalogue.owner;

const normalise = (s) => String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const broadQuestion = (q) => /\b(projects|case studies|portfolio|selected work|all cases|all your work|what have you built|show your work)\b/i.test(q);

function caseScore(question, item) {
  const q = normalise(question);
  const aliases = [item.slug, item.name, ...(item.aliases || [])].map(normalise);
  if (aliases.some((alias) => alias.length > 2 && (" " + q + " ").includes(" " + alias + " "))) return 100;
  let score = 0;
  for (const topic of item.topics || []) {
    const term = normalise(topic);
    if (term && (" " + q + " ").includes(" " + term + " ")) score += 4;
  }
  return score;
}

export function selectCurrentCases(question) {
  const q = String(question || "");
  if (broadQuestion(q) && !/\b(older|archived|historical|previous pdfs)\b/i.test(q)) return CURRENT_CASES;
  return CURRENT_CASES.map((item) => ({item, score: caseScore(q, item)}))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((entry) => entry.item);
}

export function shouldSearchArchive(question, selectedCases) {
  const q = String(question || "");
  if (/\b(older|archived|historical|previous work|thesis|bachelor|ixdf|blog|blogs|articles|pdf|academic)\b/i.test(q)) return true;
  return !selectedCases.length;
}

function htmlToText(html) {
  const body = (html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i) || [,""])[1];
  return body
    .replace(/<(script|style|noscript)\b[^>]*>[\s\S]*?<\/\1>/gi, " ")
    .replace(/<\/(p|section|h1|h2|h3|h4|li|div|article|figure)>/gi, "\n")
    .replace(/<[^>]*>/g, " ")
    .replace(/&amp;/g, "&").replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/\s+/g, " ").trim();
}

function currentCaseBody(item) {
  const file = path.join(root, "public", "case-studies", item.slug, "index.html");
  try {
    return htmlToText(fs.readFileSync(file, "utf8")).slice(0, 6400);
  } catch {
    return item.summary;
  }
}

export function getCurrentPortfolioContext(question) {
  const selected = selectCurrentCases(question);
  const overview = "CURRENT PORTFOLIO - " + CURRENT_PORTFOLIO_OWNER + " (7 featured case studies):\n" +
    CURRENT_CASES.map((item, index) => (index + 1) + ". " + item.name + " | " + item.status +
      " | " + item.role + "\n" + item.summary + "\nCase: " + item.url).join("\n\n");
  const detail = selected.length === CURRENT_CASES.length ? "" :
    selected.map((item) => "CURRENT CASE DETAIL - " + item.name + " (" + item.url + "):\n" + currentCaseBody(item)).join("\n\n");
  return { selected, overview, detail };
}

export function currentCaseSources(question, selected) {
  const items = selected || selectCurrentCases(question);
  return items.map((item) => ({ file: item.name + " - current case study", url: item.url }));
}
