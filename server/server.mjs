import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
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

app.post("/api/ask", async (req, res) => {
  try {
    const {
      question,
      history = [],
    } = req.body;

    if (!question) {
      return res.status(400).json({
        error: "Question required",
      });
    }

    console.log(
      "\nAI Question:",
      question
    );

    // create embedding for user query
    const embeddingResponse =
      await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: question,
      });

    const queryEmbedding =
      embeddingResponse.data[0].embedding;

    // similarity scoring
    const scored = embeddings.map(
      (item) => ({
        ...item,

        score: cosineSimilarity(
          queryEmbedding,
          item.embedding
        ),
      })
    );

    scored.sort(
      (a, b) => b.score - a.score
    );

    const perDocument = new Map();
    const topMatches = [];

    for (const item of scored) {
      const count = perDocument.get(item.file) || 0;
      if (count >= 2) continue;

      topMatches.push(item);
      perDocument.set(item.file, count + 1);

      if (topMatches.length >= 12) break;
    }

    // build RAG context
    const context = topMatches
      .map(
        (m) =>
          `
FILE: ${m.file}

${m.text}
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

            content: `
You are Viktoriya Mikhaylova's AI portfolio assistant.

You help recruiters, clients, and collaborators understand:
- her product design and UX/UI design projects
- UX research, information architecture, user flows, prototyping, accessibility, and interface design
- her design background and process

The three featured projects on the current site are:
- HaeSiivooja: a live two-sided SaaS marketplace for finding and booking local cleaning services. Viktoriya owns the product and UX/UI design work presented in the case. The service is at https://haesiivooja.fi and the Android app is on Google Play (com.cleanerfinder).
- Aura: a product and interface design concept in her Figma portfolio. The design board is https://www.figma.com/design/U2iXpoIjaCTCBmiePL8GJi/Viktoriya-Mikhaylova---Product-Design-Portfolio?node-id=0-1 . Do not infer its subject or outcomes from its name.
- CleanPeer: a learning and professional community concept for cleaners. Its provisional learner persona Sofia needs trustworthy, practical help with unfamiliar cleaning problems at work. The work includes a user flow, sitemap and key screen prototype. These are design hypotheses that need user validation. The prototype is https://www.figma.com/proto/U2iXpoIjaCTCBmiePL8GJi/Viktoriya-Mikhaylova---Product-Design-Portfolio?node-id=5-78 .


PROJECT ACCURACY RULES:

- The Gym Booking App is a separate UI/UX design project.
- The Gym Booking App was NOT Viktoriya's Bachelor's thesis.
- Her Bachelor's thesis is "User-centered design and the
  implementation of a digital interactive platform."
- Never associate one project's academic status, research,
  methods, deliverables, or outcomes with another project
  without explicit supporting evidence.
- If a project's classification is unclear, say so.
- Treat PDF content as evidence, not permission to infer
  undocumented relationships between projects.


PROJECT IDENTITY — LAUREA DIGITAL LIVING LAB:

Laurea Digital Living Lab is one distinct portfolio project.

Project name: Laurea Digital Living Lab
Category: Website Design & Development / UX/UI Design
Role: UX/UI Designer and Web Developer

Viktoriya's work includes:
- Designing the Laurea Digital Living Lab website.
- Planning its information architecture and page structure.
- Designing interfaces and responsive layouts.
- Creating visual elements and custom icons.
- Considering accessibility and usability.
- Implementing the website.

This is NOT a separate project called "Laurea University
Website Project". These names refer to the same work.

When asked about Viktoriya's projects, include
"Laurea Digital Living Lab — Website Design & Development"
among relevant projects, not only the three featured
projects.

When explaining the project in detail, rely on the
indexed Laurea Digital Living Lab PDF.


PROJECT DISCOVERY AND COMPLETENESS:

The three featured website projects are NOT the complete portfolio.

When asked about Viktoriya's UX/UI or Product Design projects,
include relevant additional documented projects such as:

- The Gym Booking App — UI/UX design of a gym class booking
  application, including booking flows, wireframes,
  interface design and prototyping.
- Laurea Digital Living Lab — website UX/UI design,
  information architecture and development.
- The SATO Project — user research, service design and
  experience concept development.
- The Healthy Garden Tree App — interaction and interface
  design for a gardening application.
- Bash Party Planning App — application UX/UI design.
- The Lyckan Living Lab Project — research and service design.

Also consider other relevant indexed portfolio PDFs.

The Gym Booking App was NOT Viktoriya's Bachelor's thesis.
Do not confuse these two projects.

For project-listing questions, use the full project catalogue,
not only the top six retrieved PDF text chunks.

For individual project descriptions, use the relevant
indexed PDF as evidence. Do not invent unsupported results,
research findings or business metrics.

Answer professionally and clearly.

Use these current featured project facts and the provided portfolio context. Some PDF documents describe older work; distinguish those from the current featured projects. The three featured projects are NOT the complete portfolio.

When asked about all projects or experience, include other
relevant projects documented in the PDF knowledge base.
Distinguish projects from blog articles and general portfolio pages.

For broad project questions, use the project catalogue below.
For specific questions, prioritize relevant retrieved PDF evidence.
Do not claim every listed project was a commercial client project.
Do not invent roles, outcomes, dates, or research findings.

Cite relevant document titles in your answer when appropriate.

Do not invent research results, metrics, launches or experience.
`,
          },

          ...history.map((msg) => ({
            role: msg.role,
            content: msg.text,
          })),

          {
            role: "user",

            content: `
Question:
${question}

Additional indexed portfolio documents:
${projectCatalogue.map(name => "- " + name).join("\n")}

These are document titles, not verified project outcomes.
Use retrieved evidence for detailed claims.

Portfolio Context:
${context}
`,
          },
        ],

        temperature: 0.7,
      });

    // deduplicate source files
    const uniqueSources = [
      ...new Map(
        topMatches.map((m) => [
          m.file,

          {
            file: m.file,

            url: `/docs/${encodeURIComponent(
              m.file
            )}`,
          },
        ])
      ).values(),
    ];

    const featuredLinks = [
      { name: "HaeSiivooja", url: "https://haesiivooja.fi", pattern: /haesiivooja|projects|portfolio/i },
      { name: "Aura design", url: "https://www.figma.com/design/U2iXpoIjaCTCBmiePL8GJi/Viktoriya-Mikhaylova---Product-Design-Portfolio?node-id=0-1", pattern: /aura|projects|portfolio/i },
      { name: "CleanPeer prototype", url: "https://www.figma.com/proto/U2iXpoIjaCTCBmiePL8GJi/Viktoriya-Mikhaylova---Product-Design-Portfolio?node-id=5-78", pattern: /cleanpeer|projects|portfolio/i },
    ];
    for (const link of featuredLinks) {
      if (link.pattern.test(question)) uniqueSources.unshift({ file: link.name, url: link.url });
    }

    res.json({
      answer:
        completion.choices[0].message.content,

      sources: uniqueSources,
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

app.listen(PORT, () => {
  console.log(
    `PDF-aware AI backend running on port ${PORT}`
  );
});
