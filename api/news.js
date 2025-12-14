import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = "Find 6 recent Vietnam renewable energy news articles. Return JSON array only: [{id,title,source,date,category,url,summary}]. Categories: Solar,Wind,Storage,Policy,Investment,Grid";
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const match = text.match(/\[[\s\S]*\]/);
    if (match) {
      res.status(200).json(JSON.parse(match[0]));
    } else {
      res.status(500).json({ error: "Parse failed" });
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
