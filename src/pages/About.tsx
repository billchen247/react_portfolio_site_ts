// -----------------------------------------------------------------------------
// About.tsx — the /about page.
// Author: Bill Chen
//
// This page composes three child components. Each child owns its own JSX
// (with utility classes inline). No page-level CSS file — spacing between
// the three sections comes from Tailwind's `gap-*` utility on the wrapper.
// -----------------------------------------------------------------------------
import AboutHero from '../components/about/AboutHero';
import SkillsList, { DEFAULT_SKILLS } from '../components/about/SkillsList';
import TechStack from '../components/about/TechStack';

export default function About() {
  return (
    // `space-y-8` gives each direct child 2rem of top margin — a small
    // Tailwind idiom for evenly-spaced vertical stacks that don't need a
    // grid layout.
    <section className="space-y-2">
      <h1 className="section-title">About Me</h1>

      <AboutHero />

      <SkillsList title="Skills I bring to a team" skills={DEFAULT_SKILLS} />

      <TechStack title="Tech I reach for" />
    </section>
  );
}
