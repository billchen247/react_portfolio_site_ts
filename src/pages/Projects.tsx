// -----------------------------------------------------------------------------
// Projects.tsx — the /projects page.
// Author: Bill Chen
//
// Concepts introduced here:
//   • Data-driven rendering: keep the list of projects as a plain TS array of
//     objects, then use `.map(...)` to turn each object into a card. When you
//     want another project, add another object — no JSX changes required.
//   • The `key` prop when rendering lists: React uses `key` to match items
//     between renders (so it can update instead of re-creating them). Use a
//     stable, unique value per item — never the array index if items can be
//     reordered or filtered.
//   • `loading="lazy"` on <img>: a browser hint to defer loading offscreen
//     images. Cheap performance win with no code cost.
//   • Sharing typed data between pages: PROJECTS lives in src/data/projects.ts
//     because both this listing page AND the /projects/:id detail page read
//     from the same source. Moving the array into a dedicated data module
//     also keeps this component small and easy to read.
// -----------------------------------------------------------------------------
import { Link } from 'react-router-dom';
import { PROJECTS } from '../data/projects';

export default function Projects() {
  return (
    <section>
      <h1 className="section-title">Projects</h1>
      <p className="lead">
        A few things I've shipped recently. Each card describes my role and the
        outcome the work produced — click a title for the full write-up.
      </p>

      <div className="grid gap-5 mt-6 grid-cols-1 md:grid-cols-3">
        {PROJECTS.map((project) => (
          <article
            key={project.id}
            className="card flex flex-col gap-2"
          >
            <img
              src={project.image}
              alt={project.imageAlt}
              loading="lazy"
              className="w-full h-40 object-cover rounded-md bg-surface-2"
            />
            {/* The title acts as the primary link into the detail page.
                Wrapping just the heading (rather than the whole card) keeps
                the accessible link text focused on the project title. */}
            <h3 className="mt-2 mb-0 text-text">
              <Link
                to={`/projects/${project.id}`}
                className="text-inherit no-underline hover:text-accent hover:underline"
              >
                {project.title}
              </Link>
            </h3>
            <p className="text-accent font-semibold text-[0.95rem] m-0">
              {project.role}
            </p>
            <p className="mt-1 mb-0">{project.outcome}</p>
            <Link
              to={`/projects/${project.id}`}
              aria-label={`Read more about ${project.title}`}
              className="self-start mt-1 text-accent font-semibold no-underline hover:underline"
            >
              Details →
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
