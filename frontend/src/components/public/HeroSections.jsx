import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Users, Archive, Newspaper, Images, Video, MapPin, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

const HERO_IMG = "https://images.unsplash.com/photo-1543269865-cbf427effbad?crop=entropy&cs=srgb&fm=jpg&q=85&w=1600";
const ABOUT_IMG = "https://images.unsplash.com/photo-1531545514256-b1400bc00f31?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200";

function useCountUp(target, run) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!run) return;
    const num = parseInt(String(target).replace(/\D/g, ""), 10) || 0;
    let start = 0;
    const step = Math.max(1, Math.ceil(num / 40));
    const t = setInterval(() => {
      start += step;
      if (start >= num) {
        start = num;
        clearInterval(t);
      }
      setVal(start);
    }, 30);
    return () => clearInterval(t);
  }, [target, run]);
  return val;
}

function Stat({ value, suffix, label, run }) {
  const v = useCountUp(value, run);
  return (
    <div className="text-center" data-testid={`stat-${label.toLowerCase().replace(/\s+/g, "-")}`}>
      <div className="text-4xl sm:text-5xl font-display font-extrabold text-emerald-900 dark:text-emerald-400">
        {v}
        <span className="text-amber-500">{suffix}</span>
      </div>
      <div className="mt-1 text-xs sm:text-sm uppercase tracking-wider text-slate-500 dark:text-slate-400 font-medium">{label}</div>
    </div>
  );
}

