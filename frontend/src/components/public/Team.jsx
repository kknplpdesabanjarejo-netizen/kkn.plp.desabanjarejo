import { useState } from "react";
import { motion } from "framer-motion";
import { Instagram, Phone, User } from "lucide-react";
import { SectionHeader, EmptyState } from "./ui";
import { Dialog, DialogContent } from "@/components/ui/dialog";

function MemberCard({ m, onOpen }) {
  return (
    <motion.button
      onClick={() => onOpen(m)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      data-testid={`team-member-${m.order}`}
      className="group text-left rounded-2xl border border-slate-100 bg-white dark:bg-slate-900 dark:border-white/10 overflow-hidden hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-950/5 transition-all duration-300 w-full"
    >
      <div className="aspect-square bg-emerald-50 overflow-hidden relative">
        {m.photo ? (
          <img src={m.photo} alt={m.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
        ) : (
          <div className="w-full h-full grid place-items-center text-emerald-300">
            <User className="h-16 w-16" />
          </div>
        )}
        <span className="absolute top-3 left-3 text-[10px] font-semibold uppercase tracking-wider bg-emerald-900 text-amber-300 px-2 py-1 rounded-full">
          {m.role}
        </span>
      </div>
      <div className="p-4">
        <p className="font-display font-bold text-slate-900 dark:text-white truncate">{m.name}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">{m.studyProgram}</p>
        <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium mt-0.5">{m.nim}</p>
      </div>
    </motion.button>
  );
}

const ROWS = [
  [0, 2],
  [2, 6],
  [6, 10],
  [10, 15],
];
const COLS = { 0: "sm:grid-cols-2 max-w-2xl mx-auto", 1: "sm:grid-cols-2 lg:grid-cols-4", 2: "sm:grid-cols-2 lg:grid-cols-4", 3: "sm:grid-cols-2 lg:grid-cols-5" };

export default function Team({ members, loading }) {
  const [selected, setSelected] = useState(null);
  const sorted = [...(members || [])].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <section id="team" className="py-24 bg-slate-50 dark:bg-slate-900" data-testid="team-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeader
          label="Our Team"
          title="15 students, one shared mission"
          description="Meet the members of KKN-PLP Integrated Group 66 who bring presence, learning, and service to the community."
          testId="team-header"
        />
        {loading ? (
          <div className="grid sm:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-slate-100 animate-pulse">
                <div className="aspect-square bg-slate-100 rounded-t-2xl" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-slate-100 rounded w-3/4" />
                  <div className="h-3 bg-slate-100 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : sorted.length === 0 ? (
          <EmptyState title="No Team Members Yet" message="Team member profiles will appear here after the administrator adds them." testId="team-empty" />
        ) : (
          <div className="space-y-6">
            {ROWS.map(([start, end], ri) => {
              const rowItems = sorted.slice(start, end);
              if (!rowItems.length) return null;
              return (
                <div key={ri} className={`grid grid-cols-2 gap-4 sm:gap-6 ${COLS[ri]}`}>
                  {rowItems.map((m) => (
                    <MemberCard key={m.id} m={m} onOpen={setSelected} />
                  ))}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-md" data-testid="team-member-dialog">
          {selected && (
            <div>
              <div className="aspect-square rounded-xl bg-emerald-50 overflow-hidden mb-4">
                {selected.photo ? (
                  <img src={selected.photo} alt={selected.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full grid place-items-center text-emerald-300">
                    <User className="h-20 w-20" />
                  </div>
                )}
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-wider bg-emerald-900 text-amber-300 px-2 py-1 rounded-full">{selected.role}</span>
              <h3 className="mt-3 text-xl font-display font-bold text-slate-900">{selected.name}</h3>
              <p className="text-sm text-slate-500">{selected.studyProgram} · {selected.nim}</p>
              {selected.bio && <p className="mt-3 text-sm text-slate-600 leading-relaxed">{selected.bio}</p>}
              <div className="mt-5 flex gap-3">
                {selected.instagram && (
                  <a href={selected.instagram} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-sm text-emerald-800 hover:text-emerald-600" data-testid="member-instagram">
                    <Instagram className="h-4 w-4" /> Instagram
                  </a>
                )}
                {selected.whatsapp && (
                  <a href={`https://wa.me/${selected.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-sm text-emerald-800 hover:text-emerald-600" data-testid="member-whatsapp">
                    <Phone className="h-4 w-4" /> WhatsApp
                  </a>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
