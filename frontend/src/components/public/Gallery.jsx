import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, ImageIcon } from "lucide-react";
import { SectionHeader, EmptyState } from "./ui";
import Lightbox from "./Lightbox";
import { Input } from "@/components/ui/input";

const CATEGORIES = ["All", "Arrival", "Observation", "Education", "Religious Activities", "Social Activities", "Environment", "Digitalization", "Community Development", "Evaluation", "Closing"];

export default function Gallery({ items, loading }) {
  const [cat, setCat] = useState("All");
  const [q, setQ] = useState("");
  const [lbIndex, setLbIndex] = useState(-1);

  const published = (items || []).filter((i) => i.imageUrl);
  const filtered = useMemo(() => {
    return published
      .filter((i) => cat === "All" || i.category === cat)
      .filter((i) => !q || (i.title || "").toLowerCase().includes(q.toLowerCase()) || (i.caption || "").toLowerCase().includes(q.toLowerCase()))
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [published, cat, q]);

  return (
    <section id="gallery" className="py-24 bg-white dark:bg-slate-950" data-testid="gallery-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeader label="Gallery" title="Moments from the field" description="A visual documentation of our activities, captured throughout the program." testId="gallery-header" />

        <div className="flex flex-col lg:flex-row gap-4 lg:items-center justify-between mb-8">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                data-testid={`gallery-filter-${c.toLowerCase().replace(/\s+/g, "-")}`}
                className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  cat === c ? "bg-emerald-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-emerald-900/40 dark:hover:text-emerald-300"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="relative lg:w-64 shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search photos..." className="pl-9 rounded-full" data-testid="gallery-search" />
          </div>
        </div>

        {loading ? (
          <div className="columns-2 md:columns-3 gap-4 space-y-4">
            {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-56 rounded-2xl bg-slate-100 animate-pulse break-inside-avoid" />)}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState title="No Documentation Yet" message="Activity documentation will appear here after the administrator adds content." testId="gallery-empty" />
        ) : (
          <div className="columns-2 md:columns-3 gap-4 space-y-4">
            {filtered.map((it, i) => (
              <motion.button
                key={it.id}
                onClick={() => setLbIndex(i)}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                data-testid={`gallery-item-${i}`}
                className="group relative w-full break-inside-avoid rounded-2xl overflow-hidden bg-slate-100"
              >
                <img src={it.imageUrl} alt={it.title || "Gallery"} loading="lazy" className="w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <div className="text-left">
                    <p className="text-white font-semibold text-sm">{it.title}</p>
                    {it.category && <p className="text-amber-300 text-xs">{it.category}</p>}
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </div>

      {lbIndex >= 0 && (
        <Lightbox
          items={filtered}
          index={lbIndex}
          onClose={() => setLbIndex(-1)}
          onNav={(d) => setLbIndex((p) => (p + d + filtered.length) % filtered.length)}
        />
      )}
    </section>
  );
}
