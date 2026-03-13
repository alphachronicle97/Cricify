import { useState, useEffect, useCallback } from "react";

const SUPABASE_URL = "https://rnmiuggvwvluzpqicjqn.supabase.co";
const SUPABASE_KEY = "sb_publishable_VzshP4nH__Mk5BEplgO5VQ_QiIgnUt8";
const ADMIN_PASSWORD = "*kanishka@#&23122010*";

const C = {
  accent: "#ff4500", accentBright: "#ff6a00",
  accentGlow: "rgba(255,69,0,0.25)", accentSoft: "rgba(255,69,0,0.12)",
  accentBorder: "rgba(255,69,0,0.3)", bg: "#0d0604",
  bgCard: "#150a06", bgCard2: "#1a0d08", border: "#2a1206",
  borderMid: "#3a1a0a", textPrimary: "#fff0eb",
  textSecondary: "#c08070", textMuted: "#6a3020",
  gradient: "linear-gradient(135deg, #ff4500, #ff6a00)",
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

const dbGet = (table) => sb("GET", table, null, "?order=created_at.asc");
const dbInsert = (table, data) => sb("POST", table, data);
const dbUpdate = (table, id, data) => sb("PATCH", table, data, `?id=eq.${id}`);
const dbDelete = (table, id) => sb("DELETE", table, null, `?id=eq.${id}`);

const fetchGoogleNews = async () => {
  try {
    const res = await fetch(
      "https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fnews.google.com%2Frss%2Fsearch%3Fq%3Dcricket%2Bindia%26hl%3Den-IN%26gl%3DIN%26ceid%3DIN%3Aen"
    );
    const data = await res.json();
    if (data.items) {
      return data.items.slice(0, 8).map(n => ({
        title: n.title,
        tag: "CRICKET",
        time: new Date(n.pubDate).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
        hot: true,
      }));
    }
    return [];
  } catch { return []; }
};

const Input = ({ label, value, onChange, placeholder, type = "text" }) => (
  <div style={{ marginBottom: "12px" }}>
    {label && <div style={{ color: "#aaa", fontSize: "11px", marginBottom: "4px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</div>}
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      style={{ width: "100%", background: "#1a1a25", border: "1px solid #2a2a3a", borderRadius: "8px", padding: "9px 12px", color: "#fff", fontSize: "13px", outline: "none" }} />
  </div>
);

// ─── PRIVACY POLICY PAGE ──────────────────────────────────────────────
const PrivacyPolicy = ({ onBack }) => (
  <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Segoe UI', sans-serif", color: C.textPrimary }}>
    <header style={{ background: "linear-gradient(180deg,#1a0804,#0d0604)", borderBottom: `1px solid ${C.borderMid}`, padding: "0 20px", height: "60px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div style={{ background: C.gradient, borderRadius: "10px", padding: "6px 12px", fontFamily: "'Bebas Neue', cursive", fontSize: "22px", color: "#fff", letterSpacing: "2px", cursor: "pointer" }} onClick={onBack}>🏏 CRICIFY</div>
      <button onClick={onBack} style={{ background: C.accentSoft, border: `1px solid ${C.accentBorder}`, color: C.accentBright, borderRadius: "8px", padding: "7px 16px", cursor: "pointer", fontSize: "13px" }}>← Back</button>
    </header>
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 20px" }}>
      <h1 style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "36px", color: C.accentBright, letterSpacing: "2px", marginBottom: "8px" }}>Privacy Policy</h1>
      <p style={{ color: C.textMuted, fontSize: "13px", marginBottom: "32px" }}>Last updated: March 2024</p>
      {[
        { title: "Information We Collect", text: "Cricify does not collect any personal information from its users. We do not require registration or login to use our services. We may collect anonymous usage data such as page views and browser type to improve our service." },
        { title: "Cookies", text: "We may use cookies to enhance your browsing experience. These cookies do not store any personally identifiable information. You can choose to disable cookies through your browser settings." },
        { title: "Third Party Services", text: "Cricify uses third-party services including Google Analytics for website analytics and Google AdSense for displaying advertisements. These services may collect data as per their own privacy policies." },
        { title: "Advertisements", text: "We use Google AdSense to display ads on our website. Google may use cookies to serve ads based on your prior visits to our website or other websites. You may opt out of personalized advertising by visiting Google's Ads Settings." },
        { title: "Data Security", text: "We take reasonable measures to protect any information collected. However, no internet transmission is completely secure. We cannot guarantee absolute security of any data." },
        { title: "Changes to This Policy", text: "We may update this Privacy Policy from time to time. We will notify users of any changes by posting the new policy on this page." },
        { title: "Contact Us", text: "If you have any questions about this Privacy Policy, please contact us at: support@cricify.com" },
      ].map(section => (
        <div key={section.title} style={{ marginBottom: "28px" }}>
          <h2 style={{ color: C.accentBright, fontSize: "18px", fontWeight: "700", marginBottom: "10px" }}>{section.title}</h2>
          <p style={{ color: C.textSecondary, fontSize: "14px", lineHeight: "1.8" }}>{section.text}</p>
        </div>
      ))}
    </div>
    <Footer onNav={() => {}} />
  </div>
);

// ─── ABOUT US PAGE ────────────────────────────────────────────────────
const AboutUs = ({ onBack }) => (
  <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Segoe UI', sans-serif", color: C.textPrimary }}>
    <header style={{ background: "linear-gradient(180deg,#1a0804,#0d0604)", borderBottom: `1px solid ${C.borderMid}`, padding: "0 20px", height: "60px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div style={{ background: C.gradient, borderRadius: "10px", padding: "6px 12px", fontFamily: "'Bebas Neue', cursive", fontSize: "22px", color: "#fff", letterSpacing: "2px", cursor: "pointer" }} onClick={onBack}>🏏 CRICIFY</div>
      <button onClick={onBack} style={{ background: C.accentSoft, border: `1px solid ${C.accentBorder}`, color: C.accentBright, borderRadius: "8px", padding: "7px 16px", cursor: "pointer", fontSize: "13px" }}>← Back</button>
    </header>
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 20px" }}>
      <h1 style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "36px", color: C.accentBright, letterSpacing: "2px", marginBottom: "8px" }}>About Cricify</h1>
      <p style={{ color: C.textMuted, fontSize: "13px", marginBottom: "32px" }}>Your #1 Cricket Streaming Destination</p>
      <div style={{ background: `linear-gradient(135deg,${C.bgCard},${C.bgCard2})`, border: `1px solid ${C.borderMid}`, borderRadius: "16px", padding: "30px", marginBottom: "24px" }}>
        <p style={{ color: C.textSecondary, fontSize: "15px", lineHeight: "1.9" }}>
          <strong style={{ color: C.accentBright }}>Cricify</strong> is India's fastest growing cricket streaming and scores platform. We bring you live cricket scores, match updates, breaking news, and live streams — all in one place.
        </p>
      </div>
      {[
        { icon: "🏏", title: "Live Scores", text: "Real-time ball-by-ball scores from all major cricket tournaments including IPL, ICC World Cup, Test matches, and more." },
        { icon: "📺", title: "Live Streams", text: "Watch live cricket streams directly on our platform. We provide the best streaming experience for cricket fans." },
        { icon: "📰", title: "Cricket News", text: "Stay updated with the latest cricket news, player updates, team announcements, and match previews." },
        { icon: "⚡", title: "Fast & Free", text: "Cricify is completely free to use. No registration required. Just visit and enjoy cricket!" },
      ].map(item => (
        <div key={item.title} style={{ background: `linear-gradient(135deg,${C.bgCard},${C.bgCard2})`, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "20px", marginBottom: "14px", display: "flex", gap: "16px", alignItems: "flex-start" }}>
          <div style={{ fontSize: "32px" }}>{item.icon}</div>
          <div>
            <h3 style={{ color: C.accentBright, fontWeight: "700", fontSize: "16px", marginBottom: "6px" }}>{item.title}</h3>
            <p style={{ color: C.textSecondary, fontSize: "13px", lineHeight: "1.7" }}>{item.text}</p>
          </div>
        </div>
      ))}
    </div>
    <Footer onNav={() => {}} />
  </div>
);

// ─── CONTACT PAGE ─────────────────────────────────────────────────────
const ContactUs = ({ onBack }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [sent, setSent] = useState(false);
  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Segoe UI', sans-serif", color: C.textPrimary }}>
      <header style={{ background: "linear-gradient(180deg,#1a0804,#0d0604)", borderBottom: `1px solid ${C.borderMid}`, padding: "0 20px", height: "60px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ background: C.gradient, borderRadius: "10px", padding: "6px 12px", fontFamily: "'Bebas Neue', cursive", fontSize: "22px", color: "#fff", letterSpacing: "2px", cursor: "pointer" }} onClick={onBack}>🏏 CRICIFY</div>
        <button onClick={onBack} style={{ background: C.accentSoft, border: `1px solid ${C.accentBorder}`, color: C.accentBright, borderRadius: "8px", padding: "7px 16px", cursor: "pointer", fontSize: "13px" }}>← Back</button>
      </header>
      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "40px 20px" }}>
        <h1 style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "36px", color: C.accentBright, letterSpacing: "2px", marginBottom: "8px" }}>Contact Us</h1>
        <p style={{ color: C.textMuted, fontSize: "13px", marginBottom: "32px" }}>Koi sawaal? Hum yahan hain!</p>
        {sent ? (
          <div style={{ background: "rgba(76,175,80,0.1)", border: "1px solid rgba(76,175,80,0.3)", borderRadius: "14px", padding: "40px", textAlign: "center" }}>
            <div style={{ fontSize: "48px", marginBottom: "12px" }}>✅</div>
            <div style={{ color: "#4caf50", fontSize: "18px", fontWeight: "700" }}>Message bhej diya!</div>
            <div style={{ color: "#666", fontSize: "13px", marginTop: "8px" }}>Hum jald hi jawab denge.</div>
            <button onClick={() => setSent(false)} style={{ marginTop: "20px", background: C.gradient, border: "none", color: "#fff", borderRadius: "8px", padding: "10px 24px", cursor: "pointer", fontWeight: "700" }}>Wapas jaao</button>
          </div>
        ) : (
          <div style={{ background: `linear-gradient(135deg,${C.bgCard},${C.bgCard2})`, border: `1px solid ${C.borderMid}`, borderRadius: "16px", padding: "28px" }}>
            <Input label="Aapka Naam" value={name} onChange={setName} placeholder="Rahul Kumar" />
            <Input label="Email" value={email} onChange={setEmail} placeholder="rahul@gmail.com" type="email" />
            <div style={{ marginBottom: "16px" }}>
              <div style={{ color: "#aaa", fontSize: "11px", marginBottom: "4px", fontWeight: "600", textTransform: "uppercase" }}>Message</div>
              <textarea value={msg} onChange={e => setMsg(e.target.value)} placeholder="Apna sawaal ya feedback likhein..."
                style={{ width: "100%", background: "#1a1a25", border: "1px solid #2a2a3a", borderRadius: "8px", padding: "9px 12px", color: "#fff", fontSize: "13px", outline: "none", minHeight: "120px", resize: "vertical", fontFamily: "inherit" }} />
            </div>
            <button onClick={() => { if (name && email && msg) setSent(true); }} style={{ width: "100%", background: C.gradient, border: "none", color: "#fff", borderRadius: "10px", padding: "13px", cursor: "pointer", fontWeight: "800", fontSize: "15px" }}>📨 Message Bhejo</button>
            <div style={{ marginTop: "20px", padding: "14px", background: "rgba(255,69,0,0.06)", borderRadius: "10px", border: `1px solid ${C.accentBorder}` }}>
              <div style={{ color: C.textMuted, fontSize: "12px" }}>📧 Email: <span style={{ color: C.textSecondary }}>support@cricify.com</span></div>
            </div>
          </div>
        )}
      </div>
      <Footer onNav={() => {}} />
    </div>
  );
};

// ─── FOOTER ───────────────────────────────────────────────────────────
const Footer = ({ onNav }) => (
  <footer style={{ borderTop: `1px solid ${C.borderMid}`, padding: "30px 20px", marginTop: "40px", background: "#080402" }}>
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "center", gap: "24px", marginBottom: "16px", flexWrap: "wrap" }}>
        {["about","privacy","contact"].map(page => (
          <button key={page} onClick={() => onNav(page)} style={{ background: "none", border: "none", color: C.textMuted, fontSize: "13px", cursor: "pointer", textTransform: "capitalize", fontWeight: "600" }}>
            {page === "about" ? "About Us" : page === "privacy" ? "Privacy Policy" : "Contact Us"}
          </button>
        ))}
      </div>
      <div style={{ textAlign: "center", color: C.textMuted, fontSize: "12px" }}>
        🏏 Cricify • Live Cricket Streaming • © 2024 • All Rights Reserved
      </div>
    </div>
  </footer>
);

