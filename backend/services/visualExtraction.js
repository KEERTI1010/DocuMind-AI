const { createCanvas } = require("@napi-rs/canvas");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const path = require("path");

let pdfjsLib = null;

async function loadPdfjs() {
  if (pdfjsLib) return pdfjsLib;
  const mod = await import("pdfjs-dist/legacy/build/pdf.mjs");
  pdfjsLib = mod.default || mod;
  const workerPath = require.resolve("pdfjs-dist/legacy/build/pdf.worker.min.mjs");
  pdfjsLib.GlobalWorkerOptions.workerSrc = workerPath;
  return pdfjsLib;
}

const TABLE_PATTERNS = [
  /\b(table|figure|chart|diagram)\s+\d+/i,
  /^\s*\|.*\|\s*$/m,
  /^\s*[\+\-]\s*[\+\-]+\s*[\+\-]/m,
  /\bx\s+y\s+z\b/i,
  /\b(inputs?|outputs?)\b.*\b(C|S|carry|sum)\b/i,
  /truth.?table/i,
];

const TRUTH_TABLE_PATTERNS = [
  /\bx\s+y\s+z\b/i,
  /\b(inputs?|outputs?)\b.*\b(C|S|carry|sum)\b/i,
  /truth.?table/i,
];

const MIN_TEXT_LENGTH = 100;

function looksLikeVisualPage(text) {
  if (!text || text.trim().length < MIN_TEXT_LENGTH) {
    console.log(`[visual] Page flagged: text length ${text?.trim().length || 0} < ${MIN_TEXT_LENGTH}`);
    return true;
  }
  const lower = text.toLowerCase();
  for (const pattern of TABLE_PATTERNS) {
    if (pattern.test(lower)) {
      console.log(`[visual] Page flagged: matched pattern ${pattern}`);
      return true;
    }
  }
  console.log(`[visual] Page NOT flagged: text length ${text.trim().length}, no pattern match`);
  return false;
}

function isTruthTablePage(text) {
  const lower = text.toLowerCase();
  for (const pattern of TRUTH_TABLE_PATTERNS) {
    if (pattern.test(lower)) {
      return true;
    }
  }
  return false;
}

async function renderPageToBuffer(pdfData, pageNumber, scale = 2.0) {
  const lib = await loadPdfjs();
  const uint8Data = pdfData instanceof Uint8Array ? pdfData : new Uint8Array(pdfData);
  const loadingTask = lib.getDocument({ data: uint8Data });
  const pdf = await loadingTask.promise;

  if (pageNumber < 1 || pageNumber > pdf.numPages) {
    throw new Error(`Page ${pageNumber} out of range (1-${pdf.numPages})`);
  }

  const page = await pdf.getPage(pageNumber);
  const viewport = page.getViewport({ scale });

  const canvas = createCanvas(viewport.width, viewport.height);
  const context = canvas.getContext("2d");

  const renderContext = {
    canvasContext: context,
    viewport: viewport,
  };

  await page.render(renderContext).promise;

  return canvas.toBuffer("image/png");
}

async function extractVisualContentWithGemini(imageBuffer, pageNumber, apiKey, isTruthTable = false) {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });

  let prompt;
  if (isTruthTable) {
    prompt = `You are extracting text and tables from page ${pageNumber} of a technical document.

CRITICAL INSTRUCTIONS FOR TRUTH TABLE EXTRACTION:
1. This page contains a FULL ADDER TRUTH TABLE with inputs x, y, z and outputs C (carry), S (sum)
2. Extract ALL 8 rows of the truth table in Markdown format
3. The table MUST have these columns: x, y, z, C, S (or equivalent headers)
4. Extract every visible row - there should be exactly 8 combinations (000 through 111)
5. Preserve exact numerical values (0 or 1) - do not round or interpret
6. If any cell is unreadable, use "[unreadable]" but continue extracting other cells
7. Include table caption/heading if present (e.g., "Full Adder Truth Table", "Table 5.1")
8. Output ONLY the extracted content in Markdown format
9. NO explanations, NO meta-commentary, NO apologies

Example expected output format:
| x | y | z | C | S |
|---|---|---|---|---|
| 0 | 0 | 0 | 0 | 0 |
| 0 | 0 | 1 | 0 | 1 |
| 0 | 1 | 0 | 0 | 1 |
| 0 | 1 | 1 | 1 | 0 |
| 1 | 0 | 0 | 0 | 1 |
| 1 | 0 | 1 | 1 | 0 |
| 1 | 1 | 0 | 1 | 0 |
| 1 | 1 | 1 | 1 | 1 |`;
  } else {
    prompt = `You are extracting text and tables from page ${pageNumber} of a technical document.

CRITICAL INSTRUCTIONS:
1. Extract ALL readable text, including tables, figures, and diagrams
2. For tables: Output in Markdown format with proper headers, columns, and rows
3. Preserve column alignment and row structure exactly as shown
4. Include any table captions, figure labels, or section headings on this page
5. If a table spans multiple pages, note "Table continues from previous page" or "Table continues on next page"
6. NEVER invent or hallucinate values - only extract what is visibly present
7. If content is unreadable, note "[unreadable]" in place of the value
8. Return ONLY the extracted content, no explanations or meta-commentary`;
  }

  const result = await model.generateContent([
    {
      inlineData: {
        data: imageBuffer.toString("base64"),
        mimeType: "image/png",
      },
    },
    prompt,
  ]);

  return result.response.text() || "";
}

