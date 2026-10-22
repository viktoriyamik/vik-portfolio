import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import OpenAI from "openai";
import { createRequire } from "module";

dotenv.config();

const require = createRequire(import.meta.url);

// PDF parser
const { PDFParse } = require("pdf-parse");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const PDF_DIR = "./data/pdfs";

const OUT_FILE =
  "./data/index/portfolio-index.json";

// ----------------------------
// chunk text
// ----------------------------

function chunkText(
  text,
  size = 1200,
  overlap = 200
) {
  const clean = text
    .replace(/\s+/g, " ")
    .trim();

  const chunks = [];

  let start = 0;

  while (start < clean.length) {
    const end = Math.min(
      start + size,
      clean.length
    );

    chunks.push(
      clean.slice(start, end)
    );

    start += size - overlap;
  }

  return chunks;
}

// ----------------------------
// embeddings
// ----------------------------

async function embed(text) {
  const response =
    await client.embeddings.create({
      model:
        "text-embedding-3-small",

      input: text,
    });

  return response.data[0].embedding;
}

// ----------------------------
// parse pdf
// ----------------------------

async function parsePdf(buffer) {
  const parser = new PDFParse({
    data: buffer,
  });

  const result =
    await parser.getText();

  return {
    text: result.text || "",
  };
}

// ----------------------------
// infer semantic tags
// ----------------------------

function inferTags(fileName) {
  const lower =
    fileName.toLowerCase();

  const tags = [];

  // categories

  if (lower.includes("blog")) {
    tags.push("BLOG ARTICLE");
  }

  if (
    lower.includes("portfolio")
  ) {
    tags.push("PORTFOLIO");
  }

  if (
    lower.includes("project")
  ) {
    tags.push("PROJECT");
  }

  if (
    lower.includes("case-study")
  ) {
    tags.push("CASE STUDY");
  }

  // ux/ui

  if (lower.includes("ui")) {
    tags.push("UI");
  }

  if (lower.includes("ux")) {
    tags.push("UX");
  }

  if (
    lower.includes(
      "accessibility"
    ) ||
    lower.includes(
      "saavutettavuus"
    )
  ) {
    tags.push(
      "ACCESSIBILITY"
    );
  }

  if (
    lower.includes("ixdf")
  ) {
    tags.push("IXDF");
  }

  // tech

  if (
    lower.includes("unity")
  ) {
    tags.push("UNITY");
  }

  if (
    lower.includes("react")
  ) {
    tags.push("REACT");
  }

  if (
    lower.includes(
      "three"
    ) ||
    lower.includes(
      "threejs"
    )
  ) {
    tags.push("THREE.JS");
  }

  if (
    lower.includes("ai")
  ) {
    tags.push("AI");
  }

  return tags;
}

// ----------------------------
// main ingestion
// ----------------------------

async function main() {
  fs.mkdirSync(
    "./data/index",
    {
      recursive: true,
    }
  );

  // remove old index
  if (
    fs.existsSync(OUT_FILE)
  ) {
    fs.unlinkSync(OUT_FILE);

    console.log(
      "Removed previous index"
    );
  }

  const files = fs
    .readdirSync(PDF_DIR)
    .filter((file) =>
      file
        .toLowerCase()
        .endsWith(".pdf")
    );

  if (!files.length) {
    console.log(
      "No PDF files found"
    );

    return;
  }

  console.log(
    `Found ${files.length} PDF files`
  );

  const index = [];

  for (const file of files) {
    console.log(
      `\nReading ${file}`
    );

    const fullPath =
      path.join(
        PDF_DIR,
        file
      );

    const buffer =
      fs.readFileSync(
        fullPath
      );

    // parse PDF

    const parsed =
      await parsePdf(buffer);

    if (
      !parsed.text ||
      !parsed.text.trim()
    ) {
      console.log(
        `Skipping ${file} (no readable text)`
      );

      continue;
    }

    console.log(
      `Extracted ${parsed.text.length} characters`
    );

    // infer semantic tags

    const tags =
      inferTags(file);

    console.log(
      `Tags: ${
        tags.length
          ? tags.join(", ")
          : "none"
      }`
    );

    // chunk text

    const chunks =
      chunkText(parsed.text);

    console.log(
      `Created ${chunks.length} chunks`
    );

    // embed chunks

    for (
      let i = 0;
      i < chunks.length;
      i++
    ) {
      console.log(
        `Embedding ${file} chunk ${i + 1}/${chunks.length}`
      );

      // semantic enrichment

      const enrichedText = `
FILE:
${file}

TAGS:
${tags.join(", ")}

CATEGORY:
${
  tags.includes(
    "BLOG ARTICLE"
  )
    ? "BLOG ARTICLE"
    : tags.includes(
          "PROJECT"
        )
      ? "PROJECT"
      : "PORTFOLIO"
}

CONTENT:
${chunks[i]}
`;

      const embedding =
        await embed(
          enrichedText
        );

      index.push({
        id: `${file}::${i}`,

        file,

        chunkIndex: i,

        tags,

        text: enrichedText,

        embedding,
      });
    }
  }

  fs.writeFileSync(
    OUT_FILE,
    JSON.stringify(
      index,
      null,
      2
    )
  );

  console.log(
    `\nDone.`
  );

  console.log(
    `Saved ${index.length} chunks to ${OUT_FILE}`
  );
}

// ----------------------------
// run
// ----------------------------

main().catch((err) => {
  console.error(
    "\nIngestion failed:"
  );

  console.error(err);

  process.exit(1);
});
