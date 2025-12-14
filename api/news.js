import Anthropic from "@anthropic-ai/sdk";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    
    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: "Find 6 recent Vietnam renewable energy news articles from 2024-2025. Return ONLY a JSON array, no other text: [{\"id\":1,\"title\":\"...\",\"source\":\"...\",\"date\":\"2025-01-10\",\"category\":\"Solar\",\"url\":\"https://...\",\"summary\":\"...\"}]. Categories: Solar, Wind, Storage, Policy, Investment, Grid"
        }
      ]
    });

    const text = message.content[0].text;
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