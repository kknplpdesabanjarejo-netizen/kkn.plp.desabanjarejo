import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export default function Lightbox({ items, index, onClose, onNav }) {
  const item = items[index];

  const handleKey = useCallback(
    (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNav(1);
      if (e.key === "ArrowLeft") onNav(-1);
    },
    [onClose, onNav]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [handleKey]);

  if (!item) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
        data-testid="lightbox"
      >
        <button className="absolute top-5 right-5 text-white/80 hover:text-white p-2" onClick={onClose} data-testid="lightbox-close" aria-label="Close">
          <X className="h-7 w-7" />
        </button>
        <button
          className="absolute left-4 sm:left-8 text-white/80 hover:text-white p-2"
          onClick={(e) => { e.stopPropagation(); onNav(-1); }}
          data-testid="lightbox-prev"
          aria-label="Previous"
        >
          <ChevronLeft className="h-9 w-9" />
        </button>
        <button
          className="absolute right-4 sm:right-8 text-white/80 hover:text-white p-2"
          onClick={(e) => { e.stopPropagation(); onNav(1); }}
          data-testid="lightbox-next"
          aria-label="Next"
        >
          <ChevronRight className="h-9 w-9" />
        </button>

        <motion.figure
          key={index}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25 }}
          className="max-w-4xl w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <img src={item.imageUrl} alt={item.title || "Gallery image"} className="w-full max-h-[75vh] object-contain rounded-xl" />
          <figcaption className="mt-4 text-center">
            <p className="text-white font-display font-semibold text-lg">{item.title}</p>
            {item.caption && <p className="text-slate-300 text-sm mt-1">{item.caption}</p>}
            {(item.location || item.category) && (
              <p className="text-slate-400 text-xs mt-1">{[item.category, item.location].filter(Boolean).join(" · ")}</p>
            )}
          </figcaption>
        </motion.figure>
      </motion.div>
    </AnimatePresence>
  );
}
