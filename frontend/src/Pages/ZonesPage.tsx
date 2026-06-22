import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import SideBar from '../components/SideBar';

<<<<<<< HEAD
/* ─── Types ─────────────────────────────────────────────────────────────── */
interface Division {
  id: number;
  name: string;
  area_id?: number;
}

interface Area {
  id: number;
  name: string;
  zone_id?: number;
  divisions?: Division[];
}

interface Zone {
  id: number;
  name: string;
  areas?: Area[];
}
=======
interface Division { id: number; name: string; area_id?: number; }
interface Area     { id: number; name: string; zone_id?: number; divisions?: Division[]; }
interface Zone     { id: number; name: string; areas?: Area[]; }
>>>>>>> 7bbd93f145c97d2fa914aaaf836835dedac94fd2

type ModalState =
  | { open: true; type: 'zone' | 'area' | 'division'; mode: 'add' | 'edit'; parentId?: number; record?: Zone | Area | Division }
  | { open: false };

const BASE = 'https://sosafe.onrender.com/api';

<<<<<<< HEAD
/* ── Palette ── */
const G = {
  dark:   '#004d28',   // very dark green
  main:   '#006838',   // So-Safe green
  mid:    '#008a4a',   // lighter green
  light:  '#e8f5ee',   // pale green tint
  xlight: '#f4faf7',   // near white green
  gold:   '#c9a84c',   // gold accent
  goldL:  '#e8c96e',   // light gold
  text:   '#1a3326',   // dark green text
  muted:  '#5a7a68',   // muted green-grey
  border: '#c8ddd4',   // soft green border
  white:  '#ffffff',
  red:    '#c0392b',
  redL:   '#fdf0ef',
};

/* ─── Icons ──────────────────────────────────────────────────────────────── */
const Chevron = ({ open }: { open: boolean }) => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"
    style={{ width: 13, height: 13, transform: open ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.22s cubic-bezier(.4,0,.2,1)', display:'block' }}>
    <polyline points="6 4 14 10 6 16" />
  </svg>
);
const PlusIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" style={{ width: 12, height: 12 }}>
    <line x1="10" y1="3" x2="10" y2="17" /><line x1="3" y1="10" x2="17" y2="10" />
  </svg>
);
const EditIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ width: 12, height: 12 }}>
    <path d="M14.5 2.5a2.121 2.121 0 0 1 3 3L6 17H3v-3L14.5 2.5z" />
  </svg>
);
const TrashIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ width: 12, height: 12 }}>
    <polyline points="5 7 15 7" /><path d="M8 7V4h4v3" /><rect x="4" y="7" width="12" height="10" rx="2" />
  </svg>
);
const SpinIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" style={{ width: 16, height: 16, animation: 'spin 0.8s linear infinite' }}>
    <path d="M12 2a10 10 0 0 1 10 10" />
  </svg>
);


/* ─── Component ──────────────────────────────────────────────────────────── */
const ZoneAreaDivisionTable: React.FC = () => {
  const { token } = useAuth();
  const headers = { Authorization: `Bearer ${token}` };

  const [zones, setZones]               = useState<Zone[]>([]);
  const [loading, setLoading]           = useState(true);
  const [saving, setSaving]             = useState(false);
  const [error, setError]               = useState<string | null>(null);
  const [expandedZones, setExpandedZones] = useState<Set<number>>(new Set());
  const [expandedAreas, setExpandedAreas] = useState<Set<number>>(new Set());
  const [modal, setModal]               = useState<ModalState>({ open: false });
  const [inputVal, setInputVal]         = useState('');
=======
/* ── Icons ── */
const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"
    className={`w-3 h-3 transition-transform duration-200 ${open ? 'rotate-90' : 'rotate-0'}`}>
    <polyline points="6 4 14 10 6 16" />
  </svg>
);
const PlusIcon  = () => <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" className="w-3 h-3"><line x1="10" y1="3" x2="10" y2="17"/><line x1="3" y1="10" x2="17" y2="10"/></svg>;
const EditIcon  = () => <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3"><path d="M14.5 2.5a2.121 2.121 0 0 1 3 3L6 17H3v-3L14.5 2.5z"/></svg>;
const TrashIcon = () => <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3"><polyline points="5 7 15 7"/><path d="M8 7V4h4v3"/><rect x="4" y="7" width="12" height="10" rx="2"/></svg>;
const SpinIcon  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" className="w-4 h-4 animate-spin"><path d="M12 2a10 10 0 0 1 10 10"/></svg>;

