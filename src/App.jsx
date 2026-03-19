import { useState, useEffect, useCallback } from "react";

const FIREBASE_DB = "https://gmcfi-kassakirja-default-rtdb.europe-west1.firebasedatabase.app";
const DEFAULT_OPENING_BALANCE = 40;

const INITIAL_DATA = [
  { id: 1, date: "2026-01-04", description: "Kolehti ja lahjoitus", receipt: 1, income: 232, expense: 0 },
  { id: 2, date: "2026-01-11", description: "Kolehti ja lahjoitus", receipt: 2, income: 147.10, expense: 0 },
  { id: 3, date: "2026-01-18", description: "Kolehti ja lahjoitus", receipt: 3, income: 151, expense: 0 },
  { id: 4, date: "2026-01-25", description: "Kolehti ja lahjoitus", receipt: 4, income: 135.45, expense: 0 },
];

// Copy logo from app 1
const LOGO_SRC = "data:image/jpeg;base64,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";

function fmt(v) {
  if (v === 0 || v === undefined || v === null) return "–";
  return v.toLocaleString("fi-FI", { style: "currency", currency: "EUR" });
}
function fmtAbs(v) { return v.toLocaleString("fi-FI", { style: "currency", currency: "EUR" }); }
function dateStr(d) { if (!d) return ""; const p = d.split("-"); return `${p[2]}.${p[1]}.${p[0]}`; }

const IconPlus = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="3" x2="8" y2="13"/><line x1="3" y1="8" x2="13" y2="8"/></svg>;
const IconTrash = () => <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 4h10M6 4V3a1 1 0 011-1h2a1 1 0 011 1v1M5 4v9a1 1 0 001 1h4a1 1 0 001-1V4"/></svg>;
const IconEdit = () => <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M11 2l3 3-8 8H3v-3z"/></svg>;
const IconCheck = () => <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 8l4 4 6-7"/></svg>;
const IconX = () => <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4l8 8M12 4l-8 8"/></svg>;
const IconSave = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M13 14H3a1 1 0 01-1-1V3a1 1 0 011-1h7l4 4v7a1 1 0 01-1 1z"/><path d="M11 14V9H5v5M5 2v3h5"/></svg>;
const IconPrint = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 5V1h8v4M4 11H2V6h12v5h-2"/><rect x="4" y="9" width="8" height="5" rx="0.5"/><circle cx="11" cy="7.5" r="0.6" fill="currentColor"/></svg>;
const IconDown = () => <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 4l3 3 3-3"/></svg>;

const DEFAULT_USERS = [
  { id: 1, name: "Admin", pin: "1992", role: "admin" },
  { id: 2, name: "Rahastonhoitaja", pin: "5678", role: "editor" },
  { id: 3, name: "Katselija", pin: "0000", role: "viewer" },
];
const USERS_KEY = "kassakirja2-users";

