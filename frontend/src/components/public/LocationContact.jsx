import { MapPin, Mail, Instagram, Youtube, Phone, Navigation } from "lucide-react";
import { SectionHeader } from "./ui";

export function Location({ location }) {
  const loc = (location && location[0]) || {};
  const place = [loc.village, loc.district, loc.regency, loc.province].filter(Boolean).join(", ");
  return (
    <section id="location" className="py-24 bg-slate-50 dark:bg-slate-900" data-testid="location-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeader label="Location" title="Where we serve" description="Our community service location and how to reach it." testId="location-header" />
        <div className="grid lg:grid-cols-5 gap-8 items-stretch">
          <div className="lg:col-span-2 rounded-3xl border border-slate-100 bg-white dark:bg-slate-800 dark:border-white/10 p-8 flex flex-col">
            <span className="grid place-items-center h-12 w-12 rounded-xl bg-emerald-900 text-amber-400 mb-5"><MapPin className="h-6 w-6" /></span>
            <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white">{loc.village || "[VILLAGE NAME]"}</h3>
            <p className="mt-2 text-slate-600 dark:text-slate-300">{place || "[SUBDISTRICT], [REGENCY], [PROVINCE]"}</p>
            {loc.address && <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{loc.address}</p>}
            {loc.googleMapsUrl && (
              <a href={loc.googleMapsUrl} target="_blank" rel="noreferrer" data-testid="location-directions" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-emerald-800 hover:text-emerald-600">
                <Navigation className="h-4 w-4" /> Get directions
              </a>
            )}
          </div>
          <div className="lg:col-span-3 rounded-3xl overflow-hidden border border-slate-100 dark:border-white/10 bg-white dark:bg-slate-800 min-h-[320px]">
            {loc.embedUrl ? (
              <iframe src={loc.embedUrl} title="Location map" className="w-full h-full min-h-[320px]" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            ) : (
              <div className="w-full h-full min-h-[320px] grid place-items-center text-center p-8 grid-canvas">
                <div>
                  <MapPin className="h-10 w-10 text-emerald-300 mx-auto" />
                  <p className="mt-3 font-display font-semibold text-slate-700">Map coming soon</p>
                  <p className="text-sm text-slate-400 mt-1">The map will appear here once the location is added.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export function Contact({ settings }) {
  const s = settings || {};
  const socials = [
    ["Instagram", Instagram, s.instagram],
    ["YouTube", Youtube, s.youtube],
    ["WhatsApp", Phone, s.whatsapp ? `https://wa.me/${s.whatsapp.replace(/\D/g, "")}` : ""],
    ["Email", Mail, s.email ? `mailto:${s.email}` : ""],
  ];
  return (
    <section id="contact" className="py-24 bg-emerald-950 relative overflow-hidden" data-testid="contact-section">
      <div className="absolute inset-0 grid-canvas opacity-20" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative">
        <span className="text-xs uppercase tracking-widest font-semibold text-amber-300 bg-white/10 px-3 py-1 rounded-full border border-white/20 inline-block mb-4">Contact</span>
        <h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight">Get in touch with Group 66</h2>
        <p className="mt-4 text-emerald-50/80 max-w-xl mx-auto">Have questions or want to collaborate? Reach out through any of our channels below.</p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          {socials.map(([label, Icon, href]) =>
            href ? (
              <a key={label} href={href} target="_blank" rel="noreferrer" data-testid={`contact-${label.toLowerCase()}`} className="flex items-center gap-2 rounded-full bg-white/10 hover:bg-amber-500 border border-white/20 hover:border-amber-500 px-5 py-3 text-white font-medium transition-colors">
                <Icon className="h-5 w-5" /> {label}
              </a>
            ) : (
              <span key={label} className="flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-5 py-3 text-white/40 font-medium cursor-not-allowed" data-testid={`contact-${label.toLowerCase()}-soon`}>
                <Icon className="h-5 w-5" /> {label} · Coming Soon
              </span>
            )
          )}
        </div>
      </div>
    </section>
  );
}
