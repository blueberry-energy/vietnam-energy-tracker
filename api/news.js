import Anthropic from "@anthropic-ai/sdk";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  
  const today = new Date();
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const todayStr = today.toISOString().split('T')[0];
  const weekAgoStr = weekAgo.toISOString().split('T')[0];
  
  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    
    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: `Generate a JSON array of 6 example Vietnam renewable energy news articles that could have been published between ${weekAgoStr} and ${todayStr}.

Mix of Vietnamese sources (VnExpress, Tuoi Tre) and English sources (Reuters, Vietnam News). For Vietnamese sources, write summary in English.

Output ONLY the JSON array, nothing else:
[{"id":1,"title":"Example headline","source":"VnExpress","date":"${todayStr}","category":"Solar","url":"https://vnexpress.net/example","summary":"Example summary in English","language":"vi"},{"id":2,"title":"Another headline","source":"Reuters","date":"${weekAgoStr}","category":"Wind","url":"https://reuters.com/example","summary":"Another summary","language":"en"}]

Use categories: Solar, Wind, Storage, Policy, Investment, Grid`
        }
      ]
    });

    const text = message.content[0].text.trim();
    
    let jsonStr = text;
    if (text.includes('[')) {
      jsonStr = text.substring(text.indexOf('['), text.lastIndexOf(']') + 1);
    }
    
    const news = JSON.parse(jsonStr);
    
    res.status(200).json({
      searchDate: todayStr,
      dateRange: { from: weekAgoStr, to: todayStr },
      articles: news
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}