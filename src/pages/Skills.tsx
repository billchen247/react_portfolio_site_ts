// -----------------------------------------------------------------------------
// Skills.tsx — the /skills page.
// -----------------------------------------------------------------------------
import SkillsList, { COOL_SKILLS, DEFAULT_SKILLS } from '../components/about/SkillsList';
import './Skills.css';

export default function Skills() {
  return (
    <section className="skills-page mx-auto max-w-4xl">
      <div className="skills-page-heading rounded-lg shadow-md">
        <h1 className="section-title">Skills</h1>
        <p className="lead">for week2 demo, The skills and interests I bring to my work.</p>
      </div>

      <div className="skills-page-lists mt-6 grid gap-4 md:grid-cols-2">
        <div className="transition-transform duration-200 hover:-translate-y-1">
          <SkillsList title="Skills I bring to a team" skills={DEFAULT_SKILLS} />
        </div>
        <div className="transition-transform duration-200 hover:-translate-y-1">
          <SkillsList title="Skills I want to learn" skills={COOL_SKILLS} />
        </div>
      </div>
    </section>
  );
}