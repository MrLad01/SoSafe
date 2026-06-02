import React, { useState, useRef, useCallback, useEffect, ChangeEvent } from "react";
import axios from "axios";

// ─── Types ────────────────────────────────────────────────────────────────────

type ImportStatus = "idle" | "uploading" | "queued" | "processing" | "dispatched" | "completed" | "failed";

interface ProgressData {
  status: ImportStatus;
  total: number;
  processed: number;
  chunks: number;
  done: number;
  errors: string[];
  started_at: string | null;
  finished_at: string | null;
}

interface LogEntry {
  time: string;
  text: string;
  isError: boolean;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const API_BASE = "https://sosafe.onrender.com/api";

const STATUS_META: Record<ImportStatus, { label: string; color: string }> = {
  idle:        { label: "Ready",       color: "#52525b" },
  uploading:   { label: "Uploading",   color: "#38bdf8" },
  queued:      { label: "Queued",      color: "#a78bfa" },
  processing:  { label: "Processing",  color: "#38bdf8" },
  dispatched:  { label: "Inserting",   color: "#fb923c" },
  completed:   { label: "Complete",    color: "#4ade80" },
  failed:      { label: "Failed",      color: "#f87171" },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

const fmt = (n: number) => n.toLocaleString();
const pct = (done: number, total: number) =>
  total > 0 ? Math.min(100, Math.round((done / total) * 100)) : 0;
const ts  = () =>
  new Date().toLocaleTimeString("en-GB", { hour12: false });

// ─── Component ───────────────────────────────────────────────────────────────

const FileUploader: React.FC = () => {
  const [file,       setFile]       = useState<File | null>(null);
  const [uploadPct,  setUploadPct]  = useState(0);
  const [status,     setStatus]     = useState<ImportStatus>("idle");
  const [progress,   setProgress]   = useState<ProgressData | null>(null);
  const [importId,   setImportId]   = useState<string | null>(null);
  const [log,        setLog]        = useState<LogEntry[]>([]);
  const [dragOver,   setDragOver]   = useState(false);

  const esRef     = useRef<EventSource | null>(null);
  const logEndRef = useRef<HTMLDivElement>(null);
  const token     = sessionStorage.getItem("authToken");

  // Auto-scroll log
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [log]);

  // Cleanup SSE on unmount
  useEffect(() => () => { esRef.current?.close(); }, []);

  const addLog = useCallback((text: string, isError = false) => {
    setLog(prev => [...prev, { time: ts(), text, isError }]);
  }, []);

  // ── File selection ──────────────────────────────────────────────────────────

  const applyFile = (f: File) => {
    const ok = /\.(xlsx|xls|csv)$/i.test(f.name);
    if (!ok) { addLog("Only .xlsx, .xls, or .csv files are accepted.", true); return; }
    setFile(f);
    setStatus("idle");
    setProgress(null);
    setLog([]);
    setUploadPct(0);
    setImportId(null);
    addLog(`File selected: ${f.name} (${(f.size / 1024).toFixed(1)} KB)`);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) applyFile(e.target.files[0]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files?.[0]) applyFile(e.dataTransfer.files[0]);
  };

  // ── SSE stream ──────────────────────────────────────────────────────────────

  const openStream = useCallback((id: string) => {
    esRef.current?.close();

    // EventSource can't send headers — pass JWT as query param.
    // JwtMiddleware must fall back to ?token=... when the Authorization header is absent.
    const url = `${API_BASE}/import/progress/${id}?token=${token ?? ""}`;
    const es  = new EventSource(url);
    esRef.current = es;

    es.addEventListener("progress", (e: MessageEvent) => {
      const d: ProgressData = JSON.parse(e.data);
      setProgress(d);
      setStatus(d.status);

      if (d.status === "completed") {
        addLog(`Import finished — ${fmt(d.processed)} rows inserted across ${fmt(d.chunks)} chunks.`);
        es.close();
      } else if (d.status === "failed") {
        d.errors.forEach(err => addLog(err, true));
        es.close();
      }
    });

    es.addEventListener("error", (e: MessageEvent) => {
      try {
        const d = JSON.parse((e as any).data ?? "{}");
        addLog(`Stream error: ${d.message ?? "connection lost"}`, true);
      } catch {
        addLog("Progress stream connection lost.", true);
      }
      es.close();
    });

    es.onerror = () => {
      // Browser-level drop (not a server event) — only fire if still open
      if (es.readyState === EventSource.CLOSED) return;
      addLog("Lost connection to progress stream.", true);
      es.close();
    };
  }, [token, addLog]);

  // ── Upload ──────────────────────────────────────────────────────────────────

