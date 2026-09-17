// -----------------------------------------------------------------------------
// SkillsList.tsx — a reusable "titled bullet list" for the About page.
// Author: Bill Chen
// -----------------------------------------------------------------------------
import { useState } from 'react';
import './SkillsList.css';

type SkillsListProps = {
  title: string;
  skills: readonly string[];
};

export const DEFAULT_SKILLS: readonly string[] = [
  'Product thinking — framing the user problem before the solution',
  'Clear written communication — RFCs, design docs, PR descriptions',
  'Code review as teaching, not gatekeeping',
  'Debugging by isolating variables, not by guessing',
  'Working across time zones with async-first habits',
  'Mentoring junior engineers'
];

export const COOL_SKILLS: readonly string[] = [
  'Music production — Ableton Live, Logic Pro, FL Studio',
  'Swimming — freestyle, backstroke, butterfly, breaststroke'
];

// Destructuring the props object in the parameter list is the idiomatic
// React + TS style. The `: SkillsListProps` annotation binds the whole
// destructured shape to the type, so both `title` and `skills` get their
// proper types.
export default function SkillsList({ title, skills }: SkillsListProps) {
  // useState gives this component a value that can change when the user
  // interacts with it. Each SkillsList instance gets its own show/hide state.
  const [showSkills, setShowSkills] = useState(true);

  function handleToggleSkills() {
    setShowSkills((currentlyVisible) => !currentlyVisible);
  }

  return (
    <section className="mt-8 skills-list">
      <h2 className="m-0 mb-3 text-xl">{title}</h2>
      <button
        className="skills-list-toggle"
        type="button"
        onClick={handleToggleSkills}
        aria-expanded={showSkills}
      >
        {showSkills ? 'Hide skills' : 'Show skills'}
      </button>
      {/* `list-disc pl-5 grid gap-1.5` — a disc bullet list stacked with a
          small gap, matching the shared design language. */}
      {showSkills && (
        <ul className="list-disc pl-5 m-0 grid gap-1.5 text-text leading-relaxed">
          {skills.map((skill) => (
            <li key={skill} className="pl-1">
              {skill}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
