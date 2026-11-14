const { GoogleGenerativeAI } = require("@google/generative-ai");
const { supabaseAdmin } = require("../config/supabase");

const STOP_WORDS = new Set(["the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for", "of", "with", "by", "is", "are", "was", "were", "be", "been", "this", "that", "it", "as", "from", "what", "how", "when", "where", "which", "who", "why", "can", "could", "would", "should", "will", "do", "does", "did", "have", "has", "had", "am"]);

const COMMON_CORRECTIONS = {
  "binry": "binary",
  "arry": "array",
  "functon": "function",
  "varaible": "variable",
  "algoritm": "algorithm",
  "recusrion": "recursion",
  "iteraton": "iteration",
  "complexty": "complexity",
  "deprecatd": "deprecated",
  "dependecy": "dependency",
  "configuartion": "configuration",
  "enviroment": "environment",
  "libary": "library",
  "framewrok": "framework",
  "datbase": "database",
  "querry": "query",
  "indicies": "indices",
  "matrice": "matrix",
  "vetor": "vector",
  "tenosr": "tensor",
  "gradent": "gradient",
  "optimizaton": "optimization",
  "regresion": "regression",
  "classificaton": "classification",
  "clustring": "clustering",
  "neurla": "neural",
  "netowrk": "network",
  "modle": "model",
  "trainig": "training",
  "infernece": "inference",
  "acurracy": "accuracy",
  "precison": "precision",
  "recall": "recall",
  "f1-socre": "f1-score",
  "overfiting": "overfitting",
  "underfiting": "underfitting",
  "hyperparamter": "hyperparameter",
  "epoches": "epochs",
  "bach": "batch",
  "lerning": "learning",
  "supervsed": "supervised",
  "unsupervsed": "unsupervised",
  "reinforcment": "reinforcement",
  "transformr": "transformer",
  "attenton": "attention",
  "embeding": "embedding",
  "tokeniztion": "tokenization",
  "sequnce": "sequence",
  "paralel": "parallel",
  "distributed": "distributed",
  "concurncy": "concurrency",
  "synchronizaton": "synchronization",
  "deadlok": "deadlock",
  "racecondition": "race condition",
  "mutex": "mutex",
  "semaphore": "semaphore",
  "thread": "thread",
  "process": "process",
  "schedulng": "scheduling",
  "memory": "memory",
  "cache": "cache",
  "heap": "heap",
  "stack": "stack",
  "garbage": "garbage",
  "collector": "collector",
  "pointer": "pointer",
  "reference": "reference",
  "allocaton": "allocation",
  "deallocaton": "deallocation",
  "segfault": "segfault",
  "null": "null",
  "excepton": "exception",
  "handling": "handling",
  "try-catch": "try-catch",
  "finally": "finally",
  "throw": "throw",
  "catch": "catch",
  "interface": "interface",
  "implementaton": "implementation",
  "inheritance": "inheritance",
  "polymorphism": "polymorphism",
  "encapsulation": "encapsulation",
  "abstraction": "abstraction",
  "designpattern": "design pattern",
  "singleton": "singleton",
  "factory": "factory",
  "observer": "observer",
  "strategy": "strategy",
  "decorator": "decorator",
  "adapter": "adapter",
  "facade": "facade",
  "proxy": "proxy",
  "builder": "builder",
  "prototype": "prototype",
  "abstract": "abstract",
  "concrete": "concrete",
  "solid": "solid",
  "dry": "dry",
  "kiss": "kiss",
  "yagni": "yagni",
  "clean": "clean",
  "code": "code",
  "refactor": "refactor",
  "technical": "technical",
  "debt": "debt",
  "legacy": "legacy",
  "migration": "migration",
  "deployment": "deployment",
  "ci-cd": "ci-cd",
  "pipeline": "pipeline",
  "docker": "docker",
  "kubernetes": "kubernetes",
  "container": "container",
  "orchestration": "orchestration",
  "microservice": "microservice",
  "monolith": "monolith",
  "api": "api",
  "rest": "rest",
  "graphql": "graphql",
  "grpc": "grpc",
  "websocket": "websocket",
  "message": "message",
  "queue": "queue",
  "kafka": "kafka",
  "rabbitmq": "rabbitmq",
  "redis": "redis",
  "postgresql": "postgresql",
  "mysql": "mysql",
  "mongodb": "mongodb",
  "sql": "sql",
  "nosql": "nosql",
  "acid": "acid",
  "base": "base",
  "cap": "cap",
  "theorem": "theorem",
  "consistency": "consistency",
  "availability": "availability",
  "partition": "partition",
  "tolerance": "tolerance",
  "sharding": "sharding",
  "replication": "replication",
  "load": "load",
  "balancer": "balancer",
  "scaling": "scaling",
  "horizontal": "horizontal",
  "vertical": "vertical",
  "auto": "auto",
  "manual": "manual",
  "monitoring": "monitoring",
  "logging": "logging",
  "tracing": "tracing",
  "metrics": "metrics",
  "alert": "alert",
  "dashboard": "dashboard",
  "grafana": "grafana",
  "prometheus": "prometheus",
  "elk": "elk",
  "elasticsearch": "elasticsearch",
  "logstash": "logstash",
  "kibana": "kibana",
  "security": "security",
  "authentication": "authentication",
  "authorization": "authorization",
  "oauth": "oauth",
  "jwt": "jwt",
  "token": "token",
  "session": "session",
  "cookie": "cookie",
  "csrf": "csrf",
  "xss": "xss",
  "sql-injection": "sql injection",
  "sanitization": "sanitization",
  "validation": "validation",
  "encryption": "encryption",
  "decryption": "decryption",
  "hashing": "hashing",
  "salting": "salting",
  "bcrypt": "bcrypt",
  "argon2": "argon2",
  "pbkdf2": "pbkdf2",
  "scrypt": "scrypt",
  "ssl": "ssl",
  "tls": "tls",
  "certificate": "certificate",
  "handshake": "handshake",
  "public": "public",
  "private": "private",
  "key": "key",
  "rsa": "rsa",
  "aes": "aes",
  "sha": "sha",
  "md5": "md5",
  "digest": "digest",
  "signature": "signature",
  "verify": "verify",
  "trust": "trust",
  "chain": "chain",
  "ca": "ca",
  "pki": "pki",
};

