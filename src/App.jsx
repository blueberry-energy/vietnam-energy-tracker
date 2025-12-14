import { useState } from 'react';
import { Sun, Wind, Zap, Battery, Globe, Users, Bell, Calendar, ExternalLink, RefreshCw, Mail, Filter, TrendingUp } from 'lucide-react';

const mockNews = [
  { id: 1, title: "Vietnam approves 3.5GW offshore wind project in Binh Thuan province", source: "VnExpress", date: "2025-01-10", category: "Wind", url: "#", summary: "Major offshore wind development to boost Vietnam's renewable capacity by 2028." },
  { id: 2, title: "Solar panel manufacturing plant opens in Bac Giang industrial zone", source: "Vietnam News", date: "2025-01-09", category: "Solar", url: "#", summary: "New facility expected to produce 2GW of panels annually for domestic and export markets." },
  { id: 3, title: "Government announces new FIT rates for rooftop solar installations", source: "Saigon Times", date: "2025-01-08", category: "Policy", url: "#", summary: "Updated feed-in tariffs aim to accelerate residential solar adoption nationwide." },
  { id: 4, title: "EVN signs PPA with three renewable energy developers", source: "Vietnam Investment Review", date: "2025-01-07", category: "Grid", url: "#", summary: "Power purchase agreements total 1.2GW of combined solar and wind capacity." },
  { id: 5, title: "Battery storage pilot project launches in Ho Chi Minh City", source: "The Investor", date: "2025-01-06", category: "Storage", url: "#", summary: "50MW storage facility to help stabilize grid during peak demand periods." },
  { id: 6, title: "Japanese investors commit $500M to Vietnam wind farms", source: "Nikkei Asia", date: "2025-01-05", category: "Investment", url: "#", summary: "Partnership with local developers targets central highlands region." },
];

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