function LoginScreen({ onLogin }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  async function handleSubmit(e) {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || "null") || DEFAULT_USERS;
    try {
      const res = await fetch(FIREBASE_DB + "/kassakirja2/users.json");
      const fbUsers = await res.json();
      if (fbUsers && Array.isArray(fbUsers) && fbUsers.length > 0) {
        const user = fbUsers.find(u => u.pin === pin);
        if (user) { onLogin(user); localStorage.setItem(USERS_KEY, JSON.stringify(fbUsers)); return; }
      }
    } catch(e) {}
    const user = users.find(u => u.pin === pin);
    if (user) { onLogin(user); } else {
      setError("Väärä PIN-koodi"); setShake(true);
      setTimeout(() => { setShake(false); setError(""); }, 1500); setPin("");
    }
  }
  function handleDigit(d) { if (pin.length < 6) setPin(pin + d); }
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(145deg, #0c1220 0%, #1a1f35 50%, #0f1628 100%)", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        @keyframes shake { 0%,100% { transform: translateX(0); } 20%,60% { transform: translateX(-8px); } 40%,80% { transform: translateX(8px); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .pin-dot { width: 14px; height: 14px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.25); transition: all 0.15s; }
        .pin-dot-filled { background: #4f8cff; border-color: #4f8cff; box-shadow: 0 0 8px rgba(79,140,255,0.4); }
        .num-btn { width: 64px; height: 64px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.04); color: #e0e4ef; font-size: 22px; font-weight: 600; cursor: pointer; transition: all 0.15s; display: flex; align-items: center; justify-content: center; font-family: 'DM Mono', monospace; }
        .num-btn:hover { background: rgba(79,140,255,0.15); } .num-btn:active { transform: scale(0.93); }`}</style>
      <div style={{ animation: shake ? "shake 0.4s" : "fadeIn 0.5s ease-out", textAlign: "center", padding: 40 }}>
        <img src={LOGO_SRC} alt="GMCFI" style={{ width: 72, height: 72, borderRadius: "50%", marginBottom: 16, boxShadow: "0 4px 24px rgba(107,39,55,0.5)" }} />
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#f0f2fa", marginBottom: 4 }}>GMCFI Kassakirja</h1>
        <p style={{ fontSize: 13, color: "#6b7394", marginBottom: 28 }}>Syötä PIN-koodi kirjautuaksesi</p>
        <form onSubmit={handleSubmit}>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 24 }}>
            {[0,1,2,3].map(i => (<div key={i} className={`pin-dot ${i < pin.length ? "pin-dot-filled" : ""}`} />))}
          </div>
          {error && <div style={{ color: "#ff6b6b", fontSize: 13, marginBottom: 16 }}>{error}</div>}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 64px)", gap: 12, justifyContent: "center", marginBottom: 12 }}>
            {[1,2,3,4,5,6,7,8,9].map(d => (<button key={d} type="button" className="num-btn" onClick={() => handleDigit(String(d))}>{d}</button>))}
            <div />
            <button type="button" className="num-btn" onClick={() => handleDigit("0")}>0</button>
            <button type="button" className="num-btn" onClick={() => setPin(pin.slice(0, -1))} style={{ fontSize: 16 }}>⌫</button>
          </div>
          <button type="submit" disabled={pin.length < 4} style={{ marginTop: 12, padding: "10px 36px", borderRadius: 10, border: "none", background: pin.length >= 4 ? "linear-gradient(135deg, #4f8cff, #3366dd)" : "rgba(255,255,255,0.06)", color: pin.length >= 4 ? "white" : "#4a5270", fontSize: 14, fontWeight: 600, cursor: pin.length >= 4 ? "pointer" : "default", fontFamily: "'DM Sans', sans-serif" }}>Kirjaudu</button>
        </form>
        <p style={{ fontSize: 11, color: "#3e4560", marginTop: 24 }}>PIN: 1992 (Admin) · 5678 (Rahastonhoitaja)</p>
      </div>
    </div>
  );
}

export default function KassakirjaApp() {
  const [currentUser, setCurrentUser] = useState(() => { try { const s = localStorage.getItem("kassakirja2-session"); return s ? JSON.parse(s) : null; } catch { return null; } });
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [year, setYear] = useState(2026);
  const [transactions, setTransactions] = useState(INITIAL_DATA);
  const [editingId, setEditingId] = useState(null);
  const [editRow, setEditRow] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRow, setNewRow] = useState({ date: "", description: "", receipt: "", income: "", expense: "" });
  const [saved, setSaved] = useState(false);
  const [openingBalance, setOpeningBalance] = useState(DEFAULT_OPENING_BALANCE);
  const [editingBalance, setEditingBalance] = useState(false);
  const [balanceInput, setBalanceInput] = useState("");

  function handleLogin(user) { setCurrentUser(user); localStorage.setItem("kassakirja2-session", JSON.stringify(user)); }
  function handleLogout() { setCurrentUser(null); localStorage.removeItem("kassakirja2-session"); setShowUserMenu(false); }

  const firebasePath = `${FIREBASE_DB}/kassakirja2/data/${year}.json`;
  const balancePath = `${FIREBASE_DB}/kassakirja2/settings/${year}/openingBalance.json`;

  // Load openingBalance
  useEffect(() => {
    (async () => {
      try { const res = await fetch(balancePath); const val = await res.json(); if (val !== null && typeof val === "number") setOpeningBalance(val); } catch(e) {}
    })();
  }, [year, balancePath]);

  // Load transactions from Firebase
  useEffect(() => {
    let cancelled = false;
    async function loadData() {
      try {
        const res = await fetch(firebasePath); const data = await res.json();
        if (!cancelled && data && Array.isArray(data) && data.length > 0) { setTransactions(data); localStorage.setItem("kassakirja2-" + year, JSON.stringify(data)); return; }
      } catch (e) {}
      try {
        const stored = localStorage.getItem("kassakirja2-" + year);
        if (stored && !cancelled) setTransactions(JSON.parse(stored));
        else if (!cancelled) setTransactions(year === 2026 ? INITIAL_DATA : []);
      } catch (e) { if (!cancelled) setTransactions(year === 2026 ? INITIAL_DATA : []); }
    }
    loadData();
    const interval = setInterval(async () => {
      try {
        const res = await fetch(firebasePath); const data = await res.json();
        if (data && Array.isArray(data)) { setTransactions(prev => JSON.stringify(prev) !== JSON.stringify(data) ? data : prev); localStorage.setItem("kassakirja2-" + year, JSON.stringify(data)); }
      } catch (e) {}
    }, 8000);
    return () => { cancelled = true; clearInterval(interval); };
  }, [year, firebasePath]);

  const saveData = useCallback(async (data) => {
    localStorage.setItem("kassakirja2-" + year, JSON.stringify(data));
    setSaved(true); setTimeout(() => setSaved(false), 1500);
    try { await fetch(firebasePath, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }); } catch(e) {}
  }, [year, firebasePath]);

  const totalIncome = transactions.reduce((s, r) => s + (parseFloat(r.income) || 0), 0);
  const totalExpense = transactions.reduce((s, r) => s + (parseFloat(r.expense) || 0), 0);
  const currentBalance = openingBalance + totalIncome - totalExpense;

  if (!currentUser) return <LoginScreen onLogin={handleLogin} />;
  const canEdit = currentUser.role === "admin" || currentUser.role === "editor";

  function saveBalance(val) {
    const num = parseFloat(val); if (isNaN(num)) return;
    setOpeningBalance(num); setEditingBalance(false);
    try { fetch(balancePath, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(num) }); } catch(e) {}
    setSaved(true); setTimeout(() => setSaved(false), 1500);
  }

  function addTransaction() {
    const nextId = transactions.length > 0 ? Math.max(...transactions.map(r => r.id)) + 1 : 1;
    const nextReceipt = transactions.length > 0 ? Math.max(...transactions.map(r => r.receipt || 0)) + 1 : 1;
    const entry = { id: nextId, date: newRow.date, description: newRow.description, receipt: parseInt(newRow.receipt) || nextReceipt, income: parseFloat(newRow.income) || 0, expense: parseFloat(newRow.expense) || 0 };
    const updated = [...transactions, entry]; setTransactions(updated); saveData(updated);
    setNewRow({ date: "", description: "", receipt: "", income: "", expense: "" }); setShowAddForm(false);
  }
  function deleteTransaction(id) { const updated = transactions.filter(r => r.id !== id); setTransactions(updated); saveData(updated); }
  function startEdit(row) { setEditingId(row.id); setEditRow({ ...row }); }
  function saveEdit() {
    const updated = transactions.map(r => r.id === editingId ? { ...editRow, income: parseFloat(editRow.income) || 0, expense: parseFloat(editRow.expense) || 0 } : r);
    setTransactions(updated); saveData(updated); setEditingId(null); setEditRow(null);
  }

  function handlePrint() {
    const eur = (v) => v === 0 ? "-" : "€ " + v.toLocaleString("fi-FI", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const eurA = (v) => "€ " + v.toLocaleString("fi-FI", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    let runBal = openingBalance;
    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Kassakirja ${year}</title>
    <style>@page{size:A4 landscape;margin:12mm 15mm}*{box-sizing:border-box;margin:0;padding:0}body{font-family:Calibri,Arial,sans-serif;font-size:10pt;color:#222}
    .header{text-align:center;margin-bottom:8px}.header h1{font-size:14pt;margin-bottom:2px}.header .sub{font-size:11pt;color:#555}
    table{width:100%;border-collapse:collapse;font-size:9pt}th{background:#6B2737;color:#fff;padding:5px 8px;text-align:left;font-weight:600;border:1px solid #5a1f2e}th.right{text-align:right}
    td{padding:4px 8px;border:1px solid #d4d4d4}td.right{text-align:right}tr:nth-child(even) td{background:#faf8f8}tr.total td{font-weight:700;border-top:2px solid #6B2737;background:#fff!important}
    .sig-area{margin-top:50px;display:flex;gap:80px}.sig-line{flex:1;border-top:1px solid #333;padding-top:4px;font-size:9pt;color:#555}
    @media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}</style></head><body>
    <div class="header"><h1>Grace Montagnard Alliance Church Finland</h1><div class="sub">Kassakirja Tammikuu – Joulukuu ${year}</div></div>
    <table><thead><tr><th style="width:90px">kk.pp.vv</th><th>Selite</th><th style="width:50px">Tos</th><th class="right" style="width:90px">Tulot</th><th class="right" style="width:90px">Menot</th><th class="right" style="width:100px">Saldot</th><th style="width:100px">Tilihoitaja</th><th style="width:100px">Puheenjohtaja</th></tr></thead>
    <tbody><tr><td></td><td>Siirtoo kasalta ${year-1} vuodelta</td><td></td><td class="right">${eurA(openingBalance)}</td><td class="right">-</td><td class="right">${eurA(openingBalance)}</td><td></td><td></td></tr>
    ${transactions.map(r => { runBal += (parseFloat(r.income)||0) - (parseFloat(r.expense)||0); return `<tr><td>${r.date ? r.date.split("-").reverse().join(".") : ""}</td><td>${r.description||""}</td><td>${r.receipt||""}</td><td class="right">${eur(parseFloat(r.income)||0)}</td><td class="right">${eur(parseFloat(r.expense)||0)}</td><td class="right">${eurA(runBal)}</td><td></td><td></td></tr>`; }).join("")}
    <tr class="total"><td></td><td>Yhteensä</td><td></td><td class="right">${eurA(totalIncome)}</td><td class="right">${eurA(totalExpense)}</td><td class="right">${eurA(currentBalance)}</td><td></td><td></td></tr>
    </tbody></table><div class="sig-area"><div class="sig-line">Päivämäärä ja paikka</div><div class="sig-line">Rahastonhoitaja</div><div class="sig-line">Puheenjohtaja</div></div></body></html>`;
    const win = window.open("", "_blank"); if (win) { win.document.write(html); win.document.close(); setTimeout(() => win.print(), 400); }
  }

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "linear-gradient(145deg, #0c1220 0%, #1a1f35 50%, #0f1628 100%)", color: "#e0e4ef", minHeight: "100vh" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}input,select{font-family:'DM Sans',sans-serif}
        @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slideDown{from{opacity:0;max-height:0}to{opacity:1;max-height:400px}}
        .fade-in{animation:fadeIn .35s ease-out both}
        .card{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);border-radius:14px;backdrop-filter:blur(12px)}
        .btn{display:inline-flex;align-items:center;gap:6px;padding:8px 16px;border-radius:8px;border:none;font-size:13px;font-weight:500;cursor:pointer;transition:all .2s;font-family:'DM Sans',sans-serif}
        .btn-primary{background:linear-gradient(135deg,#4f8cff,#3366dd);color:white;box-shadow:0 2px 12px rgba(79,140,255,.3)}.btn-primary:hover{box-shadow:0 4px 20px rgba(79,140,255,.45);transform:translateY(-1px)}
        .btn-ghost{background:rgba(255,255,255,.06);color:#aab4d0;border:1px solid rgba(255,255,255,.08)}.btn-ghost:hover{background:rgba(255,255,255,.1);color:#e0e4ef}
        .btn-danger{background:rgba(255,80,80,.12);color:#ff6b6b;border:1px solid rgba(255,80,80,.15)}
        .btn-success{background:rgba(80,200,120,.15);color:#5dda8a;border:1px solid rgba(80,200,120,.2)}
        .input-field{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);color:#e0e4ef;padding:7px 10px;border-radius:6px;font-size:13px;transition:border-color .2s;width:100%}.input-field:focus{outline:none;border-color:#4f8cff;box-shadow:0 0 0 2px rgba(79,140,255,.15)}
        .saved-badge{position:fixed;top:20px;right:20px;z-index:100;background:rgba(80,200,120,.2);color:#5dda8a;border:1px solid rgba(80,200,120,.3);padding:8px 16px;border-radius:10px;font-size:13px;font-weight:500;animation:fadeIn .3s ease-out;display:flex;align-items:center;gap:6px}
        table{width:100%;border-collapse:collapse}th{text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:.8px;color:#6b7394;font-weight:600;padding:10px 12px;border-bottom:1px solid rgba(255,255,255,.06)}
        td{padding:10px 12px;font-size:13px;border-bottom:1px solid rgba(255,255,255,.03);vertical-align:middle}tr:hover td{background:rgba(255,255,255,.02)}
        .mono{font-family:'DM Mono',monospace;font-size:13px}`}</style>

      {saved && <div className="saved-badge"><IconSave /> Tallennettu</div>}

      {/* HEADER */}
      <div style={{ padding: "28px 32px 0", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <img src={LOGO_SRC} alt="GMCFI" style={{ width: 56, height: 56, borderRadius: "50%", boxShadow: "0 2px 16px rgba(107,39,55,0.4)", flexShrink: 0 }} />
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: "#d4a46a", background: "linear-gradient(90deg, #d4a46a, #f0d4a0)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>GMCFI</span>
                <span style={{ width: 1, height: 14, background: "rgba(255,255,255,0.12)" }} />
                <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", color: "#4f8cff" }}>Kassakirja</span>
                <button onClick={() => setYear(y => y - 1)} style={{ background: "none", border: "none", cursor: "pointer", padding: "2px 6px", color: "#6b7394" }}><svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 1L3 5l4 4"/></svg></button>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#4f8cff", minWidth: 38, textAlign: "center" }}>{year}</span>
                <button onClick={() => setYear(y => y + 1)} style={{ background: "none", border: "none", cursor: "pointer", padding: "2px 6px", color: "#6b7394" }}><svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 1l4 4-4 4"/></svg></button>
              </div>
              <h1 style={{ fontSize: 24, fontWeight: 700, color: "#f0f2fa", letterSpacing: "-0.3px" }}>Grace Montagnard Alliance Church</h1>
              <div style={{ fontSize: 13, color: "#6b7394", marginTop: 3 }}>Kulmakatu 8, 92100 Raahe</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <button className="btn btn-ghost" onClick={handlePrint}><IconPrint /> Tulosta / PDF</button>
            <div style={{ position: "relative" }}>
              <button className="btn btn-ghost" onClick={() => setShowUserMenu(!showUserMenu)} style={{ gap: 5, padding: "8px 12px" }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="8" cy="5" r="3"/><path d="M2 14c0-3 2.5-5 6-5s6 2 6 5"/></svg>
                {currentUser.name} <IconDown />
              </button>
              {showUserMenu && (<>
                <div style={{ position: "fixed", inset: 0, zIndex: 90 }} onClick={() => setShowUserMenu(false)} />
                <div style={{ position: "absolute", top: "calc(100% + 6px)", right: 0, zIndex: 100, background: "#1e2440", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: 6, minWidth: 200, boxShadow: "0 12px 40px rgba(0,0,0,0.5)" }}>
                  <div style={{ padding: "8px 12px", fontSize: 12, color: "#8b95b8", borderBottom: "1px solid rgba(255,255,255,0.06)", marginBottom: 4 }}>
                    <div style={{ color: "#e0e4ef", fontWeight: 600, fontSize: 13 }}>{currentUser.name}</div>
                    <div style={{ marginTop: 2 }}>{currentUser.role === "admin" ? "Ylläpitäjä" : currentUser.role === "editor" ? "Muokkaaja" : "Katselija"}</div>
                  </div>
                  <button className="btn btn-ghost" style={{ width: "100%", justifyContent: "flex-start", borderRadius: 6, color: "#ff6b6b" }} onClick={handleLogout}>
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 2H3a1 1 0 00-1 1v10a1 1 0 001 1h3M11 11l3-3-3-3M14 8H6"/></svg> Kirjaudu ulos
                  </button>
                </div>
              </>)}
            </div>
          </div>
        </div>
      </div>

      {/* STAT CARDS */}
      <div style={{ padding: "20px 32px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }} className="fade-in">
          <div className="card" style={{ padding: "18px 20px", cursor: canEdit ? "pointer" : "default" }}
            onClick={() => { if (canEdit && !editingBalance) { setEditingBalance(true); setBalanceInput(String(openingBalance)); } }}>
            <div style={{ fontSize: 11, color: "#6b7394", fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
              Alkusaldo {canEdit && !editingBalance && <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="#6b7394" strokeWidth="1.5"><path d="M11 2l3 3-8 8H3v-3z"/></svg>}
            </div>
            {editingBalance ? (
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <input type="number" step="0.01" className="input-field" style={{ width: 120, fontSize: 18, fontFamily: "'DM Mono', monospace", padding: "4px 8px" }}
                  value={balanceInput} onChange={e => setBalanceInput(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") saveBalance(balanceInput); if (e.key === "Escape") setEditingBalance(false); }}
                  autoFocus onClick={e => e.stopPropagation()} />
                <button className="btn btn-success" style={{ padding: "4px 8px" }} onClick={e => { e.stopPropagation(); saveBalance(balanceInput); }}><IconCheck /></button>
                <button className="btn btn-ghost" style={{ padding: "4px 8px" }} onClick={e => { e.stopPropagation(); setEditingBalance(false); }}><IconX /></button>
              </div>
            ) : (<div style={{ fontSize: 24, fontWeight: 700, fontFamily: "'DM Mono', monospace", color: "#8b95b8" }}>{fmtAbs(openingBalance)}</div>)}
          </div>
          {[ { label: "Tulot yhteensä", value: fmtAbs(totalIncome), color: "#5dda8a" }, { label: "Menot yhteensä", value: fmtAbs(totalExpense), color: "#ff6b6b" }, { label: "Saldo nyt", value: fmtAbs(currentBalance), color: "#4f8cff" } ].map((c, i) => (
            <div key={i} className="card" style={{ padding: "18px 20px" }}>
              <div style={{ fontSize: 11, color: "#6b7394", fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 8 }}>{c.label}</div>
              <div style={{ fontSize: 24, fontWeight: 700, fontFamily: "'DM Mono', monospace", color: c.color }}>{c.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* TRANSACTION TABLE */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px 40px" }}>
        <div className="card fade-in" style={{ overflow: "auto" }}>
          <div style={{ padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: "#c8cee0" }}>Kassakirja {year}</span>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ fontSize: 13, color: "#6b7394" }}>{transactions.length} kirjausta</span>
              {canEdit && <button className="btn btn-primary" onClick={() => { setShowAddForm(!showAddForm); setEditingId(null); }}><IconPlus /> Lisää kirjaus</button>}
            </div>
          </div>
          {showAddForm && (
            <div style={{ padding: "16px 20px", background: "rgba(79,140,255,0.04)", borderBottom: "1px solid rgba(79,140,255,0.1)", animation: "slideDown 0.3s ease" }}>
              <div style={{ display: "grid", gridTemplateColumns: "130px 1fr 70px 120px 120px", gap: 8, alignItems: "end" }}>
                <div><label style={{ fontSize: 10, color: "#6b7394", display: "block", marginBottom: 3, textTransform: "uppercase" }}>Päivämäärä</label><input type="date" className="input-field" value={newRow.date} onChange={e => setNewRow({ ...newRow, date: e.target.value })} /></div>
                <div><label style={{ fontSize: 10, color: "#6b7394", display: "block", marginBottom: 3, textTransform: "uppercase" }}>Selite</label><input className="input-field" value={newRow.description} onChange={e => setNewRow({ ...newRow, description: e.target.value })} placeholder="Kuvaus..." /></div>
                <div><label style={{ fontSize: 10, color: "#6b7394", display: "block", marginBottom: 3, textTransform: "uppercase" }}>Tosite</label><input type="number" className="input-field" value={newRow.receipt} onChange={e => setNewRow({ ...newRow, receipt: e.target.value })} placeholder="#" /></div>
                <div><label style={{ fontSize: 10, color: "#6b7394", display: "block", marginBottom: 3, textTransform: "uppercase" }}>Tulo €</label><input type="number" step="0.01" className="input-field" value={newRow.income} onChange={e => setNewRow({ ...newRow, income: e.target.value })} /></div>
                <div><label style={{ fontSize: 10, color: "#6b7394", display: "block", marginBottom: 3, textTransform: "uppercase" }}>Meno €</label><input type="number" step="0.01" className="input-field" value={newRow.expense} onChange={e => setNewRow({ ...newRow, expense: e.target.value })} /></div>
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 12, justifyContent: "flex-end" }}>
                <button className="btn btn-ghost" onClick={() => setShowAddForm(false)}><IconX /> Peruuta</button>
                <button className="btn btn-primary" onClick={addTransaction} disabled={!newRow.date || !newRow.description}><IconCheck /> Tallenna</button>
              </div>
            </div>
          )}
          <table>
            <thead><tr>
              <th style={{ width: 100 }}>Päivä</th><th>Selite</th><th style={{ width: 60 }}>Tos.</th>
              <th style={{ width: 110, textAlign: "right" }}>Tulot</th><th style={{ width: 110, textAlign: "right" }}>Menot</th>
              <th style={{ width: 120, textAlign: "right" }}>Saldot</th>{canEdit && <th style={{ width: 70 }}></th>}
            </tr></thead>
            <tbody>
              <tr><td></td><td style={{ color: "#aab4d0", fontStyle: "italic" }}>Siirto kasalta {year - 1} vuodelta</td><td></td>
                <td className="mono" style={{ textAlign: "right", color: "#5dda8a" }}>{fmtAbs(openingBalance)}</td>
                <td style={{ textAlign: "right", color: "#4a5270" }}>–</td>
                <td className="mono" style={{ textAlign: "right", fontWeight: 500 }}>{fmtAbs(openingBalance)}</td>
                {canEdit && <td></td>}
              </tr>
              {transactions.length === 0 && <tr><td colSpan={canEdit ? 7 : 6} style={{ textAlign: "center", padding: 40, color: "#4a5270" }}>Ei kirjauksia</td></tr>}
              {transactions.map((row, idx) => {
                let bal = openingBalance; for (let j = 0; j <= idx; j++) bal += (parseFloat(transactions[j].income)||0) - (parseFloat(transactions[j].expense)||0);
                if (editingId === row.id) {
                  return (<tr key={row.id} style={{ background: "rgba(79,140,255,0.04)" }}>
                    <td><input type="date" className="input-field" value={editRow.date} onChange={e => setEditRow({ ...editRow, date: e.target.value })} /></td>
                    <td><input className="input-field" value={editRow.description} onChange={e => setEditRow({ ...editRow, description: e.target.value })} /></td>
                    <td><input type="number" className="input-field" style={{ width: 50 }} value={editRow.receipt} onChange={e => setEditRow({ ...editRow, receipt: e.target.value })} /></td>
                    <td><input type="number" step="0.01" className="input-field" style={{ textAlign: "right" }} value={editRow.income} onChange={e => setEditRow({ ...editRow, income: e.target.value })} /></td>
                    <td><input type="number" step="0.01" className="input-field" style={{ textAlign: "right" }} value={editRow.expense} onChange={e => setEditRow({ ...editRow, expense: e.target.value })} /></td>
                    <td className="mono" style={{ textAlign: "right", fontWeight: 500 }}>{fmtAbs(bal)}</td>
                    <td><div style={{ display: "flex", gap: 4 }}><button className="btn btn-success" style={{ padding: "5px 8px" }} onClick={saveEdit}><IconCheck /></button><button className="btn btn-ghost" style={{ padding: "5px 8px" }} onClick={() => { setEditingId(null); setEditRow(null); }}><IconX /></button></div></td>
                  </tr>);
                }
                return (<tr key={row.id}>
                  <td style={{ color: "#8b95b8", fontSize: 12 }}>{dateStr(row.date)}</td>
                  <td style={{ color: "#c8cee0" }}>{row.description}</td>
                  <td style={{ color: "#6b7394", textAlign: "center" }}>{row.receipt}</td>
                  <td className="mono" style={{ textAlign: "right", color: "#5dda8a" }}>{fmt(row.income)}</td>
                  <td className="mono" style={{ textAlign: "right", color: "#ff6b6b" }}>{fmt(row.expense)}</td>
                  <td className="mono" style={{ textAlign: "right", fontWeight: 500 }}>{fmtAbs(bal)}</td>
                  {canEdit && <td><div style={{ display: "flex", gap: 4 }}>
                    <button className="btn btn-ghost" style={{ padding: "5px 8px", fontSize: 11 }} onClick={() => startEdit(row)}><IconEdit /></button>
                    <button className="btn btn-danger" style={{ padding: "5px 8px", fontSize: 11 }} onClick={() => deleteTransaction(row.id)}><IconTrash /></button>
                  </div></td>}
                </tr>);
              })}
            </tbody>
            {transactions.length > 0 && <tfoot><tr style={{ borderTop: "2px solid rgba(255,255,255,0.08)" }}>
              <td></td><td style={{ fontWeight: 700 }}>Yhteensä</td><td></td>
              <td className="mono" style={{ textAlign: "right", color: "#5dda8a", fontWeight: 700 }}>{fmtAbs(totalIncome)}</td>
              <td className="mono" style={{ textAlign: "right", color: "#ff6b6b", fontWeight: 700 }}>{fmtAbs(totalExpense)}</td>
              <td className="mono" style={{ textAlign: "right", color: "#4f8cff", fontWeight: 700 }}>{fmtAbs(currentBalance)}</td>
              {canEdit && <td />}
            </tr></tfoot>}
          </table>
        </div>
      </div>
    </div>
  );
}
