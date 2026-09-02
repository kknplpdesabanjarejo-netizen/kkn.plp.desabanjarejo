import { GraduationCap, Instagram, Youtube, Mail, ArrowUp } from "lucide-react";

export default function Footer({ settings }) {
  const s = settings || {};
  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-8 relative overflow-hidden" data-testid="site-footer">
      <div className="absolute inset-0 grid-canvas opacity-40" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        <div className="grid md:grid-cols-3 gap-10 pb-10 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <span className="grid place-items-center h-10 w-10 rounded-xl bg-emerald-800 text-amber-400">
                <GraduationCap className="h-5 w-5" />
              </span>
              <span className="font-display font-extrabold text-white text-lg">{s.siteName || "KKN-PLP Group 66"}</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">{s.description}</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 font-display">Jelajahi</h4>
            <ul className="space-y-2 text-sm">
              {[["Tentang Kami", "about"], ["Tim", "team"], ["Program", "programs"], ["Galeri", "gallery"], ["Berita", "news"]].map(([label, id]) => (
                <li key={id}>
                  <a href={`#${id}`} className="text-slate-400 hover:text-amber-400 transition-colors">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 font-display">Terhubung</h4>
            <div className="flex gap-3 mb-4">
              {s.instagram && (
                <a href={s.instagram} target="_blank" rel="noreferrer" className="h-10 w-10 grid place-items-center rounded-lg bg-white/5 hover:bg-emerald-800 transition-colors" aria-label="Instagram">
                  <Instagram className="h-5 w-5" />
                </a>
              )}
              {s.youtube && (
                <a href={s.youtube} target="_blank" rel="noreferrer" className="h-10 w-10 grid place-items-center rounded-lg bg-white/5 hover:bg-emerald-800 transition-colors" aria-label="YouTube">
                  <Youtube className="h-5 w-5" />
                </a>
              )}
              {s.email && (
                <a href={`mailto:${s.email}`} className="h-10 w-10 grid place-items-center rounded-lg bg-white/5 hover:bg-emerald-800 transition-colors" aria-label="Email">
                  <Mail className="h-5 w-5" />
                </a>
              )}
            </div>
            {s.email && <p className="text-sm text-slate-400">{s.email}</p>}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6">
          <p className="text-xs text-slate-500">
            © {s.year || "2026"} {s.siteName || "KKN-PLP Terpadu Kelompok 66"}. Seluruh hak cipta dilindungi.
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-400"
            data-testid="footer-back-to-top"
          >
            Kembali ke atas <ArrowUp className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
