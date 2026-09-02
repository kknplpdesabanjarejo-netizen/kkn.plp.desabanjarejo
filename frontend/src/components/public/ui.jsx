import { motion } from "framer-motion";
import { Inbox } from "lucide-react";

export function SectionHeader({ label, title, description, testId }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mb-12"
      data-testid={testId}
    >
      {label && (
        <span className="text-xs uppercase tracking-widest font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-block mb-4">
          {label}
        </span>
      )}
      <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight text-slate-900">{title}</h2>
      {description && <p className="mt-4 text-base leading-relaxed text-slate-600">{description}</p>}
    </motion.div>
  );
}

export function EmptyState({ title, message, testId }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/40 text-center" data-testid={testId}>
      <span className="grid place-items-center h-14 w-14 rounded-2xl bg-white text-emerald-700 shadow-sm mb-4">
        <Inbox className="h-6 w-6" />
      </span>
      <h4 className="font-display font-semibold text-slate-800 text-lg">{title}</h4>
      <p className="mt-1.5 text-sm text-slate-500 max-w-sm">{message}</p>
    </div>
  );
}

export function CardSkeleton({ count = 3 }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-slate-100 p-5 animate-pulse">
          <div className="h-40 bg-slate-100 rounded-xl mb-4" />
          <div className="h-4 bg-slate-100 rounded w-3/4 mb-2" />
          <div className="h-3 bg-slate-100 rounded w-1/2" />
        </div>
      ))}
    </div>
  );
}
