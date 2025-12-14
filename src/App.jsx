import { useState, useEffect } from 'react';
import { Sun, Wind, Zap, Globe, Users, Bell, Calendar, ExternalLink, RefreshCw, Mail, Filter, Loader, Clock, ChevronRight } from 'lucide-react';

const teamMembers = [
  { name: "Nguyen Van A", email: "nguyen.a@company.com", role: "Energy Analyst" },
  { name: "Tran Thi B", email: "tran.b@company.com", role: "Project Manager" },
  { name: "Le Van C", email: "le.c@company.com", role: "Investment Lead" },
  { name: "Pham D", email: "pham.d@company.com", role: "Policy Advisor" },
];

const categories = ["All", "Solar", "Wind", "Storage", "Policy", "Investment", "Grid"];

const categoryColors = {
  Solar: { bg: "rgba(245, 158, 11, 0.2)", text: "#fbbf24", border: "rgba(245, 158, 11, 0.3)" },
  Wind: { bg: "rgba(14, 165, 233, 0.2)", text: "#38bdf8", border: "rgba(14, 165, 233, 0.3)" },
  Storage: { bg: "rgba(16, 185, 129, 0.2)", text: "#34d399", border: "rgba(16, 185, 129, 0.3)" },
  Policy: { bg: "rgba(168, 85, 247, 0.2)", text: "#c084fc", border: "rgba(168, 85, 247, 0.3)" },
  Investment: { bg: "rgba(244, 63, 94, 0.2)", text: "#fb7185", border: "rgba(244, 63, 94, 0.3)" },
  Grid: { bg: "rgba(59, 130, 246, 0.2)", text: "#60a5fa", border: "rgba(59, 130, 246, 0.3)" },
};

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('news');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [notificationSent, setNotificationSent] = useState(false);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchInfo, setSearchInfo] = useState(null);
  const [searchHistory, setSearchHistory] = useState([]);
  const [selectedHistoryDate, setSelectedHistoryDate] = useState(null);

  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    setSelectedHistoryDate(null);
    try {
      const response = await fetch('/api/news');
      if (!response.ok) throw new Error('Failed to fetch news');
      const data = await response.json();
      
      if (data.articles) {
        setNews(data.articles);
        setSearchInfo({ searchDate: data.searchDate, dateRange: data.dateRange });
        
        // Save to history
        const historyItem = {
          id: Date.now(),
          searchDate: data.searchDate,
          dateRange: data.dateRange,
          articles: data.articles,
          articleCount: data.articles.length
        };
        
        setSearchHistory(prev => {
          const updated = [historyItem, ...prev.filter(h => h.searchDate !== data.searchDate)].slice(0, 10);
          localStorage.setItem('newsHistory', JSON.stringify(updated));
          return updated;
        });
      } else {
        setNews(data);
        setSearchInfo({ searchDate: new Date().toISOString().split('T')[0] });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadFromHistory = (historyItem) => {
    setNews(historyItem.articles);
    setSearchInfo({ searchDate: historyItem.searchDate, dateRange: historyItem.dateRange });
    setSelectedHistoryDate(historyItem.searchDate);
    setActiveTab('news');
  };

  useEffect(() => {
    const saved = localStorage.getItem('newsHistory');
    if (saved) {
      setSearchHistory(JSON.parse(saved));
    }
    fetchNews();
  }, []);

  const filteredNews = selectedCategory === 'All' ? news : news.filter(n => n.category === selectedCategory);

  const containerStyle = { minHeight: "100vh", background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)", color: "white", fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif" };
  const headerStyle = { borderBottom: "1px solid rgba(71, 85, 105, 0.5)", padding: "16px 24px", background: "rgba(15, 23, 42, 0.5)" };
  const cardStyle = { background: "rgba(30, 41, 59, 0.5)", border: "1px solid rgba(71, 85, 105, 0.5)", borderRadius: "12px", padding: "16px", marginBottom: "16px" };

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ padding: "8px", background: "linear-gradient(135deg, #4ade80, #059669)", borderRadius: "12px" }}>
              <Zap size={24} color="white" />
            </div>
            <div>
              <h1 style={{ fontSize: "20px", fontWeight: "bold", color: "#4ade80" }}>Vietnam Renewable Energy Tracker</h1>
              <p style={{ fontSize: "12px", color: "#94a3b8" }}>Live News • Vietnamese & English Sources</p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {searchInfo && (
              <div style={{ textAlign: "right" }}>
                <p style={{ fontSize: "12px", color: "#94a3b8" }}>
                  {selectedHistoryDate ? "Viewing archive:" : "Last search:"}
                </p>
                <p style={{ fontSize: "14px", color: "#4ade80" }}>{searchInfo.searchDate}</p>
                {searchInfo.dateRange && (
                  <p style={{ fontSize: "11px", color: "#64748b" }}>
                    Articles from {searchInfo.dateRange.from} to {searchInfo.dateRange.to}
                  </p>
                )}
              </div>
            )}
            <button onClick={fetchNews} disabled={loading} style={{ padding: "8px", background: "transparent", border: "none", cursor: loading ? "wait" : "pointer" }}>
              <RefreshCw size={20} color="#94a3b8" style={loading ? { animation: "spin 1s linear infinite" } : {}} />
            </button>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px" }}>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        
        <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
          {[{ id: 'news', label: 'News Feed', Icon: Globe }, { id: 'history', label: 'Archive', Icon: Clock }, { id: 'team', label: 'Team', Icon: Users }, { id: 'settings', label: 'Schedule', Icon: Calendar }].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 16px", borderRadius: "8px", border: "none", cursor: "pointer", background: activeTab === tab.id ? "#10b981" : "rgba(30, 41, 59, 0.5)", color: activeTab === tab.id ? "white" : "#94a3b8" }}>
              <tab.Icon size={16} />{tab.label}
              {tab.id === 'history' && searchHistory.length > 0 && (
                <span style={{ background: "#4ade80", color: "#0f172a", fontSize: "11px", padding: "2px 6px", borderRadius: "10px", fontWeight: "bold" }}>{searchHistory.length}</span>
              )}
            </button>
          ))}
        </div>

        {activeTab === 'news' && (
          <div>
            {selectedHistoryDate && (
              <div style={{ ...cardStyle, background: "rgba(251, 191, 36, 0.1)", borderColor: "rgba(251, 191, 36, 0.3)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <p style={{ color: "#fbbf24" }}>Viewing archived search from {selectedHistoryDate}</p>
                <button onClick={fetchNews} style={{ padding: "6px 12px", background: "#10b981", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "13px" }}>
                  Load Latest News
                </button>
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" }}>
              {[
                { label: "Total", value: news.length, Icon: Globe, color: "#3b82f6" },
                { label: "Solar", value: news.filter(n => n.category === 'Solar').length, Icon: Sun, color: "#f59e0b" },
                { label: "Wind", value: news.filter(n => n.category === 'Wind').length, Icon: Wind, color: "#0ea5e9" },
                { label: "Policy", value: news.filter(n => n.category === 'Policy').length, Icon: Zap, color: "#a855f7" },
              ].map((stat, i) => (
                <div key={i} style={cardStyle}>
                  <stat.Icon size={20} color={stat.color} />
                  <p style={{ fontSize: "24px", fontWeight: "bold", margin: "8px 0 4px" }}>{stat.value}</p>
                  <p style={{ fontSize: "14px", color: "#94a3b8" }}>{stat.label}</p>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
              <Filter size={16} color="#94a3b8" />
              {categories.map(cat => (
                <button key={cat} onClick={() => setSelectedCategory(cat)} style={{ padding: "6px 12px", borderRadius: "8px", border: "none", cursor: "pointer", fontSize: "14px", background: selectedCategory === cat ? "#10b981" : "rgba(30, 41, 59, 0.8)", color: selectedCategory === cat ? "white" : "#94a3b8" }}>
                  {cat}
                </button>
              ))}
            </div>

            {loading && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "60px", gap: "16px" }}>
                <Loader size={40} color="#4ade80" style={{ animation: "spin 1s linear infinite" }} />
                <p style={{ color: "#94a3b8" }}>Searching Vietnamese & English news sources...</p>
              </div>
            )}

            {error && (
              <div style={{ ...cardStyle, textAlign: "center", borderColor: "rgba(239, 68, 68, 0.3)" }}>
                <p style={{ color: "#f87171", marginBottom: "12px" }}>Error: {error}</p>
                <button onClick={fetchNews} style={{ padding: "8px 16px", background: "#10b981", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}>Try Again</button>
              </div>
            )}

            {!loading && !error && filteredNews.map(article => (
              <div key={article.id} style={cardStyle}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px", flexWrap: "wrap" }}>
                      <span style={{ padding: "4px 10px", borderRadius: "20px", fontSize: "12px", background: categoryColors[article.category]?.bg || "#333", color: categoryColors[article.category]?.text || "#fff" }}>
                        {article.category}
                      </span>
                      <span style={{ fontSize: "12px", color: "#64748b" }}>{article.source}</span>
                      <span style={{ fontSize: "12px", color: "#64748b" }}>•</span>
                      <span style={{ fontSize: "12px", color: "#64748b" }}>{article.date}</span>
                      {article.language === 'vi' && (
                        <span style={{ padding: "2px 6px", borderRadius: "4px", fontSize: "10px", background: "rgba(239, 68, 68, 0.2)", color: "#f87171" }}>Vietnamese Source</span>
                      )}
                    </div>
                    <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "8px", color: "white" }}>{article.title}</h3>
                    <p style={{ fontSize: "14px", color: "#94a3b8" }}>{article.summary}</p>
                  </div>
                  <a href={article.url} target="_blank" rel="noopener noreferrer" style={{ padding: "8px", background: "rgba(71, 85, 105, 0.5)", borderRadius: "8px" }}>
                    <ExternalLink size={16} color="white" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'history' && (
          <div>
            <h2 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "24px" }}>Search Archive</h2>
            {searchHistory.length === 0 ? (
              <div style={{ ...cardStyle, textAlign: "center", padding: "40px" }}>
                <Clock size={40} color="#64748b" style={{ marginBottom: "16px" }} />
                <p style={{ color: "#94a3b8" }}>No search history yet. Run a search to start building your archive.</p>
              </div>
            ) : (
              searchHistory.map((item) => (
                <div key={item.id} onClick={() => loadFromHistory(item)} style={{ ...cardStyle, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", transition: "all 0.2s" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                      <Calendar size={16} color="#4ade80" />
                      <span style={{ fontWeight: "600", color: "white" }}>Search: {item.searchDate}</span>
                    </div>
                    <p style={{ fontSize: "13px", color: "#64748b" }}>
                      {item.dateRange ? `Articles from ${item.dateRange.from} to ${item.dateRange.to}` : 'Date range not available'}
                    </p>
                    <p style={{ fontSize: "13px", color: "#94a3b8", marginTop: "4px" }}>
                      {item.articleCount} articles found
                    </p>
                  </div>
                  <ChevronRight size={20} color="#64748b" />
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'team' && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: "600" }}>Team Notifications</h2>
              <button onClick={() => { setNotificationSent(true); setTimeout(() => setNotificationSent(false), 3000); }} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 16px", borderRadius: "8px", border: "none", cursor: "pointer", background: notificationSent ? "#10b981" : "rgba(16, 185, 129, 0.2)", color: notificationSent ? "white" : "#4ade80" }}>
                <Mail size={16} />{notificationSent ? 'Sent!' : 'Send Weekly Digest'}
              </button>
            </div>
            {teamMembers.map((member, i) => (
              <div key={i} style={{ ...cardStyle, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "linear-gradient(135deg, #4ade80, #06b6d4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", fontWeight: "bold" }}>
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p style={{ fontWeight: "500" }}>{member.name}</p>
                    <p style={{ fontSize: "14px", color: "#94a3b8" }}>{member.role}</p>
                  </div>
                </div>
                <span style={{ fontSize: "14px", color: "#94a3b8" }}>{member.email}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'settings' && (
          <div>
            <h2 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "24px" }}>Automation Schedule</h2>
            <div style={cardStyle}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "16px", background: "rgba(15, 23, 42, 0.5)", borderRadius: "8px", marginBottom: "16px" }}>
                <Calendar size={20} color="#4ade80" />
                <div>
                  <p style={{ fontWeight: "500" }}>Weekly Digest</p>
                  <p style={{ fontSize: "14px", color: "#94a3b8" }}>Every Monday at 9:00 AM (ICT)</p>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "16px", background: "rgba(15, 23, 42, 0.5)", borderRadius: "8px" }}>
                <Bell size={20} color="#fbbf24" />
                <div>
                  <p style={{ fontWeight: "500" }}>Breaking News Alerts</p>
                  <p style={{ fontSize: "14px", color: "#94a3b8" }}>Instant notification for major updates</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}