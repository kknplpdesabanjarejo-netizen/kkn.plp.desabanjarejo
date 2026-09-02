import { useState } from "react";
import { NavLink, Outlet, useNavigate, Link } from "react-router-dom";
import * as Icons from "lucide-react";
import { LayoutDashboard, Settings, ScrollText, LogOut, GraduationCap, Menu, X, ExternalLink } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { RESOURCES } from "@/pages/admin/resourceConfig";

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const doLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  const NavItem = ({ to, icon, label, end }) => {
    const Ico = Icons[icon] || LayoutDashboard;
    return (
      <NavLink
        to={to}
        end={end}
        onClick={() => setOpen(false)}
        data-testid={`sidebar-${label.toLowerCase().replace(/\s+/g, "-")}`}
        className={({ isActive }) =>
          `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            isActive ? "bg-emerald-800 text-white" : "text-emerald-100/70 hover:bg-white/10 hover:text-white"
          }`
        }
      >
        <Ico className="h-4.5 w-4.5" /> {label}
      </NavLink>
    );
  };

  const sidebar = (
    <div className="flex flex-col h-full">
      <Link to="/admin" className="flex items-center gap-2.5 px-2 py-1 mb-6" onClick={() => setOpen(false)}>
        <span className="grid place-items-center h-10 w-10 rounded-xl bg-emerald-800 text-amber-400"><GraduationCap className="h-5 w-5" /></span>
        <span className="leading-tight">
          <span className="block font-display font-extrabold text-white text-sm">KKN-PLP 66</span>
          <span className="block text-[10px] uppercase tracking-widest text-amber-400/80">Admin</span>
        </span>
      </Link>
      <nav className="flex-1 space-y-1 overflow-y-auto pr-1">
        <NavItem to="/admin" icon="LayoutDashboard" label="Dashboard" end />
        {RESOURCES.map((r) => (
          <NavItem key={r.path} to={`/admin/${r.path}`} icon={r.icon} label={r.label} />
        ))}
        <NavItem to="/admin/settings" icon="Settings" label="Settings" />
        <NavItem to="/admin/activity-logs" icon="ScrollText" label="Activity Logs" />
      </nav>
      <div className="pt-4 mt-4 border-t border-white/10 space-y-1">
        <a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-emerald-100/70 hover:bg-white/10 hover:text-white">
          <ExternalLink className="h-4 w-4" /> View Site
        </a>
        <button onClick={doLogout} data-testid="sidebar-logout" className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-red-200 hover:bg-red-500/20">
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="hidden lg:flex flex-col w-64 bg-emerald-950 p-4 fixed inset-y-0">{sidebar}</aside>

      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-slate-950/50" onClick={() => setOpen(false)} />
          <aside className="relative w-64 bg-emerald-950 p-4">{sidebar}</aside>
        </div>
      )}

      <div className="flex-1 lg:ml-64 min-w-0">
        <header className="sticky top-0 z-40 glass border-b border-slate-200 px-4 sm:px-6 h-16 flex items-center justify-between">
          <button className="lg:hidden p-2" onClick={() => setOpen(true)} data-testid="admin-mobile-menu"><Menu className="h-6 w-6 text-slate-700" /></button>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-semibold text-slate-800 leading-tight">{user?.name}</p>
              <p className="text-xs text-slate-500">{user?.email}</p>
            </div>
            <span className="grid place-items-center h-9 w-9 rounded-full bg-emerald-900 text-amber-400 font-bold text-sm">{(user?.name || "A")[0]}</span>
          </div>
        </header>
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
