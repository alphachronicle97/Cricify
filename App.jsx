import { useState, useEffect, useCallback } from "react";

const SUPABASE_URL = "https://rnmiuggvwvluzpqicjqn.supabase.co";
const SUPABASE_KEY = "sb_publishable_VzshP4nH__Mk5BEplgO5VQ_QiIgnUt8";
const ADMIN_PASSWORD = "*kanishka@#&23122010*";

const C = {
  accent: "#e8380d", accentBright: "#ff5722",
  accentGlow: "rgba(232,56,13,0.2)", accentSoft: "rgba(232,56,13,0.1)",
  accentBorder: "rgba(232,56,13,0.25)", bg: "#080604",
  bgCard: "#0f0a08", bgCard2: "#141008", bgSection: "#0c0906",
  border: "#1e1008", borderMid: "#2a1a0c", borderLight: "#3a2010",
  textPrimary: "#f5ede8", textSecondary: "#b89080", textMuted: "#6b4535",
  gradient: "linear-gradient(135deg, #e8380d, #ff6b35)",
  gradientDark: "linear-gradient(135deg, #1a0806, #0f0604)",
  white: "#ffffff", success: "#22c55e", blue: "#3b82f6",
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
      style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: `1px solid ${C.borderLight}`, borderRadius: "8px", padding: "10px 14px", color: C.textPrimary, fontSize: "13px", outline: "none", fontFamily: "inherit" }} />
  </div>
);

const Textarea = ({ label, value, onChange, placeholder, rows = 4 }) => (
  <div style={{ marginBottom: "14px" }}>
    {label && <div style={{ color: C.textSecondary, fontSize: "11px", marginBottom: "5px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px" }}>{label}</div>}
    <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows}
      style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: `1px solid ${C.borderLight}`, borderRadius: "8px", padding: "10px 14px", color: C.textPrimary, fontSize: "13px", outline: "none", fontFamily: "inherit", resize: "vertical" }} />
  </div>
);

// ─── FOOTER ───────────────────────────────────────────────────────────
const Footer = ({ onNav }) => (
  <footer style={{ background: "#050302", borderTop: `1px solid ${C.borderMid}`, padding: "50px 20px 30px", marginTop: "60px" }}>
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "40px", marginBottom: "40px" }}>
        <div>
          <div style={{ background: C.gradient, borderRadius: "10px", padding: "6px 14px", fontFamily: "'Bebas Neue', cursive", fontSize: "22px", color: "#fff", letterSpacing: "3px", display: "inline-block", marginBottom: "16px" }}>🏏 CRICIFY</div>
          <p style={{ color: C.textMuted, fontSize: "13px", lineHeight: "1.8", maxWidth: "280px" }}>India's premier cricket streaming and news platform. Live scores, match updates, and breaking cricket news — all in one place.</p>
        </div>
        <div>
          <div style={{ color: C.textPrimary, fontWeight: "700", fontSize: "13px", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "1px" }}>Quick Links</div>
          {["Matches", "Articles", "Live Scores", "Schedule"].map(item => (
            <div key={item} style={{ color: C.textMuted, fontSize: "13px", marginBottom: "10px", cursor: "pointer" }}
              onMouseEnter={e => e.target.style.color = C.accentBright} onMouseLeave={e => e.target.style.color = C.textMuted}>{item}</div>
          ))}
        </div>
        <div>
          <div style={{ color: C.textPrimary, fontWeight: "700", fontSize: "13px", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "1px" }}>Company</div>
          {[["About Us", "about"], ["Contact Us", "contact"], ["Privacy Policy", "privacy"]].map(([label, page]) => (
            <div key={page} onClick={() => onNav(page)} style={{ color: C.textMuted, fontSize: "13px", marginBottom: "10px", cursor: "pointer" }}
              onMouseEnter={e => e.target.style.color = C.accentBright} onMouseLeave={e => e.target.style.color = C.textMuted}>{label}</div>
          ))}
        </div>
        <div>
          <div style={{ color: C.textPrimary, fontWeight: "700", fontSize: "13px", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "1px" }}>Follow Us</div>
          {["Twitter / X", "Instagram", "YouTube", "Telegram"].map(item => (
            <div key={item} style={{ color: C.textMuted, fontSize: "13px", marginBottom: "10px", cursor: "pointer" }}
              onMouseEnter={e => e.target.style.color = C.accentBright} onMouseLeave={e => e.target.style.color = C.textMuted}>{item}</div>
          ))}
        </div>
      </div>
      <div style={{ borderTop: `1px solid ${C.borderMid}`, paddingTop: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
        <div style={{ color: C.textMuted, fontSize: "12px" }}>© 2024 Cricify. All Rights Reserved.</div>
        <div style={{ display: "flex", gap: "20px" }}>
          {[["Privacy Policy", "privacy"], ["About Us", "about"], ["Contact Us", "contact"]].map(([label, page]) => (
            <span key={page} onClick={() => onNav(page)} style={{ color: C.textMuted, fontSize: "12px", cursor: "pointer" }}
              onMouseEnter={e => e.target.style.color = C.accentBright} onMouseLeave={e => e.target.style.color = C.textMuted}>{label}</span>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

// ─── PRIVACY POLICY ───────────────────────────────────────────────────
const PrivacyPolicy = ({ onBack }) => (
  <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Segoe UI', sans-serif", color: C.textPrimary }}>
    <header style={{ background: C.gradientDark, borderBottom: `1px solid ${C.borderMid}`, padding: "0 20px", height: "65px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div onClick={onBack} style={{ background: C.gradient, borderRadius: "10px", padding: "6px 14px", fontFamily: "'Bebas Neue', cursive", fontSize: "22px", color: "#fff", letterSpacing: "3px", cursor: "pointer" }}>🏏 CRICIFY</div>
      <button onClick={onBack} style={{ background: C.accentSoft, border: `1px solid ${C.accentBorder}`, color: C.accentBright, borderRadius: "8px", padding: "8px 18px", cursor: "pointer", fontSize: "13px", fontWeight: "600" }}>← Back</button>
    </header>
    <div style={{ maxWidth: "860px", margin: "0 auto", padding: "50px 20px" }}>
      <div style={{ marginBottom: "40px" }}>
        <div style={{ color: C.accentBright, fontSize: "12px", fontWeight: "700", letterSpacing: "2px", marginBottom: "10px" }}>LEGAL</div>
        <h1 style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "48px", color: C.textPrimary, letterSpacing: "2px", marginBottom: "10px" }}>Privacy Policy</h1>
        <p style={{ color: C.textMuted, fontSize: "14px" }}>Last updated: March 2024</p>
      </div>
      {[
        { title: "Information We Collect", text: "Cricify does not collect any personal information from its users. We do not require registration or login to use our services. We may collect anonymous usage data such as page views and browser type to improve our service." },
        { title: "Cookies & Tracking", text: "We may use cookies to enhance your browsing experience. These cookies do not store any personally identifiable information. You can choose to disable cookies through your browser settings at any time." },
        { title: "Third Party Advertising", text: "We use Google AdSense to display advertisements on our website. Google may use cookies to serve ads based on your prior visits to our website or other websites. You may opt out of personalized advertising by visiting Google's Ads Settings." },
        { title: "Third Party Services", text: "Cricify uses third-party services including Google Analytics for website analytics. These services may collect data as per their own privacy policies, which we encourage you to review." },
        { title: "Data Security", text: "We take reasonable measures to protect any information collected. However, no internet transmission is completely secure. We cannot guarantee absolute security of any data transmitted through our platform." },
        { title: "Children's Privacy", text: "Our services are not directed to children under the age of 13. We do not knowingly collect personal information from children under 13." },
        { title: "Changes to This Policy", text: "We may update this Privacy Policy from time to time. We will notify users of any significant changes by posting the new policy on this page with an updated date." },
        { title: "Contact Us", text: "If you have any questions about this Privacy Policy or our data practices, please contact us at: support@cricify.com" },
      ].map(s => (
        <div key={s.title} style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "14px", padding: "24px", marginBottom: "16px" }}>
          <h2 style={{ color: C.accentBright, fontSize: "16px", fontWeight: "700", marginBottom: "10px" }}>{s.title}</h2>
          <p style={{ color: C.textSecondary, fontSize: "14px", lineHeight: "1.8" }}>{s.text}</p>
        </div>
      ))}
    </div>
    <Footer onNav={() => {}} />
  </div>
);

// ─── ABOUT US ─────────────────────────────────────────────────────────
const AboutUs = ({ onBack }) => (
  <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Segoe UI', sans-serif", color: C.textPrimary }}>
    <header style={{ background: C.gradientDark, borderBottom: `1px solid ${C.borderMid}`, padding: "0 20px", height: "65px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div onClick={onBack} style={{ background: C.gradient, borderRadius: "10px", padding: "6px 14px", fontFamily: "'Bebas Neue', cursive", fontSize: "22px", color: "#fff", letterSpacing: "3px", cursor: "pointer" }}>🏏 CRICIFY</div>
      <button onClick={onBack} style={{ background: C.accentSoft, border: `1px solid ${C.accentBorder}`, color: C.accentBright, borderRadius: "8px", padding: "8px 18px", cursor: "pointer", fontSize: "13px", fontWeight: "600" }}>← Back</button>
    </header>
    <div style={{ background: C.gradient, padding: "60px 20px", textAlign: "center" }}>
      <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "56px", color: "#fff", letterSpacing: "3px", marginBottom: "12px" }}>ABOUT CRICIFY</div>
      <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "16px", maxWidth: "600px", margin: "0 auto" }}>India's fastest growing cricket streaming & scores platform</p>
    </div>
    <div style={{ maxWidth: "860px", margin: "0 auto", padding: "50px 20px" }}>
      <div style={{ background: C.bgCard, border: `1px solid ${C.borderMid}`, borderRadius: "16px", padding: "32px", marginBottom: "24px" }}>
        <p style={{ color: C.textSecondary, fontSize: "15px", lineHeight: "2" }}>
          <strong style={{ color: C.accentBright }}>Cricify</strong> was founded with a single mission — to bring every cricket fan closer to the game they love. We provide live scores, match streaming, breaking news, and in-depth cricket analysis, all completely free.
        </p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
        {[
          { icon: "🏏", title: "Live Scores", text: "Real-time ball-by-ball scores from IPL, ICC, Test matches and all major tournaments worldwide." },
          { icon: "📺", title: "Live Streams", text: "Watch live cricket streams directly on our platform with the best quality available." },
          { icon: "📰", title: "Cricket News", text: "Breaking news, player updates, team announcements, match previews and expert analysis." },
          { icon: "✍️", title: "In-depth Articles", text: "Expert cricket articles, match reviews, player profiles and historical records." },
        ].map(item => (
          <div key={item.title} style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "14px", padding: "24px" }}>
            <div style={{ fontSize: "36px", marginBottom: "12px" }}>{item.icon}</div>
            <h3 style={{ color: C.accentBright, fontWeight: "700", fontSize: "16px", marginBottom: "8px" }}>{item.title}</h3>
            <p style={{ color: C.textSecondary, fontSize: "13px", lineHeight: "1.7" }}>{item.text}</p>
          </div>
        ))}
      </div>
    </div>
    <Footer onNav={() => {}} />
  </div>
);

