import HeroSection from './components/home/HeroSection';
import SkillsSection from './components/home/SkillsSection';
import ProjectsPreview from './components/home/ProjectsPreview';
import ContactSection from './components/home/ContactSection';

export default function Home() {
  return (
    <>
      <HeroSection />
      <SkillsSection />
      <ProjectsPreview />
      <ContactSection />
    </>
  );
}
