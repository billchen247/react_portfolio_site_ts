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
import './Projects.css';

export default function Projects() {
  return (
    <section className="projects">
      <h1 className="section-title">Projects</h1>
      <p className="lead">
        A few things I've shipped recently. Each card describes my role and the
        outcome the work produced — click a title for the full write-up.
      </p>

      <div className="grid grid-3 projects-grid">
        {/* `.map()` returns a new array — here, an array of <article> JSX
            elements. React knows how to render an array of elements inline. */}
        {PROJECTS.map((project) => (
          <article key={project.id} className="card project-card">
            <img
              className="project-image"
              src={project.image}
              alt={project.imageAlt}
              loading="lazy"
            />
            {/* The title acts as the primary link into the detail page.
                Wrapping just the heading (rather than the whole card) keeps
                the accessible link text focused on the project title. */}
            <h3 className="project-title">
              <Link to={`/projects/${project.id}`}>{project.title}</Link>
            </h3>
            <p className="project-role">{project.role}</p>
            <p className="project-outcome">{project.outcome}</p>
            <Link
              to={`/projects/${project.id}`}
              className="project-card-more"
              aria-label={`Read more about ${project.title}`}
            >
              Details →
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