// ─── CONTACT US ───────────────────────────────────────────────────────
const ContactUs = ({ onBack }) => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", msg: "" });
  const [sent, setSent] = useState(false);
  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Segoe UI', sans-serif", color: C.textPrimary }}>
      <header style={{ background: C.gradientDark, borderBottom: `1px solid ${C.borderMid}`, padding: "0 20px", height: "65px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div onClick={onBack} style={{ background: C.gradient, borderRadius: "10px", padding: "6px 14px", fontFamily: "'Bebas Neue', cursive", fontSize: "22px", color: "#fff", letterSpacing: "3px", cursor: "pointer" }}>🏏 CRICIFY</div>
        <button onClick={onBack} style={{ background: C.accentSoft, border: `1px solid ${C.accentBorder}`, color: C.accentBright, borderRadius: "8px", padding: "8px 18px", cursor: "pointer", fontSize: "13px", fontWeight: "600" }}>← Back</button>
      </header>
      <div style={{ maxWidth: "700px", margin: "0 auto", padding: "50px 20px" }}>
        <div style={{ marginBottom: "40px" }}>
          <div style={{ color: C.accentBright, fontSize: "12px", fontWeight: "700", letterSpacing: "2px", marginBottom: "10px" }}>GET IN TOUCH</div>
          <h1 style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "48px", color: C.textPrimary, letterSpacing: "2px" }}>Contact Us</h1>
        </div>
        {sent ? (
          <div style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.25)", borderRadius: "16px", padding: "50px", textAlign: "center" }}>
            <div style={{ fontSize: "56px", marginBottom: "16px" }}>✅</div>
            <div style={{ color: C.success, fontSize: "20px", fontWeight: "700", marginBottom: "8px" }}>Message Sent Successfully!</div>
            <div style={{ color: C.textMuted, fontSize: "14px", marginBottom: "24px" }}>We'll get back to you within 24 hours.</div>
            <button onClick={() => setSent(false)} style={{ background: C.gradient, border: "none", color: "#fff", borderRadius: "10px", padding: "12px 28px", cursor: "pointer", fontWeight: "700" }}>Send Another</button>
          </div>
        ) : (
          <div style={{ background: C.bgCard, border: `1px solid ${C.borderMid}`, borderRadius: "16px", padding: "32px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
              <Input label="Full Name" value={form.name} onChange={v => setForm({ ...form, name: v })} placeholder="Rahul Kumar" />
              <Input label="Email Address" value={form.email} onChange={v => setForm({ ...form, email: v })} placeholder="rahul@gmail.com" type="email" />
            </div>
            <Input label="Subject" value={form.subject} onChange={v => setForm({ ...form, subject: v })} placeholder="Your subject..." />
            <Textarea label="Message" value={form.msg} onChange={v => setForm({ ...form, msg: v })} placeholder="Write your message here..." rows={5} />
            <button onClick={() => { if (form.name && form.email && form.msg) setSent(true); }} style={{ width: "100%", background: C.gradient, border: "none", color: "#fff", borderRadius: "10px", padding: "14px", cursor: "pointer", fontWeight: "800", fontSize: "15px" }}>Send Message →</button>
            <div style={{ marginTop: "20px", padding: "16px", background: C.accentSoft, borderRadius: "10px", border: `1px solid ${C.accentBorder}`, display: "flex", gap: "20px", flexWrap: "wrap" }}>
              <div style={{ color: C.textMuted, fontSize: "13px" }}>📧 <span style={{ color: C.textSecondary }}>support@cricify.com</span></div>
              <div style={{ color: C.textMuted, fontSize: "13px" }}>🌐 <span style={{ color: C.textSecondary }}>cricify-tau.vercel.app</span></div>
            </div>
          </div>
        )}
      </div>
      <Footer onNav={() => {}} />
    </div>
  );
};

