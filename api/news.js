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
          content: `Find 6 recent Vietnam renewable energy news articles from the last 7 days (${weekAgoStr} to ${todayStr}).

Include both Vietnamese sources (VnExpress, Tuoi Tre, VietnamNet) and English sources (Reuters, Vietnam News, Nikkei Asia). For Vietnamese articles, write the summary in English but keep the original URL.

Return a JSON array only, no other text:
[{"id":1,"title":"Title","source":"Source","date":"${todayStr}","category":"Solar","url":"https://...","summary":"Summary","language":"vi"}]

Categories: Solar, Wind, Storage, Policy, Investment, Grid
Language: "vi" for Vietnamese, "en" for English`
        }
      ]
    });

    const text = message.content[0].text;
    
    // Try to find JSON array in response
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
    res.status(500).json({ error: e.message, details: e.toString() });
  }
}