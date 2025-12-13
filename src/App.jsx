// Vietnam Renewable Energy News Aggregator - Backend Service
// Deploy on: Vercel, Railway, AWS Lambda, or any Node.js host

import Anthropic from "@anthropic-ai/sdk";
import nodemailer from "nodemailer";
import cron from "node-cron";

// Configuration
const CONFIG = {
  sources: [
    { name: "VnExpress", rssUrl: "https://vnexpress.net/rss/khoa-hoc.rss" },
    { name: "Vietnam News", rssUrl: "https://vietnamnews.vn/rss/economy.rss" },
  ],
  keywords: [
    "renewable energy", "solar", "wind power", "năng lượng tái tạo",
    "điện mặt trời", "điện gió", "EVN", "power purchase agreement",
    "offshore wind", "battery storage", "green energy", "carbon neutral"
  ],
  teamEmails: [
    "team.member1@company.com",
    "team.member2@company.com",
  ],
  schedule: "0 9 * * 1" // Every Monday at 9:00 AM
};

// Initialize Anthropic client for AI-powered summarization
const anthropic = new Anthropic();

// News aggregation using web search
async function fetchVietnamEnergyNews() {
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    tools: [{
      type: "web_search_20250305",
      name: "web_search"
    }],
    messages: [{
      role: "user",
      content: `Search for the latest Vietnam renewable energy news from the past week. 
                Focus on: solar power, wind energy, policy updates, investments, and grid developments.
                Return a structured list of articles with title, source, date, URL, and brief summary.
                Format as JSON array.`
    }]
  });
  
  // Parse the response to extract news items
  const textContent = response.content.find(c => c.type === "text");
  return parseNewsFromResponse(textContent?.text || "[]");
}

function parseNewsFromResponse(text) {
  try {
    // Extract JSON from the response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (e) {
    console.error("Error parsing news:", e);
  }
  return [];
}

// Categorize articles using Claude
async function categorizeArticles(articles) {
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2048,
    messages: [{
      role: "user",
      content: `Categorize these news articles into: Solar, Wind, Storage, Policy, Investment, Grid.
                Articles: ${JSON.stringify(articles)}
                Return JSON with category added to each article.`
    }]
  });
  
  const textContent = response.content.find(c => c.type === "text");
  return parseNewsFromResponse(textContent?.text || "[]");
}

// Generate weekly digest email
async function generateDigestEmail(articles) {
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2048,
    messages: [{
      role: "user",
      content: `Create a professional HTML email digest summarizing these Vietnam renewable energy news articles.
                Include: executive summary, key highlights by category, and links to full articles.
                Articles: ${JSON.stringify(articles)}
                Make it visually appealing with inline CSS.`
    }]
  });
  
  return response.content.find(c => c.type === "text")?.text || "";
}

// Email sending function
async function sendDigestToTeam(htmlContent) {
  const transporter = nodemailer.createTransporter({
    host: process.env.SMTP_HOST,
    port: 587,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: '"Energy News Bot" <news@yourcompany.com>',
    to: CONFIG.teamEmails.join(", "),
    subject: `Vietnam Renewable Energy Weekly Digest - ${new Date().toLocaleDateString()}`,
    html: htmlContent,
  });
  
  console.log("Digest sent to team!");
}

// Main aggregation pipeline
async function runWeeklyAggregation() {
  console.log("Starting weekly news aggregation...");
  
  try {
    // 1. Fetch news
    const rawNews = await fetchVietnamEnergyNews();
    console.log(`Found ${rawNews.length} articles`);
    
    // 2. Categorize
    const categorizedNews = await categorizeArticles(rawNews);
    
    // 3. Generate email digest
    const emailHtml = await generateDigestEmail(categorizedNews);
    
    // 4. Send to team
    await sendDigestToTeam(emailHtml);
    
    // 5. Store in database (optional - add your DB logic)
    // await saveToDatabase(categorizedNews);
    
    return { success: true, articleCount: categorizedNews.length };
  } catch (error) {
    console.error("Aggregation failed:", error);
    return { success: false, error: error.message };
  }
}

// Schedule the job (runs every Monday at 9 AM)
cron.schedule(CONFIG.schedule, () => {
  console.log("Running scheduled aggregation...");
  runWeeklyAggregation();
});

// API endpoint for manual trigger (Express.js example)
// app.post("/api/run-aggregation", async (req, res) => {
//   const result = await runWeeklyAggregation();
//   res.json(result);
// });

// Export for serverless deployment
export { runWeeklyAggregation, fetchVietnamEnergyNews };
