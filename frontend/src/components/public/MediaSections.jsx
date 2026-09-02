import { useState } from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { PlayCircle, FileText, ExternalLink, Heart } from "lucide-react";
import { SectionHeader, EmptyState } from "./ui";
import { Dialog, DialogContent } from "@/components/ui/dialog";

function toEmbed(url, type) {
  if (!url) return null;
  const yt = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]+)/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  const gd = url.match(/drive\.google\.com\/file\/d\/([\w-]+)/);
  if (gd) return `https://drive.google.com/file/d/${gd[1]}/preview`;
  return url;
}

export function Archives({ items, loading }) {
  const sorted = [...(items || [])].sort((a, b) => (a.order || 0) - (b.order || 0));
  return (
    <section id="archives" className="py-24 bg-white dark:bg-slate-950" data-testid="archives-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeader label="Digital Archives" title="Documents & official records" description="Access schedules, reports, videos, and infographics from the program." testId="archives-header" />
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-40 rounded-2xl bg-slate-100 animate-pulse" />)}</div>
        ) : sorted.length === 0 ? (
          <EmptyState title="No Archives Yet" message="Documents will appear here once added." testId="archives-empty" />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sorted.map((a) => {
              const Ico = Icons[a.icon] || FileText;
              const link = a.url || a.embedUrl;
              return (
                <div key={a.id} data-testid={`archive-card-${a.order}`} className="rounded-2xl border border-l-4 border-l-amber-500 border-slate-100 bg-gradient-to-br from-white to-amber-50/30 dark:from-slate-900 dark:to-slate-900 dark:border-white/10 p-6 hover:shadow-lg transition-all">
                  <div className="flex items-start justify-between">
                    <span className="grid place-items-center h-11 w-11 rounded-xl bg-emerald-900 text-amber-400"><Ico className="h-5 w-5" /></span>
                    <span className="font-mono text-xs text-slate-400">{String(a.order).padStart(2, "0")}</span>
                  </div>
                  <h3 className="mt-4 font-display font-semibold text-slate-900 dark:text-white">{a.title}</h3>
                  {link ? (
                    <a href={link} target="_blank" rel="noreferrer" data-testid={`archive-link-${a.order}`} className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-800 hover:text-emerald-600">
                      Open document <ExternalLink className="h-4 w-4" />
                    </a>
                  ) : (
                    <p className="mt-3 text-sm text-slate-400 italic">Document not available yet.</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export function Videos({ items, loading }) {
  const [active, setActive] = useState(null);
  const sorted = [...(items || [])].sort((a, b) => (a.order || 0) - (b.order || 0));
  return (
    <section id="videos" className="py-24 bg-slate-50 dark:bg-slate-900" data-testid="videos-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeader label="Video Center" title="Watch our journey unfold" description="Highlights and documentation captured on video." testId="videos-header" />
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-48 rounded-2xl bg-slate-100 animate-pulse" />)}</div>
        ) : sorted.length === 0 ? (
          <EmptyState title="No Videos Yet" message="Video documentation will be added soon. Coming Soon." testId="videos-empty" />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sorted.map((v) => (
              <button key={v.id} onClick={() => setActive(v)} data-testid={`video-card-${v.order}`} className="group text-left rounded-2xl overflow-hidden bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/10 hover:shadow-xl transition-all">
                <div className="aspect-video bg-emerald-950 relative overflow-hidden grid place-items-center">
                  {v.thumbnail && <img src={v.thumbnail} alt={v.title} className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity" />}
                  <PlayCircle className="h-14 w-14 text-white/90 relative group-hover:scale-110 transition-transform" />
                </div>
                <div className="p-4">
                  <p className="font-display font-semibold text-slate-900 dark:text-white">{v.title}</p>
                  {v.category && <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-0.5">{v.category}</p>}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-w-3xl p-2" data-testid="video-dialog">
          {active && (
            <div>
              <div className="aspect-video rounded-lg overflow-hidden bg-black">
                <iframe src={toEmbed(active.videoUrl, active.type)} title={active.title} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
              </div>
              <p className="p-3 font-display font-semibold text-slate-900">{active.title}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}

export function Memories({ items, loading }) {
  const sorted = [...(items || [])].sort((a, b) => (a.order || 0) - (b.order || 0));
  return (
    <section id="memories" className="py-24 bg-white dark:bg-slate-950" data-testid="memories-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeader label="Memories" title="Chapters we will always carry" description="The moments and connections that made this journey unforgettable." testId="memories-header" />
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-36 rounded-2xl bg-slate-100 animate-pulse" />)}</div>
        ) : sorted.length === 0 ? (
          <EmptyState title="No Memories Yet" message="Memory chapters will appear here once added." testId="memories-empty" />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {sorted.map((m, i) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: (i % 4) * 0.05 }}
                data-testid={`memory-card-${m.order}`}
                className="relative rounded-2xl overflow-hidden aspect-square bg-emerald-900 group"
              >
                {m.imageUrl ? (
                  <img src={m.imageUrl} alt={m.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                ) : (
                  <div className="w-full h-full grid place-items-center text-amber-400/40"><Heart className="h-10 w-10" /></div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 to-transparent flex items-end p-4">
                  <p className="text-white text-sm font-display font-semibold leading-tight">{m.title}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