const AdminLoginPage = ({ onSuccess }) => {
  const [pass, setPass] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);
  const tryLogin = () => {
    if (pass === ADMIN_PASSWORD) { onSuccess(); }
    else { setError(true); setShake(true); setTimeout(() => setShake(false), 500); setTimeout(() => setError(false), 2500); setPass(""); }
  };
  return (
    <div style={{ minHeight: "100vh", background: "#060408", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Segoe UI', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap'); @keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-10px)}40%,80%{transform:translateX(10px)}} @keyframes fadeIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div style={{ background: "linear-gradient(135deg,#120608,#0d0604)", border: `2px solid ${error?"rgba(255,50,50,0.4)":"rgba(255,69,0,0.25)"}`, borderRadius: "24px", padding: "50px 44px", width: "100%", maxWidth: "420px", textAlign: "center", animation: shake?"shake 0.4s ease":"fadeIn 0.5s ease" }}>
        <div style={{ background: C.gradient, borderRadius: "12px", padding: "8px 16px", fontFamily: "'Bebas Neue', cursive", fontSize: "28px", color: "#fff", letterSpacing: "3px", display: "inline-block", marginBottom: "8px" }}>🏏 CRICIFY</div>
        <div style={{ color: C.textMuted, fontSize: "12px", marginBottom: "36px" }}>ADMIN DASHBOARD</div>
        <div style={{ fontSize: "52px", marginBottom: "16px" }}>🔐</div>
        <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "24px", color: C.textPrimary, marginBottom: "30px" }}>SECURE LOGIN</div>
        <input type="password" value={pass} onChange={e => { setPass(e.target.value); setError(false); }} onKeyDown={e => e.key==="Enter"&&tryLogin()} placeholder="Password..." autoFocus
          style={{ width: "100%", background: error?"rgba(255,50,50,0.08)":"rgba(255,255,255,0.04)", border: `1px solid ${error?"rgba(255,50,50,0.4)":"#2a1a10"}`, borderRadius: "12px", padding: "14px 18px", color: "#fff", fontSize: "16px", outline: "none", textAlign: "center", letterSpacing: "6px", marginBottom: "10px" }} />
        {error && <div style={{ color: "#ff4444", fontSize: "13px", marginBottom: "14px" }}>❌ Galat password!</div>}
        {!error && <div style={{ height: "24px" }} />}
        <button onClick={tryLogin} style={{ width: "100%", background: C.gradient, border: "none", color: "#fff", borderRadius: "12px", padding: "14px", cursor: "pointer", fontWeight: "800", fontSize: "16px" }}>🔓 LOGIN</button>
      </div>
    </div>
  );
};

