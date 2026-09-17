// -----------------------------------------------------------------------------
// SkillsList.tsx — a reusable "titled bullet list" for the About page.
// Author: Bill Chen
// -----------------------------------------------------------------------------

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

export default function SkillsList({ title, skills }: SkillsListProps) {
  return (
    <section className="mt-8">
      <h2 className="m-0 mb-3 text-xl">{title}</h2>
      {/* `list-disc pl-5 grid gap-1.5` — a disc bullet list stacked with a
          small gap, matching the shared design language. */}
      <ul className="list-disc pl-5 m-0 grid gap-1.5 text-text leading-relaxed">
        {skills.map((skill) => (
          <li key={skill} className="pl-1">
            {skill}
          </li>
        ))}
      </ul>
    </section>
  );
}
