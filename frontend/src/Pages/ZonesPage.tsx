import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import SideBar from '../components/SideBar';

interface Division { id: number; name: string; area_id?: number; }
interface Area     { id: number; name: string; zone_id?: number; divisions?: Division[]; }
interface Zone     { id: number; name: string; areas?: Area[]; }

type ModalState =
  | { open: true; type: 'zone' | 'area' | 'division'; mode: 'add' | 'edit'; parentId?: number; record?: Zone | Area | Division }
  | { open: false };

const BASE = 'https://sosafe.onrender.com/api';

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
      }
      await fetchZones();
      closeModal();
    } catch { setError('Save failed. Please try again.'); }
    finally  { setSaving(false); }
  };

  const handleDelete = async (type: 'zone' | 'area' | 'division', id: number) => {
    if (!window.confirm(`Permanently delete this ${type}?`)) return;
    try {
      const url = type === 'zone'
        ? `${BASE}/zones/${id}`
        : type === 'area'
          ? `${BASE}/areas/${id}`
          : `${BASE}/zone-divisions/${id}`;
      await axios.delete(url, { headers });
      await fetchZones();
    } catch { setError('Delete failed.'); }
  };

  const totalAreas     = zones.reduce((a, z) => a + (z.areas?.length ?? 0), 0);
  const totalDivisions = zones.reduce((a, z) => a + (z.areas ?? []).reduce((b, ar) => b + (ar.divisions?.length ?? 0), 0), 0);
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
            </div>
          )}

          {/* Stats */}
          {!loading && zones.length > 0 && (
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
                </div>
              ))}
            </div>
          )}

          {/* Main card */}
          <div className="bg-white border border-green-200 rounded-xl overflow-hidden shadow-sm">

            {/* Card header */}
            <div className="bg-gradient-to-r from-[#004d28] via-[#006838] to-[#008a4a] px-5 py-3.5 flex items-center justify-between">
              <span className="text-white font-semibold text-sm tracking-wide">Zones Overview</span>
              <span className="bg-white/20 text-white text-xs font-bold px-3 py-0.5 rounded-full tracking-wider">
                {zones.length} ZONE{zones.length !== 1 ? 'S' : ''}
              </span>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-green-700">
                <SpinIcon />
                <span className="text-sm">Loading zones…</span>
              </div>
            ) : zones.length === 0 ? (
              <div className="flex flex-col items-center py-20 gap-3 text-green-700">
                <span className="text-4xl opacity-40">🗺️</span>
                <p className="font-semibold text-sm">No zones configured yet</p>
                <p className="text-xs opacity-60">Click "Add New Zone" to get started</p>
              </div>
            ) : (
              zones.map((zone, zi) => {
                const zoneOpen = expandedZones.has(zone.id);
                return (
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
                    </div>

                    {/* Areas */}
                    {zoneOpen && (
                      <div className="border-t border-green-100 bg-green-50/50">
                        {(zone.areas ?? []).length === 0 ? (
                          <p className="px-14 py-3 text-xs text-green-500 italic">No areas yet — click + Area above</p>
                        ) : (
                          (zone.areas ?? []).map((area, ai) => {
                            const areaOpen = expandedAreas.has(area.id);
                            return (
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
                                </div>

                                {/* Divisions */}
                                {areaOpen && (
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
                    {modal.mode === 'add' ? `Create a new ${modal.type}` : `Rename this ${modal.type}`}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal body */}
            <div className="px-6 py-5">
              <label className="block text-xs font-bold uppercase tracking-widest text-green-600 mb-2">
                {typeLabel[modal.type]} Name
              </label>
              <input
                ref={inputRef}
                className="w-full border-2 border-green-200 focus:border-[#006838] focus:ring-2 focus:ring-green-100 rounded-lg px-3.5 py-2.5 text-sm text-green-900 outline-none transition-all"
                placeholder={modal.type === 'zone' ? 'e.g. North Zone' : modal.type === 'area' ? 'e.g. Sector 5' : 'e.g. Alpha Division'}
                value={inputVal}
                onChange={e => setInputVal(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSave()}
              />
              <div className="flex justify-end gap-2.5 mt-5">
                <button
                  onClick={closeModal}
                  className="px-5 py-2.5 text-sm font-medium text-green-700 border border-green-200 hover:bg-green-50 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving || !inputVal.trim()}
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#006838] hover:bg-[#004d28] disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors shadow-sm"
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