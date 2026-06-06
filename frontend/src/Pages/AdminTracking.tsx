import React, { useState, useEffect } from "react";
import axios from "axios";
import SideBar from "../components/SideBar";
import { Search, Download, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface ActivityLog {
  id: number | string;
  user: string;
  action: string;
  ip_address: string;
  ip_info: string;
  os_browser: string;
  status: string;
  created_at: string;
  updated_at: string;
  source: "server" | "posthog";
}

// Raw shape returned by PostHog's /events/ endpoint
interface PostHogEvent {
  id: string;
  event: string;
  distinct_id: string;
  timestamp: string;
  properties: Record<string, string | undefined>;
  person?: {
    properties?: {
      name?: string;
      email?: string;
    };
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

const EVENT_LABELS: Record<string, string> = {
  $pageview:                "Page View",
  $pageleave:               "Page Leave",
  biodata_record_edited:    "Edit Record",
  biodata_record_deleted:   "Delete Record",
  biodata_record_created:   "Create Record",
  import_started:           "Import Started",
  import_completed:         "Import Complete",
  import_failed:            "Import Failed",
  activity_logs_viewed:     "View Activity Logs",
  activity_logs_exported:   "Export Logs",
  activity_logs_searched:   "Search Logs",
  activity_logs_filtered:   "Filter Logs",
};

function labelEvent(raw: string): string {
  return EVENT_LABELS[raw] ?? raw.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function mapPostHogEvent(e: PostHogEvent): ActivityLog {
  return {
    id:         `ph-${e.id}`,
    user:       e.person?.properties?.name
               ?? e.person?.properties?.email
               ?? e.distinct_id
               ?? "Unknown",
    action:     labelEvent(e.event),
    ip_address: e.properties?.$ip ?? "N/A",
    ip_info:    "",
    os_browser: JSON.stringify({
      os_platform: e.properties?.$os      ?? "Unknown",
      browser:     e.properties?.$browser ?? "Unknown",
    }),
    status:     "success",
    created_at: e.timestamp,
    updated_at: e.timestamp,
    source:     "posthog",
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

type Source = "all" | "server" | "posthog";

const AdminTracking: React.FC = () => {
  const { token } = useAuth();

  const [serverLogs,  setServerLogs]  = useState<ActivityLog[]>([]);
  const [posthogLogs, setPosthogLogs] = useState<ActivityLog[]>([]);
  const [activeSource, setActiveSource] = useState<Source>("all");

  const [searchTerm,    setSearchTerm]    = useState("");
  const [currentPage,   setCurrentPage]   = useState(1);
  const [filterDate,    setFilterDate]    = useState("");
  const [filterAction,  setFilterAction]  = useState("");
  const [filterStatus,  setFilterStatus]  = useState("");

  const logsPerPage = 10;

  // ── Fetch server audit logs ─────────────────────────────────────────────────
  useEffect(() => {
    const fetchServerLogs = async () => {
      try {
        const res = await axios.get<Omit<ActivityLog, "source">[]>(
          "https://sosafe.onrender.com/api/audit",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const sorted = res.data
          .map((l) => ({ ...l, source: "server" as const }))
          .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
        setServerLogs(sorted);
      } catch (err) {
        console.error("Error fetching server logs:", err);
      }
    };

    fetchServerLogs();
    const id = setInterval(fetchServerLogs, 100_000);
    return () => clearInterval(id);
  }, []);

  // ── Fetch PostHog events ────────────────────────────────────────────────────
  useEffect(() => {
    const projectId   = import.meta.env.VITE_POSTHOG_PROJECT_ID;
    const personalKey = import.meta.env.VITE_POSTHOG_PERSONAL_KEY;

    if (!projectId || !personalKey) {
      console.warn("PostHog project ID or personal key not set in .env");
      return;
    }

    const fetchPostHogEvents = async () => {
      try {
        const res = await axios.get<{ results: PostHogEvent[] }>(
          `https://us.i.posthog.com/api/projects/${projectId}/events/?limit=2000`,
          { headers: { Authorization: `Bearer ${personalKey}` } }
        );
        setPosthogLogs(res.data.results.map(mapPostHogEvent));
      } catch (err) {
        console.error("Error fetching PostHog events:", err);
      }
    };

    fetchPostHogEvents();
    const id = setInterval(fetchPostHogEvents, 300_000); // PostHog every 30s
    return () => clearInterval(id);
  }, []);

  // ── Combine & filter ────────────────────────────────────────────────────────
  const allLogs = [...serverLogs, ...posthogLogs].sort(
    (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  );

  const visibleBySource =
    activeSource === "all"     ? allLogs      :
    activeSource === "server"  ? serverLogs   :
                                 posthogLogs;

  const filteredLogs = visibleBySource.filter((log) => {
    const matchesSearch =
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.ip_address.includes(searchTerm);

    const matchesDate   = !filterDate   || log.updated_at.includes(filterDate);
    const matchesAction = !filterAction || log.action === filterAction;
    const matchesStatus = !filterStatus || log.status  === filterStatus;

    return matchesSearch && matchesDate && matchesAction && matchesStatus;
  });

  const totalPages  = Math.ceil(filteredLogs.length / logsPerPage);
  const currentLogs = filteredLogs.slice(
    (currentPage - 1) * logsPerPage,
    currentPage * logsPerPage
  );

  // ── Formatting ──────────────────────────────────────────────────────────────
  const formatDate = (dateString: string) =>
    new Intl.DateTimeFormat("en-US", {
      year:   "numeric",
      month:  "short",
      day:    "numeric",
      hour:   "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(new Date(dateString));

  // ── Export ──────────────────────────────────────────────────────────────────
  const handleExport = () => {
    const csvContent = [
      ["ID", "Source", "User", "Action", "Updated At", "IP Address", "OS Platform", "Browser", "Status"],
      ...filteredLogs.map((log) => {
        let osPlatform = "Unknown";
        let browser    = "Unknown";
        try {
          const parsed = JSON.parse(log.os_browser);
          osPlatform   = parsed.os_platform ?? "Unknown";
          browser      = parsed.browser     ?? "Unknown";
        } catch { /* ignore */ }

        return [
          log.id,
          log.source,
          log.user,
          log.action,
          `"${formatDate(log.updated_at)}"`,
          log.ip_address,
          osPlatform,
          browser,
          log.status,
        ];
      }),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url  = window.URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `activity-logs-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────────

  const sourceTabs: { key: Source; label: string; count: number }[] = [
    { key: "all",     label: "All",        count: allLogs.length      },
    { key: "server",  label: "Server",     count: serverLogs.length   },
    { key: "posthog", label: "PostHog",    count: posthogLogs.length  },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <SideBar />
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Header */}
        <header className="bg-[#006838] text-white p-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold">Activity Tracking</h1>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-white text-[#006838] rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Download size={20} />
              Export Logs
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-4">

            {/* Source Tabs */}
            <div className="flex gap-2">
              {sourceTabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => { setActiveSource(tab.key); setCurrentPage(1); }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeSource === tab.key
                      ? "bg-[#006838] text-white"
                      : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                  }`}
                >
                  {tab.label}
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    activeSource === tab.key
                      ? "bg-white/20 text-white"
                      : "bg-gray-100 text-gray-500"
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Search and Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="relative lg:col-span-2">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search by user, action, or IP..."
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <input
                  type="date"
                  value={filterDate}
                  title="date"
                  onChange={(e) => { setFilterDate(e.target.value); setCurrentPage(1); }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <select
                  value={filterAction}
                  title="filter"
                  onChange={(e) => { setFilterAction(e.target.value); setCurrentPage(1); }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">All Actions</option>
                  {/* Server actions */}
                  <option value="login">Login</option>
                  <option value="admin login">Admin Login</option>
                  <option value="logout">Logout</option>
                  <option value="Update Profile">Update Profile</option>
                  <option value="View Dashboard">View Dashboard</option>
                  <option value="Export Data">Export Data</option>
                  {/* PostHog actions */}
                  <option value="Page View">Page View</option>
                  <option value="Edit Record">Edit Record</option>
                  <option value="Delete Record">Delete Record</option>
                  <option value="Create Record">Create Record</option>
                  <option value="Import Started">Import Started</option>
                  <option value="Import Complete">Import Complete</option>
                  <option value="Import Failed">Import Failed</option>
                  <option value="Export Logs">Export Logs</option>
                </select>
              </div>

              <div>
                <select
                  value={filterStatus}
                  title="status"
                  onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">All Status</option>
                  <option value="success">Success</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated At</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP Address</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentLogs.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-400">
                          No activity logs found.
                        </td>
                      </tr>
                    ) : (
                      currentLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-gray-50">
                          {/* User */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                                <User size={16} className="text-gray-500" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{log.user}</div>
                                <div className="text-sm text-gray-500">
                                  {(() => {
                                    try {
                                      const parsed = JSON.parse(log.os_browser);
                                      return `${parsed.os_platform} — ${parsed.browser}`;
                                    } catch {
                                      return "Unknown OS/Browser";
                                    }
                                  })()}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Action */}
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {log.action}
                          </td>

                          {/* Date */}
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatDate(log.updated_at)}
                          </td>

                          {/* IP */}
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {log.ip_address}
                          </td>

                          {/* Source badge */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              log.source === "posthog"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-blue-100 text-blue-800"
                            }`}>
                              {log.source === "posthog" ? "PostHog" : "Server"}
                            </span>
                          </td>

                          {/* Status */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              log.status === "success"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}>
                              {log.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>

                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <p className="text-sm text-gray-700">
                      Showing{" "}
                      <span className="font-medium">{(currentPage - 1) * logsPerPage + 1}</span>
                      {" "}to{" "}
                      <span className="font-medium">
                        {Math.min(currentPage * logsPerPage, filteredLogs.length)}
                      </span>
                      {" "}of{" "}
                      <span className="font-medium">{filteredLogs.length}</span>
                      {" "}results
                    </p>

                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      <button
                        onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        Previous
                      </button>
                      {[...Array(totalPages)].map((_, i) => (
                        <button
                          key={i + 1}
                          onClick={() => setCurrentPage(i + 1)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            currentPage === i + 1
                              ? "z-10 bg-green-50 border-green-500 text-green-600"
                              : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                      <button
                        onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                </div>
              )}
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminTracking;