import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as Icons from "lucide-react";
import { api } from "@/lib/api";
import { RESOURCES } from "@/pages/admin/resourceConfig";
import { Loader2, Activity } from "lucide-react";

const STAT_CARDS = [
  ["teamMembers", "Team Members", "Users", "team"],
  ["programAreas", "Program Areas", "LayoutGrid", "programs"],
  ["documentationItems", "Documentation Items", "Images", "gallery"],
  ["journeyStages", "Journey Stages", "GitCommitVertical", "timeline"],
  ["news", "News Articles", "Newspaper", "news"],
  ["archives", "Archives", "Archive", "archives"],
  ["videos", "Videos", "Video", "videos"],
  ["memories", "Memories", "Heart", "memories"],
];

const ACTION_COLORS = {
  LOGIN: "bg-emerald-100 text-emerald-700",
  LOGOUT: "bg-slate-100 text-slate-600",
  CREATE: "bg-blue-100 text-blue-700",
  UPDATE: "bg-amber-100 text-amber-700",
  DELETE: "bg-red-100 text-red-700",
  UPLOAD: "bg-purple-100 text-purple-700",
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get("/stats"), api.get("/activity-logs")])
      .then(([s, l]) => {
        setStats(s.data.data);
        setLogs(l.data.data.slice(0, 8));
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="grid place-items-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-800" />
      </div>
    );

  return (
    <div data-testid="admin-dashboard">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 mt-1">Overview of your website content and recent activity.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {STAT_CARDS.map(([key, label, icon, path]) => {
          const Ico = Icons[icon] || Icons.Circle;
          return (
            <Link key={key} to={`/admin/${path}`} data-testid={`dashboard-stat-${path}`} className="rounded-2xl border border-slate-100 bg-white p-5 hover:shadow-lg hover:border-emerald-200 transition-all">
              <span className="grid place-items-center h-10 w-10 rounded-xl bg-emerald-50 text-emerald-800 mb-3"><Ico className="h-5 w-5" /></span>
              <p className="text-3xl font-display font-extrabold text-slate-900">{stats?.[key] ?? 0}</p>
              <p className="text-xs text-slate-500 mt-1">{label}</p>
            </Link>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl border border-slate-100 bg-white p-6">
          <h3 className="font-display font-bold text-slate-900 mb-4">Quick Manage</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {RESOURCES.map((r) => {
              const Ico = Icons[r.icon] || Icons.Circle;
              return (
                <Link key={r.path} to={`/admin/${r.path}`} className="flex items-center gap-3 rounded-xl border border-slate-100 px-4 py-3 hover:bg-emerald-50 hover:border-emerald-200 transition-colors">
                  <Ico className="h-5 w-5 text-emerald-800" />
                  <span className="text-sm font-medium text-slate-700">{r.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-6">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="h-5 w-5 text-emerald-800" />
            <h3 className="font-display font-bold text-slate-900">Recent Activity</h3>
          </div>
          {logs.length === 0 ? (
            <p className="text-sm text-slate-400">No activity yet.</p>
          ) : (
            <ul className="space-y-3">
              {logs.map((log) => (
                <li key={log.id} className="flex items-start gap-3 text-sm">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${ACTION_COLORS[log.action] || "bg-slate-100 text-slate-600"}`}>{log.action}</span>
                  <span className="text-slate-600 min-w-0">
                    <span className="font-medium">{log.resource}</span>
                    <span className="block text-xs text-slate-400 truncate">{new Date(log.created_at).toLocaleString()}</span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
