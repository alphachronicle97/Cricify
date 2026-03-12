import { useState, useEffect, useCallback } from "react";

const SUPABASE_URL = "https://rnmiuggvwvluzpqicjqn.supabase.co";
const SUPABASE_KEY = "sb_publishable_VzshP4nH__Mk5BEplgO5VQ_QiIgnUt8";
const ADMIN_PASSWORD = "*kanishka@#23122010*"; // ← apna password yahan badlo

const C = {
  accent: "#ff4500",
  accentBright: "#ff6a00",
  accentGlow: "rgba(255,69,0,0.25)",
  accentSoft: "rgba(255,69,0,0.12)",
  accentBorder: "rgba(255,69,0,0.3)",
  bg: "#0d0604",
  bgCard: "#150a06",
  bgCard2: "#1a0d08",
  border: "#2a1206",
  borderMid: "#3a1a0a",
  textPrimary: "#fff0eb",
  textSecondary: "#c08070",
  textMuted: "#6a3020",
  gradient: "linear-gradient(135deg, #ff4500, #ff6a00)",
};

// ─── SUPABASE API ─────────────────────────────────────────────────────
const sb = async (method, table, body = null, filter = "") => {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}${filter}`, {
    method,
    headers: {
      "apikey": SUPABASE_KEY,
      "Authorization": `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      "Prefer": "return=representation",
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

