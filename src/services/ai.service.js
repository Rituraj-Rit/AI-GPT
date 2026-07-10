require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function generateResponse(contents) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents,
  });

  return response.text;
}


async function generateVector(contents) {

  const response = await ai.models.embedContent({
    model: "gemini-embedding-2",
    contents: contents,
    config:{
      outputDimensionality: 768
    }
  });

  return response.embeddings[0].values;
}
module.exports = {
  generateResponse,
  generateVector
};


