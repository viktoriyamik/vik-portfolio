import express from "express";
import dotenv from "dotenv";
import OpenAI from "openai";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { getCurrentPortfolioContext, currentCaseSources, shouldSearchArchive } from "./portfolio-context.mjs";
import { ARCHIVED_PROJECTS, getArchiveOverview, archivedProjectSources, archivePublicTitle } from "./archive-context.mjs";

dotenv.config();

const app = express();

// Browser clients access this API through the same-origin Nginx proxy.
app.set("trust proxy", "loopback");
app.use(express.json({ limit: "12kb" }));

const ipWindows = new Map();
let dailyBucket = { day: "", count: 0 };
let activeRequests = 0;
const MAX_ACTIVE = 2;
function requestGuard(req, res, next) {
  const ip = req.ip || req.socket.remoteAddress || "unknown";
  const now = Date.now();
  const day = new Date(now).toISOString().slice(0, 10);
  if (dailyBucket.day !== day) dailyBucket = { day, count: 0 };
  if (ipWindows.size > 5000) {
    for (const [key, value] of ipWindows) if (now - value.started > 3600000) ipWindows.delete(key);
  }
  const previous = ipWindows.get(ip);
  const bucket = previous && now - previous.started < 3600000 ? previous : { started: now, count: 0 };
  if (bucket.count >= 10 || dailyBucket.count >= 100) return res.status(429).json({ error: "Question limit reached. Please try later." });
  if (activeRequests >= MAX_ACTIVE) return res.status(503).json({ error: "Assistant is busy. Please retry shortly." });
  bucket.count++;
  ipWindows.set(ip, bucket);
  dailyBucket.count++;
  activeRequests++;
  let released = false;
  const release = () => { if (!released) { released = true; activeRequests--; } };
  res.once("finish", release);
  res.once("close", release);
  next();
}


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 25000,
  maxRetries: 0,
});

const __filename = fileURLToPath(
  import.meta.url
);

const __dirname = path.dirname(
  __filename
);

const indexPath = path.join(
  __dirname,
  "../data/index/portfolio-index.json"
);

console.log(
  "Loading embeddings from:",
  indexPath
);

const embeddings = JSON.parse(
  fs.readFileSync(
    indexPath,
    "utf8"
  )
);

function cosineSimilarity(a, b) {
  let dot = 0;
  let magA = 0;
  let magB = 0;

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }

  magA = Math.sqrt(magA);
  magB = Math.sqrt(magB);

  return dot / (magA * magB);
}

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "portfolio-ai", featuredCases: 7, earlierPDFSelection: ARCHIVED_PROJECTS.length });
});

