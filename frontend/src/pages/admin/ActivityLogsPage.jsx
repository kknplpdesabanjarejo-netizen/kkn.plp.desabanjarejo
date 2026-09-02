import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Loader2, ScrollText } from "lucide-react";

const ACTION_COLORS = {
  LOGIN: "bg-emerald-100 text-emerald-700",
  LOGOUT: "bg-slate-100 text-slate-600",
  CREATE: "bg-blue-100 text-blue-700",
  UPDATE: "bg-amber-100 text-amber-700",
  DELETE: "bg-red-100 text-red-700",
  UPLOAD: "bg-purple-100 text-purple-700",
};

export default function ActivityLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/activity-logs").then((r) => setLogs(r.data.data)).finally(() => setLoading(false));
  }, []);

  return (
    <div data-testid="activity-logs-page">
      <h1 className="text-2xl font-display font-bold text-slate-900 mb-1">Activity Logs</h1>
      <p className="text-slate-500 text-sm mb-6">A record of administrative actions on the platform.</p>
      {loading ? (
        <div className="grid place-items-center py-24"><Loader2 className="h-8 w-8 animate-spin text-emerald-800" /></div>
      ) : logs.length === 0 ? (
        <div className="flex flex-col items-center py-16 rounded-2xl border border-dashed border-slate-200 bg-white">
          <ScrollText className="h-10 w-10 text-slate-300" />
          <p className="mt-3 text-slate-500">No activity recorded yet.</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-100 bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-500 text-left">
                <tr>
                  <th className="px-4 py-3 font-medium">Action</th>
                  <th className="px-4 py-3 font-medium">Resource</th>
                  <th className="px-4 py-3 font-medium">User</th>
                  <th className="px-4 py-3 font-medium">IP</th>
                  <th className="px-4 py-3 font-medium">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/60">
                    <td className="px-4 py-3"><span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${ACTION_COLORS[log.action] || "bg-slate-100 text-slate-600"}`}>{log.action}</span></td>
                    <td className="px-4 py-3 text-slate-700">{log.resource}</td>
                    <td className="px-4 py-3 text-slate-500">{log.userName || "—"}</td>
                    <td className="px-4 py-3 text-slate-400 font-mono text-xs">{log.ip || "—"}</td>
                    <td className="px-4 py-3 text-slate-400 text-xs">{new Date(log.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