const StreamPlayer = ({ match, onClose }) => {
  const [volume, setVolume] = useState(80);
  const [quality, setQuality] = useState("HD");
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.96)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div style={{ width: "100%", maxWidth: "900px", background: C.bgCard, borderRadius: "16px", overflow: "hidden", border: `1px solid ${C.borderMid}` }}>
        <div style={{ background: "linear-gradient(135deg,#2a0d06,#0d0604)", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${C.borderMid}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ background: C.accent, color: "#fff", padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "800" }}>● LIVE</div>
            <span style={{ color: C.textPrimary, fontWeight: "700", fontFamily: "'Bebas Neue', cursive" }}>{match.flag1} {match.team1} vs {match.team2} {match.flag2}</span>
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,80,80,0.15)", border: "1px solid rgba(255,80,80,0.3)", color: "#ff5252", borderRadius: "8px", padding: "6px 14px", cursor: "pointer" }}>✕ Close</button>
        </div>
        <div style={{ width: "100%", aspectRatio: "16/9", background: "#0a0200", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {match.stream_url ? <iframe src={match.stream_url} style={{ width: "100%", height: "100%", border: "none", position: "absolute", inset: 0 }} allowFullScreen title="stream" /> : <div style={{ textAlign: "center" }}><div style={{ fontSize: "56px" }}>📺</div><div style={{ color: C.accent, fontSize: "20px", fontWeight: "800", fontFamily: "'Bebas Neue', cursive" }}>STREAM COMING SOON</div></div>}
        </div>
        <div style={{ padding: "14px 20px", background: "#120600", display: "flex", alignItems: "center", gap: "16px", borderTop: `1px solid ${C.borderMid}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span>🔊</span>
            <input type="range" min="0" max="100" value={volume} onChange={e => setVolume(e.target.value)} style={{ accentColor: C.accent, width: "100px" }} />
            <span style={{ color: C.textMuted, fontSize: "11px" }}>{volume}%</span>
          </div>
          <div style={{ display: "flex", gap: "6px" }}>
            {["480p","720p","HD","4K"].map(q => <button key={q} onClick={() => setQuality(q)} style={{ background: quality===q?C.gradient:C.accentSoft, color: quality===q?"#fff":C.accentBright, border: `1px solid ${C.accentBorder}`, borderRadius: "6px", padding: "4px 10px", fontSize: "11px", cursor: "pointer" }}>{q}</button>)}
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = ({ onLogout }) => {
  const [tab, setTab] = useState("matches");
  const [matches, setMatches] = useState([]);
  const [news, setNews] = useState([]);
  const [ticker, setTicker] = useState([]);
  const [editMatch, setEditMatch] = useState(null);
  const [editNews, setEditNews] = useState(null);
  const [newTicker, setNewTicker] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2500); };
  const loadData = useCallback(async () => {
    setLoading(true);
    const [m, n, t] = await Promise.all([dbGet("matches"), dbGet("news"), dbGet("ticker")]);
    if (m) setMatches(m); if (n) setNews(n); if (t) setTicker(t);
    setLoading(false);
  }, []);
  useEffect(() => { loadData(); }, [loadData]);
  const blankMatch = { team1:"",team2:"",flag1:"🏏",flag2:"🏏",score1:"—",score2:"—",overs1:"—",overs2:"—",status:"LIVE",type:"T20 • Series",venue:"",stream:false,stream_url:"",result:"" };
  const blankNews = { title:"",tag:"NEWS",time:"Just now",hot:false };
  const saveMatch = async () => { if(!editMatch.team1||!editMatch.team2){showToast("❌ Team names required!");return;} setSaving(true); if(editMatch.id) await dbUpdate("matches",editMatch.id,editMatch); else await dbInsert("matches",editMatch); await loadData();setEditMatch(null);setSaving(false);showToast("✅ Match saved!"); };
  const deleteMatch = async (id) => { if(!window.confirm("Delete?"))return; await dbDelete("matches",id);await loadData();showToast("🗑 Deleted!"); };
  const saveNews = async () => { if(!editNews.title){showToast("❌ Headline required!");return;} setSaving(true); if(editNews.id) await dbUpdate("news",editNews.id,editNews); else await dbInsert("news",editNews); await loadData();setEditNews(null);setSaving(false);showToast("✅ Saved!"); };
  const deleteNews = async (id) => { if(!window.confirm("Delete?"))return; await dbDelete("news",id);await loadData();showToast("🗑 Deleted!"); };
  const addTicker = async () => { if(!newTicker.trim())return; await dbInsert("ticker",{text:newTicker.trim()});setNewTicker("");await loadData();showToast("✅ Added!"); };
  const deleteTicker = async (id) => { await dbDelete("ticker",id);await loadData(); };
  const tabStyle = (key) => ({ padding:"10px 20px",border:"none",borderRadius:"8px",cursor:"pointer",fontSize:"13px",fontWeight:"700",background:tab===key?C.gradient:"rgba(255,255,255,0.05)",color:tab===key?"#fff":"#888" });
  return (
    <div style={{ minHeight:"100vh",background:"#060408",fontFamily:"'Segoe UI',sans-serif",color:"#fff" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap'); *{box-sizing:border-box;margin:0;padding:0} @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>
      {toast && <div style={{ position:"fixed",top:"20px",right:"20px",background:"#0d1a0d",border:"1px solid #2a5a2a",color:"#4caf50",borderRadius:"10px",padding:"12px 20px",zIndex:9999,fontSize:"14px",fontWeight:"600" }}>{toast}</div>}
      <header style={{ background:"linear-gradient(135deg,#120608,#0d0604)",borderBottom:`1px solid ${C.borderMid}`,padding:"0 30px",height:"65px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:100 }}>
        <div style={{ display:"flex",alignItems:"center",gap:"14px" }}>
          <div style={{ background:C.gradient,borderRadius:"10px",padding:"5px 12px",fontFamily:"'Bebas Neue',cursive",fontSize:"20px",color:"#fff",letterSpacing:"2px" }}>🏏 CRICIFY</div>
          <div style={{ background:C.accentSoft,border:`1px solid ${C.accentBorder}`,color:C.accentBright,fontSize:"11px",fontWeight:"700",padding:"3px 10px",borderRadius:"20px" }}>⚙️ ADMIN PANEL</div>
        </div>
        <div style={{ display:"flex",gap:"12px" }}>
          <button onClick={loadData} style={{ background:C.accentSoft,border:`1px solid ${C.accentBorder}`,color:C.accentBright,borderRadius:"8px",padding:"7px 14px",cursor:"pointer" }}>🔄 Refresh</button>
          <button onClick={onLogout} style={{ background:"rgba(255,80,80,0.12)",border:"1px solid rgba(255,80,80,0.3)",color:"#ff5252",borderRadius:"8px",padding:"7px 14px",cursor:"pointer",fontWeight:"600" }}>🔒 Logout</button>
        </div>
      </header>
      <div style={{ maxWidth:"960px",margin:"0 auto",padding:"30px 20px" }}>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"16px",marginBottom:"28px" }}>
          {[{label:"Total Matches",value:matches.length,icon:"🏏"},{label:"Total News",value:news.length,icon:"📰"},{label:"Ticker Lines",value:ticker.length,icon:"📢"}].map(s => (
            <div key={s.label} style={{ background:"linear-gradient(135deg,#120608,#0d0604)",border:`1px solid ${C.borderMid}`,borderRadius:"14px",padding:"20px",display:"flex",alignItems:"center",gap:"16px" }}>
              <div style={{ fontSize:"32px" }}>{s.icon}</div>
              <div><div style={{ fontFamily:"'Bebas Neue',cursive",fontSize:"32px",color:C.accent,lineHeight:1 }}>{s.value}</div><div style={{ color:"#555",fontSize:"12px" }}>{s.label}</div></div>
            </div>
          ))}
        </div>
        <div style={{ display:"flex",gap:"8px",marginBottom:"20px" }}>
          <button style={tabStyle("matches")} onClick={() => setTab("matches")}>🏏 Matches</button>
          <button style={tabStyle("news")} onClick={() => setTab("news")}>📰 News</button>
          <button style={tabStyle("ticker")} onClick={() => setTab("ticker")}>📢 Ticker</button>
        </div>
        {loading ? <div style={{ textAlign:"center",padding:"80px",color:C.accentBright }}>⏳ Loading...</div> : (
          <>
            {tab==="matches" && (
              <div style={{ animation:"fadeIn 0.3s ease" }}>
                <div style={{ display:"flex",justifyContent:"flex-end",marginBottom:"16px" }}>
                  <button onClick={() => setEditMatch({...blankMatch})} style={{ background:C.gradient,border:"none",color:"#fff",borderRadius:"8px",padding:"9px 20px",cursor:"pointer",fontWeight:"700" }}>+ Naya Match</button>
                </div>
                {matches.length===0&&!editMatch&&<div style={{ textAlign:"center",padding:"50px",color:"#333" }}>Koi match nahi</div>}
                {matches.map(m => (
                  <div key={m.id} style={{ background:"linear-gradient(135deg,#120608,#0d0604)",border:`1px solid ${C.border}`,borderRadius:"12px",padding:"16px 20px",marginBottom:"10px",display:"flex",alignItems:"center",justifyContent:"space-between" }}>
                    <div>
                      <div style={{ color:"#fff",fontWeight:"700",fontSize:"15px",marginBottom:"4px" }}>{m.flag1} {m.team1} vs {m.team2} {m.flag2}</div>
                      <div style={{ color:"#666",fontSize:"12px" }}>{m.status} • {m.type} {m.stream&&"• 📺 Stream ON"}</div>
                    </div>
                    <div style={{ display:"flex",gap:"8px" }}>
                      <button onClick={() => setEditMatch({...m})} style={{ background:"rgba(255,165,0,0.12)",border:"1px solid rgba(255,165,0,0.3)",color:"#ffa500",borderRadius:"7px",padding:"7px 16px",cursor:"pointer",fontSize:"12px" }}>✏️ Edit</button>
                      <button onClick={() => deleteMatch(m.id)} style={{ background:"rgba(255,80,80,0.1)",border:"1px solid rgba(255,80,80,0.3)",color:"#ff5252",borderRadius:"7px",padding:"7px 14px",cursor:"pointer" }}>🗑</button>
                    </div>
                  </div>
                ))}
                {editMatch && (
                  <div style={{ background:"#0a0410",border:`2px solid ${C.accentBorder}`,borderRadius:"16px",padding:"24px",marginTop:"16px" }}>
                    <div style={{ color:C.accentBright,fontWeight:"800",fontSize:"16px",marginBottom:"20px" }}>{editMatch.id?"✏️ Edit Match":"➕ Naya Match"}</div>
                    <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 20px" }}>
                      <Input label="Team 1" value={editMatch.team1} onChange={v => setEditMatch({...editMatch,team1:v})} placeholder="India" />
                      <Input label="Team 2" value={editMatch.team2} onChange={v => setEditMatch({...editMatch,team2:v})} placeholder="Australia" />
                      <Input label="Flag 1" value={editMatch.flag1} onChange={v => setEditMatch({...editMatch,flag1:v})} placeholder="🇮🇳" />
                      <Input label="Flag 2" value={editMatch.flag2} onChange={v => setEditMatch({...editMatch,flag2:v})} placeholder="🇦🇺" />
                      <Input label="Score 1" value={editMatch.score1} onChange={v => setEditMatch({...editMatch,score1:v})} placeholder="287/4" />
                      <Input label="Score 2" value={editMatch.score2} onChange={v => setEditMatch({...editMatch,score2:v})} placeholder="243/8" />
                      <Input label="Overs 1" value={editMatch.overs1} onChange={v => setEditMatch({...editMatch,overs1:v})} placeholder="45.2" />
                      <Input label="Overs 2" value={editMatch.overs2} onChange={v => setEditMatch({...editMatch,overs2:v})} placeholder="50.0" />
                    </div>
                    <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 20px" }}>
                      <div style={{ marginBottom:"12px" }}>
                        <div style={{ color:"#aaa",fontSize:"11px",marginBottom:"4px",fontWeight:"600",textTransform:"uppercase" }}>Status</div>
                        <select value={editMatch.status} onChange={e => setEditMatch({...editMatch,status:e.target.value})} style={{ width:"100%",background:"#1a1a25",border:"1px solid #2a2a3a",borderRadius:"8px",padding:"9px 12px",color:"#fff",fontSize:"13px",outline:"none" }}>
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
                      <Input label="Match Type" value={editMatch.type} onChange={v => setEditMatch({...editMatch,type:v})} placeholder="T20 • Series" />
                    </div>
                    <Input label="Venue" value={editMatch.venue} onChange={v => setEditMatch({...editMatch,venue:v})} placeholder="Wankhede Stadium" />
                    <Input label="Result" value={editMatch.result||""} onChange={v => setEditMatch({...editMatch,result:v})} placeholder="India won by 50 runs" />
                    <div style={{ background:C.accentSoft,border:`1px solid ${C.accentBorder}`,borderRadius:"10px",padding:"14px",marginBottom:"12px" }}>
                      <label style={{ display:"flex",alignItems:"center",gap:"10px",cursor:"pointer",color:"#ccc",fontSize:"14px" }}>
                        <input type="checkbox" checked={editMatch.stream} onChange={e => setEditMatch({...editMatch,stream:e.target.checked})} style={{ accentColor:C.accent,width:"18px",height:"18px" }} />
                        📺 Live Stream Enable?
                      </label>
                      {editMatch.stream && <div style={{ marginTop:"12px" }}><Input label="Stream Embed URL" value={editMatch.stream_url||""} onChange={v => setEditMatch({...editMatch,stream_url:v})} placeholder="https://www.youtube.com/embed/ID" /></div>}
                    </div>
                    <div style={{ display:"flex",gap:"10px" }}>
                      <button onClick={saveMatch} disabled={saving} style={{ background:C.gradient,border:"none",color:"#fff",borderRadius:"10px",padding:"12px 28px",cursor:"pointer",fontWeight:"800" }}>{saving?"⏳ Saving...":"✓ Save"}</button>
                      <button onClick={() => setEditMatch(null)} style={{ background:"rgba(255,255,255,0.05)",border:"1px solid #333",color:"#888",borderRadius:"10px",padding:"12px 20px",cursor:"pointer" }}>Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            )}
            {tab==="news" && (
              <div style={{ animation:"fadeIn 0.3s ease" }}>
                <div style={{ display:"flex",justifyContent:"flex-end",marginBottom:"16px" }}>
                  <button onClick={() => setEditNews({...blankNews})} style={{ background:C.gradient,border:"none",color:"#fff",borderRadius:"8px",padding:"9px 20px",cursor:"pointer",fontWeight:"700" }}>+ Nayi News</button>
                </div>
                {news.map(n => (
                  <div key={n.id} style={{ background:"linear-gradient(135deg,#120608,#0d0604)",border:`1px solid ${C.border}`,borderRadius:"12px",padding:"14px 18px",marginBottom:"10px",display:"flex",alignItems:"center",justifyContent:"space-between" }}>
                    <div><div style={{ color:"#fff",fontWeight:"600",fontSize:"13px" }}>{n.hot?"🔥 ":""}{n.title}</div><div style={{ color:"#666",fontSize:"11px" }}>{n.tag} • {n.time}</div></div>
                    <div style={{ display:"flex",gap:"8px" }}>
                      <button onClick={() => setEditNews({...n})} style={{ background:"rgba(255,165,0,0.12)",border:"1px solid rgba(255,165,0,0.3)",color:"#ffa500",borderRadius:"7px",padding:"7px 16px",cursor:"pointer",fontSize:"12px" }}>✏️</button>
                      <button onClick={() => deleteNews(n.id)} style={{ background:"rgba(255,80,80,0.1)",border:"1px solid rgba(255,80,80,0.3)",color:"#ff5252",borderRadius:"7px",padding:"7px 14px",cursor:"pointer" }}>🗑</button>
                    </div>
                  </div>
                ))}
                {editNews && (
                  <div style={{ background:"#0a0410",border:`2px solid ${C.accentBorder}`,borderRadius:"16px",padding:"24px",marginTop:"16px" }}>
                    <div style={{ color:C.accentBright,fontWeight:"800",fontSize:"16px",marginBottom:"20px" }}>{editNews.id?"✏️ Edit":"➕ Nayi"} News</div>
                    <Input label="Headline" value={editNews.title} onChange={v => setEditNews({...editNews,title:v})} placeholder="News headline..." />
                    <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 20px" }}>
                      <Input label="Tag" value={editNews.tag} onChange={v => setEditNews({...editNews,tag:v})} placeholder="IND" />
                      <Input label="Time" value={editNews.time} onChange={v => setEditNews({...editNews,time:v})} placeholder="2 min ago" />
                    </div>
                    <label style={{ display:"flex",alignItems:"center",gap:"10px",cursor:"pointer",color:"#ccc",fontSize:"14px",marginBottom:"20px" }}>
                      <input type="checkbox" checked={editNews.hot} onChange={e => setEditNews({...editNews,hot:e.target.checked})} style={{ accentColor:C.accent,width:"18px",height:"18px" }} />
                      🔥 Hot/Trending?
                    </label>
                    <div style={{ display:"flex",gap:"10px" }}>
                      <button onClick={saveNews} disabled={saving} style={{ background:C.gradient,border:"none",color:"#fff",borderRadius:"10px",padding:"12px 28px",cursor:"pointer",fontWeight:"800" }}>{saving?"⏳ Saving...":"✓ Save"}</button>
                      <button onClick={() => setEditNews(null)} style={{ background:"rgba(255,255,255,0.05)",border:"1px solid #333",color:"#888",borderRadius:"10px",padding:"12px 20px",cursor:"pointer" }}>Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            )}
            {tab==="ticker" && (
              <div style={{ animation:"fadeIn 0.3s ease" }}>
                <div style={{ background:"linear-gradient(135deg,#120608,#0d0604)",border:`1px solid ${C.borderMid}`,borderRadius:"12px",padding:"18px",marginBottom:"16px" }}>
                  <div style={{ display:"flex",gap:"10px" }}>
                    <input value={newTicker} onChange={e => setNewTicker(e.target.value)} onKeyDown={e => e.key==="Enter"&&addTicker()} placeholder="🏏 IND vs AUS: KOHLI 87* (62)"
                      style={{ flex:1,background:"#1a1a25",border:"1px solid #2a2a3a",borderRadius:"8px",padding:"10px 14px",color:"#fff",fontSize:"13px",outline:"none" }} />
                    <button onClick={addTicker} style={{ background:C.gradient,border:"none",color:"#fff",borderRadius:"8px",padding:"10px 20px",cursor:"pointer",fontWeight:"700" }}>+ Add</button>
                  </div>
                </div>
                {ticker.map((t,i) => (
                  <div key={t.id} style={{ background:"linear-gradient(135deg,#120608,#0d0604)",border:`1px solid ${C.border}`,borderRadius:"10px",padding:"13px 18px",marginBottom:"8px",display:"flex",alignItems:"center",justifyContent:"space-between" }}>
                    <span style={{ color:"#ddd",fontSize:"13px" }}>#{i+1} {t.text}</span>
                    <button onClick={() => deleteTicker(t.id)} style={{ background:"rgba(255,80,80,0.1)",border:"1px solid rgba(255,80,80,0.3)",color:"#ff5252",borderRadius:"6px",padding:"5px 14px",cursor:"pointer" }}>✕</button>
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

const MainWebsite = ({ onNav }) => {
  const [matches, setMatches] = useState([]);
  const [news, setNews] = useState([]);
  const [apiNews, setApiNews] = useState([]);
  const [ticker, setTicker] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("live");
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [tickerIdx, setTickerIdx] = useState(0);

  const loadData = useCallback(async () => {
    const [m, n, t] = await Promise.all([dbGet("matches"), dbGet("news"), dbGet("ticker")]);
    if (m) setMatches(m); if (n) setNews(n); if (t) setTicker(t);
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
    const t = setInterval(() => setTickerIdx(p => (p+1) % ticker.length), 3000);
    return () => clearInterval(t);
  }, [ticker]);

  const filteredMatches = matches.filter(m =>
    activeTab==="live" ? m.status==="LIVE" :
    activeTab==="upcoming" ? (m.status?.includes("TODAY")||m.status?.includes("TOMORROW")) :
    activeTab==="completed" ? m.status==="COMPLETED" : true
  ).filter(m => !searchQuery || m.team1?.toLowerCase().includes(searchQuery.toLowerCase()) || m.team2?.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div style={{ minHeight:"100vh",background:C.bg,fontFamily:"'Segoe UI',sans-serif",color:C.textPrimary }}>
      {selectedMatch && <StreamPlayer match={selectedMatch} onClose={() => setSelectedMatch(null)} />}
      <header style={{ background:"linear-gradient(180deg,#1a0804 0%,#0d0604 100%)",borderBottom:`1px solid ${C.borderMid}`,position:"sticky",top:0,zIndex:100,boxShadow:"0 4px 30px rgba(0,0,0,0.6)" }}>
        {ticker.length > 0 && (
          <div style={{ background:C.gradient,padding:"5px 0",display:"flex",alignItems:"center" }}>
            <div style={{ background:"rgba(0,0,0,0.3)",color:"#fff",padding:"0 16px",fontWeight:"900",fontSize:"11px",whiteSpace:"nowrap" }}>🔴 LIVE</div>
            <div key={tickerIdx} style={{ color:"#fff",fontWeight:"700",fontSize:"12px",paddingLeft:"20px",animation:"tickerSlide 0.5s ease" }}>{ticker[tickerIdx]?.text}</div>
          </div>
        )}
        <div style={{ maxWidth:"1200px",margin:"0 auto",padding:"0 20px",display:"flex",alignItems:"center",justifyContent:"space-between",height:"60px" }}>
          <div style={{ display:"flex",alignItems:"center",gap:"10px" }}>
            <div style={{ background:C.gradient,borderRadius:"10px",padding:"6px 12px",fontFamily:"'Bebas Neue',cursive",fontSize:"22px",color:"#fff",letterSpacing:"2px" }}>🏏 CRICIFY</div>
            <span style={{ background:C.accentSoft,border:`1px solid ${C.accentBorder}`,color:C.accentBright,fontSize:"9px",fontWeight:"700",padding:"2px 7px",borderRadius:"20px" }}>LIVE</span>
          </div>
          <div style={{ position:"relative",flex:1,maxWidth:"300px",margin:"0 30px" }}>
            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search teams, matches..."
              style={{ width:"100%",background:"rgba(255,255,255,0.04)",border:`1px solid ${C.borderMid}`,borderRadius:"25px",padding:"8px 16px 8px 36px",color:C.textPrimary,fontSize:"13px",outline:"none" }} />
            <span style={{ position:"absolute",left:"12px",top:"50%",transform:"translateY(-50%)",color:C.textMuted }}>🔍</span>
          </div>
          <nav style={{ display:"flex",gap:"4px" }}>
            {["Matches","Schedule","News"].map(item => (
              <button key={item} style={{ background:"transparent",border:"none",color:C.textSecondary,padding:"8px 14px",borderRadius:"8px",cursor:"pointer",fontSize:"13px",fontWeight:"600" }}>{item}</button>
            ))}
          </nav>
        </div>
      </header>
      <main style={{ maxWidth:"1200px",margin:"0 auto",padding:"24px 20px",display:"flex",gap:"24px" }}>
        <div style={{ flex:1 }}>
          <div style={{ display:"flex",gap:"4px",marginBottom:"20px",background:"rgba(255,255,255,0.02)",padding:"4px",borderRadius:"12px",border:`1px solid ${C.borderMid}` }}>
            {[
              {key:"live",label:"🔴 Live",count:matches.filter(m=>m.status==="LIVE").length},
              {key:"upcoming",label:"📅 Upcoming",count:matches.filter(m=>m.status?.includes("TODAY")||m.status?.includes("TOMORROW")).length},
              {key:"completed",label:"✅ Completed",count:matches.filter(m=>m.status==="COMPLETED").length},
              {key:"all",label:"All",count:matches.length},
            ].map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{ flex:1,padding:"10px",border:"none",borderRadius:"9px",cursor:"pointer",fontSize:"13px",fontWeight:"700",background:activeTab===tab.key?C.gradient:"transparent",color:activeTab===tab.key?"#fff":C.textSecondary }}>
                {tab.label} <span style={{ background:"rgba(0,0,0,0.2)",borderRadius:"20px",padding:"1px 7px",fontSize:"11px" }}>{tab.count}</span>
              </button>
            ))}
          </div>
          {loading ? <div style={{ textAlign:"center",padding:"80px",color:C.accentBright }}><div style={{ fontSize:"40px",marginBottom:"16px" }}>⏳</div>Loading...</div>
          : filteredMatches.length===0 ? (
            <div style={{ textAlign:"center",padding:"60px",color:C.textMuted,background:"rgba(255,255,255,0.02)",borderRadius:"16px",border:`1px dashed ${C.borderMid}` }}>
              <div style={{ fontSize:"48px",marginBottom:"12px" }}>🏏</div><div>Koi match nahi</div>
            </div>
          ) : (
            <div style={{ display:"flex",flexDirection:"column",gap:"12px" }}>
              {filteredMatches.map(match => (
                <div key={match.id} className="match-card" style={{ background:`linear-gradient(135deg,${C.bgCard},${C.bgCard2})`,border:`1px solid ${match.status==="LIVE"?C.borderMid:C.border}`,borderRadius:"16px",padding:"20px",position:"relative",overflow:"hidden" }}>
                  {match.status==="LIVE"&&<div style={{ position:"absolute",top:0,right:0,width:"220px",height:"220px",background:`radial-gradient(circle,${C.accentGlow},transparent 70%)`,pointerEvents:"none" }} />}
                  <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"16px" }}>
                    <div style={{ display:"flex",gap:"8px",alignItems:"center" }}>
                      <span style={{ background:match.status==="LIVE"?C.accentSoft:match.status==="COMPLETED"?"rgba(100,100,100,0.2)":"rgba(33,150,243,0.15)",color:match.status==="LIVE"?C.accentBright:match.status==="COMPLETED"?"#888":"#2196f3",border:`1px solid ${match.status==="LIVE"?C.accentBorder:"rgba(100,100,100,0.3)"}`,padding:"3px 10px",borderRadius:"20px",fontSize:"11px",fontWeight:"700" }}>
                        {match.status==="LIVE"?"● LIVE":match.status}
                      </span>
                      <span style={{ color:C.textMuted,fontSize:"12px" }}>{match.type}</span>
                    </div>
                    <span style={{ color:C.textMuted,fontSize:"11px" }}>📍 {match.venue}</span>
                  </div>
                  <div style={{ display:"flex",alignItems:"center",gap:"16px",marginBottom:"16px" }}>
                    <div style={{ flex:1,textAlign:"center" }}>
                      <div style={{ fontSize:"32px",marginBottom:"4px" }}>{match.flag1}</div>
                      <div style={{ fontWeight:"800",fontSize:"16px",color:C.textPrimary,marginBottom:"4px" }}>{match.team1}</div>
                      {match.score1!=="—"&&<><div style={{ fontFamily:"'Bebas Neue',cursive",fontSize:"28px",color:C.accent,lineHeight:1 }}>{match.score1}</div><div style={{ color:C.textMuted,fontSize:"12px" }}>{match.overs1} overs</div></>}
                    </div>
                    <div style={{ textAlign:"center" }}>
                      <div style={{ fontFamily:"'Bebas Neue',cursive",fontSize:"22px",color:C.textMuted,background:C.accentSoft,border:`1px solid ${C.borderMid}`,borderRadius:"50%",width:"44px",height:"44px",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto" }}>VS</div>
                    </div>
                    <div style={{ flex:1,textAlign:"center" }}>
                      <div style={{ fontSize:"32px",marginBottom:"4px" }}>{match.flag2}</div>
                      <div style={{ fontWeight:"800",fontSize:"16px",color:C.textPrimary,marginBottom:"4px" }}>{match.team2}</div>
                      {match.score2!=="—"&&<><div style={{ fontFamily:"'Bebas Neue',cursive",fontSize:"28px",color:C.accent,lineHeight:1 }}>{match.score2}</div>{match.overs2!=="—"&&<div style={{ color:C.textMuted,fontSize:"12px" }}>{match.overs2} overs</div>}</>}
                    </div>
                  </div>
                  {match.result&&<div style={{ background:C.accentSoft,border:`1px solid ${C.accentBorder}`,borderRadius:"8px",padding:"8px 14px",marginBottom:"12px",textAlign:"center",color:C.accentBright,fontSize:"13px",fontWeight:"600" }}>🏆 {match.result}</div>}
                  {match.stream&&(
                    <div style={{ display:"flex",gap:"10px" }}>
                      <button onClick={() => setSelectedMatch(match)} style={{ flex:1,background:C.gradient,border:"none",borderRadius:"10px",padding:"12px",color:"#fff",fontWeight:"800",fontSize:"14px",cursor:"pointer",boxShadow:`0 4px 20px ${C.accentGlow}` }}>▶ WATCH LIVE STREAM</button>
                      <button style={{ background:C.accentSoft,border:`1px solid ${C.accentBorder}`,borderRadius:"10px",padding:"12px 16px",color:C.accentBright,cursor:"pointer",fontSize:"18px" }}>📊</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        <div style={{ width:"320px",flexShrink:0 }}>
          <div style={{ background:`linear-gradient(135deg,${C.bgCard},${C.bgCard2})`,border:`1px solid ${C.border}`,borderRadius:"16px",overflow:"hidden",position:"sticky",top:"90px" }}>
            <div style={{ padding:"16px 20px",borderBottom:`1px solid ${C.borderMid}`,display:"flex",alignItems:"center",justifyContent:"space-between" }}>
              <div style={{ fontFamily:"'Bebas Neue',cursive",fontSize:"20px",color:C.textPrimary }}>📰 LATEST NEWS</div>
              <span style={{ background:C.accentSoft,border:`1px solid ${C.accentBorder}`,color:C.accentBright,fontSize:"11px",padding:"2px 8px",borderRadius:"20px" }}>LIVE</span>
            </div>
            {news.map(item => (
              <div key={item.id} style={{ padding:"14px 20px",borderBottom:`1px solid ${C.border}`,cursor:"pointer",transition:"background 0.2s" }}
                onMouseEnter={e=>e.currentTarget.style.background=C.accentSoft} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <div style={{ display:"flex",gap:"8px" }}>
                  {item.hot&&<span style={{ color:C.accent,fontSize:"14px",flexShrink:0 }}>🔥</span>}
                  <div>
                    <div style={{ fontSize:"13px",color:C.textPrimary,lineHeight:"1.4",marginBottom:"6px",fontWeight:"500" }}>{item.title}</div>
                    <div style={{ display:"flex",gap:"8px" }}>
                      <span style={{ background:C.accentSoft,border:`1px solid ${C.accentBorder}`,color:C.accentBright,fontSize:"10px",padding:"1px 7px",borderRadius:"20px",fontWeight:"700" }}>{item.tag}</span>
                      <span style={{ color:C.textMuted,fontSize:"11px" }}>{item.time}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {apiNews.length>0&&(
              <>
                <div style={{ padding:"8px 16px",background:"rgba(255,69,0,0.08)",borderBottom:`1px solid ${C.borderMid}` }}>
                  <span style={{ color:C.accentBright,fontSize:"10px",fontWeight:"700",letterSpacing:"1px" }}>🌐 GOOGLE NEWS AUTO</span>
                </div>
                {apiNews.map((item,i) => (
                  <div key={i} style={{ padding:"12px 16px",borderBottom:i<apiNews.length-1?`1px solid ${C.border}`:"none",cursor:"pointer",transition:"background 0.2s" }}
                    onMouseEnter={e=>e.currentTarget.style.background=C.accentSoft} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    <div style={{ display:"flex",gap:"8px" }}>
                      <span style={{ color:C.accent,fontSize:"13px",flexShrink:0 }}>🔥</span>
                      <div>
                        <div style={{ fontSize:"12px",color:C.textPrimary,lineHeight:"1.4",marginBottom:"5px",fontWeight:"500" }}>{item.title}</div>
                        <div style={{ display:"flex",gap:"8px" }}>
                          <span style={{ background:"rgba(33,150,243,0.15)",border:"1px solid rgba(33,150,243,0.3)",color:"#64b5f6",fontSize:"9px",padding:"1px 6px",borderRadius:"20px",fontWeight:"700" }}>GOOGLE</span>
                          <span style={{ color:C.textMuted,fontSize:"10px" }}>{item.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
            {news.length===0&&apiNews.length===0&&<div style={{ padding:"30px",textAlign:"center",color:C.textMuted,fontSize:"13px" }}>News load ho rahi hai...</div>}
          </div>
          <div style={{ background:`linear-gradient(135deg,${C.bgCard},${C.bgCard2})`,border:`1px solid ${C.border}`,borderRadius:"16px",padding:"20px",marginTop:"16px" }}>
            <div style={{ fontFamily:"'Bebas Neue',cursive",fontSize:"18px",color:C.textPrimary,marginBottom:"14px" }}>⚡ QUICK STATS</div>
            {[
              {label:"Live Matches",value:matches.filter(m=>m.status==="LIVE").length,icon:"🔴"},
              {label:"Today's Matches",value:matches.filter(m=>m.status?.includes("TODAY")).length,icon:"📅"},
              {label:"Active Streams",value:matches.filter(m=>m.stream).length,icon:"📺"},
            ].map(stat => (
              <div key={stat.label} style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:`1px solid ${C.border}` }}>
                <span style={{ color:C.textSecondary,fontSize:"13px" }}>{stat.icon} {stat.label}</span>
                <span style={{ fontFamily:"'Bebas Neue',cursive",fontSize:"22px",color:C.accent }}>{stat.value}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer onNav={onNav} />
    </div>
  );
};

export default function App() {
  const isAdminRoute = window.location.hash==="#/admin"||window.location.pathname.endsWith("/admin");
  const [page, setPage] = useState(isAdminRoute?"adminLogin":"website");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash==="#/admin") setPage(isLoggedIn?"adminDash":"adminLogin");
      else setPage("website");
    };
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, [isLoggedIn]);

  const handleNav = (p) => setPage(p);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:4px;background:#120600}
        ::-webkit-scrollbar-thumb{background:#6a1e0a;border-radius:4px}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}
        @keyframes tickerSlide{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}
        .match-card:hover{transform:translateY(-2px);border-color:#ff4500!important;box-shadow:0 8px 30px rgba(255,69,0,0.2)!important}
        .match-card{transition:all 0.2s ease}
      `}</style>
      {page==="website" && <MainWebsite onNav={handleNav} />}
      {page==="about" && <AboutUs onBack={() => setPage("website")} />}
      {page==="privacy" && <PrivacyPolicy onBack={() => setPage("website")} />}
      {page==="contact" && <ContactUs onBack={() => setPage("website")} />}
      {page==="adminLogin" && <AdminLoginPage onSuccess={() => { setIsLoggedIn(true); setPage("adminDash"); }} />}
      {page==="adminDash" && isLoggedIn && <AdminDashboard onLogout={() => { setIsLoggedIn(false); setPage("adminLogin"); }} />}
    </>
  );
}
