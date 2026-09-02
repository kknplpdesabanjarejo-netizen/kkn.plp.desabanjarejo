import { useState, useEffect } from "react";
import { Menu, X, ArrowUpRight, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";

const LINKS = [
  ["Home", "home"],
  ["About", "about"],
  ["Team", "team"],
  ["Programs", "programs"],
  ["Gallery", "gallery"],
  ["News", "news"],
  ["Archives", "archives"],
  ["Journey", "timeline"],
  ["Location", "location"],
  ["Contact", "contact"],
];

export default function Navbar({ settings }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("home");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      const secs = LINKS.map(([, id]) => id);
      for (const id of secs) {
        const el = document.getElementById(id);
        if (el) {
          const r = el.getBoundingClientRect();
          if (r.top <= 120 && r.bottom >= 120) {
            setActive(id);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      data-testid="main-navbar"
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "glass shadow-sm border-b border-emerald-900/10 py-2" : "py-4 bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        <button onClick={() => go("home")} className="flex items-center gap-2.5 group" data-testid="nav-logo">
          <span className="grid place-items-center h-10 w-10 rounded-xl bg-emerald-900 text-amber-400 shadow-lg shadow-emerald-900/20">
            <GraduationCap className="h-5 w-5" />
          </span>
          <span className="text-left leading-tight">
            <span className="block font-display font-extrabold text-slate-900 text-sm tracking-tight">KKN-PLP 66</span>
            <span className="block text-[10px] uppercase tracking-widest text-emerald-700 font-semibold">UIN Gusdur</span>
          </span>
        </button>

        <div className="hidden lg:flex items-center gap-1">
          {LINKS.map(([label, id]) => (
            <button
              key={id}
              onClick={() => go(id)}
              data-testid={`nav-link-${id}`}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                active === id ? "text-emerald-800 bg-emerald-50" : "text-slate-600 hover:text-emerald-800 hover:bg-emerald-50/60"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="hidden lg:block">
          <Button
            onClick={() => go("archives")}
            data-testid="nav-cta"
            className="bg-amber-500 hover:bg-amber-600 text-white rounded-full gap-1.5 font-semibold shadow-md shadow-amber-500/20"
          >
            View Documentation <ArrowUpRight className="h-4 w-4" />
          </Button>
        </div>

        <button
          className="lg:hidden p-2 text-slate-800"
          onClick={() => setOpen((v) => !v)}
          data-testid="nav-mobile-toggle"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {open && (
        <div className="lg:hidden glass border-t border-emerald-900/10 mt-2 px-4 py-4 space-y-1" data-testid="nav-mobile-menu">
          {LINKS.map(([label, id]) => (
            <button
              key={id}
              onClick={() => go(id)}
              data-testid={`nav-mobile-link-${id}`}
              className="block w-full text-left px-4 py-3 rounded-lg text-slate-700 font-medium hover:bg-emerald-50"
            >
              {label}
            </button>
          ))}
          <Button onClick={() => go("archives")} className="w-full mt-2 bg-amber-500 hover:bg-amber-600 text-white rounded-full font-semibold">
            View Documentation
          </Button>
        </div>
      )}
    </header>
  );
}
