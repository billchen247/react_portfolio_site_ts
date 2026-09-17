// -----------------------------------------------------------------------------
// TechStack.tsx — a grouped list of technologies I use day-to-day.
// Author: Bill Chen
//
// Concepts introduced here:
//   • Nested type shapes. `TechGroup` describes one category (label + a
//     readonly array of tech names). The component's `groups` prop is
//     `readonly TechGroup[]` — an array of those.
//   • Default prop values via destructuring. `{ title = 'Tech stack', groups
//     = DEFAULT_TECH_GROUPS }` means "if the caller omits either prop, fall
//     back to these defaults." That's how you make props optional without
//     writing a wrapper component.
//   • Optional props. In the type, `title?: string` marks `title` as
//     optional (may be undefined). The default value in the destructuring
//     turns "undefined" into a real value inside the component.
// -----------------------------------------------------------------------------
import './TechStack.css';

// One row of the tech stack: a category label and the items inside it.
export type TechGroup = {
  label: string;
  items: readonly string[];
};

// The `?` on `title` and `groups` marks them optional — callers may pass
// them, but they don't have to. The defaults in the destructuring below
// fill in when they're absent.
type TechStackProps = {
  title?: string;
  groups?: readonly TechGroup[];
};

// The default groups shown on the About page. Kept `readonly` so a caller
// that forwards this same reference can't mutate it out from under us.
export const DEFAULT_TECH_GROUPS: readonly TechGroup[] = [
  {
    label: 'Frontend',
    items: ['React', 'TypeScript', 'Vite', 'React Router', 'Vitest', 'CSS (plain)']
  },
  {
    label: 'Backend',
    items: ['Node.js', 'Express', 'PostgreSQL', 'Redis', 'REST', 'GraphQL']
  },
  {
    label: 'Mobile',
    items: ['React Native', 'Expo', 'SQLite']
  },
  {
    label: 'Tooling',
    items: ['Git', 'GitHub Actions', 'Docker', 'ESLint', 'Prettier', 'Playwright']
  }
];

export default function TechStack({
  title = 'Tech stack',
  groups = DEFAULT_TECH_GROUPS
}: TechStackProps) {
  return (
    <section className="tech-stack">
      <h2 className="tech-stack-title">{title}</h2>

      {/* Two levels of .map(): one over groups (each row is a category),
          and one inside each group over that group's items (rendered as
          "pill"-shaped tags). */}
      <dl className="tech-stack-groups">
        {groups.map((group) => (
          // <div> here wraps the <dt>/<dd> pair for CSS grid layout.
          // Semantically the <dl>/<dt>/<dd> triple is the description-list
          // element set — the most fitting HTML for "label + values" data.
          <div key={group.label} className="tech-stack-group">
            <dt className="tech-stack-group-label">{group.label}</dt>
            <dd className="tech-stack-group-items">
              <ul className="tech-stack-tags">
                {group.items.map((item) => (
                  <li key={item} className="tag">
                    {item}
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
