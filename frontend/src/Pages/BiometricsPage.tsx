import React, { useState, useRef, useCallback } from 'react';
import SideBar from '../components/SideBar';

/* ── Icons (matching zones page style) ── */
const PlusIcon    = () => <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" className="w-3 h-3"><line x1="10" y1="3" x2="10" y2="17"/><line x1="3" y1="10" x2="17" y2="10"/></svg>;
const SpinIcon    = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" className="w-4 h-4 animate-spin"><path d="M12 2a10 10 0 0 1 10 10"/></svg>;
const CameraIcon  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>;
const FingerprintIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4"/><path d="M14 13.12c0 2.38 0 6.38-1 8.88"/><path d="M17.29 21.02c.12-.6.43-2.3.5-3.02"/><path d="M2 12a10 10 0 0 1 18-6"/><path d="M2 17c1 .5 2.5 1 4 1.5"/><path d="M20 13c.2 3-.3 6-2 8"/><path d="M7 13.87C6.37 17.64 5 19.96 5 22"/><path d="M7 7a5 5 0 0 1 9.33-2.5"/><path d="M12 6a6 6 0 0 1 6 6c0 .7-.04 1.37-.1 2"/><path d="M9 7.5A5.83 5.83 0 0 0 6.12 12"/></svg>;
const CheckIcon   = () => <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polyline points="4 10 8 14 16 6"/></svg>;
const TrashIcon   = () => <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3"><polyline points="5 7 15 7"/><path d="M8 7V4h4v3"/><rect x="4" y="7" width="12" height="10" rx="2"/></svg>;
const RefreshIcon = () => <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3"><path d="M4 4v5h5"/><path d="M16 16v-5h-5"/><path d="M4.93 14A8 8 0 1 0 5.64 5.6L4 9"/></svg>;

interface UserBiometric {
  id: number;
  full_name: string;
  staff_id: string;
  department: string;
  photo_path: string | null;
  fingerprint_template: string | null;
  enrolled_at: string | null;
}

type EnrollStep = 'details' | 'photo' | 'fingerprint' | 'done';

const MOCK_USERS: UserBiometric[] = [
  { id: 1, full_name: 'Adeola Okafor',    staff_id: 'STF-001', department: 'Finance',  photo_path: 'photo.jpg', fingerprint_template: 'fp_template', enrolled_at: '2025-06-12' },
  { id: 2, full_name: 'Babatunde Nwosu',  staff_id: 'STF-002', department: 'ICT',      photo_path: 'photo.jpg', fingerprint_template: null,          enrolled_at: '2025-06-10' },
  { id: 3, full_name: 'Chisom Ugwu',      staff_id: 'STF-003', department: 'Admin',    photo_path: 'photo.jpg', fingerprint_template: 'fp_template', enrolled_at: '2025-06-09' },
  { id: 4, full_name: 'Damilola Ibrahim', staff_id: 'STF-004', department: 'HR',       photo_path: null,        fingerprint_template: null,          enrolled_at: null },
  { id: 5, full_name: 'Emeka Adeyemi',    staff_id: 'STF-005', department: 'Legal',    photo_path: 'photo.jpg', fingerprint_template: 'fp_template', enrolled_at: '2025-06-05' },
];

const getStatus = (u: UserBiometric) => {
  if (u.photo_path && u.fingerprint_template) return 'complete';
  if (u.photo_path || u.fingerprint_template)  return 'partial';
  return 'none';
};

const initials = (name: string) =>
  name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();