async function enhancePagesWithVisualExtraction(pdfBuffer, pages, apiKey) {
  if (!apiKey) {
    console.warn("[visual] No GEMINI_API_KEY, skipping visual extraction");
    return pages;
  }

  console.log(`[visual] Starting enhancement for ${pages.length} pages`);
  const enhancedPages = [...pages];
  const visualPageIndices = [];

  for (let i = 0; i < pages.length; i++) {
    const pageText = pages[i]?.text?.trim() || "";
    console.log(`[visual] Page ${i + 1}: text length = ${pageText.length}, preview: "${pageText.slice(0, 100)}..."`);
    if (looksLikeVisualPage(pageText)) {
      visualPageIndices.push(i);
    }
  }

  if (visualPageIndices.length === 0) {
    console.log("[visual] No visual pages detected");
    return enhancedPages;
  }

  console.log(`[visual] Visual pages detected: ${visualPageIndices.map(i => i + 1).join(", ")}`);

  for (const pageIndex of visualPageIndices) {
    const pageNumber = pageIndex + 1;
    const pageText = pages[pageIndex]?.text?.trim() || "";
    const isTruthTable = isTruthTablePage(pageText);
    const renderScale = isTruthTable ? 3.0 : 2.0;

    console.log(`[visual] Page ${pageNumber}: isTruthTable=${isTruthTable}, renderScale=${renderScale}`);

    try {
      console.log(`[visual] Rendering page ${pageNumber} at scale ${renderScale}...`);
      const imageBuffer = await renderPageToBuffer(pdfBuffer, pageNumber, renderScale);
      console.log(`[visual] Page ${pageNumber} rendered successfully: ${imageBuffer.length} bytes`);

      console.log(`[visual] Running Gemini visual extraction on page ${pageNumber} (truthTableMode=${isTruthTable})...`);
      const visualText = await extractVisualContentWithGemini(imageBuffer, pageNumber, apiKey, isTruthTable);

      console.log(`[visual] Page ${pageNumber} Gemini response length: ${visualText?.length || 0}`);
      console.log(`[visual] Page ${pageNumber} Gemini response preview: "${visualText?.slice(0, 300)}..."`);

      if (visualText && visualText.trim()) {
        const originalText = enhancedPages[pageIndex]?.text?.trim() || "";
        const mergedText = originalText
          ? `${originalText}\n\n--- Visual Extraction (Page ${pageNumber}) ---\n${visualText.trim()}`
          : visualText.trim();

        enhancedPages[pageIndex] = {
          ...enhancedPages[pageIndex],
          text: mergedText,
        };
        console.log(`[visual] Page ${pageNumber}: Visual extraction MERGED successfully. Added ${visualText.length} chars, total ${mergedText.length} chars`);
      } else {
        console.warn(`[visual] Page ${pageNumber}: Gemini returned EMPTY text - visual extraction produced no content`);
      }
    } catch (err) {
      console.error(`[visual] Visual extraction FAILED for page ${pageNumber}:`, err.message, err.stack);
      // Do not throw - allow upload to continue with original text
    }
  }

  return enhancedPages;
}

module.exports = {
  enhancePagesWithVisualExtraction,
  looksLikeVisualPage,
  renderPageToBuffer,
  extractVisualContentWithGemini,
  isTruthTablePage,
};