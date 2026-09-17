// -----------------------------------------------------------------------------
// SkillsList.tsx — a reusable "titled bullet list" for the About page.
// Author: Bill Chen
//
// Concepts introduced here:
//   • Typed component props. `SkillsListProps` describes exactly what this
//     component accepts. TypeScript then checks each call site: pass a
//     wrong-typed prop, misspell a prop name, or forget a required one, and
//     the compiler complains.
//   • Destructuring props in the function signature. `{ title, skills }` is
//     the same as `props` followed by `props.title` / `props.skills`, just
//     shorter and easier to read.
//   • Readonly arrays. `readonly string[]` means "an array of strings you
//     can iterate but not mutate." It documents the contract: the component
//     will not push into or splice this list.
// -----------------------------------------------------------------------------
import './SkillsList.css';

// Props are just an object. Marking `skills` as readonly means TS will
// reject accidental mutations like `skills.push(...)` from inside this file.
type SkillsListProps = {
  title: string;
  skills: readonly string[];
};

// The default skills array used by the About page. Kept next to the
// component because that's where it's used; if another page ever needs the
// same list we can lift it to src/data/.
export const DEFAULT_SKILLS: readonly string[] = [
  'Product thinking — framing the user problem before the solution',
  'Clear written communication — RFCs, design docs, PR descriptions',
  'Code review as teaching, not gatekeeping',
  'Debugging by isolating variables, not by guessing',
  'Working across time zones with async-first habits',
  'Mentoring junior engineers'
];

// Destructuring the props object in the parameter list is the idiomatic
// React + TS style. The `: SkillsListProps` annotation binds the whole
// destructured shape to the type, so both `title` and `skills` get their
// proper types.
export default function SkillsList({ title, skills }: SkillsListProps) {
  return (
    <section className="skills-list">
      <h2 className="skills-list-title">{title}</h2>
      <ul className="skills-list-items">
        {skills.map((skill) => (
          // Using the skill string itself as the key is fine here because
          // each item is unique. If duplicates were possible we'd want a
          // stable id instead.
          <li key={skill}>{skill}</li>
        ))}
      </ul>
    </section>
  );
}