  const handleUpload = async () => {
    if (!file) return;

    setStatus("uploading");
    setUploadPct(0);
    setLog([]);
    setProgress(null);

    const formData = new FormData();
    formData.append("raw_data", file);

    try {
      const { data } = await axios.post<{ message: string; import_id: string }>(
        `${API_BASE}/import`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
          onUploadProgress: (ev) => {
            const p = (ev.loaded / (ev.total ?? ev.loaded)) * 100;
            setUploadPct(Math.min(Math.round(p), 100));
          },
        }
      );

      addLog(`File accepted by server. Import ID: ${data.import_id}`);
      setImportId(data.import_id);
      setStatus("queued");
      openStream(data.import_id);
    } catch (err) {
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.message ?? err.message
        : "Upload failed. Please try again.";
      addLog(msg, true);
      setStatus("failed");
    }
  };

  // ── Reset ───────────────────────────────────────────────────────────────────

  const reset = () => {
    esRef.current?.close();
    setFile(null);
    setStatus("idle");
    setProgress(null);
    setLog([]);
    setUploadPct(0);
    setImportId(null);
  };

  // ── Derived values ──────────────────────────────────────────────────────────

  const isActive  = !["idle", "completed", "failed"].includes(status);
  const barWidth  = status === "uploading"
    ? uploadPct
    : progress
      ? pct(progress.done, progress.chunks || 1)
      : status === "queued" ? 5 : 0;

  const { label: statusLabel, color: statusColor } = STATUS_META[status];

  const indeterminate = ["queued", "processing"].includes(status) && (!progress || progress.chunks === 0);

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div style={{
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      background: "#fafaf9",
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&family=DM+Mono:wght@400;500&display=swap');

        * { box-sizing: border-box; }

        .su-card {
          width: 100%;
          max-width: 520px;
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          overflow: hidden;
        }

        .su-header {
          padding: 1.5rem 1.75rem 1.25rem;
          border-bottom: 1px solid #f3f4f6;
        }
        .su-eyebrow {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          letter-spacing: .1em;
          text-transform: uppercase;
          color: #9ca3af;
          margin-bottom: 4px;
        }
        .su-title {
          font-size: 1.15rem;
          font-weight: 600;
          color: #111827;
          margin: 0;
        }

        .su-body { padding: 1.5rem 1.75rem; display: flex; flex-direction: column; gap: 1.25rem; }

        /* Drop zone */
        .su-drop {
          border: 1.5px dashed #d1d5db;
          border-radius: 12px;
          padding: 2rem 1.5rem;
          text-align: center;
          cursor: pointer;
          transition: border-color .2s, background .2s;
          position: relative;
          background: #fafaf9;
        }
        .su-drop.drag { border-color: #6366f1; background: #eef2ff; }
        .su-drop input { position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; height: 100%; }
        .su-drop-icon { font-size: 1.75rem; margin-bottom: .5rem; color: #6366f1; }
        .su-drop-main { font-size: .9rem; font-weight: 500; color: #374151; }
        .su-drop-sub  { font-size: .78rem; color: #9ca3af; margin-top: 2px; }
        .su-file-name { font-family: 'DM Mono', monospace; font-size: .78rem; color: #6366f1; margin-top: .5rem; display: flex; align-items: center; justify-content: center; gap: 6px; }

        /* Progress bar */
        .su-bar-wrap { height: 5px; background: #f3f4f6; border-radius: 99px; overflow: hidden; }
        .su-bar-fill { height: 100%; border-radius: 99px; background: #6366f1; transition: width .4s ease; }
        .su-bar-fill.indeterminate { width: 35% !important; animation: su-slide 1.3s ease-in-out infinite; }
        .su-bar-fill.done  { background: #22c55e; }
        .su-bar-fill.error { background: #ef4444; }
        @keyframes su-slide {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(350%); }
        }

        /* Status row */
        .su-status-row { display: flex; align-items: center; justify-content: space-between; }
        .su-pct  { font-family: 'DM Mono', monospace; font-size: .8rem; color: #6b7280; }
        .su-badge {
          font-family: 'DM Mono', monospace;
          font-size: .7rem;
          padding: 3px 10px;
          border-radius: 99px;
          letter-spacing: .04em;
          text-transform: uppercase;
          font-weight: 500;
          background: #f3f4f6;
          transition: background .3s, color .3s;
        }

        /* Stats */
        .su-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
        .su-stat { background: #f9fafb; border: 1px solid #f3f4f6; border-radius: 10px; padding: .65rem .85rem; }
        .su-stat-label { font-size: .68rem; font-family: 'DM Mono', monospace; color: #9ca3af; text-transform: uppercase; letter-spacing: .06em; margin-bottom: 3px; }
        .su-stat-val   { font-size: 1.1rem; font-weight: 600; font-family: 'DM Mono', monospace; color: #111827; line-height: 1; }

        /* Log */
        .su-log { background: #f9fafb; border: 1px solid #f3f4f6; border-radius: 10px; padding: .65rem .9rem; max-height: 130px; overflow-y: auto; font-family: 'DM Mono', monospace; font-size: .72rem; color: #6b7280; line-height: 1.75; }
        .su-log-row { display: flex; gap: 10px; }
        .su-log-t   { color: #6366f1; flex-shrink: 0; }
        .su-log-err { color: #ef4444; }

        /* Import ID */
        .su-id { font-family: 'DM Mono', monospace; font-size: .7rem; color: #9ca3af; display: flex; gap: 8px; }
        .su-id span { color: #374151; word-break: break-all; }

        /* Buttons */
        .su-btn {
          width: 100%;
          padding: .7rem;
          border: none;
          border-radius: 10px;
          font-family: 'DM Sans', sans-serif;
          font-size: .9rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: background .2s, transform .1s, opacity .2s;
        }
        .su-btn-primary { background: #6366f1; color: #fff; }
        .su-btn-primary:hover:not(:disabled) { background: #4f46e5; }
        .su-btn-primary:active:not(:disabled) { transform: scale(.98); }
        .su-btn-primary:disabled { background: #e5e7eb; color: #9ca3af; cursor: not-allowed; }
        .su-btn-ghost { background: transparent; border: 1px solid #e5e7eb; color: #6b7280; margin-top: -.25rem; }
        .su-btn-ghost:hover { border-color: #6366f1; color: #6366f1; }

        @keyframes su-spin { to { transform: rotate(360deg); } }
        .su-spin { display: inline-block; animation: su-spin 1s linear infinite; }
      `}</style>

      <div className="su-card">
        {/* Header */}
        <div className="su-header">
          <p className="su-eyebrow">SoSafe Corps — Admin</p>
          <h2 className="su-title">Import personnel biodata</h2>
        </div>

        <div className="su-body">
          {/* Drop zone */}
          <div
            className={`su-drop${dragOver ? " drag" : ""}`}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleChange}
              disabled={isActive}
            />
            <div className="su-drop-icon">📊</div>
            <p className="su-drop-main">Drop spreadsheet here</p>
            <p className="su-drop-sub">xlsx · xls · csv — click to browse</p>
            {file && (
              <div className="su-file-name">
                <span>✓</span>
                <span>{file.name}</span>
              </div>
            )}
          </div>

          {/* Progress bar */}
          {status !== "idle" && (
            <div>
              <div className="su-bar-wrap">
                <div
                  className={`su-bar-fill${indeterminate ? " indeterminate" : ""}${status === "completed" ? " done" : ""}${status === "failed" ? " error" : ""}`}
                  style={{ width: indeterminate ? undefined : `${barWidth}%` }}
                />
              </div>
              <div className="su-status-row" style={{ marginTop: 6 }}>
                <span className="su-pct">
                  {status === "uploading"
                    ? `${uploadPct}% uploaded`
                    : progress
                      ? `${fmt(progress.processed)} / ${fmt(progress.total)} rows`
                      : ""}
                </span>
                <span
                  className="su-badge"
                  style={{ background: `${statusColor}18`, color: statusColor }}
                >
                  {statusLabel}
                </span>
              </div>
            </div>
          )}

          {/* Stats — only once we have real data */}
          {progress && (
            <div className="su-stats">
              <div className="su-stat">
                <p className="su-stat-label">Rows parsed</p>
                <p className="su-stat-val">{fmt(progress.total)}</p>
              </div>
              <div className="su-stat">
                <p className="su-stat-label">Rows inserted</p>
                <p className="su-stat-val">{fmt(progress.processed)}</p>
              </div>
              <div className="su-stat">
                <p className="su-stat-label">Chunks</p>
                <p className="su-stat-val">{progress.done}/{progress.chunks}</p>
              </div>
            </div>
          )}

          {/* Log */}
          {log.length > 0 && (
            <div className="su-log" role="log" aria-live="polite">
              {log.map((e, i) => (
                <div key={i} className={`su-log-row${e.isError ? " su-log-err" : ""}`}>
                  <span className="su-log-t">{e.time}</span>
                  <span>{e.text}</span>
                </div>
              ))}
              <div ref={logEndRef} />
            </div>
          )}

          {/* Import ID */}
          {importId && (
            <div className="su-id">
              <span>import</span>
              <span>{importId}</span>
            </div>
          )}

          {/* Upload button */}
          <button
            className="su-btn su-btn-primary"
            onClick={handleUpload}
            disabled={!file || isActive}
            type="button"
          >
            {status === "uploading" ? (
              <><span className="su-spin">⟳</span> Uploading…</>
            ) : isActive ? (
              <><span className="su-spin">⟳</span> Processing…</>
            ) : (
              <>↑ Upload &amp; import</>
            )}
          </button>

          {/* Reset — only after terminal state */}
          {["completed", "failed"].includes(status) && (
            <button className="su-btn su-btn-ghost" onClick={reset} type="button">
              ↺ Start a new import
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUploader;