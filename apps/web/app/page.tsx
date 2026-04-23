import { Navbar } from "./components/Navbar";
import { HeroSection } from "./components/HeroSection";
import { SocialProofSection } from "./components/SocialProofSection";
import { TrainingModesSection } from "./components/TrainingModesSection";
import { AnalyticsSection } from "./components/AnalyticsSection";
import { CompetitiveSection } from "./components/CompetitiveSection";
import { ComparisonSection } from "./components/ComparisonSection";
import { FinalCTASection } from "./components/FinalCTASection";
import { Footer } from "./components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <SocialProofSection />
        <TrainingModesSection />
        <AnalyticsSection />
        <CompetitiveSection />
        <ComparisonSection />
        <FinalCTASection />
      </main>
      <Footer />
    </>
  );
}
