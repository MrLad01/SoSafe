import React, { useState, useRef, useCallback, useEffect, ChangeEvent } from "react";
import axios from "axios";

// ─── Types ────────────────────────────────────────────────────────────────────

type ImportStatus =
  | "idle"
  | "uploading"
  | "queued"
  | "processing"
  | "dispatched"
  | "completed"
  | "failed";

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

const API_BASE    = "https://sosafe.onrender.com/api";
const POLL_MS     = 30000; // poll every 3 seconds
const TERMINAL    = new Set<ImportStatus>(["completed", "failed"]);

const STATUS_META: Record<ImportStatus, { label: string; accent: string; bg: string }> = {
  idle:        { label: "Ready",      accent: "#6b7280", bg: "#f3f4f6" },
  uploading:   { label: "Uploading",  accent: "#3b82f6", bg: "#eff6ff" },
  queued:      { label: "Queued",     accent: "#8b5cf6", bg: "#f5f3ff" },
  processing:  { label: "Processing", accent: "#0ea5e9", bg: "#f0f9ff" },
  dispatched:  { label: "Inserting",  accent: "#f59e0b", bg: "#fffbeb" },
  completed:   { label: "Complete",   accent: "#22c55e", bg: "#f0fdf4" },
  failed:      { label: "Failed",     accent: "#ef4444", bg: "#fef2f2" },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

const fmt = (n?: number | null) => (typeof n === "number" ? n.toLocaleString() : "0");const ts   = () => new Date().toLocaleTimeString("en-GB", { hour12: false });
const bpct = (done: number, total: number) =>
  total > 0 ? Math.min(100, Math.round((done / total) * 100)) : 0;

// ─── Component ───────────────────────────────────────────────────────────────

const FileUploader: React.FC = () => {
  const [file,      setFile]      = useState<File | null>(null);
  const [uploadPct, setUploadPct] = useState(0);
  const [status,    setStatus]    = useState<ImportStatus>("idle");
  const [progress,  setProgress]  = useState<ProgressData | null>(null);
  const [importId,  setImportId]  = useState<string | null>(null);
  const [log,       setLog]       = useState<LogEntry[]>([]);
  const [dragOver,  setDragOver]  = useState(false);
  const [lastPoll,  setLastPoll]  = useState<string>("");
  const [countdown, setCountdown] = useState(POLL_MS / 1000);

  const pollRef    = useRef<ReturnType<typeof setInterval> | null>(null);
  const countRef   = useRef<ReturnType<typeof setInterval> | null>(null);
  const logEndRef  = useRef<HTMLDivElement>(null);
  const token      = sessionStorage.getItem("authToken");

  // Auto-scroll log
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [log]);

  // Cleanup on unmount
  useEffect(() => () => {
    clearPoll();
  }, []);

  const addLog = useCallback((text: string, isError = false) => {
    setLog(prev => [...prev, { time: ts(), text, isError }]);
  }, []);

  const clearPoll = () => {
    if (pollRef.current)  clearInterval(pollRef.current);
    if (countRef.current) clearInterval(countRef.current);
    pollRef.current  = null;
    countRef.current = null;
  };

  // ── File selection ──────────────────────────────────────────────────────────

  const applyFile = (f: File) => {
    const valid = /\.(xlsx|xls|csv)$/i.test(f.name);
    if (!valid) {
      addLog("Only .xlsx, .xls, or .csv files are accepted.", true);
      return;
    }
    setFile(f);
    setStatus("idle");
    setProgress(null);
    setLog([]);
    setUploadPct(0);
    setImportId(null);
    setLastPoll("");
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) applyFile(e.target.files[0]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files?.[0]) applyFile(e.dataTransfer.files[0]);
  };

  // ── Polling ─────────────────────────────────────────────────────────────────

  const startPolling = useCallback((id: string) => {
    clearPoll();
    setCountdown(POLL_MS / 1000);

    const poll = async () => {
      try {
        const { data } = await axios.get<ProgressData>(
          `${API_BASE}/import/progress/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setProgress(data);
        setStatus(data.status);
        setLastPoll(ts());

        if (data.status === "completed") {
          addLog(`Import complete — ${fmt(data.processed)} rows inserted across ${fmt(data.chunks)} chunks.`);
          clearPoll();
        } else if (data.status === "failed") {
          data.errors.forEach(e => addLog(e, true));
          clearPoll();
        }
      } catch (err) {
        const msg = axios.isAxiosError(err)
          ? err.response?.data?.error ?? err.message
          : "Polling error";
        addLog(`Poll failed: ${msg}`, true);
        // Don't stop — keep polling; transient network blips happen
      }
    };

    // Fire immediately, then every POLL_MS
    poll();
    pollRef.current = setInterval(poll, POLL_MS);

    // Countdown ticker
    countRef.current = setInterval(() => {
      setCountdown(prev => (prev <= 1 ? POLL_MS / 1000 : prev - 1));
    }, 1000);
  }, [token, addLog]);

  // ── Upload ──────────────────────────────────────────────────────────────────

  const handleUpload = async () => {
    if (!file) return;

    clearPoll();
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

      addLog(`File accepted — import ID: ${data.import_id}`);
      setImportId(data.import_id);
      setStatus("queued");
      startPolling(data.import_id);

    } catch (err) {
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.message ?? err.message
        : "Upload failed. Please try again.";
      addLog(msg, true);
      setStatus("failed");
    }
  };

  // ── Manual refresh ──────────────────────────────────────────────────────────

  const manualRefresh = () => {
    if (!importId || TERMINAL.has(status)) return;
    clearPoll();
    startPolling(importId);
    addLog("Refreshed manually.");
  };

  // ── Reset ───────────────────────────────────────────────────────────────────

  const reset = () => {
    clearPoll();
    setFile(null);
    setStatus("idle");
    setProgress(null);
    setLog([]);
    setUploadPct(0);
    setImportId(null);
    setLastPoll("");
  };

  // ── Derived ─────────────────────────────────────────────────────────────────

  const isActive      = !TERMINAL.has(status) && status !== "idle";
  const meta = STATUS_META[status] || { 
    label: String(status || "Unknown"), 
    accent: "#6b7280", 
    bg: "#f3f4f6" 
  };
  const indeterminate = ["queued", "processing"].includes(status) && (!progress || progress.chunks === 0);

  const barWidth = status === "uploading"
    ? uploadPct
    : progress?.chunks
      ? bpct(progress.done, progress.chunks)
      : status === "queued" ? 8 : 0;

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div style={{
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      width: "100%",
      maxWidth: 520,
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&family=DM+Mono:wght@400;500&display=swap');

        .fu * { box-sizing: border-box; }

        .fu-card {
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          overflow: hidden;
        }

        .fu-head {
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid #f3f4f6;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .fu-head-left {}
        .fu-eyebrow {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          letter-spacing: .1em;
          text-transform: uppercase;
          color: #9ca3af;
          margin-bottom: 2px;
        }
        .fu-title {
          font-size: 1rem;
          font-weight: 600;
          color: #111827;
          margin: 0;
        }

        /* Status pill in header */
        .fu-pill {
          font-family: 'DM Mono', monospace;
          font-size: .68rem;
          font-weight: 500;
          letter-spacing: .05em;
          text-transform: uppercase;
          padding: 4px 12px;
          border-radius: 99px;
          transition: background .3s, color .3s;
        }

        .fu-body { padding: 1.25rem 1.5rem; display: flex; flex-direction: column; gap: 1rem; }

        /* Drop zone */
        .fu-drop {
          border: 1.5px dashed #d1d5db;
          border-radius: 12px;
          padding: 1.75rem 1.5rem;
          text-align: center;
          cursor: pointer;
          position: relative;
          transition: border-color .2s, background .2s;
          background: #fafaf9;
        }
        .fu-drop.drag, .fu-drop:hover { border-color: #6366f1; background: #fafaff; }
        .fu-drop input { position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; height: 100%; }
        .fu-drop input:disabled { cursor: not-allowed; }
        .fu-drop-icon { font-size: 1.5rem; margin-bottom: .4rem; }
        .fu-drop-main { font-size: .875rem; font-weight: 500; color: #374151; }
        .fu-drop-sub  { font-size: .75rem; color: #9ca3af; margin-top: 2px; }
        .fu-chosen {
          display: flex; align-items: center; justify-content: center; gap: 6px;
          font-family: 'DM Mono', monospace; font-size: .75rem; color: #6366f1; margin-top: .5rem;
        }

        /* Bar */
        .fu-bar-wrap { height: 4px; background: #f3f4f6; border-radius: 99px; overflow: hidden; }
        .fu-bar-fill { height: 100%; border-radius: 99px; transition: width .5s ease; }
        .fu-bar-fill.ind { width: 35% !important; animation: fu-slide 1.4s ease-in-out infinite; }
        @keyframes fu-slide {
          0%   { transform: translateX(-105%); }
          100% { transform: translateX(370%); }
        }

        /* Poll row */
        .fu-poll-row {
          display: flex; align-items: center; justify-content: space-between;
          font-family: 'DM Mono', monospace; font-size: .7rem; color: #9ca3af;
        }
        .fu-poll-btn {
          background: none; border: none; cursor: pointer; padding: 0;
          color: #6366f1; font-size: .7rem; font-family: 'DM Mono', monospace;
          display: flex; align-items: center; gap: 4px;
          transition: opacity .2s;
        }
        .fu-poll-btn:hover { opacity: .7; }
        .fu-poll-btn:disabled { opacity: .3; cursor: not-allowed; }
        @keyframes fu-spin { to { transform: rotate(360deg); } }
        .fu-spin { display: inline-block; animation: fu-spin 1s linear infinite; }

        /* Stats */
        .fu-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
        .fu-stat {
          background: #f9fafb; border: 1px solid #f3f4f6; border-radius: 10px;
          padding: .6rem .8rem;
        }
        .fu-stat-l { font-size: .67rem; font-family: 'DM Mono', monospace; color: #9ca3af; text-transform: uppercase; letter-spacing: .06em; margin-bottom: 2px; }
        .fu-stat-v { font-size: 1.05rem; font-weight: 600; font-family: 'DM Mono', monospace; color: #111827; line-height: 1.1; }

        /* Log */
        .fu-log {
          background: #f9fafb; border: 1px solid #f3f4f6; border-radius: 10px;
          padding: .6rem .85rem; max-height: 120px; overflow-y: auto;
          font-family: 'DM Mono', monospace; font-size: .7rem; color: #6b7280; line-height: 1.8;
        }
        .fu-log-row { display: flex; gap: 10px; }
        .fu-log-t   { color: #6366f1; flex-shrink: 0; }
        .fu-log-err { color: #ef4444; }

        /* Import ID */
        .fu-id {
          font-family: 'DM Mono', monospace; font-size: .68rem; color: #9ca3af;
          display: flex; gap: 6px; flex-wrap: wrap;
        }
        .fu-id span { color: #374151; }

        /* Buttons */
        .fu-btn {
          width: 100%; padding: .7rem; border: none; border-radius: 10px;
          font-family: 'DM Sans', sans-serif; font-size: .875rem; font-weight: 600;
          cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: background .15s, opacity .15s, transform .1s;
        }
        .fu-primary { background: #6366f1; color: #fff; }
        .fu-primary:hover:not(:disabled) { background: #4f46e5; }
        .fu-primary:active:not(:disabled) { transform: scale(.98); }
        .fu-primary:disabled { background: #e5e7eb; color: #9ca3af; cursor: not-allowed; }
        .fu-ghost {
          background: transparent; border: 1px solid #e5e7eb; color: #6b7280;
        }
        .fu-ghost:hover { border-color: #6366f1; color: #6366f1; }

        /* Error banner */
        .fu-error {
          background: #fef2f2; border: 1px solid #fecaca; border-radius: 10px;
          padding: .65rem .9rem; font-size: .8rem; color: #b91c1c;
          display: flex; gap: 8px; align-items: flex-start;
        }
      `}</style>

      <div className="fu">
        <div className="fu-card">

          {/* Header */}
          <div className="fu-head">
            <div className="fu-head-left">
              <p className="fu-eyebrow">SoSafe Corps — Admin</p>
              <h2 className="fu-title">Import personnel biodata</h2>
            </div>
            {status !== "idle" && (
              <span
                className="fu-pill"
                style={{ background: meta.bg, color: meta.accent }}
              >
                {meta.label}
              </span>
            )}
          </div>

          <div className="fu-body">

            {/* Drop zone */}
            <div
              className={`fu-drop${dragOver ? " drag" : ""}`}
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
              <div className="fu-drop-icon">📊</div>
              <p className="fu-drop-main">Drop spreadsheet here</p>
              <p className="fu-drop-sub">xlsx · xls · csv accepted — or click to browse</p>
              {file && (
                <div className="fu-chosen">
                  <span>✓</span>
                  <span>{file.name}</span>
                  <span style={{ color: "#9ca3af" }}>({(file.size / 1024).toFixed(1)} KB)</span>
                </div>
              )}
            </div>

            {/* Progress bar + poll controls */}
            {status !== "idle" && (
              <div>
                <div className="fu-bar-wrap" style={{ marginBottom: 8 }}>
                  <div
                    className={`fu-bar-fill${indeterminate ? " ind" : ""}`}
                    style={{
                      width:      indeterminate ? undefined : `${barWidth}%`,
                      background: status === "completed" ? "#22c55e"
                                : status === "failed"    ? "#ef4444"
                                : meta.accent,
                    }}
                  />
                </div>

                <div className="fu-poll-row">
                  <span>
                    {status === "uploading"
                      ? `${uploadPct}% transferred`
                      : progress
                        ? `${fmt(progress.processed)} / ${fmt(progress.total)} rows`
                        : "Waiting for worker…"}
                  </span>

                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    {lastPoll && !TERMINAL.has(status) && (
                      <span style={{ color: "#d1d5db" }}>
                        next in {countdown}s
                      </span>
                    )}
                    {lastPoll && (
                      <span style={{ color: "#d1d5db" }}>
                        last {lastPoll}
                      </span>
                    )}
                    {!TERMINAL.has(status) && status !== "uploading" && (
                      <button
                        className="fu-poll-btn"
                        onClick={manualRefresh}
                        disabled={!importId}
                        title="Refresh now"
                      >
                        <span className={isActive ? "fu-spin" : ""}>↻</span>
                        refresh
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Stats */}
            {progress && (
              <div className="fu-stats">
                <div className="fu-stat">
                  <p className="fu-stat-l">Rows parsed</p>
                  <p className="fu-stat-v">{fmt(progress.total)}</p>
                </div>
                <div className="fu-stat">
                  <p className="fu-stat-l">Inserted</p>
                  <p className="fu-stat-v">{fmt(progress.processed)}</p>
                </div>
                <div className="fu-stat">
                  <p className="fu-stat-l">Chunks</p>
                  <p className="fu-stat-v">{progress.done}/{progress.chunks || "?"}</p>
                </div>
              </div>
            )}

            {/* Error list */}
            {progress?.errors?.length ? (
              <div className="fu-error">
                <span>⚠</span>
                <div>
                  {progress.errors.map((e, i) => (
                    <div key={i}>{e}</div>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Activity log */}
            {log.length > 0 && (
              <div className="fu-log" role="log" aria-live="polite">
                {log.map((e, i) => (
                  <div key={i} className={`fu-log-row${e.isError ? " fu-log-err" : ""}`}>
                    <span className="fu-log-t">{e.time}</span>
                    <span>{e.text}</span>
                  </div>
                ))}
                <div ref={logEndRef} />
              </div>
            )}

            {/* Import ID */}
            {importId && (
              <div className="fu-id">
                <span>import id</span>
                <span>{importId}</span>
              </div>
            )}

            {/* Primary CTA */}
            <button
              className="fu-btn fu-primary"
              onClick={handleUpload}
              disabled={!file || isActive}
              type="button"
            >
              {status === "uploading" ? (
                <><span className="fu-spin">⟳</span> Uploading…</>
              ) : isActive ? (
                <><span className="fu-spin">⟳</span> Processing…</>
              ) : (
                <>↑ Upload &amp; import</>
              )}
            </button>

            {/* Reset after terminal */}
            {TERMINAL.has(status) && (
              <button className="fu-btn fu-ghost" onClick={reset} type="button">
                ↺ Start a new import
              </button>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUploader;