import { BackgroundLayers } from "@/components/layout/BackgroundLayers";
import { CursorField } from "@/components/layout/CursorField";
import { DepthRail } from "@/components/layout/DepthRail";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { ContactSection } from "@/components/sections/ContactSection";
import { Hero } from "@/components/sections/Hero";
import { Identity } from "@/components/sections/Identity";
import { LabInterface } from "@/components/sections/LabInterface";
import { Record } from "@/components/sections/Record";
import { ResearchAtlas } from "@/components/sections/ResearchAtlas";
import { SkillGraph } from "@/components/sections/SkillGraph";
import { TeachingSection } from "@/components/sections/TeachingSection";
import { TheoreticalLab } from "@/components/sections/TheoreticalLab";
import { Timeline } from "@/components/sections/Timeline";

export default function Home() {
  return (
    <>
      <BackgroundLayers />
      <CursorField />
      <Navbar />
      <DepthRail />
      <main id="main" className="relative z-10">
        <Hero />
        <Identity />
        <ResearchAtlas />
        <LabInterface />
        <TheoreticalLab />
        <SkillGraph />
        <TeachingSection />
        <Timeline />
        <Record />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