function tokenize(text) {
  return (text || "")
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((word) => word.length > 2 && !STOP_WORDS.has(word));
}

function levenshtein(a, b) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const matrix = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= b.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      if (a[i - 1] === b[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j - 1] + 1
        );
      }
    }
  }
  return matrix[a.length][b.length];
}

function buildVocabulary(chunks) {
  const vocab = new Set();
  for (const chunk of chunks) {
    const words = tokenize(chunk.content);
    for (const w of words) vocab.add(w);
  }
  return Array.from(vocab);
}

function correctQuery(question, chunks) {
  const vocab = buildVocabulary(chunks);
  const vocabSet = new Set(vocab);
  const tokens = tokenize(question);
  let corrected = false;
  const correctedTokens = tokens.map((token) => {
    if (vocabSet.has(token)) return token;
    if (token.length < 4) return token;
    if (COMMON_CORRECTIONS[token] && vocabSet.has(COMMON_CORRECTIONS[token])) {
      corrected = true;
      return COMMON_CORRECTIONS[token];
    }
    let bestMatch = token;
    let bestDist = Infinity;
    for (const v of vocab) {
      if (Math.abs(v.length - token.length) > 2) continue;
      const dist = levenshtein(token, v);
      if (dist < bestDist && dist <= 2) {
        bestDist = dist;
        bestMatch = v;
      }
    }
    if (bestMatch !== token) corrected = true;
    return bestMatch;
  });
  return { corrected: corrected, correctedQuery: correctedTokens.join(" "), originalQuery: question };
}

