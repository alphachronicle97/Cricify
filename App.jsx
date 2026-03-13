import { useState, useEffect, useCallback } from "react";

const SUPABASE_URL = "https://rnmiuggvwvluzpqicjqn.supabase.co";
const SUPABASE_KEY = "sb_publishable_VzshP4nH__Mk5BEplgO5VQ_QiIgnUt8";
const ADMIN_PASSWORD = "*kanishka@#&23122010*";

const C = {
  accent: "#e8380d", accentBright: "#ff5722", accentSoft: "rgba(232,56,13,0.1)",
  accentBorder: "rgba(232,56,13,0.3)", accentGlow: "rgba(232,56,13,0.15)",
  bg: "#06080a", bgCard: "#0d1014", bgCard2: "#111518", bgSection: "#090c0f",
  border: "#1a2028", borderMid: "#222c36", borderLight: "#2a3848",
  textPrimary: "#eef2f6", textSecondary: "#8a9bb0", textMuted: "#4a5a6a",
  gradient: "linear-gradient(135deg, #e8380d, #ff6b35)",
  gradientBlue: "linear-gradient(135deg, #0f1923, #0a1420)",
  white: "#ffffff", success: "#22c55e", gold: "#f59e0b",
};

const sb = async (method, table, body = null, filter = "") => {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}${filter}`, {
    method,
    headers: {
      "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json", "Prefer": "return=representation",
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  if (!res.ok) return null;
  const text = await res.text();
  return text ? JSON.parse(text) : [];
};

const dbGet = (table, order = "created_at.desc") => sb("GET", table, null, `?order=${order}`);
const dbInsert = (table, data) => sb("POST", table, data);
const dbUpdate = (table, id, data) => sb("PATCH", table, data, `?id=eq.${id}`);
const dbDelete = (table, id) => sb("DELETE", table, null, `?id=eq.${id}`);

const fetchGoogleNews = async () => {
  try {
    const res = await fetch("https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fnews.google.com%2Frss%2Fsearch%3Fq%3Dcricket%2Bindia%26hl%3Den-IN%26gl%3DIN%26ceid%3DIN%3Aen");
    const data = await res.json();
    if (data.items) return data.items.slice(0, 10).map(n => ({ title: n.title, tag: "CRICKET", time: new Date(n.pubDate).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }), hot: true, link: n.link }));
    return [];
  } catch { return []; }
};

const Input = ({ label, value, onChange, placeholder, type = "text" }) => (
  <div style={{ marginBottom: "14px" }}>
    {label && <div style={{ color: C.textSecondary, fontSize: "11px", marginBottom: "5px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px" }}>{label}</div>}
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      style={{ width: "100%", background: "rgba(255,255,255,0.03)", border: `1px solid ${C.borderLight}`, borderRadius: "8px", padding: "10px 14px", color: C.textPrimary, fontSize: "13px", outline: "none", fontFamily: "inherit" }} />
  </div>
);

const Textarea = ({ label, value, onChange, placeholder, rows = 5 }) => (
  <div style={{ marginBottom: "14px" }}>
    {label && <div style={{ color: C.textSecondary, fontSize: "11px", marginBottom: "5px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px" }}>{label}</div>}
    <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows}
      style={{ width: "100%", background: "rgba(255,255,255,0.03)", border: `1px solid ${C.borderLight}`, borderRadius: "8px", padding: "10px 14px", color: C.textPrimary, fontSize: "13px", outline: "none", fontFamily: "inherit", resize: "vertical" }} />
  </div>
);

const Footer = ({ onNav }) => (
  <footer style={{ background: "#040608", borderTop: `1px solid ${C.border}`, padding: "40px 20px 24px" }}>
    <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "30px", marginBottom: "32px" }}>
        <div style={{ maxWidth: "280px" }}>
          <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "22px", color: C.textPrimary, fontWeight: "700", marginBottom: "12px", letterSpacing: "1px" }}>
            <span style={{ color: C.accent }}>CRICI</span>FY
          </div>
          <p style={{ color: C.textMuted, fontSize: "13px", lineHeight: "1.8" }}>India's premier cricket streaming and news platform — live scores, streams, and breaking cricket news.</p>
        </div>
        <div style={{ display: "flex", gap: "50px", flexWrap: "wrap" }}>
          {[
            { title: "Navigate", links: [["Matches", "website"], ["Articles", "articles"]] },
            { title: "Company", links: [["About Us", "about"], ["Privacy Policy", "privacy"], ["Contact Us", "contact"]] },
          ].map(col => (
            <div key={col.title}>
              <div style={{ color: C.textPrimary, fontWeight: "700", fontSize: "11px", marginBottom: "14px", textTransform: "uppercase", letterSpacing: "2px" }}>{col.title}</div>
              {col.links.map(([label, page]) => (
                <div key={page} onClick={() => onNav(page)} style={{ color: C.textMuted, fontSize: "13px", marginBottom: "10px", cursor: "pointer", transition: "color 0.2s" }}
                  onMouseEnter={e => e.target.style.color = C.accentBright} onMouseLeave={e => e.target.style.color = C.textMuted}>{label}</div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
        <div style={{ color: C.textMuted, fontSize: "12px" }}>© 2024 Cricify. All Rights Reserved.</div>
        <div style={{ display: "flex", gap: "20px" }}>
          {[["Privacy", "privacy"], ["About", "about"], ["Contact", "contact"]].map(([l, p]) => (
            <span key={p} onClick={() => onNav(p)} style={{ color: C.textMuted, fontSize: "12px", cursor: "pointer" }}
              onMouseEnter={e => e.target.style.color = C.accentBright} onMouseLeave={e => e.target.style.color = C.textMuted}>{l}</span>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

const PrivacyPolicy = ({ onBack }) => (
  <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Segoe UI', sans-serif", color: C.textPrimary }}>
    <header style={{ background: "#040608", borderBottom: `1px solid ${C.border}`, padding: "0 24px", height: "60px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div onClick={onBack} style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "20px", color: C.textPrimary, cursor: "pointer", fontWeight: "700" }}><span style={{ color: C.accent }}>CRICI</span>FY</div>
      <button onClick={onBack} style={{ background: "transparent", border: `1px solid ${C.borderLight}`, color: C.textSecondary, borderRadius: "6px", padding: "7px 16px", cursor: "pointer", fontSize: "13px" }}>← Back</button>
    </header>
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "50px 20px" }}>
      <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "42px", color: C.textPrimary, marginBottom: "8px" }}>Privacy Policy</h1>
      <p style={{ color: C.textMuted, marginBottom: "40px" }}>Last updated: March 2024</p>
      {[
        ["Information We Collect", "Cricify does not collect any personal information. We may collect anonymous usage data such as page views and browser type to improve our service."],
        ["Cookies", "We use cookies to enhance browsing experience. These do not store personally identifiable information. You can disable cookies through your browser settings."],
        ["Advertising", "We use Google AdSense to display ads. Google may use cookies to serve ads based on your visits. You may opt out via Google's Ads Settings."],
        ["Data Security", "We take reasonable measures to protect collected information. No internet transmission is completely secure."],
        ["Contact", "Questions about this Privacy Policy? Contact us at: support@cricify.com"],
      ].map(([title, text]) => (
        <div key={title} style={{ marginBottom: "28px", paddingBottom: "28px", borderBottom: `1px solid ${C.border}` }}>
          <h2 style={{ color: C.textPrimary, fontSize: "17px", fontWeight: "700", marginBottom: "10px" }}>{title}</h2>
          <p style={{ color: C.textSecondary, fontSize: "14px", lineHeight: "1.9" }}>{text}</p>
        </div>
      ))}
    </div>
    <Footer onNav={() => {}} />
  </div>
);

const AboutUs = ({ onBack }) => (
  <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Segoe UI', sans-serif", color: C.textPrimary }}>
    <header style={{ background: "#040608", borderBottom: `1px solid ${C.border}`, padding: "0 24px", height: "60px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div onClick={onBack} style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "20px", color: C.textPrimary, cursor: "pointer", fontWeight: "700" }}><span style={{ color: C.accent }}>CRICI</span>FY</div>
      <button onClick={onBack} style={{ background: "transparent", border: `1px solid ${C.borderLight}`, color: C.textSecondary, borderRadius: "6px", padding: "7px 16px", cursor: "pointer", fontSize: "13px" }}>← Back</button>
    </header>
    <div style={{ background: `linear-gradient(160deg, #0f1923 0%, #060a0e 100%)`, padding: "70px 20px", textAlign: "center", borderBottom: `1px solid ${C.border}` }}>
      <div style={{ color: C.accent, fontSize: "12px", fontWeight: "700", letterSpacing: "3px", marginBottom: "16px" }}>EST. 2024</div>
      <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "52px", color: C.textPrimary, marginBottom: "16px" }}>About Cricify</h1>
      <p style={{ color: C.textSecondary, fontSize: "16px", maxWidth: "500px", margin: "0 auto", lineHeight: "1.8" }}>India's fastest growing cricket streaming & scores platform — bringing the game closer to every fan.</p>
    </div>
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "50px 20px" }}>
      {[
        { icon: "🏏", title: "Live Scores", text: "Real-time ball-by-ball scores from IPL, ICC, Test matches and all major cricket tournaments." },
        { icon: "📺", title: "Live Streams", text: "Watch live cricket streams directly on our platform, completely free." },
        { icon: "📰", title: "Cricket News", text: "Breaking news, player updates, match previews and expert cricket analysis." },
        { icon: "✍️", title: "Articles", text: "In-depth cricket articles, match reviews, and player profiles from our editorial team." },
      ].map(item => (
        <div key={item.title} style={{ display: "flex", gap: "20px", marginBottom: "28px", padding: "24px", background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "12px" }}>
          <div style={{ fontSize: "32px" }}>{item.icon}</div>
          <div><h3 style={{ color: C.textPrimary, fontWeight: "700", marginBottom: "8px" }}>{item.title}</h3><p style={{ color: C.textSecondary, fontSize: "14px", lineHeight: "1.7" }}>{item.text}</p></div>
        </div>
      ))}
    </div>
    <Footer onNav={() => {}} />
  </div>
);

