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
      max_tokens: 2048,
      messages: [
        {
          role: "user",
          content: `Find 8-10 recent Vietnam renewable energy news articles published ONLY between ${weekAgoStr} and ${todayStr} (last 7 days).

IMPORTANT REQUIREMENTS:
1. Include BOTH Vietnamese language sources (VnExpress, Tuoi Tre, Thanh Nien, VietnamNet, Bao Dien Tu) AND English language sources (Reuters, Nikkei Asia, Vietnam News, Vietnam Investment Review, PV Magazine)
2. For Vietnamese language articles: Provide the summary in ENGLISH, but keep the original Vietnamese URL
3. Only include articles from the last 7 days (${weekAgoStr} to ${todayStr})
4. Focus on: solar power, wind energy, government policy, foreign investment, EVN announcements, battery storage

Return ONLY a JSON array with this exact format:
[{"id":1,"title":"English title here","source":"Source Name","date":"YYYY-MM-DD","category":"Solar","url":"https://original-url.com","summary":"English summary here","language":"vi"}]

Categories must be: Solar, Wind, Storage, Policy, Investment, or Grid
Language field must be: "vi" for Vietnamese sources, "en" for English sources`
        }
      ]
    });

    const text = message.content[0].text;
    const match = text.match(/\[[\s\S]*\]/);
    
    if (match) {
      const news = JSON.parse(match[0]);
      const searchResult = {
        searchDate: todayStr,
        dateRange: { from: weekAgoStr, to: todayStr },
        articles: news
      };
      res.status(200).json(searchResult);
    } else {
      res.status(500).json({ error: "Parse failed" });
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}