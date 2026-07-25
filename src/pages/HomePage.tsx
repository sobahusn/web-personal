import { HeroSection } from "../components/sections/HeroSection";
import { FeaturedProjects } from "../components/sections/FeaturedProjects";
import { StatsBar } from "../components/sections/StatsBar";
import { ContactCTA } from "../components/sections/ContactCTA";
export function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <HeroSection />

      {/* Stats */}
      <StatsBar />

      {/* Featured Projects */}
      <FeaturedProjects />

      {/* CTA Banner */}
      <ContactCTA />
    </>
  );
}