// ─── ARTICLE VIEW ─────────────────────────────────────────────────────
const ArticleView = ({ article, onBack, onNav }) => (
  <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Segoe UI', sans-serif", color: C.textPrimary }}>
    <header style={{ background: C.gradientDark, borderBottom: `1px solid ${C.borderMid}`, padding: "0 20px", height: "65px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 }}>
      <div onClick={() => onNav("website")} style={{ background: C.gradient, borderRadius: "10px", padding: "6px 14px", fontFamily: "'Bebas Neue', cursive", fontSize: "22px", color: "#fff", letterSpacing: "3px", cursor: "pointer" }}>🏏 CRICIFY</div>
      <button onClick={onBack} style={{ background: C.accentSoft, border: `1px solid ${C.accentBorder}`, color: C.accentBright, borderRadius: "8px", padding: "8px 18px", cursor: "pointer", fontSize: "13px", fontWeight: "600" }}>← Back to Articles</button>
    </header>
    <div style={{ maxWidth: "860px", margin: "0 auto", padding: "50px 20px" }}>
      <div style={{ marginBottom: "32px" }}>
        <span style={{ background: C.accentSoft, border: `1px solid ${C.accentBorder}`, color: C.accentBright, fontSize: "11px", fontWeight: "700", padding: "4px 12px", borderRadius: "20px", letterSpacing: "1px" }}>{article.category}</span>
        <h1 style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "44px", color: C.textPrimary, lineHeight: "1.15", marginTop: "16px", marginBottom: "16px", letterSpacing: "1px" }}>{article.title}</h1>
        <div style={{ display: "flex", gap: "20px", alignItems: "center", color: C.textMuted, fontSize: "13px" }}>
          <span>✍️ {article.author}</span>
          <span>📅 {new Date(article.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</span>
        </div>
      </div>
      {article.image_url && <div style={{ width: "100%", height: "380px", background: `linear-gradient(135deg,${C.bgCard},${C.bgCard2})`, borderRadius: "16px", marginBottom: "32px", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${C.border}` }}><img src={article.image_url} alt={article.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => { e.target.style.display = "none"; }} /></div>}
      <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "16px", padding: "36px" }}>
        {article.content.split("\n").map((para, i) => para.trim() && <p key={i} style={{ color: C.textSecondary, fontSize: "15px", lineHeight: "2", marginBottom: "18px" }}>{para}</p>)}
      </div>
    </div>
    <Footer onNav={onNav} />
  </div>
);

// ─── ARTICLES PAGE ────────────────────────────────────────────────────
const ArticlesPage = ({ onNav, onArticleClick }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const categories = ["All", "IPL", "Test Cricket", "T20", "ODI", "Player News", "Cricket"];

  useEffect(() => {
    dbGet("articles").then(data => { if (data) setArticles(data); setLoading(false); });
  }, []);

  const filtered = articles.filter(a =>
    (activeCategory === "All" || a.category === activeCategory) &&
    (!search || a.title.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Segoe UI', sans-serif", color: C.textPrimary }}>
      <div style={{ background: C.gradient, padding: "50px 20px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "14px", letterSpacing: "3px", color: "rgba(255,255,255,0.7)", marginBottom: "10px" }}>CRICIFY EDITORIAL</div>
          <h1 style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "52px", color: "#fff", letterSpacing: "2px", marginBottom: "20px" }}>CRICKET ARTICLES</h1>
          <div style={{ position: "relative", maxWidth: "500px" }}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search articles..."
              style={{ width: "100%", background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: "25px", padding: "12px 20px 12px 44px", color: "#fff", fontSize: "14px", outline: "none" }} />
            <span style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)" }}>🔍</span>
          </div>
        </div>
      </div>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "30px 20px" }}>
        <div style={{ display: "flex", gap: "8px", marginBottom: "30px", flexWrap: "wrap" }}>
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} style={{ padding: "8px 18px", border: `1px solid ${activeCategory === cat ? C.accentBorder : C.borderMid}`, borderRadius: "25px", cursor: "pointer", fontSize: "13px", fontWeight: "600", background: activeCategory === cat ? C.accentSoft : "transparent", color: activeCategory === cat ? C.accentBright : C.textMuted }}>
              {cat}
            </button>
          ))}
        </div>
        {loading ? <div style={{ textAlign: "center", padding: "80px", color: C.accentBright }}>⏳ Loading articles...</div>
          : filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px", color: C.textMuted }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>📝</div>
              <div style={{ fontSize: "18px" }}>No articles found</div>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
              {filtered.map(article => (
                <div key={article.id} onClick={() => onArticleClick(article)}
                  style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "14px", overflow: "hidden", cursor: "pointer", transition: "all 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = C.accentBorder; e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = `0 12px 40px ${C.accentGlow}`; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
                  <div style={{ height: "180px", background: C.gradient, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "48px" }}>🏏</div>
                  <div style={{ padding: "20px" }}>
                    <span style={{ background: C.accentSoft, border: `1px solid ${C.accentBorder}`, color: C.accentBright, fontSize: "10px", fontWeight: "700", padding: "3px 10px", borderRadius: "20px", letterSpacing: "1px" }}>{article.category}</span>
                    <h3 style={{ color: C.textPrimary, fontSize: "15px", fontWeight: "700", lineHeight: "1.4", margin: "12px 0 10px" }}>{article.title}</h3>
                    <p style={{ color: C.textMuted, fontSize: "12px", lineHeight: "1.6", marginBottom: "14px" }}>{article.content.substring(0, 100)}...</p>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ color: C.textMuted, fontSize: "11px" }}>✍️ {article.author}</span>
                      <span style={{ color: C.accentBright, fontSize: "12px", fontWeight: "600" }}>Read More →</span>
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

// ─── STREAM PLAYER ────────────────────────────────────────────────────
const StreamPlayer = ({ match, onClose }) => {
  const [volume, setVolume] = useState(80);
  const [quality, setQuality] = useState("HD");
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.97)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div style={{ width: "100%", maxWidth: "960px", background: C.bgCard, borderRadius: "20px", overflow: "hidden", border: `1px solid ${C.borderMid}`, boxShadow: `0 0 100px ${C.accentGlow}` }}>
        <div style={{ background: C.gradientDark, padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${C.borderMid}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div style={{ background: C.gradient, color: "#fff", padding: "4px 12px", borderRadius: "20px", fontSize: "11px", fontWeight: "800", letterSpacing: "1px" }}>● LIVE</div>
            <span style={{ color: C.textPrimary, fontWeight: "700", fontSize: "16px", fontFamily: "'Bebas Neue', cursive", letterSpacing: "1px" }}>{match.flag1} {match.team1} vs {match.team2} {match.flag2}</span>
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,80,80,0.15)", border: "1px solid rgba(255,80,80,0.3)", color: "#ff5252", borderRadius: "8px", padding: "7px 16px", cursor: "pointer", fontWeight: "600" }}>✕ Close</button>
        </div>
        <div style={{ width: "100%", aspectRatio: "16/9", background: "#020100", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {match.stream_url ? <iframe src={match.stream_url} style={{ width: "100%", height: "100%", border: "none", position: "absolute", inset: 0 }} allowFullScreen title="stream" />
            : <div style={{ textAlign: "center" }}><div style={{ fontSize: "64px", marginBottom: "16px" }}>📺</div><div style={{ color: C.accentBright, fontSize: "22px", fontWeight: "800", fontFamily: "'Bebas Neue', cursive", letterSpacing: "2px" }}>STREAM COMING SOON</div></div>}
          <div style={{ position: "absolute", top: "20px", left: "20px", background: "rgba(0,0,0,0.9)", borderRadius: "12px", padding: "12px 20px", border: `1px solid ${C.accentBorder}`, zIndex: 10, backdropFilter: "blur(10px)" }}>
            <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
              <div style={{ textAlign: "center" }}><div style={{ color: "#888", fontSize: "10px", marginBottom: "2px" }}>{match.team1}</div><div style={{ color: "#fff", fontSize: "20px", fontWeight: "800", fontFamily: "'Bebas Neue', cursive" }}>{match.score1}</div></div>
              <div style={{ color: C.accentBright, fontWeight: "900", fontSize: "14px" }}>VS</div>
              <div style={{ textAlign: "center" }}><div style={{ color: "#888", fontSize: "10px", marginBottom: "2px" }}>{match.team2}</div><div style={{ color: "#fff", fontSize: "20px", fontWeight: "800", fontFamily: "'Bebas Neue', cursive" }}>{match.score2}</div></div>
            </div>
          </div>
        </div>
        <div style={{ padding: "16px 24px", background: C.bgSection, display: "flex", alignItems: "center", gap: "20px", borderTop: `1px solid ${C.borderMid}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span>🔊</span>
            <input type="range" min="0" max="100" value={volume} onChange={e => setVolume(e.target.value)} style={{ accentColor: C.accent, width: "120px" }} />
            <span style={{ color: C.textMuted, fontSize: "12px", minWidth: "35px" }}>{volume}%</span>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            {["480p", "720p", "HD", "4K"].map(q => <button key={q} onClick={() => setQuality(q)} style={{ background: quality === q ? C.gradient : C.accentSoft, color: quality === q ? "#fff" : C.accentBright, border: `1px solid ${C.accentBorder}`, borderRadius: "6px", padding: "5px 12px", fontSize: "11px", cursor: "pointer", fontWeight: "600" }}>{q}</button>)}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── ADMIN DASHBOARD ──────────────────────────────────────────────────
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

  const blankMatch = { team1: "", team2: "", flag1: "🏏", flag2: "🏏", score1: "—", score2: "—", overs1: "—", overs2: "—", status: "LIVE", type: "T20 • IPL 2026", venue: "", stream: false, stream_url: "", result: "" };
  const blankNews = { title: "", tag: "IPL", time: "Just now", hot: false };
  const blankArticle = { title: "", content: "", category: "Cricket", author: "Cricify Staff", image_url: "" };

  const saveMatch = async () => { if (!editMatch.team1 || !editMatch.team2) { showToast("❌ Team names required!"); return; } setSaving(true); if (editMatch.id) await dbUpdate("matches", editMatch.id, editMatch); else await dbInsert("matches", editMatch); await loadData(); setEditMatch(null); setSaving(false); showToast("✅ Match saved!"); };
  const deleteMatch = async (id) => { if (!window.confirm("Delete?")) return; await dbDelete("matches", id); await loadData(); showToast("🗑 Deleted!"); };
  const saveNews = async () => { if (!editNews.title) { showToast("❌ Headline required!"); return; } setSaving(true); if (editNews.id) await dbUpdate("news", editNews.id, editNews); else await dbInsert("news", editNews); await loadData(); setEditNews(null); setSaving(false); showToast("✅ Saved!"); };
  const deleteNews = async (id) => { if (!window.confirm("Delete?")) return; await dbDelete("news", id); await loadData(); showToast("🗑 Deleted!"); };
  const saveArticle = async () => { if (!editArticle.title || !editArticle.content) { showToast("❌ Title & content required!"); return; } setSaving(true); if (editArticle.id) await dbUpdate("articles", editArticle.id, editArticle); else await dbInsert("articles", editArticle); await loadData(); setEditArticle(null); setSaving(false); showToast("✅ Article published!"); };
  const deleteArticle = async (id) => { if (!window.confirm("Delete?")) return; await dbDelete("articles", id); await loadData(); showToast("🗑 Deleted!"); };
  const addTicker = async () => { if (!newTicker.trim()) return; await dbInsert("ticker", { text: newTicker.trim() }); setNewTicker(""); await loadData(); showToast("✅ Added!"); };
  const deleteTicker = async (id) => { await dbDelete("ticker", id); await loadData(); };

  const tabStyle = (key) => ({ padding: "10px 20px", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: "700", background: tab === key ? C.gradient : "rgba(255,255,255,0.04)", color: tab === key ? "#fff" : "#666", transition: "all 0.2s" });

  return (
    <div style={{ minHeight: "100vh", background: "#060402", fontFamily: "'Segoe UI', sans-serif", color: "#fff" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap'); *{box-sizing:border-box;margin:0;padding:0} @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>
      {toast && <div style={{ position: "fixed", top: "20px", right: "20px", background: "#0d1a0d", border: "1px solid #2a5a2a", color: "#4caf50", borderRadius: "10px", padding: "12px 20px", zIndex: 9999, fontSize: "14px", fontWeight: "600", boxShadow: "0 4px 20px rgba(0,0,0,0.5)" }}>{toast}</div>}
      <header style={{ background: "linear-gradient(135deg,#140806,#0a0402)", borderBottom: `1px solid ${C.borderMid}`, padding: "0 30px", height: "65px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{ background: C.gradient, borderRadius: "10px", padding: "5px 14px", fontFamily: "'Bebas Neue', cursive", fontSize: "20px", color: "#fff", letterSpacing: "3px" }}>🏏 CRICIFY</div>
          <div style={{ background: C.accentSoft, border: `1px solid ${C.accentBorder}`, color: C.accentBright, fontSize: "11px", fontWeight: "700", padding: "4px 12px", borderRadius: "20px", letterSpacing: "1px" }}>⚙️ ADMIN PANEL</div>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <button onClick={loadData} style={{ background: C.accentSoft, border: `1px solid ${C.accentBorder}`, color: C.accentBright, borderRadius: "8px", padding: "8px 16px", cursor: "pointer", fontWeight: "600" }}>🔄 Refresh</button>
          <button onClick={onLogout} style={{ background: "rgba(255,80,80,0.12)", border: "1px solid rgba(255,80,80,0.3)", color: "#ff5252", borderRadius: "8px", padding: "8px 16px", cursor: "pointer", fontWeight: "600" }}>🔒 Logout</button>
        </div>
      </header>
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "32px 20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "16px", marginBottom: "32px" }}>
          {[{ label: "Matches", value: matches.length, icon: "🏏" }, { label: "News Items", value: news.length, icon: "📰" }, { label: "Articles", value: articles.length, icon: "✍️" }, { label: "Ticker Lines", value: ticker.length, icon: "📢" }].map(s => (
            <div key={s.label} style={{ background: "linear-gradient(135deg,#140806,#0a0402)", border: `1px solid ${C.borderMid}`, borderRadius: "14px", padding: "20px", display: "flex", alignItems: "center", gap: "16px" }}>
              <div style={{ fontSize: "30px" }}>{s.icon}</div>
              <div><div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "34px", color: C.accent, lineHeight: 1 }}>{s.value}</div><div style={{ color: "#444", fontSize: "12px" }}>{s.label}</div></div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
          <button style={tabStyle("matches")} onClick={() => setTab("matches")}>🏏 Matches</button>
          <button style={tabStyle("news")} onClick={() => setTab("news")}>📰 News</button>
          <button style={tabStyle("articles")} onClick={() => setTab("articles")}>✍️ Articles</button>
          <button style={tabStyle("ticker")} onClick={() => setTab("ticker")}>📢 Ticker</button>
        </div>
        {loading ? <div style={{ textAlign: "center", padding: "80px", color: C.accentBright }}>⏳ Loading...</div> : (
          <>
            {tab === "matches" && (
              <div style={{ animation: "fadeIn 0.3s ease" }}>
                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "16px" }}>
                  <button onClick={() => setEditMatch({ ...blankMatch })} style={{ background: C.gradient, border: "none", color: "#fff", borderRadius: "8px", padding: "10px 22px", cursor: "pointer", fontWeight: "700" }}>+ Add Match</button>
                </div>
                {matches.length === 0 && !editMatch && <div style={{ textAlign: "center", padding: "50px", color: "#333" }}>No matches yet</div>}
                {matches.map(m => (
                  <div key={m.id} style={{ background: "linear-gradient(135deg,#140806,#0a0402)", border: `1px solid ${C.border}`, borderRadius: "12px", padding: "16px 20px", marginBottom: "10px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ color: "#fff", fontWeight: "700", fontSize: "15px", marginBottom: "4px" }}>{m.flag1} {m.team1} vs {m.team2} {m.flag2}</div>
                      <div style={{ color: "#555", fontSize: "12px" }}>{m.status} • {m.type} {m.stream && "• 📺 Stream ON"}</div>
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button onClick={() => setEditMatch({ ...m })} style={{ background: "rgba(255,165,0,0.12)", border: "1px solid rgba(255,165,0,0.3)", color: "#ffa500", borderRadius: "7px", padding: "7px 16px", cursor: "pointer", fontSize: "12px" }}>✏️ Edit</button>
                      <button onClick={() => deleteMatch(m.id)} style={{ background: "rgba(255,80,80,0.1)", border: "1px solid rgba(255,80,80,0.3)", color: "#ff5252", borderRadius: "7px", padding: "7px 14px", cursor: "pointer" }}>🗑</button>
                    </div>
                  </div>
                ))}
                {editMatch && (
                  <div style={{ background: "#0a0410", border: `2px solid ${C.accentBorder}`, borderRadius: "16px", padding: "28px", marginTop: "16px" }}>
                    <div style={{ color: C.accentBright, fontWeight: "800", fontSize: "16px", marginBottom: "22px" }}>{editMatch.id ? "✏️ Edit Match" : "➕ New Match"}</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
                      <Input label="Team 1" value={editMatch.team1} onChange={v => setEditMatch({ ...editMatch, team1: v })} placeholder="India" />
                      <Input label="Team 2" value={editMatch.team2} onChange={v => setEditMatch({ ...editMatch, team2: v })} placeholder="Australia" />
                      <Input label="Flag 1" value={editMatch.flag1} onChange={v => setEditMatch({ ...editMatch, flag1: v })} placeholder="🇮🇳" />
                      <Input label="Flag 2" value={editMatch.flag2} onChange={v => setEditMatch({ ...editMatch, flag2: v })} placeholder="🇦🇺" />
                      <Input label="Score 1" value={editMatch.score1} onChange={v => setEditMatch({ ...editMatch, score1: v })} placeholder="287/4" />
                      <Input label="Score 2" value={editMatch.score2} onChange={v => setEditMatch({ ...editMatch, score2: v })} placeholder="243/8" />
                      <Input label="Overs 1" value={editMatch.overs1} onChange={v => setEditMatch({ ...editMatch, overs1: v })} placeholder="45.2" />
                      <Input label="Overs 2" value={editMatch.overs2} onChange={v => setEditMatch({ ...editMatch, overs2: v })} placeholder="50.0" />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
                      <div style={{ marginBottom: "14px" }}>
                        <div style={{ color: C.textSecondary, fontSize: "11px", marginBottom: "5px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px" }}>Status</div>
                        <select value={editMatch.status} onChange={e => setEditMatch({ ...editMatch, status: e.target.value })} style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: `1px solid ${C.borderLight}`, borderRadius: "8px", padding: "10px 14px", color: "#fff", fontSize: "13px", outline: "none" }}>
                          <option value="LIVE">🔴 LIVE</option>
                          <option value="STARTING SOON">⏳ STARTING SOON</option>
                          <option value="TODAY 3:00 PM">📅 TODAY 3:00 PM</option>
                          <option value="TODAY 7:30 PM">📅 TODAY 7:30 PM</option>
                          <option value="TODAY 9:00 PM">📅 TODAY 9:00 PM</option>
                          <option value="TOMORROW 3:00 PM">📅 TOMORROW 3:00 PM</option>
                          <option value="TOMORROW 7:30 PM">📅 TOMORROW 7:30 PM</option>
                          <option value="TOMORROW 9:00 PM">📅 TOMORROW 9:00 PM</option>
                          <option value="COMPLETED">✅ COMPLETED</option>
                        </select>
                      </div>
                      <Input label="Match Type" value={editMatch.type} onChange={v => setEditMatch({ ...editMatch, type: v })} placeholder="T20 • IPL 2026" />
                    </div>
                    <Input label="Venue" value={editMatch.venue} onChange={v => setEditMatch({ ...editMatch, venue: v })} placeholder="Wankhede Stadium, Mumbai" />
                    <Input label="Result" value={editMatch.result || ""} onChange={v => setEditMatch({ ...editMatch, result: v })} placeholder="India won by 50 runs" />
                    <div style={{ background: C.accentSoft, border: `1px solid ${C.accentBorder}`, borderRadius: "10px", padding: "16px", marginBottom: "16px" }}>
                      <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", color: "#ccc", fontSize: "14px" }}>
                        <input type="checkbox" checked={editMatch.stream} onChange={e => setEditMatch({ ...editMatch, stream: e.target.checked })} style={{ accentColor: C.accent, width: "18px", height: "18px" }} />
                        📺 Enable Live Stream
                      </label>
                      {editMatch.stream && <div style={{ marginTop: "14px" }}><Input label="Stream Embed URL" value={editMatch.stream_url || ""} onChange={v => setEditMatch({ ...editMatch, stream_url: v })} placeholder="https://www.youtube.com/embed/VIDEO_ID" /></div>}
                    </div>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <button onClick={saveMatch} disabled={saving} style={{ background: C.gradient, border: "none", color: "#fff", borderRadius: "10px", padding: "12px 30px", cursor: "pointer", fontWeight: "800" }}>{saving ? "⏳ Saving..." : "✓ Save Match"}</button>
                      <button onClick={() => setEditMatch(null)} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid #333", color: "#666", borderRadius: "10px", padding: "12px 20px", cursor: "pointer" }}>Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            )}
            {tab === "news" && (
              <div style={{ animation: "fadeIn 0.3s ease" }}>
                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "16px" }}>
                  <button onClick={() => setEditNews({ ...blankNews })} style={{ background: C.gradient, border: "none", color: "#fff", borderRadius: "8px", padding: "10px 22px", cursor: "pointer", fontWeight: "700" }}>+ Add News</button>
                </div>
                {news.map(n => (
                  <div key={n.id} style={{ background: "linear-gradient(135deg,#140806,#0a0402)", border: `1px solid ${C.border}`, borderRadius: "12px", padding: "14px 20px", marginBottom: "10px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div><div style={{ color: "#fff", fontWeight: "600", fontSize: "14px" }}>{n.hot ? "🔥 " : ""}{n.title}</div><div style={{ color: "#555", fontSize: "12px" }}>{n.tag} • {n.time}</div></div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button onClick={() => setEditNews({ ...n })} style={{ background: "rgba(255,165,0,0.12)", border: "1px solid rgba(255,165,0,0.3)", color: "#ffa500", borderRadius: "7px", padding: "7px 16px", cursor: "pointer", fontSize: "12px" }}>✏️</button>
                      <button onClick={() => deleteNews(n.id)} style={{ background: "rgba(255,80,80,0.1)", border: "1px solid rgba(255,80,80,0.3)", color: "#ff5252", borderRadius: "7px", padding: "7px 14px", cursor: "pointer" }}>🗑</button>
                    </div>
                  </div>
                ))}
                {editNews && (
                  <div style={{ background: "#0a0410", border: `2px solid ${C.accentBorder}`, borderRadius: "16px", padding: "28px", marginTop: "16px" }}>
                    <div style={{ color: C.accentBright, fontWeight: "800", fontSize: "16px", marginBottom: "22px" }}>{editNews.id ? "✏️ Edit" : "➕ New"} News</div>
                    <Input label="Headline" value={editNews.title} onChange={v => setEditNews({ ...editNews, title: v })} placeholder="News headline..." />
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
                      <Input label="Tag" value={editNews.tag} onChange={v => setEditNews({ ...editNews, tag: v })} placeholder="IPL" />
                      <Input label="Time" value={editNews.time} onChange={v => setEditNews({ ...editNews, time: v })} placeholder="2 min ago" />
                    </div>
                    <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", color: "#ccc", fontSize: "14px", marginBottom: "20px" }}>
                      <input type="checkbox" checked={editNews.hot} onChange={e => setEditNews({ ...editNews, hot: e.target.checked })} style={{ accentColor: C.accent, width: "18px", height: "18px" }} />
                      🔥 Mark as Hot/Trending
                    </label>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <button onClick={saveNews} disabled={saving} style={{ background: C.gradient, border: "none", color: "#fff", borderRadius: "10px", padding: "12px 30px", cursor: "pointer", fontWeight: "800" }}>{saving ? "⏳..." : "✓ Save"}</button>
                      <button onClick={() => setEditNews(null)} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid #333", color: "#666", borderRadius: "10px", padding: "12px 20px", cursor: "pointer" }}>Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            )}
            {tab === "articles" && (
              <div style={{ animation: "fadeIn 0.3s ease" }}>
                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "16px" }}>
                  <button onClick={() => setEditArticle({ ...blankArticle })} style={{ background: C.gradient, border: "none", color: "#fff", borderRadius: "8px", padding: "10px 22px", cursor: "pointer", fontWeight: "700" }}>+ Write Article</button>
                </div>
                {articles.length === 0 && !editArticle && <div style={{ textAlign: "center", padding: "50px", color: "#333" }}>No articles yet — write your first one!</div>}
                {articles.map(a => (
                  <div key={a.id} style={{ background: "linear-gradient(135deg,#140806,#0a0402)", border: `1px solid ${C.border}`, borderRadius: "12px", padding: "16px 20px", marginBottom: "10px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ color: "#fff", fontWeight: "700", fontSize: "14px", marginBottom: "4px" }}>{a.title}</div>
                      <div style={{ color: "#555", fontSize: "12px" }}>{a.category} • {a.author} • {new Date(a.created_at).toLocaleDateString("en-IN")}</div>
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button onClick={() => setEditArticle({ ...a })} style={{ background: "rgba(255,165,0,0.12)", border: "1px solid rgba(255,165,0,0.3)", color: "#ffa500", borderRadius: "7px", padding: "7px 16px", cursor: "pointer", fontSize: "12px" }}>✏️ Edit</button>
                      <button onClick={() => deleteArticle(a.id)} style={{ background: "rgba(255,80,80,0.1)", border: "1px solid rgba(255,80,80,0.3)", color: "#ff5252", borderRadius: "7px", padding: "7px 14px", cursor: "pointer" }}>🗑</button>
                    </div>
                  </div>
                ))}
                {editArticle && (
                  <div style={{ background: "#0a0410", border: `2px solid ${C.accentBorder}`, borderRadius: "16px", padding: "28px", marginTop: "16px" }}>
                    <div style={{ color: C.accentBright, fontWeight: "800", fontSize: "16px", marginBottom: "22px" }}>{editArticle.id ? "✏️ Edit" : "✍️ Write New"} Article</div>
                    <Input label="Article Title" value={editArticle.title} onChange={v => setEditArticle({ ...editArticle, title: v })} placeholder="IPL 2026: Top 5 Players to Watch..." />
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0 20px" }}>
                      <div style={{ marginBottom: "14px" }}>
                        <div style={{ color: C.textSecondary, fontSize: "11px", marginBottom: "5px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px" }}>Category</div>
                        <select value={editArticle.category} onChange={e => setEditArticle({ ...editArticle, category: e.target.value })} style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: `1px solid ${C.borderLight}`, borderRadius: "8px", padding: "10px 14px", color: "#fff", fontSize: "13px", outline: "none" }}>
                          <option>Cricket</option>
                          <option>IPL</option>
                          <option>Test Cricket</option>
                          <option>T20</option>
                          <option>ODI</option>
                          <option>Player News</option>
                        </select>
                      </div>
                      <Input label="Author" value={editArticle.author} onChange={v => setEditArticle({ ...editArticle, author: v })} placeholder="Cricify Staff" />
                      <Input label="Image URL (optional)" value={editArticle.image_url} onChange={v => setEditArticle({ ...editArticle, image_url: v })} placeholder="https://..." />
                    </div>
                    <Textarea label="Article Content (each paragraph = new line)" value={editArticle.content} onChange={v => setEditArticle({ ...editArticle, content: v })} placeholder="Write your article here...&#10;&#10;New paragraph here..." rows={10} />
                    <div style={{ display: "flex", gap: "10px" }}>
                      <button onClick={saveArticle} disabled={saving} style={{ background: C.gradient, border: "none", color: "#fff", borderRadius: "10px", padding: "12px 30px", cursor: "pointer", fontWeight: "800" }}>{saving ? "⏳ Publishing..." : "🚀 Publish Article"}</button>
                      <button onClick={() => setEditArticle(null)} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid #333", color: "#666", borderRadius: "10px", padding: "12px 20px", cursor: "pointer" }}>Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            )}
            {tab === "ticker" && (
              <div style={{ animation: "fadeIn 0.3s ease" }}>
                <div style={{ background: "linear-gradient(135deg,#140806,#0a0402)", border: `1px solid ${C.borderMid}`, borderRadius: "12px", padding: "18px", marginBottom: "16px" }}>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <input value={newTicker} onChange={e => setNewTicker(e.target.value)} onKeyDown={e => e.key === "Enter" && addTicker()} placeholder="🏏 KOHLI 87* (62) — IND vs AUS LIVE"
                      style={{ flex: 1, background: "rgba(255,255,255,0.04)", border: `1px solid ${C.borderLight}`, borderRadius: "8px", padding: "10px 14px", color: "#fff", fontSize: "13px", outline: "none" }} />
                    <button onClick={addTicker} style={{ background: C.gradient, border: "none", color: "#fff", borderRadius: "8px", padding: "10px 22px", cursor: "pointer", fontWeight: "700" }}>+ Add</button>
                  </div>
                </div>
                {ticker.map((t, i) => (
                  <div key={t.id} style={{ background: "linear-gradient(135deg,#140806,#0a0402)", border: `1px solid ${C.border}`, borderRadius: "10px", padding: "14px 18px", marginBottom: "8px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ color: "#ccc", fontSize: "13px" }}>#{i + 1} {t.text}</span>
                    <button onClick={() => deleteTicker(t.id)} style={{ background: "rgba(255,80,80,0.1)", border: "1px solid rgba(255,80,80,0.3)", color: "#ff5252", borderRadius: "6px", padding: "5px 14px", cursor: "pointer" }}>✕</button>
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

// ─── ADMIN LOGIN ──────────────────────────────────────────────────────
const AdminLoginPage = ({ onSuccess }) => {
  const [pass, setPass] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);
  const tryLogin = () => {
    if (pass === ADMIN_PASSWORD) { onSuccess(); }
    else { setError(true); setShake(true); setTimeout(() => setShake(false), 500); setTimeout(() => setError(false), 2500); setPass(""); }
  };
  return (
    <div style={{ minHeight: "100vh", background: "#040201", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Segoe UI', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap'); @keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-10px)}40%,80%{transform:translateX(10px)}} @keyframes fadeIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div style={{ background: "linear-gradient(135deg,#140806,#0a0402)", border: `1px solid ${error ? "rgba(255,50,50,0.4)" : C.accentBorder}`, borderRadius: "24px", padding: "56px 48px", width: "100%", maxWidth: "420px", textAlign: "center", animation: shake ? "shake 0.4s ease" : "fadeIn 0.5s ease", boxShadow: `0 0 100px ${C.accentGlow}` }}>
        <div style={{ background: C.gradient, borderRadius: "12px", padding: "8px 18px", fontFamily: "'Bebas Neue', cursive", fontSize: "28px", color: "#fff", letterSpacing: "3px", display: "inline-block", marginBottom: "30px" }}>🏏 CRICIFY</div>
        <div style={{ fontSize: "52px", marginBottom: "16px" }}>🔐</div>
        <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "26px", color: C.textPrimary, letterSpacing: "2px", marginBottom: "8px" }}>ADMIN ACCESS</div>
        <div style={{ color: C.textMuted, fontSize: "13px", marginBottom: "30px" }}>Authorized personnel only</div>
        <input type="password" value={pass} onChange={e => { setPass(e.target.value); setError(false); }} onKeyDown={e => e.key === "Enter" && tryLogin()} placeholder="Enter password..." autoFocus
          style={{ width: "100%", background: error ? "rgba(255,50,50,0.08)" : "rgba(255,255,255,0.04)", border: `1px solid ${error ? "rgba(255,50,50,0.4)" : C.borderLight}`, borderRadius: "12px", padding: "14px 18px", color: "#fff", fontSize: "16px", outline: "none", textAlign: "center", letterSpacing: "6px", marginBottom: "10px" }} />
        {error && <div style={{ color: "#ff4444", fontSize: "13px", marginBottom: "14px" }}>❌ Incorrect password</div>}
        {!error && <div style={{ height: "32px" }} />}
        <button onClick={tryLogin} style={{ width: "100%", background: C.gradient, border: "none", color: "#fff", borderRadius: "12px", padding: "14px", cursor: "pointer", fontWeight: "800", fontSize: "16px" }}>🔓 LOGIN</button>
      </div>
    </div>
  );
};

// ─── MAIN WEBSITE ─────────────────────────────────────────────────────
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
  const [mobileMenu, setMobileMenu] = useState(false);

  const loadData = useCallback(async () => {
    const [m, n, t, a] = await Promise.all([dbGet("matches", "created_at.asc"), dbGet("news", "created_at.asc"), dbGet("ticker", "created_at.asc"), dbGet("articles")]);
    if (m) setMatches(m); if (n) setNews(n); if (t) setTicker(t); if (a) setArticles(a.slice(0, 6));
    setLoading(false);
  }, []);

  const loadApiData = useCallback(async () => {
    const items = await fetchGoogleNews();
    if (items.length > 0) setApiNews(items);
  }, []);

  useEffect(() => { loadData(); loadApiData(); }, [loadData, loadApiData]);
  useEffect(() => { const i = setInterval(loadData, 30000); return () => clearInterval(i); }, [loadData]);
  useEffect(() => { const i = setInterval(loadApiData, 120000); return () => clearInterval(i); }, [loadApiData]);
  useEffect(() => {
    if (ticker.length === 0) return;
    const t = setInterval(() => setTickerIdx(p => (p + 1) % ticker.length), 3500);
    return () => clearInterval(t);
  }, [ticker]);

  const filteredMatches = matches.filter(m =>
    activeTab === "live" ? m.status === "LIVE" :
      activeTab === "upcoming" ? (m.status?.includes("TODAY") || m.status?.includes("TOMORROW") || m.status?.includes("SOON")) :
        activeTab === "completed" ? m.status === "COMPLETED" : true
  ).filter(m => !searchQuery || m.team1?.toLowerCase().includes(searchQuery.toLowerCase()) || m.team2?.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Segoe UI', sans-serif", color: C.textPrimary }}>
      {selectedMatch && <StreamPlayer match={selectedMatch} onClose={() => setSelectedMatch(null)} />}

      {/* Ticker */}
      {ticker.length > 0 && (
        <div style={{ background: C.gradient, padding: "6px 0", display: "flex", alignItems: "center", overflow: "hidden" }}>
          <div style={{ background: "rgba(0,0,0,0.35)", color: "#fff", padding: "0 18px", fontWeight: "900", fontSize: "11px", whiteSpace: "nowrap", letterSpacing: "1px", borderRight: "1px solid rgba(255,255,255,0.2)" }}>🔴 BREAKING</div>
          <div key={tickerIdx} style={{ color: "#fff", fontWeight: "600", fontSize: "12px", paddingLeft: "20px", animation: "tickerSlide 0.5s ease", whiteSpace: "nowrap" }}>{ticker[tickerIdx]?.text}</div>
        </div>
      )}

      {/* Header */}
      <header style={{ background: "rgba(8,6,4,0.97)", borderBottom: `1px solid ${C.borderMid}`, position: "sticky", top: ticker.length > 0 ? "29px" : 0, zIndex: 100, backdropFilter: "blur(20px)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", height: "65px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ background: C.gradient, borderRadius: "10px", padding: "6px 14px", fontFamily: "'Bebas Neue', cursive", fontSize: "24px", color: "#fff", letterSpacing: "3px" }}>🏏 CRICIFY</div>
            <span style={{ background: C.accentSoft, border: `1px solid ${C.accentBorder}`, color: C.accentBright, fontSize: "9px", fontWeight: "700", padding: "3px 8px", borderRadius: "20px", letterSpacing: "1px" }}>LIVE</span>
          </div>
          <nav style={{ display: "flex", gap: "4px", alignItems: "center" }}>
            {[["Matches", "website"], ["Articles", "articles"]].map(([label, page]) => (
              <button key={page} onClick={() => onNav(page)} style={{ background: "transparent", border: "none", color: C.textSecondary, padding: "8px 16px", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: "600" }}
                onMouseEnter={e => e.target.style.color = C.accentBright} onMouseLeave={e => e.target.style.color = C.textSecondary}>{label}</button>
            ))}
          </nav>
          <div style={{ position: "relative", width: "260px" }}>
            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search matches..."
              style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: `1px solid ${C.borderMid}`, borderRadius: "25px", padding: "8px 16px 8px 36px", color: C.textPrimary, fontSize: "13px", outline: "none" }} />
            <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: C.textMuted, fontSize: "14px" }}>🔍</span>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <div style={{ background: `linear-gradient(135deg, #1a0804 0%, #0d0502 50%, #140806 100%)`, borderBottom: `1px solid ${C.borderMid}`, padding: "40px 20px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ color: C.accentBright, fontSize: "12px", fontWeight: "700", letterSpacing: "2px", marginBottom: "10px" }}>INDIA'S PREMIER CRICKET PLATFORM</div>
            <h1 style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "52px", color: C.textPrimary, letterSpacing: "2px", lineHeight: 1, marginBottom: "12px" }}>LIVE CRICKET<br /><span style={{ background: `${C.gradient}`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>SCORES & STREAMS</span></h1>
            <p style={{ color: C.textMuted, fontSize: "14px", maxWidth: "400px" }}>Real-time scores, live streaming and breaking news from every cricket match worldwide.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            {[
              { label: "Live Matches", value: matches.filter(m => m.status === "LIVE").length, icon: "🔴" },
              { label: "Upcoming", value: matches.filter(m => m.status?.includes("TODAY") || m.status?.includes("TOMORROW")).length, icon: "📅" },
              { label: "Streams", value: matches.filter(m => m.stream).length, icon: "📺" },
              { label: "Articles", value: articles.length, icon: "✍️" },
            ].map(s => (
              <div key={s.label} style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "16px 20px", textAlign: "center", minWidth: "110px" }}>
                <div style={{ fontSize: "22px", marginBottom: "4px" }}>{s.icon}</div>
                <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "28px", color: C.accent, lineHeight: 1 }}>{s.value}</div>
                <div style={{ color: C.textMuted, fontSize: "11px", marginTop: "2px" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "28px 20px", display: "flex", gap: "26px" }}>
        {/* Main Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Match Tabs */}
          <div style={{ display: "flex", gap: "4px", marginBottom: "22px", background: "rgba(255,255,255,0.02)", padding: "5px", borderRadius: "14px", border: `1px solid ${C.borderMid}` }}>
            {[
              { key: "live", label: "🔴 Live", count: matches.filter(m => m.status === "LIVE").length },
              { key: "upcoming", label: "📅 Upcoming", count: matches.filter(m => m.status?.includes("TODAY") || m.status?.includes("TOMORROW") || m.status?.includes("SOON")).length },
              { key: "completed", label: "✅ Completed", count: matches.filter(m => m.status === "COMPLETED").length },
              { key: "all", label: "All Matches", count: matches.length },
            ].map(t => (
              <button key={t.key} onClick={() => setActiveTab(t.key)} style={{ flex: 1, padding: "10px 8px", border: "none", borderRadius: "10px", cursor: "pointer", fontSize: "12px", fontWeight: "700", background: activeTab === t.key ? C.gradient : "transparent", color: activeTab === t.key ? "#fff" : C.textMuted, transition: "all 0.2s" }}>
                {t.label} <span style={{ background: "rgba(0,0,0,0.2)", borderRadius: "20px", padding: "1px 7px", fontSize: "10px" }}>{t.count}</span>
              </button>
            ))}
          </div>

          {loading ? <div style={{ textAlign: "center", padding: "80px", color: C.accentBright }}><div style={{ fontSize: "40px", marginBottom: "14px" }}>⏳</div>Loading matches...</div>
            : filteredMatches.length === 0 ? (
              <div style={{ textAlign: "center", padding: "70px", color: C.textMuted, background: "rgba(255,255,255,0.01)", borderRadius: "16px", border: `1px dashed ${C.borderMid}` }}>
                <div style={{ fontSize: "48px", marginBottom: "14px" }}>🏏</div>
                <div style={{ fontSize: "16px", fontWeight: "600" }}>No matches found</div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {filteredMatches.map(match => (
                  <div key={match.id} className="match-card" style={{ background: `linear-gradient(135deg,${C.bgCard},${C.bgCard2})`, border: `1px solid ${match.status === "LIVE" ? C.accentBorder : C.border}`, borderRadius: "18px", padding: "22px 24px", position: "relative", overflow: "hidden" }}>
                    {match.status === "LIVE" && <div style={{ position: "absolute", top: 0, right: 0, width: "300px", height: "300px", background: `radial-gradient(circle,${C.accentGlow},transparent 70%)`, pointerEvents: "none" }} />}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                        <span style={{ background: match.status === "LIVE" ? C.accentSoft : match.status === "COMPLETED" ? "rgba(100,100,100,0.15)" : "rgba(59,130,246,0.15)", color: match.status === "LIVE" ? C.accentBright : match.status === "COMPLETED" ? "#888" : "#60a5fa", border: `1px solid ${match.status === "LIVE" ? C.accentBorder : "rgba(100,100,100,0.2)"}`, padding: "4px 12px", borderRadius: "20px", fontSize: "11px", fontWeight: "700", letterSpacing: "0.5px" }}>
                          {match.status === "LIVE" ? "● LIVE" : match.status}
                        </span>
                        <span style={{ color: C.textMuted, fontSize: "12px", fontWeight: "500" }}>{match.type}</span>
                      </div>
                      <span style={{ color: C.textMuted, fontSize: "12px" }}>📍 {match.venue}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "18px" }}>
                      <div style={{ flex: 1, textAlign: "center" }}>
                        <div style={{ fontSize: "36px", marginBottom: "6px" }}>{match.flag1}</div>
                        <div style={{ fontWeight: "800", fontSize: "17px", color: C.textPrimary, marginBottom: "6px" }}>{match.team1}</div>
                        {match.score1 !== "—" && <><div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "30px", color: C.accent, lineHeight: 1, marginBottom: "2px" }}>{match.score1}</div><div style={{ color: C.textMuted, fontSize: "12px" }}>{match.overs1} overs</div></>}
                      </div>
                      <div style={{ textAlign: "center" }}>
                        <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "18px", color: C.textMuted, background: C.accentSoft, border: `1px solid ${C.borderMid}`, borderRadius: "50%", width: "48px", height: "48px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto" }}>VS</div>
                      </div>
                      <div style={{ flex: 1, textAlign: "center" }}>
                        <div style={{ fontSize: "36px", marginBottom: "6px" }}>{match.flag2}</div>
                        <div style={{ fontWeight: "800", fontSize: "17px", color: C.textPrimary, marginBottom: "6px" }}>{match.team2}</div>
                        {match.score2 !== "—" && <><div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "30px", color: C.accent, lineHeight: 1, marginBottom: "2px" }}>{match.score2}</div>{match.overs2 !== "—" && <div style={{ color: C.textMuted, fontSize: "12px" }}>{match.overs2} overs</div>}</>}
                      </div>
                    </div>
                    {match.result && <div style={{ background: C.accentSoft, border: `1px solid ${C.accentBorder}`, borderRadius: "10px", padding: "10px 16px", marginBottom: "14px", textAlign: "center", color: C.accentBright, fontSize: "13px", fontWeight: "600" }}>🏆 {match.result}</div>}
                    {match.stream && (
                      <button onClick={() => setSelectedMatch(match)} style={{ width: "100%", background: C.gradient, border: "none", borderRadius: "12px", padding: "13px", color: "#fff", fontWeight: "800", fontSize: "15px", cursor: "pointer", boxShadow: `0 6px 24px ${C.accentGlow}`, letterSpacing: "0.5px" }}>▶ WATCH LIVE STREAM</button>
                    )}
                  </div>
                ))}
              </div>
            )}

          {/* Articles Section */}
          {articles.length > 0 && (
            <div style={{ marginTop: "40px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <div>
                  <div style={{ color: C.accentBright, fontSize: "11px", fontWeight: "700", letterSpacing: "2px", marginBottom: "6px" }}>EDITORIAL</div>
                  <h2 style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "28px", color: C.textPrimary, letterSpacing: "1px" }}>LATEST ARTICLES</h2>
                </div>
                <button onClick={() => onNav("articles")} style={{ background: C.accentSoft, border: `1px solid ${C.accentBorder}`, color: C.accentBright, borderRadius: "8px", padding: "8px 18px", cursor: "pointer", fontSize: "13px", fontWeight: "600" }}>View All →</button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                {articles.slice(0, 4).map(article => (
                  <div key={article.id} onClick={() => onArticleClick(article)} style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "14px", overflow: "hidden", cursor: "pointer", transition: "all 0.2s" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = C.accentBorder; e.currentTarget.style.transform = "translateY(-3px)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = "translateY(0)"; }}>
                    <div style={{ height: "140px", background: C.gradient, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "40px" }}>🏏</div>
                    <div style={{ padding: "16px" }}>
                      <span style={{ background: C.accentSoft, border: `1px solid ${C.accentBorder}`, color: C.accentBright, fontSize: "9px", fontWeight: "700", padding: "2px 8px", borderRadius: "20px", letterSpacing: "1px" }}>{article.category}</span>
                      <h3 style={{ color: C.textPrimary, fontSize: "14px", fontWeight: "700", lineHeight: "1.4", margin: "10px 0 8px" }}>{article.title}</h3>
                      <div style={{ color: C.textMuted, fontSize: "11px" }}>✍️ {article.author}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div style={{ width: "310px", flexShrink: 0 }}>
          {/* News Sidebar */}
          <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "16px", overflow: "hidden", position: "sticky", top: "95px" }}>
            <div style={{ padding: "16px 20px", borderBottom: `1px solid ${C.borderMid}`, display: "flex", alignItems: "center", justifyContent: "space-between", background: C.bgSection }}>
              <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "18px", color: C.textPrimary, letterSpacing: "1px" }}>📰 CRICKET NEWS</div>
              <span style={{ background: C.accentSoft, border: `1px solid ${C.accentBorder}`, color: C.accentBright, fontSize: "10px", padding: "2px 8px", borderRadius: "20px", fontWeight: "700" }}>LIVE</span>
            </div>
            <div style={{ maxHeight: "600px", overflowY: "auto" }}>
              {news.map(item => (
                <div key={item.id} style={{ padding: "14px 18px", borderBottom: `1px solid ${C.border}`, cursor: "pointer", transition: "background 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.background = C.accentSoft}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <div style={{ display: "flex", gap: "10px" }}>
                    {item.hot && <span style={{ color: C.accent, fontSize: "14px", flexShrink: 0, marginTop: "1px" }}>🔥</span>}
                    <div>
                      <div style={{ fontSize: "13px", color: C.textPrimary, lineHeight: "1.4", marginBottom: "7px", fontWeight: "500" }}>{item.title}</div>
                      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        <span style={{ background: C.accentSoft, border: `1px solid ${C.accentBorder}`, color: C.accentBright, fontSize: "9px", padding: "2px 7px", borderRadius: "20px", fontWeight: "700" }}>{item.tag}</span>
                        <span style={{ color: C.textMuted, fontSize: "11px" }}>{item.time}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {apiNews.length > 0 && (
                <>
                  <div style={{ padding: "8px 16px", background: "rgba(255,87,34,0.06)", borderBottom: `1px solid ${C.borderMid}`, borderTop: news.length > 0 ? `1px solid ${C.borderMid}` : "none" }}>
                    <span style={{ color: C.accentBright, fontSize: "9px", fontWeight: "700", letterSpacing: "1.5px" }}>🌐 GOOGLE NEWS</span>
                  </div>
                  {apiNews.map((item, i) => (
                    <div key={i} style={{ padding: "12px 16px", borderBottom: i < apiNews.length - 1 ? `1px solid ${C.border}` : "none", cursor: "pointer", transition: "background 0.2s" }}
                      onMouseEnter={e => e.currentTarget.style.background = C.accentSoft}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <span style={{ color: C.accent, fontSize: "12px", flexShrink: 0, marginTop: "1px" }}>🔥</span>
                        <div>
                          <div style={{ fontSize: "12px", color: C.textPrimary, lineHeight: "1.4", marginBottom: "6px", fontWeight: "500" }}>{item.title}</div>
                          <div style={{ display: "flex", gap: "8px" }}>
                            <span style={{ background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.25)", color: "#60a5fa", fontSize: "9px", padding: "2px 7px", borderRadius: "20px", fontWeight: "700" }}>GOOGLE</span>
                            <span style={{ color: C.textMuted, fontSize: "10px" }}>{item.time}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
              {news.length === 0 && apiNews.length === 0 && <div style={{ padding: "30px", textAlign: "center", color: C.textMuted, fontSize: "13px" }}>Loading news...</div>}
            </div>
          </div>
        </div>
      </main>
      <Footer onNav={onNav} />
    </div>
  );
};

// ─── APP ROOT ─────────────────────────────────────────────────────────
export default function App() {
  const isAdminRoute = window.location.hash === "#/admin" || window.location.pathname.endsWith("/admin");
  const [page, setPage] = useState(isAdminRoute ? "adminLogin" : "website");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === "#/admin") setPage(isLoggedIn ? "adminDash" : "adminLogin");
      else setPage("website");
    };
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, [isLoggedIn]);

  const handleNav = (p) => { setPage(p); window.scrollTo(0, 0); };
  const handleArticleClick = (article) => { setSelectedArticle(article); setPage("articleView"); window.scrollTo(0, 0); };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        body{background:#080604}
        ::-webkit-scrollbar{width:5px;background:#0a0602}
        ::-webkit-scrollbar-thumb{background:#3a1a0c;border-radius:4px}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
        @keyframes tickerSlide{from{opacity:0;transform:translateX(30px)}to{opacity:1;transform:translateX(0)}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        .match-card{transition:all 0.25s ease}
        .match-card:hover{transform:translateY(-3px)!important;box-shadow:0 12px 40px rgba(232,56,13,0.18)!important}
      `}</style>
      {page === "website" && <MainWebsite onNav={handleNav} onArticleClick={handleArticleClick} />}
      {page === "articles" && <ArticlesPage onNav={handleNav} onArticleClick={handleArticleClick} />}
      {page === "articleView" && selectedArticle && <ArticleView article={selectedArticle} onBack={() => { setPage("articles"); window.scrollTo(0, 0); }} onNav={handleNav} />}
      {page === "about" && <AboutUs onBack={() => handleNav("website")} />}
      {page === "privacy" && <PrivacyPolicy onBack={() => handleNav("website")} />}
      {page === "contact" && <ContactUs onBack={() => handleNav("website")} />}
      {page === "adminLogin" && <AdminLoginPage onSuccess={() => { setIsLoggedIn(true); setPage("adminDash"); }} />}
      {page === "adminDash" && isLoggedIn && <AdminDashboard onLogout={() => { setIsLoggedIn(false); setPage("adminLogin"); }} />}
    </>
  );
}
