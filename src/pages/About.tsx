// -----------------------------------------------------------------------------
// About.tsx — the /about page.
// Author: Bill Chen
//
// This page used to hold all of its content inline. It now composes three
// child components. Each child owns its own JSX, CSS, and default data —
// keeping this file short and easy to scan.
//
// Concepts introduced here:
//   • Component composition. A "page" is often just a thin wrapper that
//     assembles smaller pieces. Small components read better, are easier to
//     test in isolation, and can be reused on other pages if needed.
//   • Passing props. `SkillsList` requires a `title` and a `skills` array,
//     so we hand it both explicitly. `TechStack` accepts optional props
//     with sensible defaults, so we call it bare here.
//   • Passing an imported constant as a prop. `DEFAULT_SKILLS` lives next
//     to the SkillsList component; we re-use it here instead of duplicating.
// -----------------------------------------------------------------------------
import AboutHero from '../components/about/AboutHero';
import SkillsList, { DEFAULT_SKILLS } from '../components/about/SkillsList';
import TechStack from '../components/about/TechStack';
import './About.css';

export default function About() {
  return (
    <section className="about">
      <h1 className="section-title">About Me</h1>

      <AboutHero />

      {/* SkillsList is generic on purpose — pass any list of strings and
          any heading. Here we hand it the default set exported alongside
          the component. */}
      <SkillsList title="Skills I bring to a team" skills={DEFAULT_SKILLS} />

      {/* TechStack has default props, so calling it without arguments is
          fine. It's still a good habit to pass an explicit title when the
          wording matters to the page. */}
      <TechStack title="Tech I reach for" />
    </section>
  );
}
