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
      tools: [{
        type: "web_search_20250305",
        name: "web_search"
      }],
      messages: [
        {
          role: "user",
          content: `Search for real Vietnam renewable energy news articles published in the last 7 days (${weekAgoStr} to ${todayStr}).

Search for:
1. Vietnam solar energy news
2. Vietnam wind power news  
3. Vietnam renewable energy policy
4. Vietnam EVN electricity news

After searching, compile a list of 6-8 REAL articles with ACTUAL working URLs.

Return ONLY a JSON array with real URLs from your search results:
[{"id":1,"title":"Actual headline","source":"Actual source","date":"YYYY-MM-DD","category":"Solar","url":"https://actual-url.com/article","summary":"Brief summary","language":"en"}]

Categories: Solar, Wind, Storage, Policy, Investment, Grid
Language: "vi" for Vietnamese sites, "en" for English sites`
        }
      ]
    });

    // Extract text from response (may have multiple content blocks due to tool use)
    let text = "";
    for (const block of message.content) {
      if (block.type === "text") {
        text += block.text;
      }
    }
    
    let jsonStr = text.trim();
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