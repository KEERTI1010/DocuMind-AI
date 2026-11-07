const { GoogleGenerativeAI } = require("@google/generative-ai");

async function extractTextWithGemini(buffer) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });

  const result = await model.generateContent([
    {
      inlineData: {
        data: buffer.toString("base64"),
        mimeType: "application/pdf",
      },
    },
    "Extract all readable text from this PDF. Return only the extracted text.",
  ]);

  return result.response.text() || "";
}

module.exports = { extractTextWithGemini };
