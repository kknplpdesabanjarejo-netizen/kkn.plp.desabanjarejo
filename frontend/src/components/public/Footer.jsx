import { GraduationCap, ArrowUp, LockKeyhole } from "lucide-react";

// Bangun tautan WhatsApp dari pengaturan (fallback ke placeholder bila kosong).
function waHref(settings) {
  const digits = (settings?.whatsapp || "").replace(/\D/g, "");
  const num = digits || "62XXXXXXXXXX";
  return `https://wa.me/${num}?text=Halo%2C%20saya%20ingin%20bertanya%20tentang%20KKN`;
}

const SOCIALS = [
  { key: "instagram", label: "Instagram", icon: "fa-instagram", hover: "hover:bg-[#E4405F] hover:border-[#E4405F]" },
  { key: "tiktok", label: "TikTok", icon: "fa-tiktok", hover: "hover:bg-[#010101] hover:border-[#69C9D0] hover:text-[#69C9D0]" },
  { key: "youtube", label: "YouTube", icon: "fa-youtube", hover: "hover:bg-[#FF0000] hover:border-[#FF0000]" },
];

export default function Footer({ settings }) {
  const s = settings || {};
  const wa = waHref(s);

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
              <span className="font-display font-extrabold text-white text-lg">{s.siteName || "KKN-PLP Terpadu Kelompok 66"}</span>
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
            <h4 className="text-white font-semibold mb-4 font-display">Kontak</h4>
            {s.email && (
              <a href={`mailto:${s.email}`} className="text-sm text-slate-400 hover:text-amber-400 transition-colors break-all">
                {s.email}
              </a>
            )}
            {s.university && <p className="text-sm text-slate-500 mt-3">{s.university}</p>}
          </div>
        </div>

        {/* Section Media Sosial */}
        <div className="py-12 my-4 flex flex-col items-center text-center border-b border-white/10" data-testid="footer-social-section">
          <h4 className="text-white font-display font-bold text-lg">Ikuti & Terhubung dengan Kami</h4>
          <p className="text-sm text-slate-400 mt-1.5 max-w-md">Dapatkan kabar terbaru kegiatan KKN-PLP Terpadu Kelompok 66 melalui kanal media sosial resmi kami.</p>

          {/* Tombol CTA WhatsApp */}
          <a
            href={wa}
            target="_blank"
            rel="noreferrer"
            data-testid="footer-whatsapp-cta"
            className="mt-6 inline-flex items-center gap-2.5 rounded-full bg-[#25D366] hover:bg-[#1EBE57] text-white font-semibold px-6 py-3 shadow-lg shadow-[#25D366]/25 hover:scale-105 transition duration-300"
          >
            <i className="fa-brands fa-whatsapp text-xl" aria-hidden="true"></i>
            Chat via WhatsApp
          </a>

          {/* Ikon Media Sosial */}
          <div className="mt-7 flex items-center justify-center gap-4 sm:gap-5 flex-wrap">
            {SOCIALS.map((soc) => (
              <a
                key={soc.key}
                href={s[soc.key] || "#"}
                target="_blank"
                rel="noreferrer"
                aria-label={soc.label}
                data-testid={`footer-social-${soc.key}`}
                className={`grid place-items-center h-12 w-12 rounded-full bg-white/5 border border-white/10 text-slate-200 hover:text-white hover:scale-110 transition duration-300 ${soc.hover}`}
              >
                <i className={`fa-brands ${soc.icon} text-xl`} aria-hidden="true"></i>
              </a>
            ))}
            <a
              href={wa}
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
              data-testid="footer-social-whatsapp"
              className="grid place-items-center h-12 w-12 rounded-full bg-white/5 border border-white/10 text-slate-200 hover:text-white hover:bg-[#25D366] hover:border-[#25D366] hover:scale-110 transition duration-300"
            >
              <i className="fa-brands fa-whatsapp text-xl" aria-hidden="true"></i>
            </a>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8">
          <p className="text-xs text-slate-500">
            © {s.year || "2026"} {s.siteName || "KKN-PLP Terpadu Kelompok 66"}. Seluruh hak cipta dilindungi.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="/admin/login"
              data-testid="footer-admin-cta"
              className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 hover:bg-emerald-800 hover:border-emerald-700 px-4 py-2 text-xs font-semibold text-slate-200 transition-colors"
            >
              <LockKeyhole className="h-3.5 w-3.5" /> Masuk Admin
            </a>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-400"
              data-testid="footer-back-to-top"
            >
              Kembali ke atas <ArrowUp className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