export function Hero({ settings }) {
  const s = settings || {};
  return (
    <section id="home" className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden" data-testid="hero-section">
      <div className="absolute inset-0">
        <img src={s.heroImage || HERO_IMG} alt="Background KKN-PLP" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/90 via-emerald-950/70 to-slate-950/50" />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative w-full">
        <div className="max-w-2xl">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-amber-300 bg-white/10 border border-white/20 px-4 py-1.5 rounded-full backdrop-blur-sm"
          >
            {s.university || "UIN K.H. Abdurrahman Wahid Pekalongan"} · {s.year || "2026"}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold text-white leading-tight tracking-tight"
          >
            {s.siteName || "KKN-PLP Integrated Group 66"}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-2xl sm:text-3xl font-display font-bold text-amber-400"
          >
            {s.tagline || "Be Present. Learn. Serve."}
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-6 text-base sm:text-lg text-emerald-50/90 leading-relaxed max-w-xl"
          >
            Dokumentasi perjalanan mahasiswa dalam belajar bersama masyarakat, membangun kolaborasi, dan memberikan kontribusi nyata melalui program KKN-PLP Terpadu.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-9 flex flex-col sm:flex-row gap-3"
          >
            <Button
              onClick={() => document.getElementById("timeline")?.scrollIntoView({ behavior: "smooth" })}
              data-testid="hero-cta-primary"
              className="bg-amber-500 hover:bg-amber-600 text-white rounded-full h-12 px-7 text-base font-semibold gap-2 shadow-xl shadow-amber-900/20"
            >
              Jelajahi Perjalanan Kami <ArrowRight className="h-5 w-5" />
            </Button>
            <Button
              onClick={() => document.getElementById("team")?.scrollIntoView({ behavior: "smooth" })}
              data-testid="hero-cta-secondary"
              variant="outline"
              className="rounded-full h-12 px-7 text-base font-semibold bg-white/10 text-white border-white/30 hover:bg-white/20 hover:text-white backdrop-blur-sm"
            >
              Kenali Tim Kami
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export function About({ settings }) {
  return (
    <section id="about" className="py-24 bg-white dark:bg-slate-950" data-testid="about-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-14 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <img src={ABOUT_IMG} alt="Students collaborating with the community" className="rounded-3xl shadow-2xl shadow-emerald-950/10 w-full object-cover aspect-[4/3]" />
          <div className="absolute -bottom-6 -right-4 sm:right-6 glass rounded-2xl border border-emerald-900/10 shadow-xl p-5 max-w-[220px]">
            <p className="font-display font-bold text-emerald-900 text-lg">Masyarakat yang Utama</p>
            <p className="text-sm text-slate-600 mt-1">Belajar dengan mengabdi, tumbuh bersama masyarakat desa.</p>
          </div>
        </motion.div>
        <div>
          <span className="text-xs uppercase tracking-widest font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-block mb-4">
            Tentang Program
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
            Tentang KKN-PLP Terpadu
          </h2>
          <p className="mt-5 text-slate-600 dark:text-slate-300 leading-relaxed">
            KKN-PLP Terpadu merupakan wadah bagi mahasiswa untuk mengembangkan pengalaman akademik dan sosial melalui keterlibatan langsung bersama masyarakat. Melalui kegiatan pendidikan, keagamaan, sosial, digitalisasi, lingkungan, dan pemberdayaan masyarakat, mahasiswa berupaya menghadirkan kontribusi yang bermanfaat dan berkelanjutan.
          </p>
          <p className="mt-4 text-slate-600 dark:text-slate-300 leading-relaxed">
            Platform ini mendokumentasikan setiap langkah perjalanan kami — mulai dari kedatangan dan observasi hingga pelaksanaan, kolaborasi, dan penutupan yang penuh makna.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-4">
            {[["Hadir", "Hadir sepenuhnya"], ["Belajar", "Bersama masyarakat"], ["Mengabdi", "Dengan sepenuh hati"]].map(([t, d]) => (
              <div key={t} className="rounded-xl border border-emerald-100 bg-emerald-50/50 dark:border-emerald-900/40 dark:bg-emerald-900/20 p-4">
                <p className="font-display font-bold text-emerald-900 dark:text-emerald-300">{t}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function Statistics({ stats }) {
  const ref = useRef(null);
  const [run, setRun] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setRun(true);
      },
      { threshold: 0.4 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  const s = stats || {};
  const data = [
    [s.teamMembers ?? 15, "", "Anggota Tim"],
    [s.programAreas ?? 6, "", "Bidang Program"],
    [s.documentationItems ?? 14, "+", "Dokumentasi"],
    [s.journeyStages ?? 7, "", "Tahapan Perjalanan"],
  ];
  return (
    <section ref={ref} className="py-16 bg-slate-50 dark:bg-slate-900 border-y border-slate-100 dark:border-white/10" data-testid="statistics-section">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-2 lg:grid-cols-4 gap-10">
        {data.map(([v, suf, label]) => (
          <Stat key={label} value={v} suffix={suf} label={label} run={run} />
        ))}
      </div>
    </section>
  );
}

const QUICK = [
  ["Arsip Digital", Archive, "archives"],
  ["Berita Kegiatan", Newspaper, "news"],
  ["Galeri Foto", Images, "gallery"],
  ["Pusat Video", Video, "videos"],
  ["Anggota Tim", Users, "team"],
  ["Lokasi Kegiatan", MapPin, "location"],
];

export function QuickAccess() {
  return (
    <section className="py-24 bg-white dark:bg-slate-950" data-testid="quick-access-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-3 mb-10">
          <Compass className="h-6 w-6 text-emerald-800 dark:text-emerald-400" />
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 dark:text-white">Akses Cepat</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {QUICK.map(([label, Icon, id], i) => (
            <motion.button
              key={label}
              onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })}
              data-testid={`quick-access-${id}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="group text-left rounded-2xl border border-slate-100 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-900 dark:border-white/10 p-6 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-950/5 hover:border-emerald-200 dark:hover:border-emerald-800 transition-all duration-300"
            >
              <span className="grid place-items-center h-12 w-12 rounded-xl bg-emerald-900 text-amber-400 mb-4 group-hover:scale-110 transition-transform">
                <Icon className="h-6 w-6" />
              </span>
              <p className="font-display font-semibold text-slate-900 dark:text-white group-hover:text-emerald-800 dark:group-hover:text-emerald-300 transition-colors">{label}</p>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