// ─── INPUT ────────────────────────────────────────────────────────────
const Input = ({ label, value, onChange, placeholder, type = "text" }) => (
  <div style={{ marginBottom: "12px" }}>
    {label && <div style={{ color: "#aaa", fontSize: "11px", marginBottom: "4px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</div>}
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      style={{ width: "100%", background: "#1a1a25", border: "1px solid #2a2a3a", borderRadius: "8px", padding: "9px 12px", color: "#fff", fontSize: "13px", outline: "none" }} />
  </div>
);

// ─── ADMIN LOGIN PAGE ─────────────────────────────────────────────────
const AdminLoginPage = ({ onSuccess }) => {
  const [pass, setPass] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  const tryLogin = () => {
    if (pass === ADMIN_PASSWORD) {
      onSuccess();
    } else {
      setError(true); setShake(true);
      setTimeout(() => setShake(false), 500);
      setTimeout(() => setError(false), 2500);
      setPass("");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#060408", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Segoe UI', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        @keyframes shake { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-10px)} 40%,80%{transform:translateX(10px)} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
      <div style={{
        background: "linear-gradient(135deg, #120608, #0d0604)",
        border: `2px solid ${error ? "rgba(255,50,50,0.4)" : "rgba(255,69,0,0.25)"}`,
        borderRadius: "24px", padding: "50px 44px", width: "100%", maxWidth: "420px",
        textAlign: "center",
        boxShadow: `0 0 80px ${error ? "rgba(255,50,50,0.15)" : "rgba(255,69,0,0.12)"}`,
        animation: shake ? "shake 0.4s ease" : "fadeIn 0.5s ease",
        transition: "border-color 0.3s, box-shadow 0.3s"
      }}>
        {/* Logo */}
        <div style={{ marginBottom: "8px" }}>
          <div style={{ background: C.gradient, borderRadius: "12px", padding: "8px 16px", fontFamily: "'Bebas Neue', cursive", fontSize: "28px", color: "#fff", letterSpacing: "3px", display: "inline-block", boxShadow: `0 0 30px ${C.accentGlow}` }}>🏏 CRICIFY</div>
        </div>
        <div style={{ color: C.textMuted, fontSize: "12px", marginBottom: "36px", letterSpacing: "1px" }}>ADMIN DASHBOARD</div>

        <div style={{ fontSize: "52px", marginBottom: "16px" }}>🔐</div>
        <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "24px", color: C.textPrimary, letterSpacing: "2px", marginBottom: "6px" }}>SECURE LOGIN</div>
        <div style={{ color: "#444", fontSize: "13px", marginBottom: "30px" }}>Sirf authorized admin ke liye</div>

        <input
          type="password"
          value={pass}
          onChange={e => { setPass(e.target.value); setError(false); }}
          onKeyDown={e => e.key === "Enter" && tryLogin()}
          placeholder="Password darj karein..."
          autoFocus
          style={{
            width: "100%",
            background: error ? "rgba(255,50,50,0.08)" : "rgba(255,255,255,0.04)",
            border: `1px solid ${error ? "rgba(255,50,50,0.4)" : "#2a1a10"}`,
            borderRadius: "12px", padding: "14px 18px",
            color: "#fff", fontSize: "16px", outline: "none",
            textAlign: "center", letterSpacing: "6px",
            marginBottom: "10px", transition: "all 0.3s"
          }}
        />

        {error && (
          <div style={{ color: "#ff4444", fontSize: "13px", marginBottom: "14px", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
            ❌ Galat password! Dobara try karein.
          </div>
        )}
        {!error && <div style={{ height: "24px", marginBottom: "0px" }} />}

        <button
          onClick={tryLogin}
          style={{
            width: "100%", background: C.gradient, border: "none",
            color: "#fff", borderRadius: "12px", padding: "14px",
            cursor: "pointer", fontWeight: "800", fontSize: "16px",
            letterSpacing: "1px", boxShadow: `0 6px 25px ${C.accentGlow}`,
            marginBottom: "20px"
          }}
        >
          🔓 LOGIN
        </button>

        <div style={{ color: "#2a1a10", fontSize: "11px" }}>
          © Cricify Admin Panel • Unauthorized access prohibited
        </div>
      </div>
    </div>
  );
};

// ─── STREAM PLAYER ────────────────────────────────────────────────────
const StreamPlayer = ({ match, onClose }) => {
  const [volume, setVolume] = useState(80);
  const [quality, setQuality] = useState("HD");
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.96)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div style={{ width: "100%", maxWidth: "900px", background: C.bgCard, borderRadius: "16px", overflow: "hidden", border: `1px solid ${C.borderMid}`, boxShadow: `0 0 60px ${C.accentGlow}` }}>
        <div style={{ background: "linear-gradient(135deg,#2a0d06,#0d0604)", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${C.borderMid}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ background: C.accent, color: "#fff", padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "800", animation: "pulse 1.5s infinite" }}>● LIVE</div>
            <span style={{ color: C.textPrimary, fontWeight: "700", fontSize: "15px", fontFamily: "'Bebas Neue', cursive" }}>{match.flag1} {match.team1} vs {match.team2} {match.flag2}</span>
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,80,80,0.15)", border: "1px solid rgba(255,80,80,0.3)", color: "#ff5252", borderRadius: "8px", padding: "6px 14px", cursor: "pointer", fontSize: "13px", fontWeight: "600" }}>✕ Close</button>
        </div>
        <div style={{ width: "100%", aspectRatio: "16/9", background: "#0a0200", position: "relative", backgroundImage: "radial-gradient(ellipse at center,#2a0d06 0%,#0a0200 70%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {match.stream_url ? (
            <iframe src={match.stream_url} style={{ width: "100%", height: "100%", border: "none", position: "absolute", inset: 0 }} allowFullScreen title="stream" />
          ) : (
            <div style={{ textAlign: "center", zIndex: 2 }}>
              <div style={{ fontSize: "56px", marginBottom: "12px" }}>📺</div>
              <div style={{ color: C.accent, fontSize: "20px", fontWeight: "800", fontFamily: "'Bebas Neue', cursive", letterSpacing: "2px", marginBottom: "8px" }}>STREAM COMING SOON</div>
              <div style={{ color: C.textMuted, fontSize: "13px" }}>Admin se stream URL add karwayein</div>
            </div>
          )}
          <div style={{ position: "absolute", top: "16px", left: "16px", background: "rgba(0,0,0,0.88)", backdropFilter: "blur(8px)", borderRadius: "10px", padding: "10px 16px", border: `1px solid ${C.accentBorder}`, zIndex: 10 }}>
            <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ color: "#aaa", fontSize: "10px" }}>{match.team1}</div>
                <div style={{ color: "#fff", fontSize: "18px", fontWeight: "800", fontFamily: "'Bebas Neue', cursive" }}>{match.score1}</div>
                <div style={{ color: "#666", fontSize: "10px" }}>{match.overs1} ov</div>
              </div>
              <div style={{ color: C.accent, fontWeight: "900", fontSize: "14px" }}>VS</div>
              <div style={{ textAlign: "center" }}>
                <div style={{ color: "#aaa", fontSize: "10px" }}>{match.team2}</div>
                <div style={{ color: "#fff", fontSize: "18px", fontWeight: "800", fontFamily: "'Bebas Neue', cursive" }}>{match.score2}</div>
                <div style={{ color: "#666", fontSize: "10px" }}>{match.overs2} ov</div>
              </div>
            </div>
          </div>
        </div>
        <div style={{ padding: "14px 20px", background: "#120600", display: "flex", alignItems: "center", gap: "16px", borderTop: `1px solid ${C.borderMid}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ color: C.textMuted }}>🔊</span>
            <input type="range" min="0" max="100" value={volume} onChange={e => setVolume(e.target.value)} style={{ accentColor: C.accent, width: "100px" }} />
            <span style={{ color: C.textMuted, fontSize: "11px" }}>{volume}%</span>
          </div>
          <div style={{ display: "flex", gap: "6px" }}>
            {["480p","720p","HD","4K"].map(q => (
              <button key={q} onClick={() => setQuality(q)} style={{ background: quality === q ? C.gradient : C.accentSoft, color: quality === q ? "#fff" : C.accentBright, border: `1px solid ${C.accentBorder}`, borderRadius: "6px", padding: "4px 10px", fontSize: "11px", cursor: "pointer", fontWeight: "600" }}>{q}</button>
            ))}
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
    if (m) setMatches(m);
    if (n) setNews(n);
    if (t) setTicker(t);
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const blankMatch = { team1: "", team2: "", flag1: "🏏", flag2: "🏏", score1: "—", score2: "—", overs1: "—", overs2: "—", status: "LIVE", type: "T20 • Series", venue: "", stream: false, stream_url: "", result: "" };
  const blankNews = { title: "", tag: "NEWS", time: "Just now", hot: false };

  const saveMatch = async () => {
    if (!editMatch.team1 || !editMatch.team2) { showToast("❌ Team names required!"); return; }
    setSaving(true);
    if (editMatch.id) await dbUpdate("matches", editMatch.id, editMatch);
    else await dbInsert("matches", editMatch);
    await loadData(); setEditMatch(null); setSaving(false); showToast("✅ Match saved!");
  };

  const deleteMatch = async (id) => {
    if (!window.confirm("Match delete karein?")) return;
    await dbDelete("matches", id); await loadData(); showToast("🗑 Match deleted!");
  };

  const saveNews = async () => {
    if (!editNews.title) { showToast("❌ Headline required!"); return; }
    setSaving(true);
    if (editNews.id) await dbUpdate("news", editNews.id, editNews);
    else await dbInsert("news", editNews);
    await loadData(); setEditNews(null); setSaving(false); showToast("✅ News saved!");
  };

  const deleteNews = async (id) => {
    if (!window.confirm("News delete karein?")) return;
    await dbDelete("news", id); await loadData(); showToast("🗑 News deleted!");
  };

  const addTicker = async () => {
    if (!newTicker.trim()) return;
    await dbInsert("ticker", { text: newTicker.trim() });
    setNewTicker(""); await loadData(); showToast("✅ Ticker added!");
  };

  const deleteTicker = async (id) => {
    await dbDelete("ticker", id); await loadData(); showToast("🗑 Removed!");
  };

  const tabStyle = (key) => ({ padding: "10px 20px", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: "700", background: tab === key ? C.gradient : "rgba(255,255,255,0.05)", color: tab === key ? "#fff" : "#888", transition: "all 0.2s" });

  return (
    <div style={{ minHeight: "100vh", background: "#060408", fontFamily: "'Segoe UI', sans-serif", color: "#fff" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      {toast && <div style={{ position: "fixed", top: "20px", right: "20px", background: "#0d1a0d", border: "1px solid #2a5a2a", color: "#4caf50", borderRadius: "10px", padding: "12px 20px", zIndex: 9999, fontSize: "14px", fontWeight: "600", boxShadow: "0 4px 20px rgba(0,0,0,0.5)" }}>{toast}</div>}

      {/* Admin Header */}
      <header style={{ background: "linear-gradient(135deg, #120608, #0d0604)", borderBottom: `1px solid ${C.borderMid}`, padding: "0 30px", height: "65px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 4px 20px rgba(0,0,0,0.5)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{ background: C.gradient, borderRadius: "10px", padding: "5px 12px", fontFamily: "'Bebas Neue', cursive", fontSize: "20px", color: "#fff", letterSpacing: "2px" }}>🏏 CRICIFY</div>
          <div style={{ background: "rgba(255,69,0,0.15)", border: `1px solid ${C.accentBorder}`, color: C.accentBright, fontSize: "11px", fontWeight: "700", padding: "3px 10px", borderRadius: "20px", letterSpacing: "1px" }}>⚙️ ADMIN PANEL</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button onClick={loadData} style={{ background: C.accentSoft, border: `1px solid ${C.accentBorder}`, color: C.accentBright, borderRadius: "8px", padding: "7px 14px", cursor: "pointer", fontSize: "13px" }}>🔄 Refresh</button>
          <button onClick={onLogout} style={{ background: "rgba(255,80,80,0.12)", border: "1px solid rgba(255,80,80,0.3)", color: "#ff5252", borderRadius: "8px", padding: "7px 14px", cursor: "pointer", fontSize: "13px", fontWeight: "600" }}>🔒 Logout</button>
        </div>
      </header>

      <div style={{ maxWidth: "960px", margin: "0 auto", padding: "30px 20px" }}>
        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "28px" }}>
          {[
            { label: "Total Matches", value: matches.length, icon: "🏏", color: C.accent },
            { label: "Total News", value: news.length, icon: "📰", color: "#2196f3" },
            { label: "Ticker Lines", value: ticker.length, icon: "📢", color: "#4caf50" },
          ].map(s => (
            <div key={s.label} style={{ background: "linear-gradient(135deg,#120608,#0d0604)", border: `1px solid ${C.borderMid}`, borderRadius: "14px", padding: "20px", display: "flex", alignItems: "center", gap: "16px" }}>
              <div style={{ fontSize: "32px" }}>{s.icon}</div>
              <div>
                <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "32px", color: s.color, lineHeight: 1 }}>{s.value}</div>
                <div style={{ color: "#555", fontSize: "12px", marginTop: "2px" }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
          <button style={tabStyle("matches")} onClick={() => setTab("matches")}>🏏 Matches</button>
          <button style={tabStyle("news")} onClick={() => setTab("news")}>📰 News</button>
          <button style={tabStyle("ticker")} onClick={() => setTab("ticker")}>📢 Ticker</button>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "80px", color: C.accentBright }}>
            <div style={{ fontSize: "36px", marginBottom: "12px" }}>⏳</div>
            <div>Database se data load ho raha hai...</div>
          </div>
        ) : (
          <>
            {/* ── MATCHES ── */}
            {tab === "matches" && (
              <div style={{ animation: "fadeIn 0.3s ease" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                  <div style={{ color: "#555", fontSize: "13px" }}>{matches.length} matches database mein</div>
                  <button onClick={() => setEditMatch({ ...blankMatch })} style={{ background: C.gradient, border: "none", color: "#fff", borderRadius: "8px", padding: "9px 20px", cursor: "pointer", fontWeight: "700", fontSize: "13px", boxShadow: `0 4px 15px ${C.accentGlow}` }}>+ Naya Match</button>
                </div>

                {matches.length === 0 && !editMatch && <div style={{ textAlign: "center", padding: "50px", color: "#333", background: "rgba(255,255,255,0.02)", borderRadius: "14px", border: "1px dashed #2a1206" }}>Koi match nahi — naya add karo!</div>}

                {matches.map(m => (
                  <div key={m.id} style={{ background: "linear-gradient(135deg,#120608,#0d0604)", border: `1px solid ${m.status === "LIVE" ? C.borderMid : C.border}`, borderRadius: "12px", padding: "16px 20px", marginBottom: "10px", display: "flex", alignItems: "center", justifyContent: "space-between", animation: "fadeIn 0.3s ease" }}>
                    <div>
                      <div style={{ color: "#fff", fontWeight: "700", fontSize: "15px", marginBottom: "4px" }}>{m.flag1} {m.team1} vs {m.team2} {m.flag2}</div>
                      <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                        <span style={{ background: m.status === "LIVE" ? C.accentSoft : "rgba(100,100,100,0.15)", color: m.status === "LIVE" ? C.accentBright : "#888", border: `1px solid ${m.status === "LIVE" ? C.accentBorder : "rgba(100,100,100,0.3)"}`, padding: "2px 8px", borderRadius: "20px", fontSize: "11px", fontWeight: "700" }}>{m.status === "LIVE" ? "● LIVE" : m.status}</span>
                        <span style={{ color: "#555", fontSize: "12px" }}>{m.type}</span>
                        {m.venue && <span style={{ color: "#444", fontSize: "11px" }}>📍 {m.venue}</span>}
                        {m.stream && <span style={{ color: "#4caf50", fontSize: "11px" }}>📺 Stream ON</span>}
                      </div>
                      <div style={{ color: "#555", fontSize: "12px", marginTop: "4px" }}>{m.score1} | {m.score2}</div>
                    </div>
                    <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                      <button onClick={() => setEditMatch({ ...m })} style={{ background: "rgba(255,165,0,0.12)", border: "1px solid rgba(255,165,0,0.3)", color: "#ffa500", borderRadius: "7px", padding: "7px 16px", cursor: "pointer", fontSize: "12px", fontWeight: "600" }}>✏️ Edit</button>
                      <button onClick={() => deleteMatch(m.id)} style={{ background: "rgba(255,80,80,0.1)", border: "1px solid rgba(255,80,80,0.3)", color: "#ff5252", borderRadius: "7px", padding: "7px 14px", cursor: "pointer", fontSize: "12px" }}>🗑</button>
                    </div>
                  </div>
                ))}

                {editMatch && (
                  <div style={{ background: "#0a0410", border: `2px solid ${C.accentBorder}`, borderRadius: "16px", padding: "24px", marginTop: "16px", animation: "fadeIn 0.3s ease" }}>
                    <div style={{ color: C.accentBright, fontWeight: "800", fontSize: "16px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
                      {editMatch.id ? "✏️ Match Edit Karein" : "➕ Naya Match Add Karein"}
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
                      <Input label="Team 1 Name" value={editMatch.team1} onChange={v => setEditMatch({ ...editMatch, team1: v })} placeholder="e.g. India" />
                      <Input label="Team 2 Name" value={editMatch.team2} onChange={v => setEditMatch({ ...editMatch, team2: v })} placeholder="e.g. Australia" />
                      <Input label="Team 1 Flag (emoji)" value={editMatch.flag1} onChange={v => setEditMatch({ ...editMatch, flag1: v })} placeholder="🇮🇳" />
                      <Input label="Team 2 Flag (emoji)" value={editMatch.flag2} onChange={v => setEditMatch({ ...editMatch, flag2: v })} placeholder="🇦🇺" />
                      <Input label="Team 1 Score" value={editMatch.score1} onChange={v => setEditMatch({ ...editMatch, score1: v })} placeholder="287/4 ya —" />
                      <Input label="Team 2 Score" value={editMatch.score2} onChange={v => setEditMatch({ ...editMatch, score2: v })} placeholder="243/8 ya —" />
                      <Input label="Team 1 Overs" value={editMatch.overs1} onChange={v => setEditMatch({ ...editMatch, overs1: v })} placeholder="45.2 ya —" />
                      <Input label="Team 2 Overs" value={editMatch.overs2} onChange={v => setEditMatch({ ...editMatch, overs2: v })} placeholder="50.0 ya —" />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
                      <div style={{ marginBottom: "12px" }}>
                        <div style={{ color: "#aaa", fontSize: "11px", marginBottom: "4px", fontWeight: "600", textTransform: "uppercase" }}>Match Status</div>
                        <select value={editMatch.status} onChange={e => setEditMatch({ ...editMatch, status: e.target.value })}
                          style={{ width: "100%", background: "#1a1a25", border: "1px solid #2a2a3a", borderRadius: "8px", padding: "9px 12px", color: "#fff", fontSize: "13px", outline: "none" }}>
                          <option value="LIVE">🔴 LIVE</option>
                          <option value="TODAY 7:30 PM">📅 TODAY</option>
                          <option value="TOMORROW 3:00 PM">📅 TOMORROW</option>
                          <option value="COMPLETED">✅ COMPLETED</option>
                        </select>
                      </div>
                      <Input label="Match Type" value={editMatch.type} onChange={v => setEditMatch({ ...editMatch, type: v })} placeholder="T20 • Series" />
                    </div>
                    <Input label="Venue / Stadium" value={editMatch.venue} onChange={v => setEditMatch({ ...editMatch, venue: v })} placeholder="Wankhede Stadium, Mumbai" />
                    <Input label="Match Result (sirf completed ke liye)" value={editMatch.result || ""} onChange={v => setEditMatch({ ...editMatch, result: v })} placeholder="India won by 50 runs" />

                    <div style={{ background: "rgba(255,69,0,0.06)", border: `1px solid ${C.accentBorder}`, borderRadius: "10px", padding: "14px", marginBottom: "12px" }}>
                      <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", color: "#ccc", fontSize: "14px", fontWeight: "600" }}>
                        <input type="checkbox" checked={editMatch.stream} onChange={e => setEditMatch({ ...editMatch, stream: e.target.checked })} style={{ accentColor: C.accent, width: "18px", height: "18px" }} />
                        📺 Live Stream Enable karein?
                      </label>
                      {editMatch.stream && (
                        <div style={{ marginTop: "12px" }}>
                          <Input label="Stream Embed URL" value={editMatch.stream_url || ""} onChange={v => setEditMatch({ ...editMatch, stream_url: v })} placeholder="https://www.youtube.com/embed/LIVE_VIDEO_ID" />
                          <div style={{ color: "#555", fontSize: "11px", marginTop: "-8px" }}>YouTube: youtube.com/embed/ID | Facebook: facebook.com/plugins/video.php?href=URL</div>
                        </div>
                      )}
                    </div>

                    <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
                      <button onClick={saveMatch} disabled={saving} style={{ background: C.gradient, border: "none", color: "#fff", borderRadius: "10px", padding: "12px 28px", cursor: "pointer", fontWeight: "800", fontSize: "14px", opacity: saving ? 0.7 : 1, boxShadow: `0 4px 15px ${C.accentGlow}` }}>
                        {saving ? "⏳ Saving..." : "✓ Save Match"}
                      </button>
                      <button onClick={() => setEditMatch(null)} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid #333", color: "#888", borderRadius: "10px", padding: "12px 20px", cursor: "pointer", fontSize: "13px" }}>Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── NEWS ── */}
            {tab === "news" && (
              <div style={{ animation: "fadeIn 0.3s ease" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                  <div style={{ color: "#555", fontSize: "13px" }}>{news.length} news database mein</div>
                  <button onClick={() => setEditNews({ ...blankNews })} style={{ background: C.gradient, border: "none", color: "#fff", borderRadius: "8px", padding: "9px 20px", cursor: "pointer", fontWeight: "700", fontSize: "13px", boxShadow: `0 4px 15px ${C.accentGlow}` }}>+ Nayi News</button>
                </div>

                {news.length === 0 && !editNews && <div style={{ textAlign: "center", padding: "50px", color: "#333", background: "rgba(255,255,255,0.02)", borderRadius: "14px", border: "1px dashed #2a1206" }}>Koi news nahi — nayi add karo!</div>}

                {news.map(n => (
                  <div key={n.id} style={{ background: "linear-gradient(135deg,#120608,#0d0604)", border: `1px solid ${C.border}`, borderRadius: "12px", padding: "14px 18px", marginBottom: "10px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ color: "#fff", fontWeight: "600", fontSize: "13px", marginBottom: "4px" }}>{n.hot ? "🔥 " : ""}{n.title}</div>
                      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        <span style={{ background: C.accentSoft, border: `1px solid ${C.accentBorder}`, color: C.accentBright, fontSize: "10px", padding: "1px 7px", borderRadius: "20px", fontWeight: "700" }}>{n.tag}</span>
                        <span style={{ color: "#555", fontSize: "11px" }}>{n.time}</span>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button onClick={() => setEditNews({ ...n })} style={{ background: "rgba(255,165,0,0.12)", border: "1px solid rgba(255,165,0,0.3)", color: "#ffa500", borderRadius: "7px", padding: "7px 16px", cursor: "pointer", fontSize: "12px", fontWeight: "600" }}>✏️ Edit</button>
                      <button onClick={() => deleteNews(n.id)} style={{ background: "rgba(255,80,80,0.1)", border: "1px solid rgba(255,80,80,0.3)", color: "#ff5252", borderRadius: "7px", padding: "7px 14px", cursor: "pointer", fontSize: "12px" }}>🗑</button>
                    </div>
                  </div>
                ))}

                {editNews && (
                  <div style={{ background: "#0a0410", border: `2px solid ${C.accentBorder}`, borderRadius: "16px", padding: "24px", marginTop: "16px", animation: "fadeIn 0.3s ease" }}>
                    <div style={{ color: C.accentBright, fontWeight: "800", fontSize: "16px", marginBottom: "20px" }}>{editNews.id ? "✏️ News Edit" : "➕ Nayi News"}</div>
                    <Input label="News Headline" value={editNews.title} onChange={v => setEditNews({ ...editNews, title: v })} placeholder="Yahan news headline likhein..." />
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
                      <Input label="Tag (e.g. IND, IPL, ICC)" value={editNews.tag} onChange={v => setEditNews({ ...editNews, tag: v })} placeholder="IND" />
                      <Input label="Time (e.g. 2 min ago)" value={editNews.time} onChange={v => setEditNews({ ...editNews, time: v })} placeholder="Just now" />
                    </div>
                    <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", color: "#ccc", fontSize: "14px", marginBottom: "20px" }}>
                      <input type="checkbox" checked={editNews.hot} onChange={e => setEditNews({ ...editNews, hot: e.target.checked })} style={{ accentColor: C.accent, width: "18px", height: "18px" }} />
                      🔥 Hot/Trending news mark karein?
                    </label>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <button onClick={saveNews} disabled={saving} style={{ background: C.gradient, border: "none", color: "#fff", borderRadius: "10px", padding: "12px 28px", cursor: "pointer", fontWeight: "800", fontSize: "14px", opacity: saving ? 0.7 : 1 }}>{saving ? "⏳ Saving..." : "✓ Save News"}</button>
                      <button onClick={() => setEditNews(null)} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid #333", color: "#888", borderRadius: "10px", padding: "12px 20px", cursor: "pointer", fontSize: "13px" }}>Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── TICKER ── */}
            {tab === "ticker" && (
              <div style={{ animation: "fadeIn 0.3s ease" }}>
                <div style={{ background: "linear-gradient(135deg,#120608,#0d0604)", border: `1px solid ${C.borderMid}`, borderRadius: "12px", padding: "18px", marginBottom: "16px" }}>
                  <div style={{ color: "#aaa", fontSize: "11px", fontWeight: "600", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Nayi Ticker Line Add Karein</div>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <input value={newTicker} onChange={e => setNewTicker(e.target.value)} onKeyDown={e => e.key === "Enter" && addTicker()} placeholder="🏏 IND vs AUS: KOHLI 87* (62)"
                      style={{ flex: 1, background: "#1a1a25", border: "1px solid #2a2a3a", borderRadius: "8px", padding: "10px 14px", color: "#fff", fontSize: "13px", outline: "none" }} />
                    <button onClick={addTicker} style={{ background: C.gradient, border: "none", color: "#fff", borderRadius: "8px", padding: "10px 20px", cursor: "pointer", fontWeight: "700", fontSize: "13px", whiteSpace: "nowrap" }}>+ Add</button>
                  </div>
                </div>
                {ticker.length === 0 && <div style={{ textAlign: "center", padding: "50px", color: "#333", background: "rgba(255,255,255,0.02)", borderRadius: "14px", border: "1px dashed #2a1206" }}>Koi ticker nahi!</div>}
                {ticker.map((t, i) => (
                  <div key={t.id} style={{ background: "linear-gradient(135deg,#120608,#0d0604)", border: `1px solid ${C.border}`, borderRadius: "10px", padding: "13px 18px", marginBottom: "8px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{ color: C.accentBright, fontSize: "12px", fontWeight: "700" }}>#{i + 1}</span>
                      <span style={{ color: "#ddd", fontSize: "13px" }}>{t.text}</span>
                    </div>
                    <button onClick={() => deleteTicker(t.id)} style={{ background: "rgba(255,80,80,0.1)", border: "1px solid rgba(255,80,80,0.3)", color: "#ff5252", borderRadius: "6px", padding: "5px 14px", cursor: "pointer", fontSize: "12px" }}>✕ Remove</button>
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

// ─── MAIN WEBSITE ─────────────────────────────────────────────────────
const MainWebsite = () => {
  const [matches, setMatches] = useState([]);
  const [news, setNews] = useState([]);
  const [ticker, setTicker] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("live");
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [tickerIdx, setTickerIdx] = useState(0);

  const loadData = useCallback(async () => {
    const [m, n, t] = await Promise.all([dbGet("matches"), dbGet("news"), dbGet("ticker")]);
    if (m) setMatches(m);
    if (n) setNews(n);
    if (t) setTicker(t);
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);
  useEffect(() => { const i = setInterval(loadData, 30000); return () => clearInterval(i); }, [loadData]);
  useEffect(() => {
    if (ticker.length === 0) return;
    const t = setInterval(() => setTickerIdx(p => (p + 1) % ticker.length), 3000);
    return () => clearInterval(t);
  }, [ticker]);

  const filteredMatches = matches.filter(m =>
    activeTab === "live" ? m.status === "LIVE" :
    activeTab === "upcoming" ? (m.status?.includes("TODAY") || m.status?.includes("TOMORROW")) :
    activeTab === "completed" ? m.status === "COMPLETED" : true
  ).filter(m => !searchQuery || m.team1?.toLowerCase().includes(searchQuery.toLowerCase()) || m.team2?.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Segoe UI', sans-serif", color: C.textPrimary }}>
      {selectedMatch && <StreamPlayer match={selectedMatch} onClose={() => setSelectedMatch(null)} />}

      {/* Header */}
      <header style={{ background: "linear-gradient(180deg,#1a0804 0%,#0d0604 100%)", borderBottom: `1px solid ${C.borderMid}`, position: "sticky", top: 0, zIndex: 100, boxShadow: "0 4px 30px rgba(0,0,0,0.6)" }}>
        {ticker.length > 0 && (
          <div style={{ background: C.gradient, padding: "5px 0", overflow: "hidden", display: "flex", alignItems: "center" }}>
            <div style={{ background: "rgba(0,0,0,0.3)", color: "#fff", padding: "0 16px", fontWeight: "900", fontSize: "11px", letterSpacing: "1px", whiteSpace: "nowrap", display: "flex", alignItems: "center" }}>🔴 LIVE</div>
            <div key={tickerIdx} style={{ color: "#fff", fontWeight: "700", fontSize: "12px", paddingLeft: "20px", animation: "tickerSlide 0.5s ease" }}>{ticker[tickerIdx]?.text}</div>
          </div>
        )}
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", height: "60px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ background: C.gradient, borderRadius: "10px", padding: "6px 12px", fontFamily: "'Bebas Neue', cursive", fontSize: "22px", color: "#fff", letterSpacing: "2px", boxShadow: `0 0 20px ${C.accentGlow}` }}>🏏 CRICIFY</div>
            <span style={{ background: C.accentSoft, border: `1px solid ${C.accentBorder}`, color: C.accentBright, fontSize: "9px", fontWeight: "700", padding: "2px 7px", borderRadius: "20px", letterSpacing: "1px" }}>LIVE</span>
          </div>
          <div style={{ position: "relative", flex: 1, maxWidth: "300px", margin: "0 30px" }}>
            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search teams, matches..."
              style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: `1px solid ${C.borderMid}`, borderRadius: "25px", padding: "8px 16px 8px 36px", color: C.textPrimary, fontSize: "13px", outline: "none" }} />
            <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: C.textMuted }}>🔍</span>
          </div>
          <nav style={{ display: "flex", gap: "4px" }}>
            {["Matches","Schedule","News"].map(item => (
              <button key={item} style={{ background: "transparent", border: "none", color: C.textSecondary, padding: "8px 14px", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: "600" }}>{item}</button>
            ))}
          </nav>
        </div>
      </header>

      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px 20px", display: "flex", gap: "24px" }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", gap: "4px", marginBottom: "20px", background: "rgba(255,255,255,0.02)", padding: "4px", borderRadius: "12px", border: `1px solid ${C.borderMid}` }}>
            {[
              { key: "live", label: "🔴 Live", count: matches.filter(m => m.status === "LIVE").length },
              { key: "upcoming", label: "📅 Upcoming", count: matches.filter(m => m.status?.includes("TODAY") || m.status?.includes("TOMORROW")).length },
              { key: "completed", label: "✅ Completed", count: matches.filter(m => m.status === "COMPLETED").length },
              { key: "all", label: "All", count: matches.length },
            ].map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{ flex: 1, padding: "10px", border: "none", borderRadius: "9px", cursor: "pointer", fontSize: "13px", fontWeight: "700", transition: "all 0.2s", background: activeTab === tab.key ? C.gradient : "transparent", color: activeTab === tab.key ? "#fff" : C.textSecondary, boxShadow: activeTab === tab.key ? `0 4px 15px ${C.accentGlow}` : "none" }}>
                {tab.label} <span style={{ background: activeTab === tab.key ? "rgba(0,0,0,0.2)" : C.accentSoft, borderRadius: "20px", padding: "1px 7px", fontSize: "11px" }}>{tab.count}</span>
              </button>
            ))}
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "80px", color: C.accentBright }}>
              <div style={{ fontSize: "40px", marginBottom: "16px" }}>⏳</div>
              <div>Loading matches...</div>
            </div>
          ) : filteredMatches.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px", color: C.textMuted, background: "rgba(255,255,255,0.02)", borderRadius: "16px", border: `1px dashed ${C.borderMid}` }}>
              <div style={{ fontSize: "48px", marginBottom: "12px" }}>🏏</div>
              <div style={{ fontSize: "16px" }}>Koi match nahi</div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {filteredMatches.map(match => (
                <div key={match.id} className="match-card" style={{ background: `linear-gradient(135deg,${C.bgCard} 0%,${C.bgCard2} 100%)`, border: `1px solid ${match.status === "LIVE" ? C.borderMid : C.border}`, borderRadius: "16px", padding: "20px", position: "relative", overflow: "hidden" }}>
                  {match.status === "LIVE" && <div style={{ position: "absolute", top: 0, right: 0, width: "220px", height: "220px", background: `radial-gradient(circle,${C.accentGlow} 0%,transparent 70%)`, pointerEvents: "none" }} />}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      <span style={{ background: match.status === "LIVE" ? C.accentSoft : match.status === "COMPLETED" ? "rgba(100,100,100,0.2)" : "rgba(33,150,243,0.15)", color: match.status === "LIVE" ? C.accentBright : match.status === "COMPLETED" ? "#888" : "#2196f3", border: `1px solid ${match.status === "LIVE" ? C.accentBorder : "rgba(100,100,100,0.3)"}`, padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "700", ...(match.status === "LIVE" ? { animation: "pulse 1.5s infinite" } : {}) }}>
                        {match.status === "LIVE" ? "● LIVE" : match.status}
                      </span>
                      <span style={{ color: C.textMuted, fontSize: "12px" }}>{match.type}</span>
                    </div>
                    <span style={{ color: C.textMuted, fontSize: "11px" }}>📍 {match.venue}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px" }}>
                    <div style={{ flex: 1, textAlign: "center" }}>
                      <div style={{ fontSize: "32px", marginBottom: "4px" }}>{match.flag1}</div>
                      <div style={{ fontWeight: "800", fontSize: "16px", color: C.textPrimary, marginBottom: "4px" }}>{match.team1}</div>
                      {match.score1 !== "—" && (<><div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "28px", color: C.accent, lineHeight: 1 }}>{match.score1}</div><div style={{ color: C.textMuted, fontSize: "12px" }}>{match.overs1} overs</div></>)}
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "22px", color: C.textMuted, background: C.accentSoft, border: `1px solid ${C.borderMid}`, borderRadius: "50%", width: "44px", height: "44px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto" }}>VS</div>
                    </div>
                    <div style={{ flex: 1, textAlign: "center" }}>
                      <div style={{ fontSize: "32px", marginBottom: "4px" }}>{match.flag2}</div>
                      <div style={{ fontWeight: "800", fontSize: "16px", color: C.textPrimary, marginBottom: "4px" }}>{match.team2}</div>
                      {match.score2 !== "—" && (<><div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "28px", color: C.accent, lineHeight: 1 }}>{match.score2}</div>{match.overs2 !== "—" && <div style={{ color: C.textMuted, fontSize: "12px" }}>{match.overs2} overs</div>}</>)}
                    </div>
                  </div>
                  {match.result && <div style={{ background: C.accentSoft, border: `1px solid ${C.accentBorder}`, borderRadius: "8px", padding: "8px 14px", marginBottom: "12px", textAlign: "center", color: C.accentBright, fontSize: "13px", fontWeight: "600" }}>🏆 {match.result}</div>}
                  {match.stream && (
                    <div style={{ display: "flex", gap: "10px" }}>
                      <button onClick={() => setSelectedMatch(match)} style={{ flex: 1, background: C.gradient, border: "none", borderRadius: "10px", padding: "12px", color: "#fff", fontWeight: "800", fontSize: "14px", cursor: "pointer", letterSpacing: "0.5px", boxShadow: `0 4px 20px ${C.accentGlow}`, transition: "all 0.15s" }}>▶ WATCH LIVE STREAM</button>
                      <button style={{ background: C.accentSoft, border: `1px solid ${C.accentBorder}`, borderRadius: "10px", padding: "12px 16px", color: C.accentBright, cursor: "pointer", fontSize: "18px" }}>📊</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div style={{ width: "320px", flexShrink: 0 }}>
          <div style={{ background: `linear-gradient(135deg,${C.bgCard} 0%,${C.bgCard2} 100%)`, border: `1px solid ${C.border}`, borderRadius: "16px", overflow: "hidden", position: "sticky", top: "90px" }}>
            <div style={{ padding: "16px 20px", borderBottom: `1px solid ${C.borderMid}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "20px", color: C.textPrimary, letterSpacing: "1px" }}>📰 LATEST NEWS</div>
              <span style={{ background: C.accentSoft, border: `1px solid ${C.accentBorder}`, color: C.accentBright, fontSize: "11px", padding: "2px 8px", borderRadius: "20px" }}>LIVE</span>
            </div>
            {news.length === 0 ? (
              <div style={{ padding: "30px", textAlign: "center", color: C.textMuted, fontSize: "13px" }}>Koi news nahi abhi</div>
            ) : news.map((item, i) => (
              <div key={item.id} style={{ padding: "14px 20px", borderBottom: i < news.length - 1 ? `1px solid ${C.border}` : "none", cursor: "pointer", transition: "background 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.background = C.accentSoft}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <div style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                  {item.hot && <span style={{ color: C.accent, fontSize: "14px", flexShrink: 0, marginTop: "2px" }}>🔥</span>}
                  <div>
                    <div style={{ fontSize: "13px", color: C.textPrimary, lineHeight: "1.4", marginBottom: "6px", fontWeight: "500" }}>{item.title}</div>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      <span style={{ background: C.accentSoft, border: `1px solid ${C.accentBorder}`, color: C.accentBright, fontSize: "10px", padding: "1px 7px", borderRadius: "20px", fontWeight: "700" }}>{item.tag}</span>
                      <span style={{ color: C.textMuted, fontSize: "11px" }}>{item.time}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ background: `linear-gradient(135deg,${C.bgCard} 0%,${C.bgCard2} 100%)`, border: `1px solid ${C.border}`, borderRadius: "16px", padding: "20px", marginTop: "16px" }}>
            <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "18px", color: C.textPrimary, letterSpacing: "1px", marginBottom: "14px" }}>⚡ QUICK STATS</div>
            {[
              { label: "Live Matches", value: matches.filter(m => m.status === "LIVE").length, icon: "🔴" },
              { label: "Today's Matches", value: matches.filter(m => m.status?.includes("TODAY")).length, icon: "📅" },
              { label: "Active Streams", value: matches.filter(m => m.stream).length, icon: "📺" },
            ].map(stat => (
              <div key={stat.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${C.border}` }}>
                <span style={{ color: C.textSecondary, fontSize: "13px" }}>{stat.icon} {stat.label}</span>
                <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "22px", color: C.accent }}>{stat.value}</span>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer style={{ borderTop: `1px solid ${C.borderMid}`, padding: "20px", textAlign: "center", color: C.textMuted, fontSize: "12px", marginTop: "40px" }}>
        🏏 Cricify • Live Cricket Streaming • © 2024
      </footer>
    </div>
  );
};

// ─── ROOT — URL based routing ─────────────────────────────────────────
export default function App() {
  // Check karo URL mein /admin hai ya nahi
  const isAdminRoute = window.location.hash === "#/admin" || window.location.pathname.endsWith("/admin");
  const [page, setPage] = useState(isAdminRoute ? "adminLogin" : "website");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Hash change pe admin route detect karo
    const handleHash = () => {
      if (window.location.hash === "#/admin") {
        setPage(isLoggedIn ? "adminDash" : "adminLogin");
      } else {
        setPage("website");
      }
    };
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, [isLoggedIn]);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setPage("adminDash");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setPage("adminLogin");
    window.location.hash = "#/admin";
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }
        ::-webkit-scrollbar { width:4px; background:#120600; }
        ::-webkit-scrollbar-thumb { background:#6a1e0a; border-radius:4px; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        @keyframes tickerSlide { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }
        .match-card:hover { transform:translateY(-2px); border-color:#ff4500 !important; box-shadow:0 8px 30px rgba(255,69,0,0.2) !important; }
        .match-card { transition:all 0.2s ease; }
      `}</style>

      {page === "website" && <MainWebsite />}
      {page === "adminLogin" && <AdminLoginPage onSuccess={handleLoginSuccess} />}
      {page === "adminDash" && isLoggedIn && <AdminDashboard onLogout={handleLogout} />}
    </>
  );
}