const ContactUs = ({ onBack }) => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", msg: "" });
  const [sent, setSent] = useState(false);
  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Segoe UI', sans-serif", color: C.textPrimary }}>
      <header style={{ background: "#040608", borderBottom: `1px solid ${C.border}`, padding: "0 24px", height: "60px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div onClick={onBack} style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "20px", color: C.textPrimary, cursor: "pointer", fontWeight: "700" }}><span style={{ color: C.accent }}>CRICI</span>FY</div>
        <button onClick={onBack} style={{ background: "transparent", border: `1px solid ${C.borderLight}`, color: C.textSecondary, borderRadius: "6px", padding: "7px 16px", cursor: "pointer", fontSize: "13px" }}>← Back</button>
      </header>
      <div style={{ maxWidth: "640px", margin: "0 auto", padding: "60px 20px" }}>
        <div style={{ color: C.accent, fontSize: "11px", fontWeight: "700", letterSpacing: "3px", marginBottom: "12px" }}>GET IN TOUCH</div>
        <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "42px", color: C.textPrimary, marginBottom: "36px" }}>Contact Us</h1>
        {sent ? (
          <div style={{ textAlign: "center", padding: "50px", background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "16px" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>✅</div>
            <div style={{ color: C.success, fontSize: "18px", fontWeight: "700", marginBottom: "8px" }}>Message Sent!</div>
            <div style={{ color: C.textMuted, fontSize: "14px" }}>We'll respond within 24 hours.</div>
          </div>
        ) : (
          <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "16px", padding: "32px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
              <Input label="Name" value={form.name} onChange={v => setForm({ ...form, name: v })} placeholder="Your name" />
              <Input label="Email" value={form.email} onChange={v => setForm({ ...form, email: v })} placeholder="your@email.com" type="email" />
            </div>
            <Input label="Subject" value={form.subject} onChange={v => setForm({ ...form, subject: v })} placeholder="Subject" />
            <Textarea label="Message" value={form.msg} onChange={v => setForm({ ...form, msg: v })} placeholder="Your message..." rows={5} />
            <button onClick={() => { if (form.name && form.email && form.msg) setSent(true); }}
              style={{ width: "100%", background: C.gradient, border: "none", color: "#fff", borderRadius: "10px", padding: "14px", cursor: "pointer", fontWeight: "700", fontSize: "14px" }}>Send Message →</button>
          </div>
        )}
      </div>
      <Footer onNav={() => {}} />
    </div>
  );
};