function retrieveChunks(question, chunks, limit = 5) {
  const questionTerms = new Set(tokenize(question));
  console.log(`[rag] Question terms: ${Array.from(questionTerms).join(", ")}`);
  const scored = chunks.map((chunk) => {
    const chunkTerms = tokenize(chunk.content);
    let score = 0;
    questionTerms.forEach((term) => {
      if (chunkTerms.includes(term)) score += 1;
    });
    if (score > 0) {
      console.log(`[rag] Chunk ${chunk.chunk_index} (page ${chunk.page_number}): score=${score}, terms=${Array.from(chunkTerms).filter(t => questionTerms.has(t)).join(", ")}, preview="${chunk.content.slice(0, 100)}"`);
    }
    return { chunk, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const relevant = scored.filter((item) => item.score > 0).slice(0, limit);
  const selected = relevant.length ? relevant : scored.slice(0, Math.min(limit, scored.length));
  console.log(`[rag] Selected ${selected.length} chunks: ${selected.map(s => `chunk ${s.chunk.chunk_index} (page ${s.chunk.page_number}, score ${s.score})`).join(", ")}`);
  return selected.map((item) => item.chunk);
}

async function callGeminiWithRetry(model, prompt, timeoutMs, maxRetries = 3) {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const attemptStart = Date.now();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const result = await model.generateContent(prompt, { signal: controller.signal });
      clearTimeout(timeoutId);
      console.log(`[rag:timing] Attempt ${attempt + 1} succeeded in ${Date.now() - attemptStart}ms`);
      return result;
    } catch (err) {
      clearTimeout(timeoutId);
      const attemptDuration = Date.now() - attemptStart;
      const status = err?.status || err?.response?.status;
      const isAborted = err?.name === "AbortError" || err?.message?.includes("abort");
      const isRateLimit = status === 429;
      const isServerError = status >= 500 && status < 600;
      const isNetworkError = err?.code === "ECONNRESET" || err?.code === "ENOTFOUND" || err?.code === "ETIMEDOUT";

      const isTransient = isAborted || isRateLimit || isServerError || isNetworkError;

      const errMsg = isAborted ? "GEMINI_TIMEOUT" : err.message;
      console.warn(`[rag:timing] Attempt ${attempt + 1} failed after ${attemptDuration}ms:`, errMsg, `status=${status || "unknown"}, aborted=${isAborted}, transient=${isTransient}`);

      if (attempt === maxRetries || !isTransient) {
        const enrichedError = new Error(errMsg);
        enrichedError.status = status;
        enrichedError.code = err?.code;
        throw enrichedError;
      }

      const delay = Math.min(1000 * 2 ** attempt, 5000) + Math.random() * 500;
      console.warn(`[rag] Gemini error (attempt ${attempt + 1}/${maxRetries + 1}), retrying in ${Math.round(delay)}ms:`, errMsg, `status=${status || "unknown"}`);
      await new Promise(r => setTimeout(r, delay));
    }
  }
}

async function generateAnswer(documentId, question) {
  const { data: document, error: docError } = await supabaseAdmin
    .from("documents")
    .select("id, name")
    .eq("id", documentId)
    .single();

  if (docError || !document) {
    throw new Error("DOCUMENT_NOT_FOUND");
  }

  const { data: chunks, error: chunkError } = await supabaseAdmin
    .from("document_chunks")
    .select("content, chunk_index, page_number")
    .eq("document_id", documentId)
    .order("chunk_index", { ascending: true });

  if (chunkError) {
    throw new Error("CHUNK_FETCH_FAILED");
  }

  if (!chunks || chunks.length === 0) {
    throw new Error("NO_TEXT");
  }

  const correction = correctQuery(question, chunks);
  const retrievalQuery = correction.corrected ? correction.correctedQuery : question;

  const retrievalStart = Date.now();
  const selected = retrieveChunks(retrievalQuery, chunks, 5);
  console.log(`[rag:timing] Retrieval took ${Date.now() - retrievalStart}ms, selected ${selected.length} chunks`);

  const contextBuildStart = Date.now();
  const context = selected
    .map((chunk, index) => `Chunk ${index + 1} (page ${chunk.page_number ?? "unknown"}, index ${chunk.chunk_index}):\n${chunk.content}`)
    .join("\n\n");
  console.log(`[rag:timing] Context build took ${Date.now() - contextBuildStart}ms, length=${context.length}`);

  console.log("[rag] Context sent to Gemini:", context.slice(0, 2000));
  console.log("[rag] Full context length:", context.length);

  console.log("RAG: generating answer", { documentId, originalQuery: question, correctedQuery: retrievalQuery, wasCorrected: correction.corrected });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("AI_NOT_CONFIGURED");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });

  const prompt = `You are a document question-answering assistant. Answer the user's question using only the provided document context. If the answer is not present in the context, say that the document does not contain enough information. Do not invent page numbers or citations.

Context:
${context}

Question: ${question}`;

  console.log(`[rag:timing] Prompt length: ${prompt.length} chars, estimated tokens: ~${Math.ceil(prompt.length / 4)}`);
  console.log(`[rag:timing] Starting Gemini request...`);
  const totalStart = Date.now();
  const timeoutMs = parseInt(process.env.GEMINI_TIMEOUT_MS, 10) || 90000;
  let result;
  try {
    result = await callGeminiWithRetry(model, prompt, timeoutMs);
  } catch (err) {
    console.error("[rag] Gemini call failed:", err.message, err.status || "", err.stack);
    throw err;
  }
  const geminiDuration = Date.now() - totalStart;
  console.log(`[rag:timing] Gemini response received after ${geminiDuration}ms`);
  const answer = result.response.text() || "The document does not contain enough information.";

  const sources = selected.map((chunk) => ({
    documentName: document.name,
    pageNumber: chunk.page_number ?? null,
    chunkIndex: chunk.chunk_index,
  }));

  return { answer, sources };
}

module.exports = { generateAnswer };
