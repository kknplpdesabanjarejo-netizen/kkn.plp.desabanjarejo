import { useState, useEffect } from "react";

function waHref(settings) {
  const digits = (settings?.whatsapp || "").replace(/\D/g, "");
  const num = digits || "62XXXXXXXXXX";
  return `https://wa.me/${num}?text=Halo%2C%20saya%20ingin%20bertanya%20tentang%20KKN`;
}

export default function FloatingWhatsApp({ settings }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a
      href={waHref(settings)}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat via WhatsApp"
      data-testid="floating-whatsapp"
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-full bg-[#25D366] hover:bg-[#1EBE57] text-white font-semibold shadow-xl shadow-[#25D366]/30 h-14 pl-4 pr-5 hover:scale-105 transition-all duration-300 ${
        show ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <i className="fa-brands fa-whatsapp text-2xl" aria-hidden="true"></i>
      <span className="hidden sm:inline text-sm">Hubungi Kami</span>
    </a>
  );
}