const ArticleView = ({ article, onBack, onNav }) => (
  <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Segoe UI', sans-serif", color: C.textPrimary }}>
    <header style={{ background: "rgba(6,8,10,0.97)", borderBottom: `1px solid ${C.border}`, padding: "0 24px", height: "60px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100, backdropFilter: "blur(20px)" }}>
      <div onClick={() => onNav("website")} style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "20px", color: C.textPrimary, cursor: "pointer", fontWeight: "700" }}><span style={{ color: C.accent }}>CRICI</span>FY</div>
      <button onClick={onBack} style={{ background: "transparent", border: `1px solid ${C.borderLight}`, color: C.textSecondary, borderRadius: "6px", padding: "7px 16px", cursor: "pointer", fontSize: "13px" }}>← Articles</button>
    </header>
    <div style={{ maxWidth: "780px", margin: "0 auto", padding: "50px 20px" }}>
      <div style={{ marginBottom: "8px" }}>
        <span style={{ color: C.accent, fontSize: "11px", fontWeight: "700", letterSpacing: "2px" }}>{article.category.toUpperCase()}</span>
      </div>
      <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(28px, 5vw, 44px)", color: C.textPrimary, lineHeight: "1.2", marginBottom: "20px" }}>{article.title}</h1>
      <div style={{ display: "flex", gap: "20px", color: C.textMuted, fontSize: "13px", marginBottom: "36px", paddingBottom: "24px", borderBottom: `1px solid ${C.border}` }}>
        <span>✍️ {article.author}</span>
        <span>📅 {new Date(article.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</span>
      </div>
      <div>
        {article.content.split("\n").map((para, i) => para.trim() && (
          <p key={i} style={{ color: C.textSecondary, fontSize: "15px", lineHeight: "2", marginBottom: "22px" }}>{para}</p>
        ))}
      </div>
    </div>
    <Footer onNav={onNav} />
  </div>
);

const ArticlesPage = ({ onNav, onArticleClick }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("All");
  const cats = ["All", "IPL", "Test Cricket", "T20", "ODI", "Player News", "Cricket"];

  useEffect(() => { dbGet("articles").then(d => { if (d) setArticles(d); setLoading(false); }); }, []);
  const filtered = articles.filter(a => (cat === "All" || a.category === cat) && (!search || a.title.toLowerCase().includes(search.toLowerCase())));

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Segoe UI', sans-serif", color: C.textPrimary }}>
      <header style={{ background: "rgba(6,8,10,0.97)", borderBottom: `1px solid ${C.border}`, padding: "0 24px", height: "60px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100, backdropFilter: "blur(20px)" }}>
        <div onClick={() => onNav("website")} style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "20px", color: C.textPrimary, cursor: "pointer", fontWeight: "700" }}><span style={{ color: C.accent }}>CRICI</span>FY</div>
        <div style={{ position: "relative" }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search articles..." style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${C.borderMid}`, borderRadius: "20px", padding: "7px 16px 7px 34px", color: C.textPrimary, fontSize: "13px", outline: "none", width: "200px" }} />
          <span style={{ position: "absolute", left: "11px", top: "50%", transform: "translateY(-50%)", color: C.textMuted, fontSize: "13px" }}>🔍</span>
        </div>
      </header>
      <div style={{ background: `linear-gradient(160deg, #0f1923, #060a0e)`, padding: "50px 20px 40px", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ color: C.accent, fontSize: "11px", fontWeight: "700", letterSpacing: "3px", marginBottom: "12px" }}>EDITORIAL</div>
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(32px, 6vw, 50px)", color: C.textPrimary }}>Cricket Articles</h1>
        </div>
      </div>
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "28px 20px" }}>
        <div style={{ display: "flex", gap: "8px", marginBottom: "28px", flexWrap: "wrap" }}>
          {cats.map(c => (
            <button key={c} onClick={() => setCat(c)} style={{ padding: "7px 16px", border: `1px solid ${cat === c ? C.accentBorder : C.border}`, borderRadius: "20px", cursor: "pointer", fontSize: "12px", fontWeight: "600", background: cat === c ? C.accentSoft : "transparent", color: cat === c ? C.accentBright : C.textMuted }}>
              {c}
            </button>
          ))}
        </div>
        {loading ? <div style={{ textAlign: "center", padding: "80px", color: C.textMuted }}>Loading...</div>
          : filtered.length === 0 ? <div style={{ textAlign: "center", padding: "80px", color: C.textMuted }}><div style={{ fontSize: "40px", marginBottom: "12px" }}>📝</div>No articles found</div>
          : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
              {filtered.map(a => (
                <div key={a.id} onClick={() => onArticleClick(a)} style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "12px", overflow: "hidden", cursor: "pointer", transition: "all 0.25s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = C.accentBorder; e.currentTarget.style.transform = "translateY(-4px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = "translateY(0)"; }}>
                  <div style={{ height: "160px", background: `linear-gradient(135deg, #1a2030, #0d1420)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: "44px" }}>🏏</span>
                  </div>
                  <div style={{ padding: "18px" }}>
                    <div style={{ color: C.accent, fontSize: "10px", fontWeight: "700", letterSpacing: "1.5px", marginBottom: "8px" }}>{a.category.toUpperCase()}</div>
                    <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", color: C.textPrimary, fontSize: "15px", lineHeight: "1.5", marginBottom: "10px" }}>{a.title}</h3>
                    <p style={{ color: C.textMuted, fontSize: "12px", lineHeight: "1.6", marginBottom: "14px" }}>{a.content.substring(0, 90)}...</p>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ color: C.textMuted, fontSize: "11px" }}>✍️ {a.author}</span>
                      <span style={{ color: C.accentBright, fontSize: "12px", fontWeight: "600" }}>Read →</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
      </div>
      <Footer onNav={onNav} />
    </div>
  );
};

const StreamPlayer = ({ match, onClose }) => {
  const [volume, setVolume] = useState(80);
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.97)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
      <div style={{ width: "100%", maxWidth: "900px", background: C.bgCard, borderRadius: "16px", overflow: "hidden", border: `1px solid ${C.borderMid}` }}>
        <div style={{ padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${C.border}`, background: "#050709" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ background: C.gradient, color: "#fff", padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "800" }}>● LIVE</span>
            <span style={{ color: C.textPrimary, fontWeight: "700", fontSize: "15px" }}>{match.flag1} {match.team1} vs {match.team2} {match.flag2}</span>
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,80,80,0.15)", border: "1px solid rgba(255,80,80,0.3)", color: "#ff5252", borderRadius: "8px", padding: "6px 14px", cursor: "pointer" }}>✕</button>
        </div>
        <div style={{ width: "100%", aspectRatio: "16/9", background: "#020304", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {match.stream_url ? <iframe src={match.stream_url} style={{ width: "100%", height: "100%", border: "none", position: "absolute", inset: 0 }} allowFullScreen title="stream" />
            : <div style={{ textAlign: "center" }}><div style={{ fontSize: "52px", marginBottom: "12px" }}>📺</div><div style={{ color: C.textSecondary, fontSize: "16px" }}>Stream Coming Soon</div></div>}
        </div>
        <div style={{ padding: "12px 20px", background: "#050709", display: "flex", alignItems: "center", gap: "12px", borderTop: `1px solid ${C.border}` }}>
          <span style={{ color: C.textMuted }}>🔊</span>
          <input type="range" min="0" max="100" value={volume} onChange={e => setVolume(e.target.value)} style={{ accentColor: C.accent, width: "100px" }} />
          <span style={{ color: C.textMuted, fontSize: "12px" }}>{volume}%</span>
        </div>
      </div>
    </div>
  );
};

const AdminLoginPage = ({ onSuccess }) => {
  const [pass, setPass] = useState("");
  const [error, setError] = useState(false);
  const tryLogin = () => { if (pass === ADMIN_PASSWORD) onSuccess(); else { setError(true); setTimeout(() => setError(false), 2000); setPass(""); } };
  return (
    <div style={{ minHeight: "100vh", background: "#040608", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Segoe UI', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap');`}</style>
      <div style={{ background: C.bgCard, border: `1px solid ${C.borderMid}`, borderRadius: "20px", padding: "50px 44px", width: "100%", maxWidth: "400px", textAlign: "center" }}>
        <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "26px", color: C.textPrimary, fontWeight: "700", marginBottom: "6px" }}><span style={{ color: C.accent }}>CRICI</span>FY</div>
        <div style={{ color: C.textMuted, fontSize: "12px", marginBottom: "36px", letterSpacing: "2px" }}>ADMIN PORTAL</div>
        <div style={{ fontSize: "44px", marginBottom: "20px" }}>🔐</div>
        <input type="password" value={pass} onChange={e => { setPass(e.target.value); setError(false); }} onKeyDown={e => e.key === "Enter" && tryLogin()} placeholder="Enter password..." autoFocus
          style={{ width: "100%", background: error ? "rgba(255,50,50,0.08)" : "rgba(255,255,255,0.04)", border: `1px solid ${error ? "rgba(255,50,50,0.4)" : C.borderLight}`, borderRadius: "10px", padding: "13px 18px", color: "#fff", fontSize: "15px", outline: "none", textAlign: "center", letterSpacing: "6px", marginBottom: "10px" }} />
        {error && <div style={{ color: "#ff4444", fontSize: "13px", marginBottom: "12px" }}>❌ Incorrect password</div>}
        {!error && <div style={{ height: "28px" }} />}
        <button onClick={tryLogin} style={{ width: "100%", background: C.gradient, border: "none", color: "#fff", borderRadius: "10px", padding: "13px", cursor: "pointer", fontWeight: "700", fontSize: "15px" }}>Login →</button>
      </div>
    </div>
  );
};

const AdminDashboard = ({ onLogout }) => {
  const [tab, setTab] = useState("matches");
  const [matches, setMatches] = useState([]);
  const [news, setNews] = useState([]);
  const [ticker, setTicker] = useState([]);
  const [articles, setArticles] = useState([]);
  const [editMatch, setEditMatch] = useState(null);
  const [editNews, setEditNews] = useState(null);
  const [editArticle, setEditArticle] = useState(null);
  const [newTicker, setNewTicker] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };
  const loadData = useCallback(async () => {
    setLoading(true);
    const [m, n, t, a] = await Promise.all([dbGet("matches", "created_at.asc"), dbGet("news", "created_at.asc"), dbGet("ticker", "created_at.asc"), dbGet("articles")]);
    if (m) setMatches(m); if (n) setNews(n); if (t) setTicker(t); if (a) setArticles(a);
    setLoading(false);
  }, []);
  useEffect(() => { loadData(); }, [loadData]);

  const blankMatch = { team1: "", team2: "", flag1: "🏏", flag2: "🏏", score1: "—", score2: "—", overs1: "—", overs2: "—", status: "LIVE", match_date: "", match_time: "", type: "T20 • IPL 2026", venue: "", stream: false, stream_url: "", result: "" };
  const blankNews = { title: "", tag: "IPL", time: "Just now", hot: false };
  const blankArticle = { title: "", content: "", category: "Cricket", author: "Cricify Staff", image_url: "" };

  const getMatchStatus = (m) => {
    if (m.status === "LIVE") return "LIVE";
    if (m.status === "COMPLETED") return "COMPLETED";
    if (m.match_date && m.match_time) return `${m.match_date} • ${m.match_time}`;
    return m.status;
  };

  const saveMatch = async () => {
    if (!editMatch.team1 || !editMatch.team2) { showToast("❌ Team names required!"); return; }
    setSaving(true);
    const dataToSave = { ...editMatch };
    if (editMatch.id) await dbUpdate("matches", editMatch.id, dataToSave);
    else await dbInsert("matches", dataToSave);
    await loadData(); setEditMatch(null); setSaving(false); showToast("✅ Match saved!");
  };
  const deleteMatch = async (id) => { if (!window.confirm("Delete?")) return; await dbDelete("matches", id); await loadData(); showToast("🗑 Deleted!"); };
  const saveNews = async () => { if (!editNews.title) { showToast("❌ Headline required!"); return; } setSaving(true); if (editNews.id) await dbUpdate("news", editNews.id, editNews); else await dbInsert("news", editNews); await loadData(); setEditNews(null); setSaving(false); showToast("✅ Saved!"); };
  const deleteNews = async (id) => { if (!window.confirm("Delete?")) return; await dbDelete("news", id); await loadData(); showToast("🗑 Deleted!"); };
  const saveArticle = async () => { if (!editArticle.title || !editArticle.content) { showToast("❌ Title & content required!"); return; } setSaving(true); if (editArticle.id) await dbUpdate("articles", editArticle.id, editArticle); else await dbInsert("articles", editArticle); await loadData(); setEditArticle(null); setSaving(false); showToast("✅ Published!"); };
  const deleteArticle = async (id) => { if (!window.confirm("Delete?")) return; await dbDelete("articles", id); await loadData(); showToast("🗑 Deleted!"); };
  const addTicker = async () => { if (!newTicker.trim()) return; await dbInsert("ticker", { text: newTicker.trim() }); setNewTicker(""); await loadData(); showToast("✅ Added!"); };
  const deleteTicker = async (id) => { await dbDelete("ticker", id); await loadData(); };

  const tabStyle = (key) => ({ padding: "9px 18px", border: "none", borderRadius: "7px", cursor: "pointer", fontSize: "12px", fontWeight: "700", background: tab === key ? C.gradient : "rgba(255,255,255,0.04)", color: tab === key ? "#fff" : "#666" });

  return (
    <div style={{ minHeight: "100vh", background: "#040608", fontFamily: "'Segoe UI', sans-serif", color: "#fff" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap'); *{box-sizing:border-box;margin:0;padding:0} @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>
      {toast && <div style={{ position: "fixed", top: "20px", right: "20px", background: "#0d1a0d", border: "1px solid #2a5a2a", color: "#4caf50", borderRadius: "10px", padding: "12px 20px", zIndex: 9999, fontSize: "14px", fontWeight: "600" }}>{toast}</div>}
      <header style={{ background: "#040608", borderBottom: `1px solid ${C.borderMid}`, padding: "0 24px", height: "60px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "18px", color: C.textPrimary, fontWeight: "700" }}><span style={{ color: C.accent }}>CRICI</span>FY</div>
          <span style={{ background: C.accentSoft, border: `1px solid ${C.accentBorder}`, color: C.accentBright, fontSize: "10px", fontWeight: "700", padding: "3px 10px", borderRadius: "20px" }}>ADMIN</span>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={loadData} style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${C.borderMid}`, color: C.textSecondary, borderRadius: "7px", padding: "7px 14px", cursor: "pointer", fontSize: "12px" }}>🔄 Refresh</button>
          <button onClick={onLogout} style={{ background: "rgba(255,80,80,0.1)", border: "1px solid rgba(255,80,80,0.25)", color: "#ff5252", borderRadius: "7px", padding: "7px 14px", cursor: "pointer", fontSize: "12px" }}>Logout</button>
        </div>
      </header>
      <div style={{ maxWidth: "980px", margin: "0 auto", padding: "28px 20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "12px", marginBottom: "28px" }}>
          {[{ label: "Matches", value: matches.length, icon: "🏏" }, { label: "News", value: news.length, icon: "📰" }, { label: "Articles", value: articles.length, icon: "✍️" }, { label: "Ticker", value: ticker.length, icon: "📢" }].map(s => (
            <div key={s.label} style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "18px", display: "flex", alignItems: "center", gap: "14px" }}>
              <div style={{ fontSize: "26px" }}>{s.icon}</div>
              <div><div style={{ fontSize: "28px", fontWeight: "800", color: C.accent, lineHeight: 1 }}>{s.value}</div><div style={{ color: "#444", fontSize: "11px", marginTop: "2px" }}>{s.label}</div></div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: "6px", marginBottom: "22px", flexWrap: "wrap" }}>
          {[["matches", "🏏 Matches"], ["news", "📰 News"], ["articles", "✍️ Articles"], ["ticker", "📢 Ticker"]].map(([key, label]) => (
            <button key={key} style={tabStyle(key)} onClick={() => setTab(key)}>{label}</button>
          ))}
        </div>
        {loading ? <div style={{ textAlign: "center", padding: "80px", color: C.textMuted }}>Loading...</div> : (
          <>
            {tab === "matches" && (
              <div style={{ animation: "fadeIn 0.3s ease" }}>
                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "14px" }}>
                  <button onClick={() => setEditMatch({ ...blankMatch })} style={{ background: C.gradient, border: "none", color: "#fff", borderRadius: "8px", padding: "9px 20px", cursor: "pointer", fontWeight: "700", fontSize: "13px" }}>+ Add Match</button>
                </div>
                {matches.map(m => (
                  <div key={m.id} style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "10px", padding: "14px 18px", marginBottom: "8px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ color: "#fff", fontWeight: "700", fontSize: "14px", marginBottom: "3px" }}>{m.flag1} {m.team1} vs {m.team2} {m.flag2}</div>
                      <div style={{ color: "#555", fontSize: "12px" }}>{getMatchStatus(m)} • {m.type}</div>
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button onClick={() => setEditMatch({ ...m, match_date: m.match_date || "", match_time: m.match_time || "" })} style={{ background: "rgba(255,165,0,0.1)", border: "1px solid rgba(255,165,0,0.25)", color: "#ffa500", borderRadius: "7px", padding: "6px 14px", cursor: "pointer", fontSize: "12px" }}>✏️ Edit</button>
                      <button onClick={() => deleteMatch(m.id)} style={{ background: "rgba(255,80,80,0.1)", border: "1px solid rgba(255,80,80,0.25)", color: "#ff5252", borderRadius: "7px", padding: "6px 12px", cursor: "pointer" }}>🗑</button>
                    </div>
                  </div>
                ))}
                {editMatch && (
                  <div style={{ background: "#080c10", border: `1px solid ${C.borderMid}`, borderRadius: "14px", padding: "24px", marginTop: "14px" }}>
                    <div style={{ color: C.accentBright, fontWeight: "700", fontSize: "15px", marginBottom: "20px" }}>{editMatch.id ? "✏️ Edit Match" : "➕ New Match"}</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
                      <Input label="Team 1" value={editMatch.team1} onChange={v => setEditMatch({ ...editMatch, team1: v })} placeholder="India" />
                      <Input label="Team 2" value={editMatch.team2} onChange={v => setEditMatch({ ...editMatch, team2: v })} placeholder="Australia" />
                      <Input label="Flag 1" value={editMatch.flag1} onChange={v => setEditMatch({ ...editMatch, flag1: v })} placeholder="🇮🇳" />
                      <Input label="Flag 2" value={editMatch.flag2} onChange={v => setEditMatch({ ...editMatch, flag2: v })} placeholder="🇦🇺" />
                      <Input label="Score 1" value={editMatch.score1} onChange={v => setEditMatch({ ...editMatch, score1: v })} placeholder="187/4" />
                      <Input label="Score 2" value={editMatch.score2} onChange={v => setEditMatch({ ...editMatch, score2: v })} placeholder="183/7" />
                      <Input label="Overs 1" value={editMatch.overs1} onChange={v => setEditMatch({ ...editMatch, overs1: v })} placeholder="20.0" />
                      <Input label="Overs 2" value={editMatch.overs2} onChange={v => setEditMatch({ ...editMatch, overs2: v })} placeholder="19.3" />
                    </div>
                    <div style={{ marginBottom: "14px" }}>
                      <div style={{ color: C.textSecondary, fontSize: "11px", marginBottom: "5px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px" }}>Match Status</div>
                      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                        {["LIVE", "UPCOMING", "COMPLETED"].map(s => (
                          <button key={s} onClick={() => setEditMatch({ ...editMatch, status: s })}
                            style={{ padding: "7px 16px", border: `1px solid ${editMatch.status === s ? C.accentBorder : C.borderLight}`, borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontWeight: "700", background: editMatch.status === s ? C.accentSoft : "transparent", color: editMatch.status === s ? C.accentBright : C.textMuted }}>
                            {s === "LIVE" ? "🔴 LIVE" : s === "UPCOMING" ? "📅 UPCOMING" : "✅ COMPLETED"}
                          </button>
                        ))}
                      </div>
                    </div>
                    {editMatch.status === "UPCOMING" && (
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px", background: C.accentSoft, border: `1px solid ${C.accentBorder}`, borderRadius: "10px", padding: "14px", marginBottom: "14px" }}>
                        <Input label="📅 Match Date (e.g. 15 March 2026)" value={editMatch.match_date || ""} onChange={v => setEditMatch({ ...editMatch, match_date: v })} placeholder="15 March 2026" />
                        <Input label="⏰ Match Time (e.g. 7:30 PM IST)" value={editMatch.match_time || ""} onChange={v => setEditMatch({ ...editMatch, match_time: v })} placeholder="7:30 PM IST" />
                      </div>
                    )}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
                      <Input label="Match Type" value={editMatch.type} onChange={v => setEditMatch({ ...editMatch, type: v })} placeholder="T20 • IPL 2026" />
                      <Input label="Venue" value={editMatch.venue} onChange={v => setEditMatch({ ...editMatch, venue: v })} placeholder="Wankhede Stadium" />
                    </div>
                    <Input label="Result (optional)" value={editMatch.result || ""} onChange={v => setEditMatch({ ...editMatch, result: v })} placeholder="India won by 4 wickets" />
                    <div style={{ background: C.accentSoft, border: `1px solid ${C.accentBorder}`, borderRadius: "10px", padding: "14px", marginBottom: "14px" }}>
                      <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", color: C.textSecondary, fontSize: "14px" }}>
                        <input type="checkbox" checked={editMatch.stream} onChange={e => setEditMatch({ ...editMatch, stream: e.target.checked })} style={{ accentColor: C.accent, width: "16px", height: "16px" }} />
                        📺 Enable Live Stream
                      </label>
                      {editMatch.stream && <div style={{ marginTop: "12px" }}><Input label="Stream Embed URL" value={editMatch.stream_url || ""} onChange={v => setEditMatch({ ...editMatch, stream_url: v })} placeholder="https://www.youtube.com/embed/VIDEO_ID" /></div>}
                    </div>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <button onClick={saveMatch} disabled={saving} style={{ background: C.gradient, border: "none", color: "#fff", borderRadius: "9px", padding: "11px 26px", cursor: "pointer", fontWeight: "700" }}>{saving ? "Saving..." : "✓ Save Match"}</button>
                      <button onClick={() => setEditMatch(null)} style={{ background: "transparent", border: `1px solid ${C.borderLight}`, color: "#666", borderRadius: "9px", padding: "11px 18px", cursor: "pointer" }}>Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            )}
            {tab === "news" && (
              <div style={{ animation: "fadeIn 0.3s ease" }}>
                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "14px" }}>
                  <button onClick={() => setEditNews({ ...blankNews })} style={{ background: C.gradient, border: "none", color: "#fff", borderRadius: "8px", padding: "9px 20px", cursor: "pointer", fontWeight: "700", fontSize: "13px" }}>+ Add News</button>
                </div>
                {news.map(n => (
                  <div key={n.id} style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "10px", padding: "12px 18px", marginBottom: "8px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div><div style={{ color: "#fff", fontWeight: "600", fontSize: "13px" }}>{n.hot ? "🔥 " : ""}{n.title}</div><div style={{ color: "#444", fontSize: "11px" }}>{n.tag} • {n.time}</div></div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button onClick={() => setEditNews({ ...n })} style={{ background: "rgba(255,165,0,0.1)", border: "1px solid rgba(255,165,0,0.25)", color: "#ffa500", borderRadius: "7px", padding: "6px 14px", cursor: "pointer", fontSize: "12px" }}>✏️</button>
                      <button onClick={() => deleteNews(n.id)} style={{ background: "rgba(255,80,80,0.1)", border: "1px solid rgba(255,80,80,0.25)", color: "#ff5252", borderRadius: "7px", padding: "6px 12px", cursor: "pointer" }}>🗑</button>
                    </div>
                  </div>
                ))}
                {editNews && (
                  <div style={{ background: "#080c10", border: `1px solid ${C.borderMid}`, borderRadius: "14px", padding: "24px", marginTop: "14px" }}>
                    <div style={{ color: C.accentBright, fontWeight: "700", fontSize: "15px", marginBottom: "20px" }}>{editNews.id ? "Edit" : "New"} News</div>
                    <Input label="Headline" value={editNews.title} onChange={v => setEditNews({ ...editNews, title: v })} placeholder="News headline..." />
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
                      <Input label="Tag" value={editNews.tag} onChange={v => setEditNews({ ...editNews, tag: v })} placeholder="IPL" />
                      <Input label="Time" value={editNews.time} onChange={v => setEditNews({ ...editNews, time: v })} placeholder="2 min ago" />
                    </div>
                    <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", color: C.textSecondary, fontSize: "13px", marginBottom: "18px" }}>
                      <input type="checkbox" checked={editNews.hot} onChange={e => setEditNews({ ...editNews, hot: e.target.checked })} style={{ accentColor: C.accent }} />
                      🔥 Mark as Hot
                    </label>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <button onClick={saveNews} disabled={saving} style={{ background: C.gradient, border: "none", color: "#fff", borderRadius: "9px", padding: "11px 26px", cursor: "pointer", fontWeight: "700" }}>{saving ? "..." : "✓ Save"}</button>
                      <button onClick={() => setEditNews(null)} style={{ background: "transparent", border: `1px solid ${C.borderLight}`, color: "#666", borderRadius: "9px", padding: "11px 18px", cursor: "pointer" }}>Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            )}
            {tab === "articles" && (
              <div style={{ animation: "fadeIn 0.3s ease" }}>
                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "14px" }}>
                  <button onClick={() => setEditArticle({ ...blankArticle })} style={{ background: C.gradient, border: "none", color: "#fff", borderRadius: "8px", padding: "9px 20px", cursor: "pointer", fontWeight: "700", fontSize: "13px" }}>+ Write Article</button>
                </div>
                {articles.length === 0 && !editArticle && <div style={{ textAlign: "center", padding: "50px", color: "#333" }}>No articles yet</div>}
                {articles.map(a => (
                  <div key={a.id} style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "10px", padding: "12px 18px", marginBottom: "8px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div><div style={{ color: "#fff", fontWeight: "600", fontSize: "13px" }}>{a.title}</div><div style={{ color: "#444", fontSize: "11px" }}>{a.category} • {a.author}</div></div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button onClick={() => setEditArticle({ ...a })} style={{ background: "rgba(255,165,0,0.1)", border: "1px solid rgba(255,165,0,0.25)", color: "#ffa500", borderRadius: "7px", padding: "6px 14px", cursor: "pointer", fontSize: "12px" }}>✏️</button>
                      <button onClick={() => deleteArticle(a.id)} style={{ background: "rgba(255,80,80,0.1)", border: "1px solid rgba(255,80,80,0.25)", color: "#ff5252", borderRadius: "7px", padding: "6px 12px", cursor: "pointer" }}>🗑</button>
                    </div>
                  </div>
                ))}
                {editArticle && (
                  <div style={{ background: "#080c10", border: `1px solid ${C.borderMid}`, borderRadius: "14px", padding: "24px", marginTop: "14px" }}>
                    <div style={{ color: C.accentBright, fontWeight: "700", fontSize: "15px", marginBottom: "20px" }}>{editArticle.id ? "Edit" : "Write New"} Article</div>
                    <Input label="Title" value={editArticle.title} onChange={v => setEditArticle({ ...editArticle, title: v })} placeholder="Article title..." />
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0 16px" }}>
                      <div style={{ marginBottom: "14px" }}>
                        <div style={{ color: C.textSecondary, fontSize: "11px", marginBottom: "5px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px" }}>Category</div>
                        <select value={editArticle.category} onChange={e => setEditArticle({ ...editArticle, category: e.target.value })} style={{ width: "100%", background: "rgba(255,255,255,0.03)", border: `1px solid ${C.borderLight}`, borderRadius: "8px", padding: "10px 14px", color: "#fff", fontSize: "13px", outline: "none" }}>
                          {["Cricket", "IPL", "Test Cricket", "T20", "ODI", "Player News"].map(c => <option key={c}>{c}</option>)}
                        </select>
                      </div>
                      <Input label="Author" value={editArticle.author} onChange={v => setEditArticle({ ...editArticle, author: v })} placeholder="Cricify Staff" />
                      <Input label="Image URL (optional)" value={editArticle.image_url} onChange={v => setEditArticle({ ...editArticle, image_url: v })} placeholder="https://..." />
                    </div>
                    <Textarea label="Content (new line = new paragraph)" value={editArticle.content} onChange={v => setEditArticle({ ...editArticle, content: v })} placeholder="Write article..." rows={10} />
                    <div style={{ display: "flex", gap: "10px" }}>
                      <button onClick={saveArticle} disabled={saving} style={{ background: C.gradient, border: "none", color: "#fff", borderRadius: "9px", padding: "11px 26px", cursor: "pointer", fontWeight: "700" }}>{saving ? "Publishing..." : "🚀 Publish"}</button>
                      <button onClick={() => setEditArticle(null)} style={{ background: "transparent", border: `1px solid ${C.borderLight}`, color: "#666", borderRadius: "9px", padding: "11px 18px", cursor: "pointer" }}>Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            )}
            {tab === "ticker" && (
              <div style={{ animation: "fadeIn 0.3s ease" }}>
                <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "10px", padding: "16px", marginBottom: "14px" }}>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <input value={newTicker} onChange={e => setNewTicker(e.target.value)} onKeyDown={e => e.key === "Enter" && addTicker()} placeholder="🏏 KOHLI 87* — IND vs AUS LIVE"
                      style={{ flex: 1, background: "rgba(255,255,255,0.03)", border: `1px solid ${C.borderLight}`, borderRadius: "8px", padding: "9px 14px", color: "#fff", fontSize: "13px", outline: "none" }} />
                    <button onClick={addTicker} style={{ background: C.gradient, border: "none", color: "#fff", borderRadius: "8px", padding: "9px 18px", cursor: "pointer", fontWeight: "700", fontSize: "13px" }}>Add</button>
                  </div>
                </div>
                {ticker.map((t, i) => (
                  <div key={t.id} style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "9px", padding: "12px 16px", marginBottom: "7px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ color: "#aaa", fontSize: "13px" }}>#{i + 1} {t.text}</span>
                    <button onClick={() => deleteTicker(t.id)} style={{ background: "rgba(255,80,80,0.1)", border: "1px solid rgba(255,80,80,0.25)", color: "#ff5252", borderRadius: "6px", padding: "4px 12px", cursor: "pointer", fontSize: "12px" }}>✕</button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const MainWebsite = ({ onNav, onArticleClick }) => {
  const [matches, setMatches] = useState([]);
  const [news, setNews] = useState([]);
  const [apiNews, setApiNews] = useState([]);
  const [articles, setArticles] = useState([]);
  const [ticker, setTicker] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("live");
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [tickerIdx, setTickerIdx] = useState(0);
  const [showSearch, setShowSearch] = useState(false);

  const loadData = useCallback(async () => {
    const [m, n, t, a] = await Promise.all([dbGet("matches", "created_at.asc"), dbGet("news", "created_at.asc"), dbGet("ticker", "created_at.asc"), dbGet("articles")]);
    if (m) setMatches(m); if (n) setNews(n); if (t) setTicker(t); if (a) setArticles(a.slice(0, 6));
    setLoading(false);
  }, []);
  const loadApiData = useCallback(async () => { const items = await fetchGoogleNews(); if (items.length > 0) setApiNews(items); }, []);

  useEffect(() => { loadData(); loadApiData(); }, [loadData, loadApiData]);
  useEffect(() => { const i = setInterval(loadData, 30000); return () => clearInterval(i); }, [loadData]);
  useEffect(() => { const i = setInterval(loadApiData, 120000); return () => clearInterval(i); }, [loadApiData]);
  useEffect(() => {
    if (!ticker.length) return;
    const t = setInterval(() => setTickerIdx(p => (p + 1) % ticker.length), 3500);
    return () => clearInterval(t);
  }, [ticker]);

  const getMatchStatus = (m) => {
    if (m.status === "LIVE") return { label: "● LIVE", color: C.accent, bg: C.accentSoft, border: C.accentBorder };
    if (m.status === "COMPLETED") return { label: "COMPLETED", color: "#666", bg: "rgba(100,100,100,0.1)", border: "rgba(100,100,100,0.2)" };
    return { label: m.match_date && m.match_time ? `${m.match_date} • ${m.match_time}` : m.status, color: "#60a5fa", bg: "rgba(59,130,246,0.1)", border: "rgba(59,130,246,0.25)" };
  };

  const filteredMatches = matches.filter(m =>
    activeTab === "live" ? m.status === "LIVE" :
      activeTab === "upcoming" ? (m.status === "UPCOMING" || m.status?.includes("TODAY") || m.status?.includes("TOMORROW") || m.status?.includes("SOON")) :
        activeTab === "completed" ? m.status === "COMPLETED" : true
  ).filter(m => !searchQuery || m.team1?.toLowerCase().includes(searchQuery.toLowerCase()) || m.team2?.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Segoe UI', sans-serif", color: C.textPrimary }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        @keyframes tickerSlide{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        .mcard{transition:all 0.22s ease}
        .mcard:hover{transform:translateY(-3px)!important}
      `}</style>
      {selectedMatch && <StreamPlayer match={selectedMatch} onClose={() => setSelectedMatch(null)} />}

      {ticker.length > 0 && (
        <div style={{ background: C.accent, display: "flex", alignItems: "center", overflow: "hidden" }}>
          <div style={{ background: "rgba(0,0,0,0.25)", color: "#fff", padding: "5px 14px", fontSize: "10px", fontWeight: "800", letterSpacing: "2px", whiteSpace: "nowrap" }}>BREAKING</div>
          <div key={tickerIdx} style={{ color: "#fff", fontSize: "12px", fontWeight: "600", padding: "5px 16px", animation: "tickerSlide 0.4s ease", whiteSpace: "nowrap" }}>{ticker[tickerIdx]?.text}</div>
        </div>
      )}

      <header style={{ background: "rgba(6,8,10,0.98)", borderBottom: `1px solid ${C.border}`, position: "sticky", top: ticker.length > 0 ? "27px" : 0, zIndex: 100, backdropFilter: "blur(20px)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", height: "60px" }}>
          <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "22px", fontWeight: "700", color: C.textPrimary, letterSpacing: "0.5px", cursor: "pointer" }} onClick={() => onNav("website")}>
            <span style={{ color: C.accent }}>CRICI</span>FY
          </div>
          <nav style={{ display: "flex", gap: "2px", alignItems: "center" }}>
            {[["Matches", "website"], ["Articles", "articles"]].map(([label, page]) => (
              <button key={page} onClick={() => onNav(page)} style={{ background: "transparent", border: "none", color: C.textSecondary, padding: "8px 14px", borderRadius: "6px", cursor: "pointer", fontSize: "13px", fontWeight: "500" }}
                onMouseEnter={e => e.target.style.color = C.textPrimary} onMouseLeave={e => e.target.style.color = C.textSecondary}>{label}</button>
            ))}
          </nav>
          <button onClick={() => setShowSearch(s => !s)} style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${C.border}`, color: C.textSecondary, borderRadius: "8px", padding: "7px 14px", cursor: "pointer", fontSize: "13px" }}>🔍</button>
        </div>
        {showSearch && (
          <div style={{ borderTop: `1px solid ${C.border}`, padding: "10px 20px", background: "rgba(6,8,10,0.98)" }}>
            <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
              <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search teams or matches..." autoFocus
                style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: `1px solid ${C.borderMid}`, borderRadius: "8px", padding: "10px 16px", color: C.textPrimary, fontSize: "14px", outline: "none" }} />
            </div>
          </div>
        )}
      </header>

      {/* Hero */}
      <div style={{ background: `linear-gradient(160deg, #0c1520 0%, #080c10 60%, #060809 100%)`, padding: "clamp(30px,6vw,60px) 20px", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "24px" }}>
          <div style={{ flex: 1, minWidth: "260px" }}>
            <div style={{ color: C.accent, fontSize: "11px", fontWeight: "700", letterSpacing: "3px", marginBottom: "14px" }}>INDIA'S PREMIER CRICKET PLATFORM</div>
            <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(32px,6vw,56px)", color: C.textPrimary, lineHeight: "1.1", marginBottom: "16px", fontWeight: "900" }}>
              Live Cricket<br /><span style={{ color: C.accent }}>Scores & Streams</span>
            </h1>
            <p style={{ color: C.textMuted, fontSize: "14px", lineHeight: "1.8", maxWidth: "380px" }}>Real-time scores, live streaming and breaking news from every cricket match worldwide.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            {[
              { label: "Live Matches", value: matches.filter(m => m.status === "LIVE").length, icon: "🔴" },
              { label: "Upcoming", value: matches.filter(m => m.status === "UPCOMING" || m.status?.includes("TODAY") || m.status?.includes("TOMORROW")).length, icon: "📅" },
              { label: "Live Streams", value: matches.filter(m => m.stream).length, icon: "📺" },
              { label: "Articles", value: articles.length, icon: "✍️" },
            ].map(s => (
              <div key={s.label} style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${C.border}`, borderRadius: "12px", padding: "16px 20px", textAlign: "center", minWidth: "100px" }}>
                <div style={{ fontSize: "20px", marginBottom: "4px" }}>{s.icon}</div>
                <div style={{ fontSize: "26px", fontWeight: "800", color: C.accent, lineHeight: 1, fontFamily: "'Playfair Display', serif" }}>{s.value}</div>
                <div style={{ color: C.textMuted, fontSize: "11px", marginTop: "3px" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "28px 20px", display: "flex", gap: "24px", flexWrap: "wrap" }}>
        {/* Main */}
        <div style={{ flex: 1, minWidth: "280px" }}>
          {/* Tabs */}
          <div style={{ display: "flex", borderBottom: `1px solid ${C.border}`, marginBottom: "22px" }}>
            {[
              { key: "live", label: "Live", count: matches.filter(m => m.status === "LIVE").length },
              { key: "upcoming", label: "Upcoming", count: matches.filter(m => m.status === "UPCOMING" || m.status?.includes("TODAY") || m.status?.includes("TOMORROW")).length },
              { key: "completed", label: "Completed", count: matches.filter(m => m.status === "COMPLETED").length },
              { key: "all", label: "All", count: matches.length },
            ].map(t => (
              <button key={t.key} onClick={() => setActiveTab(t.key)} style={{ background: "transparent", border: "none", borderBottom: `2px solid ${activeTab === t.key ? C.accent : "transparent"}`, color: activeTab === t.key ? C.textPrimary : C.textMuted, padding: "10px 16px", cursor: "pointer", fontSize: "13px", fontWeight: "600", marginBottom: "-1px", transition: "all 0.2s" }}>
                {t.label} <span style={{ fontSize: "11px", opacity: 0.7 }}>({t.count})</span>
              </button>
            ))}
          </div>

          {loading ? <div style={{ textAlign: "center", padding: "60px", color: C.textMuted }}>Loading...</div>
            : filteredMatches.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px", color: C.textMuted, border: `1px dashed ${C.border}`, borderRadius: "12px" }}>
                <div style={{ fontSize: "36px", marginBottom: "12px" }}>🏏</div>No matches found
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {filteredMatches.map(match => {
                  const statusInfo = getMatchStatus(match);
                  return (
                    <div key={match.id} className="mcard" style={{ background: C.bgCard, border: `1px solid ${match.status === "LIVE" ? C.accentBorder : C.border}`, borderRadius: "14px", padding: "20px", position: "relative", overflow: "hidden", boxShadow: match.status === "LIVE" ? `0 0 30px ${C.accentGlow}` : "none" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "18px", flexWrap: "wrap", gap: "8px" }}>
                        <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
                          <span style={{ background: statusInfo.bg, color: statusInfo.color, border: `1px solid ${statusInfo.border}`, padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "700" }}>{statusInfo.label}</span>
                          <span style={{ color: C.textMuted, fontSize: "12px" }}>{match.type}</span>
                        </div>
                        {match.venue && <span style={{ color: C.textMuted, fontSize: "11px" }}>📍 {match.venue}</span>}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                        <div style={{ flex: 1, textAlign: "center" }}>
                          <div style={{ fontSize: "clamp(24px,5vw,34px)", marginBottom: "6px" }}>{match.flag1}</div>
                          <div style={{ fontWeight: "700", fontSize: "clamp(13px,3vw,16px)", color: C.textPrimary, marginBottom: "4px" }}>{match.team1}</div>
                          {match.score1 !== "—" && <><div style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(20px,4vw,28px)", color: C.accent, fontWeight: "700", lineHeight: 1 }}>{match.score1}</div><div style={{ color: C.textMuted, fontSize: "11px" }}>{match.overs1} ov</div></>}
                        </div>
                        <div style={{ color: C.textMuted, fontSize: "13px", fontWeight: "700", padding: "0 6px" }}>vs</div>
                        <div style={{ flex: 1, textAlign: "center" }}>
                          <div style={{ fontSize: "clamp(24px,5vw,34px)", marginBottom: "6px" }}>{match.flag2}</div>
                          <div style={{ fontWeight: "700", fontSize: "clamp(13px,3vw,16px)", color: C.textPrimary, marginBottom: "4px" }}>{match.team2}</div>
                          {match.score2 !== "—" && <><div style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(20px,4vw,28px)", color: C.accent, fontWeight: "700", lineHeight: 1 }}>{match.score2}</div><div style={{ color: C.textMuted, fontSize: "11px" }}>{match.overs2} ov</div></>}
                        </div>
                      </div>
                      {match.result && <div style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: "8px", padding: "8px 14px", marginBottom: "12px", textAlign: "center", color: "#4ade80", fontSize: "12px", fontWeight: "600" }}>🏆 {match.result}</div>}
                      {match.stream && <button onClick={() => setSelectedMatch(match)} style={{ width: "100%", background: C.gradient, border: "none", borderRadius: "10px", padding: "12px", color: "#fff", fontWeight: "700", fontSize: "14px", cursor: "pointer" }}>▶ Watch Live</button>}
                    </div>
                  );
                })}
              </div>
            )}

          {/* Articles on homepage */}
          {articles.length > 0 && (
            <div style={{ marginTop: "40px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px", paddingBottom: "12px", borderBottom: `1px solid ${C.border}` }}>
                <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "22px", color: C.textPrimary }}>Latest Articles</h2>
                <button onClick={() => onNav("articles")} style={{ background: "transparent", border: "none", color: C.accentBright, cursor: "pointer", fontSize: "13px", fontWeight: "600" }}>View all →</button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "14px" }}>
                {articles.slice(0, 4).map(a => (
                  <div key={a.id} onClick={() => onArticleClick(a)} style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "10px", overflow: "hidden", cursor: "pointer", transition: "all 0.2s" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = C.accentBorder; e.currentTarget.style.transform = "translateY(-3px)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = "translateY(0)"; }}>
                    <div style={{ height: "100px", background: `linear-gradient(135deg, #1a2030, #0d1420)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px" }}>🏏</div>
                    <div style={{ padding: "12px" }}>
                      <div style={{ color: C.accent, fontSize: "9px", fontWeight: "700", letterSpacing: "1.5px", marginBottom: "6px" }}>{a.category.toUpperCase()}</div>
                      <h3 style={{ fontFamily: "'Playfair Display', serif", color: C.textPrimary, fontSize: "13px", lineHeight: "1.4" }}>{a.title}</h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div style={{ width: "clamp(260px, 28%, 300px)", flexShrink: 0 }}>
          <div style={{ position: "sticky", top: "80px" }}>
            <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "14px", overflow: "hidden" }}>
              <div style={{ padding: "14px 18px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "16px", fontWeight: "700", color: C.textPrimary }}>Cricket News</span>
                <span style={{ background: C.accentSoft, border: `1px solid ${C.accentBorder}`, color: C.accentBright, fontSize: "9px", fontWeight: "700", padding: "2px 7px", borderRadius: "20px" }}>LIVE</span>
              </div>
              <div style={{ maxHeight: "70vh", overflowY: "auto" }}>
                {news.map(item => (
                  <div key={item.id} style={{ padding: "12px 16px", borderBottom: `1px solid ${C.border}`, cursor: "pointer", transition: "background 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <div style={{ display: "flex", gap: "8px" }}>
                      {item.hot && <span style={{ color: C.accent, fontSize: "12px", flexShrink: 0 }}>🔥</span>}
                      <div>
                        <div style={{ fontSize: "12px", color: C.textSecondary, lineHeight: "1.5", marginBottom: "6px", fontWeight: "500" }}>{item.title}</div>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <span style={{ background: C.accentSoft, border: `1px solid ${C.accentBorder}`, color: C.accentBright, fontSize: "9px", padding: "1px 7px", borderRadius: "20px", fontWeight: "700" }}>{item.tag}</span>
                          <span style={{ color: C.textMuted, fontSize: "10px" }}>{item.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {apiNews.length > 0 && (
                  <>
                    <div style={{ padding: "7px 14px", background: "rgba(255,87,34,0.05)", borderBottom: `1px solid ${C.border}` }}>
                      <span style={{ color: C.textMuted, fontSize: "9px", fontWeight: "700", letterSpacing: "1.5px" }}>GOOGLE NEWS</span>
                    </div>
                    {apiNews.map((item, i) => (
                      <div key={i} style={{ padding: "11px 14px", borderBottom: i < apiNews.length - 1 ? `1px solid ${C.border}` : "none", cursor: "pointer", transition: "background 0.2s" }}
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                        <div style={{ fontSize: "12px", color: C.textSecondary, lineHeight: "1.5", marginBottom: "5px" }}>{item.title}</div>
                        <span style={{ color: C.textMuted, fontSize: "10px" }}>{item.time}</span>
                      </div>
                    ))}
                  </>
                )}
                {!news.length && !apiNews.length && <div style={{ padding: "28px", textAlign: "center", color: C.textMuted, fontSize: "13px" }}>Loading news...</div>}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer onNav={onNav} />
    </div>
  );
};

export default function App() {
  const isAdmin = window.location.hash === "#/admin" || window.location.pathname.endsWith("/admin");
  const [page, setPage] = useState(isAdmin ? "adminLogin" : "website");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    const h = () => {
      if (window.location.hash === "#/admin") setPage(isLoggedIn ? "adminDash" : "adminLogin");
      else setPage("website");
    };
    window.addEventListener("hashchange", h);
    return () => window.removeEventListener("hashchange", h);
  }, [isLoggedIn]);

  const nav = (p) => { setPage(p); window.scrollTo(0, 0); };
  const articleClick = (a) => { setSelectedArticle(a); setPage("articleView"); window.scrollTo(0, 0); };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        body{background:#06080a;-webkit-font-smoothing:antialiased}
        ::-webkit-scrollbar{width:4px;background:#040608}
        ::-webkit-scrollbar-thumb{background:#1a2028;border-radius:4px}
      `}</style>
      {page === "website" && <MainWebsite onNav={nav} onArticleClick={articleClick} />}
      {page === "articles" && <ArticlesPage onNav={nav} onArticleClick={articleClick} />}
      {page === "articleView" && selectedArticle && <ArticleView article={selectedArticle} onBack={() => { setPage("articles"); window.scrollTo(0, 0); }} onNav={nav} />}
      {page === "about" && <AboutUs onBack={() => nav("website")} />}
      {page === "privacy" && <PrivacyPolicy onBack={() => nav("website")} />}
      {page === "contact" && <ContactUs onBack={() => nav("website")} />}
      {page === "adminLogin" && <AdminLoginPage onSuccess={() => { setIsLoggedIn(true); setPage("adminDash"); }} />}
      {page === "adminDash" && isLoggedIn && <AdminDashboard onLogout={() => { setIsLoggedIn(false); setPage("adminLogin"); }} />}
    </>
  );
}