const styles = {
  container: { minHeight: "100vh", background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)", color: "white", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" },
  header: { borderBottom: "1px solid rgba(71, 85, 105, 0.5)", padding: "16px 24px", background: "rgba(15, 23, 42, 0.5)", position: "sticky", top: 0, zIndex: 10 },
  headerContent: { maxWidth: "1200px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" },
  logo: { display: "flex", alignItems: "center", gap: "12px" },
  logoIcon: { padding: "8px", background: "linear-gradient(135deg, #4ade80, #059669)", borderRadius: "12px" },
  title: { fontSize: "20px", fontWeight: "bold", background: "linear-gradient(90deg, #4ade80, #6ee7b7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  subtitle: { fontSize: "12px", color: "#94a3b8" },
  main: { maxWidth: "1200px", margin: "0 auto", padding: "24px" },
  tabs: { display: "flex", gap: "8px", padding: "4px", background: "rgba(30, 41, 59, 0.5)", borderRadius: "12px", width: "fit-content", marginBottom: "24px" },
  tab: { display: "flex", alignItems: "center", gap: "8px", padding: "8px 16px", borderRadius: "8px", border: "none", cursor: "pointer", transition: "all 0.2s" },
  tabActive: { background: "#10b981", color: "white" },
  tabInactive: { background: "transparent", color: "#94a3b8" },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" },
  statCard: { background: "rgba(30, 41, 59, 0.5)", border: "1px solid rgba(71, 85, 105, 0.5)", borderRadius: "12px", padding: "16px" },
  statIcon: { width: "40px", height: "40px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "12px" },
  statValue: { fontSize: "24px", fontWeight: "bold", marginBottom: "4px" },
  statLabel: { fontSize: "14px", color: "#94a3b8" },
  filterRow: { display: "flex", alignItems: "center", gap: "8px", marginBottom: "24px", flexWrap: "wrap" },
  filterBtn: { padding: "6px 12px", borderRadius: "8px", border: "none", cursor: "pointer", fontSize: "14px", transition: "all 0.2s" },
  filterActive: { background: "#10b981", color: "white" },
  filterInactive: { background: "rgba(30, 41, 59, 0.8)", color: "#94a3b8" },
  newsCard: { background: "rgba(30, 41, 59, 0.5)", border: "1px solid rgba(71, 85, 105, 0.5)", borderRadius: "12px", padding: "20px", marginBottom: "16px", transition: "all 0.2s" },
  newsHeader: { display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px", flexWrap: "wrap" },
  badge: { display: "inline-flex", alignItems: "center", gap: "6px", padding: "4px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "500" },
  newsTitle: { fontSize: "18px", fontWeight: "600", marginBottom: "8px", color: "white" },
  newsSummary: { fontSize: "14px", color: "#94a3b8" },
  teamCard: { background: "rgba(30, 41, 59, 0.5)", border: "1px solid rgba(71, 85, 105, 0.5)", borderRadius: "12px", padding: "16px", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" },
  avatar: { width: "48px", height: "48px", borderRadius: "50%", background: "linear-gradient(135deg, #4ade80, #06b6d4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", fontWeight: "bold" },
  button: { display: "flex", alignItems: "center", gap: "8px", padding: "8px 16px", borderRadius: "8px", border: "none", cursor: "pointer", fontSize: "14px", fontWeight: "500" },
  scheduleCard: { background: "rgba(15, 23, 42, 0.5)", borderRadius: "8px", padding: "16px", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" },
  toggle: { width: "48px", height: "24px", borderRadius: "12px", position: "relative", cursor: "pointer" },
  toggleCircle: { width: "16px", height: "16px", borderRadius: "50%", background: "white", position: "absolute", top: "4px" },
};

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('news');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [notificationSent, setNotificationSent] = useState(false);
  const lastUpdated = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const filteredNews = selectedCategory === 'All' ? mockNews : mockNews.filter(n => n.category === selectedCategory);

  const handleSendNotification = () => {
    setNotificationSent(true);
    setTimeout(() => setNotificationSent(false), 3000);
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.logo}>
            <div style={styles.logoIcon}><Zap size={24} color="white" /></div>
            <div>
              <h1 style={styles.title}>Vietnam Renewable Energy Tracker</h1>
              <p style={styles.subtitle}>Weekly News Aggregator</p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: "12px", color: "#94a3b8" }}>Last updated</p>
              <p style={{ fontSize: "14px", color: "#4ade80", fontWeight: "500" }}>{lastUpdated}</p>
            </div>
            <button style={{ padding: "8px", background: "transparent", border: "none", cursor: "pointer" }}>
              <RefreshCw size={20} color="#94a3b8" />
            </button>
          </div>
        </div>
      </header>

      <main style={styles.main}>
        <div style={styles.tabs}>
          {[{ id: 'news', label: 'News Feed', icon: Globe }, { id: 'team', label: 'Team', icon: Users }, { id: 'settings', label: 'Schedule', icon: Calendar }].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ ...styles.tab, ...(activeTab === tab.id ? styles.tabActive : styles.tabInactive) }}>
              <tab.icon size={16} />{tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'news' && (
          <div>
            <div style={styles.statsGrid}>
              {[
                { label: "Total Articles", value: mockNews.length, icon: Globe, gradient: "linear-gradient(135deg, #3b82f6, #06b6d4)" },
                { label: "Solar News", value: mockNews.filter(n => n.category === 'Solar').length, icon: Sun, gradient: "linear-gradient(135deg, #f59e0b, #f97316)" },
                { label: "Wind News", value: mockNews.filter(n => n.category === 'Wind').length, icon: Wind, gradient: "linear-gradient(135deg, #0ea5e9, #3b82f6)" },
                { label: "Policy Updates", value: mockNews.filter(n => n.category === 'Policy').length, icon: Zap, gradient: "linear-gradient(135deg, #a855f7, #ec4899)" },
              ].map((stat, i) => (
                <div key={i} style={styles.statCard}>
                  <div style={{ ...styles.statIcon, background: stat.gradient }}><stat.icon size={20} color="white" /></div>
                  <p style={styles.statValue}>{stat.value}</p>
                  <p style={styles.statLabel}>{stat.label}</p>
                </div>
              ))}
            </div>

            <div style={styles.filterRow}>
              <Filter size={16} color="#94a3b8" />
              {categories.map(cat => (
                <button key={cat} onClick={() => setSelectedCategory(cat)} style={{ ...styles.filterBtn, ...(selectedCategory === cat ? styles.filterActive : styles.filterInactive) }}>
                  {cat}
                </button>
              ))}
            </div>

            {filteredNews.map(article => (
              <article key={article.id} style={styles.newsCard}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px" }}>
                  <div style={{ flex: 1 }}>
                    <div style={styles.newsHeader}>
                      <span style={{ ...styles.badge, background: categoryColors[article.category].bg, color: categoryColors[article.category].text, border: `1px solid ${categoryColors[article.category].border}` }}>
                        {article.category}
                      </span>
                      <span style={{ fontSize: "12px", color: "#64748b" }}>{article.source}</span>
                      <span style={{ fontSize: "12px", color: "#64748b" }}>•</span>
                      <span style={{ fontSize: "12px", color: "#64748b" }}>{article.date}</span>
                    </div>
                    <h3 style={styles.newsTitle}>{article.title}</h3>
                    <p style={styles.newsSummary}>{article.summary}</p>
                  </div>
                  <a href={article.url} style={{ padding: "8px", background: "rgba(71, 85, 105, 0.5)", borderRadius: "8px" }}>
                    <ExternalLink size={16} color="white" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}

        {activeTab === 'team' && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: "600" }}>Team Notifications</h2>
              <button onClick={handleSendNotification} style={{ ...styles.button, background: notificationSent ? "#10b981" : "rgba(16, 185, 129, 0.2)", color: notificationSent ? "white" : "#4ade80" }}>
                <Mail size={16} />{notificationSent ? 'Sent!' : 'Send Weekly Digest'}
              </button>
            </div>
            {teamMembers.map((member, i) => (
              <div key={i} style={styles.teamCard}>
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <div style={styles.avatar}>{member.name.split(' ').map(n => n[0]).join('')}</div>
                  <div>
                    <p style={{ fontWeight: "500" }}>{member.name}</p>
                    <p style={{ fontSize: "14px", color: "#94a3b8" }}>{member.role}</p>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ fontSize: "14px", color: "#94a3b8" }}>{member.email}</span>
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10b981" }}></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'settings' && (
          <div>
            <h2 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "24px" }}>Automation Schedule</h2>
            <div style={{ background: "rgba(30, 41, 59, 0.5)", border: "1px solid rgba(71, 85, 105, 0.5)", borderRadius: "12px", padding: "24px" }}>
              <div style={styles.scheduleCard}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <Calendar size={20} color="#4ade80" />
                  <div>
                    <p style={{ fontWeight: "500" }}>Weekly Digest</p>
                    <p style={{ fontSize: "14px", color: "#94a3b8" }}>Every Monday at 9:00 AM (ICT)</p>
                  </div>
                </div>
                <div style={{ ...styles.toggle, background: "#10b981" }}>
                  <div style={{ ...styles.toggleCircle, right: "4px" }}></div>
                </div>
              </div>
              <div style={styles.scheduleCard}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <Bell size={20} color="#fbbf24" />
                  <div>
                    <p style={{ fontWeight: "500" }}>Breaking News Alerts</p>
                    <p style={{ fontSize: "14px", color: "#94a3b8" }}>Instant notification for major updates</p>
                  </div>
                </div>
                <div style={{ ...styles.toggle, background: "#475569" }}>
                  <div style={{ ...styles.toggleCircle, left: "4px" }}></div>
                </div>
              </div>
              <div style={{ borderTop: "1px solid rgba(71, 85, 105, 0.5)", paddingTop: "24px", marginTop: "8px" }}>
                <h3 style={{ fontWeight: "500", marginBottom: "12px" }}>News Sources</h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {['VnExpress', 'Vietnam News', 'Saigon Times', 'Vietnam Investment Review', 'The Investor', 'Nikkei Asia', 'Reuters', 'PV Magazine'].map(source => (
                    <span key={source} style={{ padding: "6px 12px", background: "rgba(71, 85, 105, 0.5)", borderRadius: "8px", fontSize: "14px" }}>{source}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}