import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowUpRight, Newspaper, MapPin } from "lucide-react";
import { SectionHeader, EmptyState } from "./ui";

export default function NewsSection({ items, loading }) {
  const navigate = useNavigate();
  const sorted = [...(items || [])].sort((a, b) => (a.order || 0) - (b.order || 0));
  const featured = sorted[0];
  const rest = sorted.slice(1);

  return (
    <section id="news" className="py-24 bg-slate-50" data-testid="news-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeader label="News" title="Stories from the journey" description="The latest activities, milestones, and stories from Group 66." testId="news-header" />
        {loading ? (
          <div className="grid lg:grid-cols-2 gap-6">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-64 rounded-2xl bg-slate-100 animate-pulse" />)}</div>
        ) : sorted.length === 0 ? (
          <EmptyState title="No News Yet" message="Activity stories will be updated soon." testId="news-empty" />
        ) : (
          <div className="grid lg:grid-cols-2 gap-6">
            {featured && (
              <motion.article
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                onClick={() => navigate(`/news/${featured.slug}`)}
                data-testid="news-featured"
                className="group cursor-pointer rounded-3xl overflow-hidden bg-emerald-950 text-white relative min-h-[340px] flex flex-col justify-end p-8"
              >
                {featured.coverImage ? (
                  <img src={featured.coverImage} alt={featured.title} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-70 group-hover:scale-105 transition-all duration-500" />
                ) : (
                  <div className="absolute inset-0 grid-canvas opacity-40" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/50 to-transparent" />
                <div className="relative">
                  <span className="inline-block text-xs font-semibold uppercase tracking-wider bg-amber-500 text-white px-3 py-1 rounded-full mb-3">{featured.category}</span>
                  <h3 className="font-display font-bold text-2xl leading-snug group-hover:text-amber-300 transition-colors">{featured.title}</h3>
                  <p className="mt-2 text-sm text-emerald-50/80 line-clamp-2">{featured.excerpt}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-amber-300 text-sm font-semibold">Read more <ArrowUpRight className="h-4 w-4" /></span>
                </div>
              </motion.article>
            )}
            <div className="grid gap-6">
              {rest.map((n, i) => (
                <motion.article
                  key={n.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  onClick={() => navigate(`/news/${n.slug}`)}
                  data-testid={`news-card-${i}`}
                  className="group cursor-pointer flex gap-4 rounded-2xl border border-slate-100 bg-white p-4 hover:shadow-lg hover:border-emerald-200 transition-all"
                >
                  <div className="h-24 w-24 shrink-0 rounded-xl bg-emerald-50 overflow-hidden grid place-items-center text-emerald-300">
                    {n.coverImage ? <img src={n.coverImage} alt={n.title} className="w-full h-full object-cover" /> : <Newspaper className="h-8 w-8" />}
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-semibold text-amber-600 uppercase tracking-wide">{n.category}</span>
                    <h4 className="font-display font-semibold text-slate-900 leading-snug mt-1 line-clamp-2 group-hover:text-emerald-800 transition-colors">{n.title}</h4>
                    {n.location && <p className="mt-1 flex items-center gap-1 text-xs text-slate-400"><MapPin className="h-3 w-3" />{n.location}</p>}
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