app.post("/api/ask", requestGuard, async (req, res) => {
  try {
    const {
      question,
      history = [],
    } = req.body || {};

    if (typeof question !== "string" || !question.trim() || question.length > 3000) {
      return res.status(400).json({
        error: "Question required",
      });
    }

    console.log(
      "\nAI Question:",
      question
    );

    // Current portfolio case pages are authoritative and need no new embeddings.
    // Historical PDF embeddings are used for older projects, IxDF and academic work.
    const current = getCurrentPortfolioContext(question);
    const archiveOverview = getArchiveOverview(question);
    const includeArchive = shouldSearchArchive(question, current.selected);
    const topMatches = [];

    if (includeArchive) {
      const embeddingResponse = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: question,
      });
      const queryEmbedding = embeddingResponse.data[0].embedding;
      const scored = embeddings.map((item) => ({
        ...item,
        score: cosineSimilarity(queryEmbedding, item.embedding),
      }));
      scored.sort((a, b) => b.score - a.score);
      const perDocument = new Map();
      for (const item of scored) {
        const count = perDocument.get(item.file) || 0;
        if (count >= 2) continue;
        topMatches.push(item);
        perDocument.set(item.file, count + 1);
        if (topMatches.length >= 8) break;
      }
    }

    // build RAG context
    const context = topMatches
      .map(
        (m) =>
          `
ARCHIVED PDF: ${archivePublicTitle(m.file)}

${m.text.replaceAll("Viktoriya Mikhaylova", "Viktoriya Lihvoinen")}
`
      )
      .join("\n\n");

    const excluded = new Set([
      "About",
      "Home",
      "My IxDF Learning Experience Archives"
    ]);

    const projectCatalogue = [...new Set(
      embeddings
        .map(item => item.file)
        .filter(file => file.endsWith(
          " - Viktoriya Mikhaylova's portfolio.pdf"
        ))
        .map(file => file.split(
          " - Viktoriya Mikhaylova's portfolio.pdf"
        )[0])
        .filter(name => !excluded.has(name))
    )].sort();

    // AI completion
    const completion =
      await openai.chat.completions.create({
        model: "gpt-4.1-mini",

        messages: [
          {
            role: "system",

            content: [
              "You are Viktoriya Lihvoinen's portfolio AI assistant for recruiters, clients and collaborators.",
              "The seven published current case studies listed below are the primary source for current project names, roles, status and outcomes.",
              "Never say there are only three featured projects. For a project overview, mention all seven and link the matching case study.",
              "Distinguish a published product from a design concept, an interactive prototype, a proposed usability test, and completed research. Do not invent impact metrics, research participants, revenue, integrations or outcomes.",
              "Use the detailed current case text supplied with the question for specifics. If the evidence does not establish something, say it is not documented.",
              "Always identify the designer as Viktoriya Lihvoinen in every answer and link label. Historical PDF filenames are preserved as original file paths but must not change her displayed professional name.",
              "The homepage also links to eight selected earlier portfolio PDFs. Those archived projects are additional work beyond the seven featured cases.",
              "When asked for earlier, older, archived or other projects, prioritize the historical PDF archive. When asked for both current and older work, distinguish the two groups.",
              "Historical projects include The Gym Booking App, The SATO Project, The Healthy Garden Tree App, Bash Party Planning App, The Lyckan Living Lab Project and others when supported by indexed PDFs.",
              "The Gym Booking App was not Viktoriya's Bachelor's thesis. Her thesis is User-centered design and the implementation of a digital interactive platform.",
              "Laurea Digital Living Lab is one project, not an unrelated second Laurea University website project.",
              "When discussing AI, explain uncertainty, human review, consent and evidence boundaries accurately. Do not claim AccessBloom sample scans or planned AURA research are real-world validated metrics.",
              "Keep answers clear and professional, using concise paragraphs and explicit project names. Prefer canonical https://vik.ooo/case-studies/ links. Historical PDF titles may be mentioned when useful.",
              current.overview,
              "Selected historical PDF titles: " + ARCHIVED_PROJECTS.map((p) => p.title).join("; "),
              archiveOverview,
            ].join("\n\n"),
          },

          ...(Array.isArray(history) ? history : [])
            .filter((msg) => msg && ["user", "assistant"].includes(msg.role) && typeof msg.text === "string")
            .slice(-6)
            .map((msg) => ({ role: msg.role, content: msg.text.slice(0, 1500) })),

          {
            role: "user",

            content: [
              "Question:\n" + question,
              current.detail ? "Current published case study evidence:\n" + current.detail : "",
              archiveOverview ? "Earlier portfolio archive links:\n" + archiveOverview : "",
              includeArchive ? "Additional archived portfolio document titles (not necessarily current featured projects):\n" +
                projectCatalogue.map((name) => "- " + name).join("\n") : "",
              includeArchive ? "Relevant archived PDF excerpts:\n" + context : "",
            ].filter(Boolean).join("\n\n"),
          },
        ],

        temperature: 0.3,
        max_completion_tokens: 700,
      });

    // Preserve original archive file URLs while exposing the current name in labels.
    const pdfSources = [...new Map(topMatches.map((m) => [
      m.file,
      { file: archivePublicTitle(m.file) + " - historical PDF", url: "/docs/" + encodeURIComponent(m.file) }
    ])).values()];
    const sources = [...new Map([
      ...currentCaseSources(question, current.selected),
      ...archivedProjectSources(question),
      ...pdfSources,
    ].map((source) => [source.url, source])).values()];

    res.json({
      answer:
        completion.choices[0].message.content,

      sources,
    });
  } catch (err) {
    console.error(
      "\nAI request failed:"
    );

    console.error(err);

    res.status(500).json({
      error: "AI request failed",
    });
  }
});

const PORT = 3001;

app.listen(PORT, "127.0.0.1", () => {
  console.log(
    `Seven-case portfolio AI backend running on port ${PORT}`
  );
});