const avatarColors = [
  { bg: 'bg-green-100',  text: 'text-green-800'  },
  { bg: 'bg-blue-100',   text: 'text-blue-800'   },
  { bg: 'bg-purple-100', text: 'text-purple-800' },
  { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  { bg: 'bg-pink-100',   text: 'text-pink-800'   },
];

const BiometricsPage: React.FC = () => {
  const [users]              = useState<UserBiometric[]>(MOCK_USERS);
  const [modalOpen, setModalOpen] = useState(false);
  const [step, setStep]      = useState<EnrollStep>('details');
  const [saving, setSaving]  = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned]   = useState(false);
  const [photo, setPhoto]    = useState<string | null>(null);
  const [stream, setStream]  = useState<MediaStream | null>(null);
  const [form, setForm]      = useState({ full_name: '', staff_id: '', department: '', phone: '', dob: '' });

  const videoRef  = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const total    = users.length;
  const complete = users.filter(u => getStatus(u) === 'complete').length;
  const partial  = users.filter(u => getStatus(u) === 'partial').length;
  const pending  = users.filter(u => getStatus(u) === 'none').length;

  /* ── Camera ── */
  const startCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) videoRef.current.srcObject = s;
      setStream(s);
    } catch {
      alert('Could not access camera. Please check permissions.');
    }
  };

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    canvas.width  = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
    setPhoto(canvas.toDataURL('image/jpeg'));
    stream?.getTracks().forEach(t => t.stop());
    setStream(null);
  }, [stream]);

  const retakePhoto = () => {
    setPhoto(null);
    startCamera();
  };

  /* ── Fingerprint (stub — wire your WebSocket/SDK here) ── */
  const startScan = () => {
    setScanning(true);
    // TODO: connect to ws://localhost:9734 or your scanner SDK
    // ws.onmessage = (e) => { setScanned(true); setScanning(false); }
    setTimeout(() => { setScanning(false); setScanned(true); }, 2500); // mock
  };

  /* ── Modal lifecycle ── */
  const openModal = () => {
    setModalOpen(true);
    setStep('details');
    setPhoto(null);
    setScanned(false);
    setForm({ full_name: '', staff_id: '', department: '', phone: '', dob: '' });
  };

  const closeModal = () => {
    stream?.getTracks().forEach(t => t.stop());
    setStream(null);
    setModalOpen(false);
  };

  const handleSubmit = async () => {
    setSaving(true);
    // TODO: POST to /api/users/enroll with FormData (photo blob + fingerprint_template + form fields)
    await new Promise(r => setTimeout(r, 1500));
    setSaving(false);
    setStep('done');
  };

  const steps: EnrollStep[] = ['details', 'photo', 'fingerprint'];
  // include 'done' so indexing with EnrollStep is safe (TS won't complain)
  const stepLabels: { [K in EnrollStep]: string } = { details: 'Personal details', photo: 'Webcam photo', fingerprint: 'Fingerprint scan', done: 'Complete' };

  return (
    <div className="flex h-screen bg-green-50">
      <SideBar />

      <div className="flex-1 overflow-y-auto p-7">
        <div className="max-w-4xl mx-auto">

          {/* ── Header ── */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="text-xs font-bold tracking-widest uppercase text-green-600 mb-1">
                Biometric Management
              </p>
              <h1 className="text-2xl font-bold text-green-900">Biometric Enrollment</h1>
            </div>
            <button
              onClick={openModal}
              className="flex items-center gap-2 bg-[#006838] hover:bg-[#004d28] text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors shadow-sm"
            >
              <PlusIcon /> Enroll New User
            </button>
          </div>

          {/* ── Stats ── */}
          <div className="grid grid-cols-4 gap-3 mb-5">
            {[
              { label: 'Total Users',   val: total,    icon: '👥', cls: 'text-[#006838]' },
              { label: 'Fully Enrolled', val: complete, icon: '✅', cls: 'text-[#006838]' },
              { label: 'Partial',        val: partial,  icon: '⚠️', cls: 'text-yellow-600' },
              { label: 'Not Enrolled',   val: pending,  icon: '❌', cls: 'text-red-500'   },
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

          {/* ── Users table card ── */}
          <div className="bg-white border border-green-200 rounded-xl overflow-hidden shadow-sm">

            <div className="bg-gradient-to-r from-[#004d28] via-[#006838] to-[#008a4a] px-5 py-3.5 flex items-center justify-between">
              <span className="text-white font-semibold text-sm tracking-wide">Enrolled Users</span>
              <span className="bg-white/20 text-white text-xs font-bold px-3 py-0.5 rounded-full tracking-wider">
                {total} USER{total !== 1 ? 'S' : ''}
              </span>
            </div>

            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-green-100 bg-green-50/60">
                  <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-widest text-green-600">User</th>
                  <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-widest text-green-600">Staff ID</th>
                  <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-widest text-green-600">Department</th>
                  <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-widest text-green-600">Photo</th>
                  <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-widest text-green-600">Fingerprint</th>
                  <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-widest text-green-600">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-widest text-green-600">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => {
                  const status  = getStatus(u);
                  const color   = avatarColors[i % avatarColors.length];
                  return (
                    <tr key={u.id} className="border-b border-green-50 hover:bg-green-50/50 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-full ${color.bg} ${color.text} justify-content: center font-semibold text-xs shrink-0 flex items-center justify-center`}>
                            {initials(u.full_name)}
                          </div>
                          <span className="font-medium text-green-900">{u.full_name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-green-700 font-mono text-xs">{u.staff_id}</td>
                      <td className="px-4 py-3.5 text-green-800">{u.department}</td>
                      <td className="px-4 py-3.5">
                        {u.photo_path
                          ? <span className="inline-flex items-center gap-1 text-[11px] font-bold text-green-700 bg-green-100 border border-green-200 px-2.5 py-0.5 rounded-full"><CheckIcon /> Captured</span>
                          : <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-500 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full">Missing</span>
                        }
                      </td>
                      <td className="px-4 py-3.5">
                        {u.fingerprint_template
                          ? <span className="inline-flex items-center gap-1 text-[11px] font-bold text-green-700 bg-green-100 border border-green-200 px-2.5 py-0.5 rounded-full"><CheckIcon /> Scanned</span>
                          : <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-500 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full">Missing</span>
                        }
                      </td>
                      <td className="px-4 py-3.5">
                        {status === 'complete' && <span className="text-[10px] font-bold uppercase tracking-wider bg-green-100 text-green-700 border border-green-200 px-2.5 py-0.5 rounded-full">Complete</span>}
                        {status === 'partial'  && <span className="text-[10px] font-bold uppercase tracking-wider bg-yellow-100 text-yellow-700 border border-yellow-200 px-2.5 py-0.5 rounded-full">Partial</span>}
                        {status === 'none'     && <span className="text-[10px] font-bold uppercase tracking-wider bg-red-50 text-red-500 border border-red-200 px-2.5 py-0.5 rounded-full">Not Enrolled</span>}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex gap-1.5">
                          <button
                            onClick={openModal}
                            className="flex items-center gap-1 text-[11px] font-semibold text-[#006838] border border-green-300 hover:bg-green-50 hover:border-[#006838] px-2.5 py-1 rounded-md transition-colors"
                          >
                            {status === 'none' ? <><PlusIcon /> Enroll</> : <><RefreshIcon /> Update</>}
                          </button>
                          {status !== 'none' && (
                            <button className="flex items-center gap-1 text-[11px] font-semibold text-red-500 border border-red-200 hover:bg-red-50 hover:border-red-400 px-2.5 py-1 rounded-md transition-colors">
                              <TrashIcon />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </div>
      </div>

      {/* ── Enrollment Modal ── */}
      {modalOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-2xl w-[560px] shadow-2xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="bg-gradient-to-r from-[#004d28] to-[#006838] px-6 py-5">
              <div className="flex items-center gap-3">
                <span className="text-xl">🫆</span>
                <div>
                  <h3 className="text-white font-bold text-base">Biometric Enrollment</h3>
                  <p className="text-white/60 text-xs mt-0.5">Capture user photo and fingerprint</p>
                </div>
              </div>

              {/* Step indicator */}
              {step !== 'done' && (
                <div className="flex items-center gap-2 mt-4">
                  {steps.map((s, i) => (
                    <React.Fragment key={s}>
                      <div className="flex items-center gap-1.5">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors
                          ${step === s ? 'bg-white text-[#006838]' : steps.indexOf(step) > i ? 'bg-green-400 text-white' : 'bg-white/20 text-white/60'}`}>
                          {steps.indexOf(step) > i ? '✓' : i + 1}
                        </div>
                        <span className={`text-[11px] font-semibold ${step === s ? 'text-white' : 'text-white/50'}`}>
                          {stepLabels[s]}
                        </span>
                      </div>
                      {i < steps.length - 1 && <div className="flex-1 h-px bg-white/20" />}
                    </React.Fragment>
                  ))}
                </div>
              )}
            </div>

            {/* Modal body */}
            <div className="px-6 py-5">

              {/* Step 1 — Personal details */}
              {step === 'details' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { key: 'full_name',   label: 'Full Name',   placeholder: 'e.g. Adeola Okafor' },
                      { key: 'staff_id',    label: 'Staff ID',    placeholder: 'e.g. STF-001' },
                      { key: 'department',  label: 'Department',  placeholder: 'e.g. Finance' },
                      { key: 'phone',       label: 'Phone',       placeholder: 'e.g. 08012345678' },
                    ].map(f => (
                      <div key={f.key}>
                        <label className="block text-xs font-bold uppercase tracking-widest text-green-600 mb-1.5">{f.label}</label>
                        <input
                          className="w-full border-2 border-green-200 focus:border-[#006838] focus:ring-2 focus:ring-green-100 rounded-lg px-3.5 py-2 text-sm text-green-900 outline-none transition-all"
                          placeholder={f.placeholder}
                          value={(form as any)[f.key]}
                          onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                        />
                      </div>
                    ))}
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-green-600 mb-1.5">Date of Birth</label>
                    <input
                      type="date"
                      className="w-full border-2 border-green-200 focus:border-[#006838] focus:ring-2 focus:ring-green-100 rounded-lg px-3.5 py-2 text-sm text-green-900 outline-none transition-all"
                      value={form.dob}
                      onChange={e => setForm({ ...form, dob: e.target.value })}
                    />
                  </div>
                </div>
              )}

              {/* Step 2 — Webcam */}
              {step === 'photo' && (
                <div>
                  <div className="rounded-xl overflow-hidden border-2 border-green-200 bg-green-50 mb-3" style={{ height: 240 }}>
                    {photo ? (
                      <img src={photo} alt="Captured" className="w-full h-full object-cover" />
                    ) : stream ? (
                      <video ref={videoRef} autoPlay className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full gap-3 text-green-400">
                        <CameraIcon />
                        <p className="text-sm font-medium text-green-600">Camera feed will appear here</p>
                        <p className="text-xs text-green-400">Click "Start Camera" to begin</p>
                      </div>
                    )}
                  </div>
                  <canvas ref={canvasRef} className="hidden" />
                  <div className="flex gap-2">
                    {!stream && !photo && (
                      <button onClick={startCamera} className="flex-1 flex items-center justify-center gap-2 bg-[#006838] hover:bg-[#004d28] text-white text-sm font-semibold py-2.5 rounded-lg transition-colors">
                        <CameraIcon /> Start Camera
                      </button>
                    )}
                    {stream && (
                      <button onClick={capturePhoto} className="flex-1 flex items-center justify-center gap-2 bg-[#006838] hover:bg-[#004d28] text-white text-sm font-semibold py-2.5 rounded-lg transition-colors">
                        <CameraIcon /> Capture Photo
                      </button>
                    )}
                    {photo && (
                      <button onClick={retakePhoto} className="flex-1 flex items-center justify-center gap-2 border-2 border-green-200 hover:bg-green-50 hover:border-[#006838] text-green-700 text-sm font-semibold py-2.5 rounded-lg transition-colors">
                        <RefreshIcon /> Retake
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Step 3 — Fingerprint */}
              {step === 'fingerprint' && (
                <div>
                  <div className="rounded-xl border-2 border-green-200 bg-green-50 mb-3 flex flex-col items-center justify-center gap-3" style={{ height: 200 }}>
                    {scanned ? (
                      <>
                        <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center text-green-700">
                          <CheckIcon />
                        </div>
                        <p className="text-sm font-semibold text-green-700">Fingerprint captured successfully</p>
                      </>
                    ) : scanning ? (
                      <>
                        <div className="text-green-600"><SpinIcon /></div>
                        <p className="text-sm font-semibold text-green-700">Scanning… place finger on scanner</p>
                        <p className="text-xs text-green-400">Hold still until the scan completes</p>
                      </>
                    ) : (
                      <>
                        <div className="text-green-400"><FingerprintIcon /></div>
                        <p className="text-sm font-medium text-green-600">Awaiting scanner input</p>
                        <p className="text-xs text-green-400">Make sure your USB fingerprint scanner is connected</p>
                      </>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {!scanned && (
                      <button
                        onClick={startScan}
                        disabled={scanning}
                        className="flex-1 flex items-center justify-center gap-2 bg-[#006838] hover:bg-[#004d28] disabled:opacity-50 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
                      >
                        {scanning ? <SpinIcon /> : <FingerprintIcon />}
                        {scanning ? 'Scanning…' : 'Start Scan'}
                      </button>
                    )}
                    {scanned && (
                      <button onClick={() => setScanned(false)} className="flex-1 flex items-center justify-center gap-2 border-2 border-green-200 hover:bg-green-50 hover:border-[#006838] text-green-700 text-sm font-semibold py-2.5 rounded-lg transition-colors">
                        <RefreshIcon /> Re-scan
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Done */}
              {step === 'done' && (
                <div className="flex flex-col items-center py-6 gap-3">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-green-700 text-3xl">✅</div>
                  <p className="text-base font-bold text-green-900">Enrollment Complete!</p>
                  <p className="text-sm text-green-600 text-center">
                    {form.full_name || 'User'}'s photo and fingerprint have been saved successfully.
                  </p>
                </div>
              )}

              {/* Footer buttons */}
              {step !== 'done' && (
                <div className="flex justify-end gap-2.5 mt-5">
                  <button
                    onClick={closeModal}
                    className="px-5 py-2.5 text-sm font-medium text-green-700 border border-green-200 hover:bg-green-50 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>

                  {step !== 'details' && (
                    <button
                      onClick={() => setStep(step === 'fingerprint' ? 'photo' : 'details')}
                      className="px-5 py-2.5 text-sm font-medium text-green-700 border border-green-200 hover:bg-green-50 rounded-lg transition-colors"
                    >
                      Back
                    </button>
                  )}

                  {step === 'details' && (
                    <button
                      onClick={() => setStep('photo')}
                      disabled={!form.full_name.trim() || !form.staff_id.trim()}
                      className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#006838] hover:bg-[#004d28] disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors shadow-sm"
                    >
                      Next: Capture Photo →
                    </button>
                  )}

                  {step === 'photo' && (
                    <button
                      onClick={() => setStep('fingerprint')}
                      disabled={!photo}
                      className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#006838] hover:bg-[#004d28] disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors shadow-sm"
                    >
                      Next: Fingerprint →
                    </button>
                  )}

                  {step === 'fingerprint' && (
                    <button
                      onClick={handleSubmit}
                      disabled={saving}
                      className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#006838] hover:bg-[#004d28] disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors shadow-sm"
                    >
                      {saving && <SpinIcon />}
                      {saving ? 'Saving…' : 'Save Enrollment'}
                    </button>
                  )}
                </div>
              )}

              {step === 'done' && (
                <div className="flex justify-center mt-2">
                  <button
                    onClick={closeModal}
                    className="px-8 py-2.5 text-sm font-semibold text-white bg-[#006838] hover:bg-[#004d28] rounded-lg transition-colors shadow-sm"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BiometricsPage;