const ZoneAreaDivisionTable: React.FC = () => {
  const { token, user } = useAuth();
  const headers = { Authorization: `Bearer ${token}` };
  const isSuperAdmin = user?.role === 'superadmin';

  const [zones, setZones]                   = useState<Zone[]>([]);
  const [loading, setLoading]               = useState(true);
  const [saving, setSaving]                 = useState(false);
  const [error, setError]                   = useState<string | null>(null);
  const [expandedZones, setExpandedZones]   = useState<Set<number>>(new Set());
  const [expandedAreas, setExpandedAreas]   = useState<Set<number>>(new Set());
  const [modal, setModal]                   = useState<ModalState>({ open: false });
  const [inputVal, setInputVal]             = useState('');
>>>>>>> 7bbd93f145c97d2fa914aaaf836835dedac94fd2
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchZones = async () => {
    try {
      setLoading(true);
      const res = await axios.get<{ data: Zone[] }>(`${BASE}/zones`, { headers });
      setZones(res.data.data ?? (res.data as any));
    } catch { setError('Failed to load zones. Please check your connection.'); }
    finally  { setLoading(false); }
  };

  useEffect(() => { fetchZones(); }, []);
  useEffect(() => { if (modal.open) setTimeout(() => inputRef.current?.focus(), 80); }, [modal.open]);

  const toggle = (s: Set<number>, id: number) => {
    const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n;
  };

  const openAdd  = (type: 'zone' | 'area' | 'division', parentId?: number) => { setInputVal(''); setModal({ open: true, type, mode: 'add', parentId }); };
  const openEdit = (type: 'zone' | 'area' | 'division', record: any)        => { setInputVal(record.name); setModal({ open: true, type, mode: 'edit', record }); };
  const closeModal = () => setModal({ open: false });

  const handleSave = async () => {
    if (!modal.open || !inputVal.trim()) return;
    setSaving(true);
    try {
      const { type, mode } = modal;
      if (type === 'zone') {
        mode === 'add'
          ? await axios.post(`${BASE}/zones`, { name: inputVal }, { headers })
          : await axios.put(`${BASE}/zones/${(modal.record as Zone).id}`, { name: inputVal }, { headers });
      } else if (type === 'area') {
<<<<<<< HEAD
        mode === 'add'
          ? await axios.post(`${BASE}/areas`, { name: inputVal, zone_id: modal.parentId }, { headers })
          : await axios.put(`${BASE}/areas/${(modal.record as Area).id}`, { name: inputVal }, { headers });
      } else {
        mode === 'add'
          ? await axios.post(`${BASE}/zone-divisions`, { name: inputVal, area_id: modal.parentId }, { headers })
          : await axios.put(`${BASE}/zone-divisions/${(modal.record as Division).id}`, { name: inputVal }, { headers });
=======
        const area = modal.record as Area;
        mode === 'add'
          ? await axios.post(`${BASE}/areas`, { name: inputVal, zone_id: modal.parentId }, { headers })
          : await axios.put(`${BASE}/areas/${area.id}`, { name: inputVal, zone_id: area.zone_id }, { headers });
      } else {
        const div = modal.record as Division;
        mode === 'add'
          ? await axios.post(`${BASE}/zone-divisions`, { name: inputVal, area_id: modal.parentId }, { headers })
          // send area_id so the backend validation passes (it requires it on update too)
          : await axios.put(`${BASE}/zone-divisions/${div.id}`, { name: inputVal, area_id: div.area_id }, { headers });
>>>>>>> 7bbd93f145c97d2fa914aaaf836835dedac94fd2
      }
      await fetchZones();
      closeModal();
    } catch { setError('Save failed. Please try again.'); }
    finally  { setSaving(false); }
  };

  const handleDelete = async (type: 'zone' | 'area' | 'division', id: number) => {
    if (!window.confirm(`Permanently delete this ${type}?`)) return;
    try {
<<<<<<< HEAD
      const url = type === 'zone' ? `${BASE}/zones/${id}` : type === 'area' ? `${BASE}/areas/${id}` : `${BASE}/zone-divisions/${id}`;
=======
      const url = type === 'zone'
        ? `${BASE}/zones/${id}`
        : type === 'area'
          ? `${BASE}/areas/${id}`
          : `${BASE}/zone-divisions/${id}`;
>>>>>>> 7bbd93f145c97d2fa914aaaf836835dedac94fd2
      await axios.delete(url, { headers });
      await fetchZones();
    } catch { setError('Delete failed.'); }
  };

  const totalAreas     = zones.reduce((a, z) => a + (z.areas?.length ?? 0), 0);
  const totalDivisions = zones.reduce((a, z) => a + (z.areas ?? []).reduce((b, ar) => b + (ar.divisions?.length ?? 0), 0), 0);
<<<<<<< HEAD

  const typeLabel = { zone: 'Zone', area: 'Area', division: 'Division' };

  return (
    <div style={{ display: 'flex', height: '100vh', background: G.xlight, fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Playfair+Display:wght@600;700&display=swap');
        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes fadeUp  { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn  { from { opacity:0; } to { opacity:1; } }
        @keyframes slideUp { from { opacity:0; transform:translateY(20px) scale(0.97); } to { opacity:1; transform:translateY(0) scale(1); } }

        .zone-card { animation: fadeUp 0.3s ease both; }
        .zone-card:nth-child(1){animation-delay:.04s}
        .zone-card:nth-child(2){animation-delay:.09s}
        .zone-card:nth-child(3){animation-delay:.14s}
        .zone-card:nth-child(4){animation-delay:.19s}
        .zone-card:nth-child(5){animation-delay:.24s}

        .row-zone  { transition: background 0.15s; }
        .row-zone:hover  { background: ${G.light} !important; }
        .row-area  { transition: background 0.15s; }
        .row-area:hover  { background: #f0f7f3 !important; }

        .btn-ghost {
          display:inline-flex; align-items:center; gap:4px;
          padding:4px 10px; border-radius:6px; font-size:11.5px; font-weight:600;
          border:1.5px solid; cursor:pointer; transition:all 0.15s ease;
          background:transparent; font-family:inherit; letter-spacing:0.02em;
          white-space:nowrap;
        }
        .btn-ghost:hover { transform:translateY(-1px); }
        .btn-ghost:active { transform:translateY(0); }

        .btn-green  { color:${G.main}; border-color:${G.border}; }
        .btn-green:hover { background:${G.light}; border-color:${G.main}; }

        .btn-gold  { color:${G.gold}; border-color:rgba(201,168,76,0.3); }
        .btn-gold:hover { background:rgba(201,168,76,0.08); border-color:${G.gold}; }

        .btn-red   { color:${G.red}; border-color:rgba(192,57,43,0.2); }
        .btn-red:hover  { background:${G.redL}; border-color:${G.red}; }

        .btn-primary {
          display:inline-flex; align-items:center; gap:6px;
          padding:9px 20px; border-radius:9px; border:none;
          background: ${G.main}; color:#fff;
          font-size:13.5px; font-weight:600; cursor:pointer;
          font-family:inherit; transition:all 0.18s ease;
          box-shadow: 0 3px 14px rgba(0,104,56,0.35);
          letter-spacing:0.01em;
        }
        .btn-primary:hover { background:${G.dark}; transform:translateY(-1px); box-shadow:0 5px 20px rgba(0,104,56,0.45); }
        .btn-primary:disabled { opacity:0.5; cursor:not-allowed; transform:none; }

        .stat-card {
          background:${G.white}; border:1px solid ${G.border};
          border-radius:12px; padding:16px 22px; flex:1;
          transition: box-shadow 0.2s;
        }
        .stat-card:hover { box-shadow: 0 4px 16px rgba(0,104,56,0.1); }

        .main-card {
          background:${G.white}; border:1px solid ${G.border};
          border-radius:14px; overflow:hidden;
          box-shadow: 0 2px 12px rgba(0,104,56,0.07);
        }

        .div-pill {
          display:flex; align-items:center; gap:9px;
          background:${G.xlight}; border:1px solid ${G.border};
          border-radius:8px; padding:8px 13px;
          transition: all 0.15s;
        }
        .div-pill:hover { background:${G.light}; border-color:${G.mid}; }

        .badge {
          font-size:10px; font-weight:700; padding:2px 8px;
          border-radius:99px; letter-spacing:0.05em; text-transform:uppercase;
        }

        .input-field {
          width:100%; padding:10px 13px; box-sizing:border-box;
          border:1.5px solid ${G.border}; border-radius:8px;
          color:${G.text}; font-size:14px; font-family:inherit;
          outline:none; transition:border-color 0.18s, box-shadow 0.18s;
          background:#fff;
        }
        .input-field:focus { border-color:${G.main}; box-shadow:0 0 0 3px rgba(0,104,56,0.12); }
        .input-field::placeholder { color:${G.muted}; opacity:0.6; }

        .modal-overlay { animation: fadeIn 0.18s ease; }
        .modal-box     { animation: slideUp 0.22s cubic-bezier(.4,0,.2,1); }

        .header-bar {
          background: linear-gradient(135deg, ${G.dark} 0%, ${G.main} 60%, ${G.mid} 100%);
          padding: 14px 24px;
          display:flex; align-items:center; gap:12px;
        }
      `}</style>

      <SideBar />

      <div style={{ flex: 1, overflowY: 'auto', padding: '28px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>

          {/* Page header */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 24 }}>
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                <div style={{ width:3, height:22, background:G.gold, borderRadius:2 }} />
                <p style={{ margin:0, fontSize:11, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:G.muted }}>
                  Organizational Structure
                </p>
              </div>
              <h1 style={{ margin:0, fontFamily:"'Playfair Display', serif", fontSize:24, fontWeight:700, color:G.dark, lineHeight:1.2 }}>
                Zone, Area &amp; Division
              </h1>
            </div>
            <button className="btn-primary" onClick={() => openAdd('zone')}>
              <PlusIcon /> Add New Zone
            </button>
          </div>

          {/* Error */}
          {error && (
            <div style={{ background:'#fdf0ef', border:`1px solid rgba(192,57,43,0.3)`, borderRadius:9, padding:'10px 16px', marginBottom:18, color:G.red, fontSize:13, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              {error}
              <button onClick={() => setError(null)} style={{ background:'none', border:'none', color:G.red, cursor:'pointer', fontSize:18, lineHeight:1, padding:0 }}>×</button>
=======
  const typeLabel      = { zone: 'Zone', area: 'Area', division: 'Division' } as const;
  const typeEmoji      = { zone: '🗺️',  area: '📍',   division: '🏢'       } as const;

  return (
    <div className="flex h-screen bg-green-50">
      <SideBar />

      <div className="flex-1 overflow-y-auto p-7">
        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="text-xs font-bold tracking-widest uppercase text-green-600 mb-1">
                Organizational Structure
              </p>
              <h1 className="text-2xl font-bold text-green-900">Zone, Area &amp; Division</h1>
            </div>
            {isSuperAdmin && (
              <button
                onClick={() => openAdd('zone')}
                className="flex items-center gap-2 bg-[#006838] hover:bg-[#004d28] text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors shadow-sm"
              >
                <PlusIcon /> Add New Zone
              </button>
            )}
          </div>

          {/* Error banner */}
          {error && (
            <div className="flex justify-between items-center bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-5">
              {error}
              <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600 text-lg leading-none ml-4">×</button>
>>>>>>> 7bbd93f145c97d2fa914aaaf836835dedac94fd2
            </div>
          )}

          {/* Stats */}
          {!loading && zones.length > 0 && (
<<<<<<< HEAD
            <div style={{ display:'flex', gap:12, marginBottom:20 }}>
              {[
                { label:'Total Zones',     val: zones.length,    icon:'🗺️', color: G.main },
                { label:'Total Areas',     val: totalAreas,      icon:'📍', color: G.mid  },
                { label:'Total Divisions', val: totalDivisions,  icon:'🏢', color: G.gold },
              ].map(s => (
                <div className="stat-card" key={s.label}>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                    <div>
                      <div style={{ fontSize:26, fontFamily:"'Playfair Display',serif", fontWeight:700, color: s.color }}>{s.val}</div>
                      <div style={{ fontSize:11, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.07em', color: G.muted, marginTop:1 }}>{s.label}</div>
                    </div>
                    <span style={{ fontSize:24, opacity:0.7 }}>{s.icon}</span>
                  </div>
=======
            <div className="grid grid-cols-3 gap-3 mb-5">
              {[
                { label: 'Total Zones',     val: zones.length,    icon: '🗺️', cls: 'text-[#006838]' },
                { label: 'Total Areas',     val: totalAreas,      icon: '📍', cls: 'text-[#008a4a]' },
                { label: 'Total Divisions', val: totalDivisions,  icon: '🏢', cls: 'text-yellow-600' },
              ].map(s => (
                <div key={s.label} className="bg-white border border-green-200 rounded-xl px-5 py-4 flex items-center justify-between hover:shadow-md transition-shadow">
                  <div>
                    <p className={`text-2xl font-bold ${s.cls}`}>{s.val}</p>
                    <p className="text-xs font-semibold uppercase tracking-wider text-green-700 mt-0.5">{s.label}</p>
                  </div>
                  <span className="text-2xl opacity-60">{s.icon}</span>
>>>>>>> 7bbd93f145c97d2fa914aaaf836835dedac94fd2
                </div>
              ))}
            </div>
          )}

          {/* Main card */}
<<<<<<< HEAD
          <div className="main-card">

            {/* Card header bar */}
            <div className="header-bar">
              <span style={{ color:'#fff', fontWeight:600, fontSize:14, letterSpacing:'0.02em' }}>Zones Overview</span>
              <span style={{ marginLeft:'auto', background:'rgba(255,255,255,0.18)', color:'#fff', fontSize:11, fontWeight:700, padding:'2px 10px', borderRadius:99, letterSpacing:'0.06em' }}>
=======
          <div className="bg-white border border-green-200 rounded-xl overflow-hidden shadow-sm">

            {/* Card header */}
            <div className="bg-gradient-to-r from-[#004d28] via-[#006838] to-[#008a4a] px-5 py-3.5 flex items-center justify-between">
              <span className="text-white font-semibold text-sm tracking-wide">Zones Overview</span>
              <span className="bg-white/20 text-white text-xs font-bold px-3 py-0.5 rounded-full tracking-wider">
>>>>>>> 7bbd93f145c97d2fa914aaaf836835dedac94fd2
                {zones.length} ZONE{zones.length !== 1 ? 'S' : ''}
              </span>
            </div>

            {loading ? (
<<<<<<< HEAD
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:64, gap:14, color:G.muted }}>
                <SpinIcon />
                <span style={{ fontSize:13 }}>Loading zones…</span>
              </div>
            ) : zones.length === 0 ? (
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', padding:72, gap:12, color:G.muted }}>
                <span style={{ fontSize:40, opacity:0.4 }}>🗺️</span>
                <p style={{ margin:0, fontWeight:600, fontSize:14 }}>No zones configured yet</p>
                <p style={{ margin:0, fontSize:12, opacity:0.7 }}>Click "Add New Zone" to get started</p>
=======
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-green-700">
                <SpinIcon />
                <span className="text-sm">Loading zones…</span>
              </div>
            ) : zones.length === 0 ? (
              <div className="flex flex-col items-center py-20 gap-3 text-green-700">
                <span className="text-4xl opacity-40">🗺️</span>
                <p className="font-semibold text-sm">No zones configured yet</p>
                <p className="text-xs opacity-60">Click "Add New Zone" to get started</p>
>>>>>>> 7bbd93f145c97d2fa914aaaf836835dedac94fd2
              </div>
            ) : (
              zones.map((zone, zi) => {
                const zoneOpen = expandedZones.has(zone.id);
                return (
<<<<<<< HEAD
                  <div key={zone.id} className="zone-card" style={{ borderBottom: zi < zones.length - 1 ? `1px solid ${G.border}` : 'none' }}>

                    {/* Zone row */}
                    <div
                      className="row-zone"
                      style={{ display:'flex', alignItems:'center', gap:11, padding:'13px 20px', cursor:'pointer', background: zoneOpen ? G.light : G.white }}
                      onClick={() => setExpandedZones(toggle(expandedZones, zone.id))}
                    >
                      <span style={{ color: zoneOpen ? G.main : G.muted, display:'flex', flexShrink:0 }}>
                        <Chevron open={zoneOpen} />
                      </span>
                      <div style={{ width:9, height:9, borderRadius:'50%', background: G.main, flexShrink:0, boxShadow:`0 0 0 3px rgba(0,104,56,0.15)` }} />
                      <span style={{ flex:1, fontFamily:"'Playfair Display',serif", fontWeight:600, fontSize:15, color:G.dark }}>{zone.name}</span>
                      <span className="badge" style={{ background:G.light, color:G.main, border:`1px solid ${G.border}` }}>
                        {zone.areas?.length ?? 0} area{(zone.areas?.length ?? 0) !== 1 ? 's' : ''}
                      </span>
                      <div style={{ display:'flex', gap:5 }} onClick={e => e.stopPropagation()}>
                        <button className="btn-ghost btn-green" onClick={() => openAdd('area', zone.id)}><PlusIcon /> Area</button>
                        <button className="btn-ghost btn-gold"  onClick={() => openEdit('zone', zone)}><EditIcon /></button>
                        <button className="btn-ghost btn-red"   onClick={() => handleDelete('zone', zone.id)}><TrashIcon /></button>
                      </div>
=======
                  <div key={zone.id} className={zi < zones.length - 1 ? 'border-b border-green-100' : ''}>

                    {/* Zone row */}
                    <div
                      className={`flex items-center gap-3 px-5 py-3.5 cursor-pointer transition-colors ${zoneOpen ? 'bg-green-50' : 'bg-white hover:bg-green-50'}`}
                      onClick={() => setExpandedZones(toggle(expandedZones, zone.id))}
                    >
                      <span className={zoneOpen ? 'text-green-700' : 'text-green-400'}><ChevronIcon open={zoneOpen} /></span>
                      <div className="w-2.5 h-2.5 rounded-full bg-[#006838] ring-2 ring-green-200 shrink-0" />
                      <span className="flex-1 font-semibold text-green-900">{zone.name}</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-green-100 text-green-700 border border-green-200 px-2.5 py-0.5 rounded-full">
                        {zone.areas?.length ?? 0} area{(zone.areas?.length ?? 0) !== 1 ? 's' : ''}
                      </span>
                      { isSuperAdmin && (
                      <div className="flex gap-1.5" onClick={e => e.stopPropagation()}>
                        <button onClick={() => openAdd('area', zone.id)}   className="flex items-center gap-1 text-[11px] font-semibold text-[#006838] border border-green-300 hover:bg-green-50 hover:border-[#006838] px-2.5 py-1 rounded-md transition-colors"><PlusIcon /> Area</button>
                        <button onClick={() => openEdit('zone', zone)}      className="flex items-center gap-1 text-[11px] font-semibold text-yellow-600 border border-yellow-200 hover:bg-yellow-50 hover:border-yellow-400 px-2.5 py-1 rounded-md transition-colors"><EditIcon /></button>
                        <button onClick={() => handleDelete('zone', zone.id)} className="flex items-center gap-1 text-[11px] font-semibold text-red-500 border border-red-200 hover:bg-red-50 hover:border-red-400 px-2.5 py-1 rounded-md transition-colors"><TrashIcon /></button>
                      </div>)}
>>>>>>> 7bbd93f145c97d2fa914aaaf836835dedac94fd2
                    </div>

                    {/* Areas */}
                    {zoneOpen && (
<<<<<<< HEAD
                      <div style={{ borderTop:`1px solid ${G.border}`, background:'#fafcfb' }}>
                        {(zone.areas ?? []).length === 0 ? (
                          <p style={{ padding:'12px 52px', fontSize:12.5, color:G.muted, fontStyle:'italic', margin:0 }}>No areas yet — click + Area above</p>
=======
                      <div className="border-t border-green-100 bg-green-50/50">
                        {(zone.areas ?? []).length === 0 ? (
                          <p className="px-14 py-3 text-xs text-green-500 italic">No areas yet — click + Area above</p>
>>>>>>> 7bbd93f145c97d2fa914aaaf836835dedac94fd2
                        ) : (
                          (zone.areas ?? []).map((area, ai) => {
                            const areaOpen = expandedAreas.has(area.id);
                            return (
<<<<<<< HEAD
                              <div key={area.id} style={{ borderBottom: ai < (zone.areas?.length ?? 0) - 1 ? `1px dashed ${G.border}` : 'none' }}>

                                {/* Area row */}
                                <div
                                  className="row-area"
                                  style={{ display:'flex', alignItems:'center', gap:11, padding:'11px 20px 11px 44px', cursor:'pointer', background: areaOpen ? '#f0f7f3' : 'transparent' }}
                                  onClick={() => setExpandedAreas(toggle(expandedAreas, area.id))}
                                >
                                  <span style={{ color: areaOpen ? G.mid : G.muted, display:'flex', flexShrink:0 }}>
                                    <Chevron open={areaOpen} />
                                  </span>
                                  <div style={{ width:7, height:7, borderRadius:'50%', background: G.mid, flexShrink:0, boxShadow:`0 0 0 2px rgba(0,138,74,0.15)` }} />
                                  <span style={{ flex:1, fontWeight:600, fontSize:13.5, color:G.text }}>{area.name}</span>
                                  <span className="badge" style={{ background:'rgba(0,138,74,0.08)', color:G.mid, border:`1px solid rgba(0,138,74,0.2)` }}>
                                    {area.divisions?.length ?? 0} div{(area.divisions?.length ?? 0) !== 1 ? 's' : ''}
                                  </span>
                                  <div style={{ display:'flex', gap:5 }} onClick={e => e.stopPropagation()}>
                                    <button className="btn-ghost btn-green" onClick={() => openAdd('division', area.id)}><PlusIcon /> Division</button>
                                    <button className="btn-ghost btn-gold"  onClick={() => openEdit('area', area)}><EditIcon /></button>
                                    <button className="btn-ghost btn-red"   onClick={() => handleDelete('area', area.id)}><TrashIcon /></button>
                                  </div>
=======
                              <div key={area.id} className={ai < (zone.areas?.length ?? 0) - 1 ? 'border-b border-dashed border-green-100' : ''}>

                                {/* Area row */}
                                <div
                                  className={`flex items-center gap-3 pl-11 pr-5 py-3 cursor-pointer transition-colors ${areaOpen ? 'bg-green-100/60' : 'hover:bg-green-100/40'}`}
                                  onClick={() => setExpandedAreas(toggle(expandedAreas, area.id))}
                                >
                                  <span className={areaOpen ? 'text-green-600' : 'text-green-400'}><ChevronIcon open={areaOpen} /></span>
                                  <div className="w-2 h-2 rounded-full bg-[#008a4a] ring-2 ring-green-200 shrink-0" />
                                  <span className="flex-1 font-semibold text-sm text-green-800">{area.name}</span>
                                  <span className="text-[10px] font-bold uppercase tracking-wider bg-green-100 text-[#008a4a] border border-green-200 px-2.5 py-0.5 rounded-full">
                                    {area.divisions?.length ?? 0} div{(area.divisions?.length ?? 0) !== 1 ? 's' : ''}
                                  </span>
                                  { isSuperAdmin && (
                                    <div className="flex gap-1.5" onClick={e => e.stopPropagation()}>
                                      <button onClick={() => openAdd('division', area.id)}  className="flex items-center gap-1 text-[11px] font-semibold text-[#006838] border border-green-300 hover:bg-green-50 hover:border-[#006838] px-2.5 py-1 rounded-md transition-colors"><PlusIcon /> Division</button>
                                      <button onClick={() => openEdit('area', area)}         className="flex items-center gap-1 text-[11px] font-semibold text-yellow-600 border border-yellow-200 hover:bg-yellow-50 hover:border-yellow-400 px-2.5 py-1 rounded-md transition-colors"><EditIcon /></button>
                                      <button onClick={() => handleDelete('area', area.id)} className="flex items-center gap-1 text-[11px] font-semibold text-red-500 border border-red-200 hover:bg-red-50 hover:border-red-400 px-2.5 py-1 rounded-md transition-colors"><TrashIcon /></button>
                                    </div>
                                  )}
>>>>>>> 7bbd93f145c97d2fa914aaaf836835dedac94fd2
                                </div>

                                {/* Divisions */}
                                {areaOpen && (
<<<<<<< HEAD
                                  <div style={{ padding:'8px 20px 12px 72px', background:'#f7fbf8' }}>
                                    {(area.divisions ?? []).length === 0 ? (
                                      <p style={{ fontSize:12, color:G.muted, fontStyle:'italic', margin:0 }}>No divisions yet</p>
                                    ) : (
                                      <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
                                        {(area.divisions ?? []).map(div => (
                                          <div key={div.id} className="div-pill">
                                            <div style={{ width:6, height:6, borderRadius:'50%', background:G.gold, flexShrink:0, boxShadow:`0 0 0 2px rgba(201,168,76,0.2)` }} />
                                            <span style={{ flex:1, fontSize:13, color:G.text, fontWeight:500 }}>{div.name}</span>
                                            <div style={{ display:'flex', gap:4 }}>
                                              <button className="btn-ghost btn-gold" onClick={() => openEdit('division', div)}><EditIcon /></button>
                                              <button className="btn-ghost btn-red"  onClick={() => handleDelete('division', div.id)}><TrashIcon /></button>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
=======
                                  <div className="pl-20 pr-5 pb-3 pt-1.5 bg-white/60 space-y-1.5">
                                    {(area.divisions ?? []).length === 0 ? (
                                      <p className="text-xs text-green-400 italic">No divisions yet</p>
                                    ) : (
                                      (area.divisions ?? []).map(div => (
                                        <div key={div.id} className="flex items-center gap-2.5 bg-green-50 border border-green-200 rounded-lg px-3.5 py-2 hover:bg-green-100 transition-colors">
                                          <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 ring-2 ring-yellow-100 shrink-0" />
                                          <span className="flex-1 text-sm font-medium text-green-900">{div.name}</span>
                                          { isSuperAdmin && (
                                            <div className="flex gap-1">
                                              <button onClick={() => openEdit('division', div)}          className="flex items-center gap-1 text-[11px] font-semibold text-yellow-600 border border-yellow-200 hover:bg-yellow-50 hover:border-yellow-400 px-2.5 py-1 rounded-md transition-colors"><EditIcon /></button>
                                              <button onClick={() => handleDelete('division', div.id)} className="flex items-center gap-1 text-[11px] font-semibold text-red-500 border border-red-200 hover:bg-red-50 hover:border-red-400 px-2.5 py-1 rounded-md transition-colors"><TrashIcon /></button>
                                            </div>
                                          )}
                                        </div>
                                      ))
>>>>>>> 7bbd93f145c97d2fa914aaaf836835dedac94fd2
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {modal.open && (
        <div
<<<<<<< HEAD
          className="modal-overlay"
          style={{ position:'fixed', inset:0, background:'rgba(0,30,15,0.45)', backdropFilter:'blur(5px)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:50 }}
          onClick={closeModal}
        >
          <div
            className="modal-box"
            style={{ background:G.white, borderRadius:16, width:400, boxShadow:'0 24px 64px rgba(0,50,25,0.22)', overflow:'hidden' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Modal header */}
            <div style={{ background:`linear-gradient(135deg, ${G.dark}, ${G.main})`, padding:'18px 24px' }}>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <span style={{ fontSize:20 }}>
                  {modal.type === 'zone' ? '🗺️' : modal.type === 'area' ? '📍' : '🏢'}
                </span>
                <div>
                  <h3 style={{ margin:0, fontFamily:"'Playfair Display',serif", fontSize:17, fontWeight:700, color:'#fff' }}>
                    {modal.mode === 'add' ? 'Add New' : 'Edit'} {typeLabel[modal.type]}
                  </h3>
                  <p style={{ margin:0, fontSize:11.5, color:'rgba(255,255,255,0.6)', marginTop:2 }}>
=======
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-2xl w-96 shadow-2xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="bg-gradient-to-r from-[#004d28] to-[#006838] px-6 py-5">
              <div className="flex items-center gap-3">
                <span className="text-xl">{typeEmoji[modal.type]}</span>
                <div>
                  <h3 className="text-white font-bold text-base">
                    {modal.mode === 'add' ? 'Add New' : 'Edit'} {typeLabel[modal.type]}
                  </h3>
                  <p className="text-white/60 text-xs mt-0.5">
>>>>>>> 7bbd93f145c97d2fa914aaaf836835dedac94fd2
                    {modal.mode === 'add' ? `Create a new ${modal.type}` : `Rename this ${modal.type}`}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal body */}
<<<<<<< HEAD
            <div style={{ padding:'22px 24px 20px' }}>
              <label style={{ display:'block', fontSize:11.5, fontWeight:700, letterSpacing:'0.07em', textTransform:'uppercase', color:G.muted, marginBottom:7 }}>
=======
            <div className="px-6 py-5">
              <label className="block text-xs font-bold uppercase tracking-widest text-green-600 mb-2">
>>>>>>> 7bbd93f145c97d2fa914aaaf836835dedac94fd2
                {typeLabel[modal.type]} Name
              </label>
              <input
                ref={inputRef}
<<<<<<< HEAD
                className="input-field"
=======
                className="w-full border-2 border-green-200 focus:border-[#006838] focus:ring-2 focus:ring-green-100 rounded-lg px-3.5 py-2.5 text-sm text-green-900 outline-none transition-all"
>>>>>>> 7bbd93f145c97d2fa914aaaf836835dedac94fd2
                placeholder={modal.type === 'zone' ? 'e.g. North Zone' : modal.type === 'area' ? 'e.g. Sector 5' : 'e.g. Alpha Division'}
                value={inputVal}
                onChange={e => setInputVal(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSave()}
              />
<<<<<<< HEAD

              <div style={{ display:'flex', justifyContent:'flex-end', gap:10, marginTop:20 }}>
                <button
                  onClick={closeModal}
                  style={{ padding:'9px 18px', borderRadius:8, border:`1.5px solid ${G.border}`, background:'transparent', color:G.muted, fontSize:13.5, cursor:'pointer', fontFamily:'inherit', fontWeight:500 }}
=======
              <div className="flex justify-end gap-2.5 mt-5">
                <button
                  onClick={closeModal}
                  className="px-5 py-2.5 text-sm font-medium text-green-700 border border-green-200 hover:bg-green-50 rounded-lg transition-colors"
>>>>>>> 7bbd93f145c97d2fa914aaaf836835dedac94fd2
                >
                  Cancel
                </button>
                <button
<<<<<<< HEAD
                  className="btn-primary"
                  onClick={handleSave}
                  disabled={saving || !inputVal.trim()}
=======
                  onClick={handleSave}
                  disabled={saving || !inputVal.trim()}
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#006838] hover:bg-[#004d28] disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors shadow-sm"
>>>>>>> 7bbd93f145c97d2fa914aaaf836835dedac94fd2
                >
                  {saving && <SpinIcon />}
                  {saving ? 'Saving…' : modal.mode === 'add' ? 'Create' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ZoneAreaDivisionTable;