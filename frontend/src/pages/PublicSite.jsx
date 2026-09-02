import { useEffect } from "react";
import { useResource, useObject } from "@/lib/useApi";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import { Hero, About, Statistics, QuickAccess } from "@/components/public/HeroSections";
import Team from "@/components/public/Team";
import { Programs, Timeline } from "@/components/public/ProgramsTimeline";
import Gallery from "@/components/public/Gallery";
import NewsSection from "@/components/public/NewsSection";
import { Archives, Videos, Memories } from "@/components/public/MediaSections";
import { Location, Contact } from "@/components/public/LocationContact";

export default function PublicSite() {
  const { data: settings } = useObject("settings");
  const { data: stats } = useObject("stats");
  const team = useResource("team");
  const programs = useResource("programs");
  const timeline = useResource("timeline");
  const gallery = useResource("gallery");
  const news = useResource("news");
  const archives = useResource("archives");
  const videos = useResource("videos");
  const memories = useResource("memories");
  const location = useResource("location");

  useEffect(() => {
    if (settings) {
      document.title = `${settings.siteName} | ${settings.university}`;
      const meta = document.querySelector('meta[name="description"]');
      if (meta) meta.setAttribute("content", settings.description || "");
    }
  }, [settings]);

  return (
    <div className="bg-white">
      <Navbar settings={settings} />
      <main>
        <Hero settings={settings} />
        <About settings={settings} />
        <Statistics stats={stats} />
        <QuickAccess />
        <Team members={team.data} loading={team.loading} />
        <Programs programs={programs.data} loading={programs.loading} />
        <Timeline stages={timeline.data} loading={timeline.loading} />
        <Gallery items={gallery.data} loading={gallery.loading} />
        <NewsSection items={news.data} loading={news.loading} />
        <Archives items={archives.data} loading={archives.loading} />
        <Videos items={videos.data} loading={videos.loading} />
        <Memories items={memories.data} loading={memories.loading} />
        <Location location={location.data} />
        <Contact settings={settings} />
      </main>
      <Footer settings={settings} />
    </div>
  );
}
