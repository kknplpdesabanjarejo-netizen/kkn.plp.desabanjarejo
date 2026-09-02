import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { SectionHeader, EmptyState } from "./ui";

function LucideIcon({ name, className }) {
  const Ico = Icons[name] || Icons.Sparkles;
  return <Ico className={className} />;
}

export function Programs({ programs, loading }) {
  const sorted = [...(programs || [])].sort((a, b) => (a.order || 0) - (b.order || 0));
  return (
    <section id="programs" className="py-24 bg-white dark:bg-slate-950" data-testid="programs-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeader label="Program" title="Program Kami" description="Berbagai program dirancang berdasarkan kebutuhan dan potensi masyarakat dengan semangat kolaborasi dan kebermanfaatan." testId="programs-header" />
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-48 rounded-2xl bg-slate-100 animate-pulse" />)}
          </div>
        ) : sorted.length === 0 ? (
          <EmptyState title="Belum Ada Program" message="Bidang program akan tampil di sini setelah administrator menambahkannya." testId="programs-empty" />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sorted.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: (i % 3) * 0.08 }}
                data-testid={`program-card-${p.number}`}
                className="group relative rounded-2xl border border-slate-100 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-900 dark:border-white/10 p-7 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-950/5 hover:border-emerald-200 dark:hover:border-emerald-800 transition-all duration-300"
              >
                <span className="absolute top-6 right-7 font-display font-extrabold text-5xl text-emerald-50 dark:text-slate-800 group-hover:text-emerald-100 transition-colors">
                  {String(p.number).padStart(2, "0")}
                </span>
                <span className="grid place-items-center h-12 w-12 rounded-xl bg-emerald-900 text-amber-400 mb-5 relative">
                  <LucideIcon name={p.icon} className="h-6 w-6" />
                </span>
                <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white relative">{p.title}</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed relative">{p.description}</p>
                {p.activities?.length > 0 && (
                  <ul className="mt-4 space-y-1.5 relative">
                    {p.activities.map((a, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                        <Icons.Check className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" /> {a}
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export function Timeline({ stages, loading }) {
  const sorted = [...(stages || [])].sort((a, b) => (a.order || 0) - (b.order || 0));
  return (
    <section id="timeline" className="py-24 bg-slate-950 relative overflow-hidden" data-testid="timeline-section">
      <div className="absolute inset-0 grid-canvas opacity-30" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative">
        <div className="max-w-2xl mb-14">
          <span className="text-xs uppercase tracking-widest font-semibold text-amber-300 bg-white/10 px-3 py-1 rounded-full border border-white/20 inline-block mb-4">Perjalanan Kami</span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight">Perjalanan Kami</h2>
          <p className="mt-4 text-slate-300">Setiap langkah menjadi bagian dari perjalanan untuk belajar, mengabdi, dan tumbuh bersama masyarakat.</p>
        </div>
        {loading ? (
          <div className="space-y-6">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-20 rounded-xl bg-white/5 animate-pulse" />)}</div>
        ) : sorted.length === 0 ? (
          <EmptyState title="Belum Ada Perjalanan" message="Lini masa perjalanan akan tampil di sini setelah ditambahkan." testId="timeline-empty" />
        ) : (
          <div className="relative pl-8 sm:pl-10">
            <div className="absolute left-3 sm:left-4 top-2 bottom-2 w-px bg-gradient-to-b from-amber-400 via-emerald-500 to-transparent" />
            {sorted.map((st, i) => (
              <motion.div
                key={st.id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                data-testid={`timeline-stage-${st.number}`}
                className="relative pb-10 last:pb-0"
              >
                <span className="absolute -left-[26px] sm:-left-[30px] grid place-items-center h-7 w-7 rounded-full bg-amber-500 text-slate-950 text-xs font-bold font-mono ring-4 ring-slate-950">
                  {st.number}
                </span>
                <div className="glass rounded-xl border border-white/10 p-5 bg-white/5">
                  <h3 className="font-display font-bold text-white text-lg">{st.title}</h3>
                  {st.date && <p className="text-xs text-amber-300 font-mono mt-0.5">{st.date}</p>}
                  <p className="mt-2 text-sm text-slate-300 leading-relaxed">{st.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
