// -----------------------------------------------------------------------------
// ProjectDetails.tsx — the /projects/:id detail page.
// Author: Bill Chen
//
// Structurally this file mirrors BlogPost.tsx: read a param off the URL,
// look it up in a shared data module, and render a "not found" state if the
// id is bogus.
//
// A subtle TypeScript note: the imported `Project` type carries `liveUrl`
// and `repoUrl` as optional fields (marked with `?`). At runtime that means
// they can be `undefined`, so the JSX guards each one with `&&` before
// rendering the corresponding link. Without those checks, the type checker
// would complain about passing `undefined` where a `string` href is
// required.
// -----------------------------------------------------------------------------
import { Link, useParams } from 'react-router-dom';
import { PROJECTS } from '../data/projects';
import './ProjectDetails.css';

export default function ProjectDetails() {
  // `id` is `string | undefined` — the segment might be missing from the URL.
  const { id } = useParams<{ id: string }>();

  const project = PROJECTS.find((entry) => entry.id === id);

  if (!project) {
    return (
      <section className="project-details">
        <h1 className="section-title">Project not found</h1>
        <p className="lead">
          The project you tried to open doesn't exist (or was renamed).
        </p>
        <p>
          <Link className="btn" to="/projects">
            ← Back to projects
          </Link>
        </p>
      </section>
    );
  }

  return (
    <article className="project-details">
      <p className="project-details-back">
        <Link to="/projects">← Back to projects</Link>
      </p>

      <header className="project-details-header">
        <h1 className="project-details-title">{project.title}</h1>
        <p className="project-details-role">{project.role}</p>
        <p className="project-details-timeline">{project.timeline}</p>
      </header>

      <img
        className="project-details-image"
        src={project.image}
        alt={project.imageAlt}
      />

      <div className="project-details-body">
        {project.description.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>

      <section className="project-details-meta">
        <h2 className="project-details-meta-heading">Tech stack</h2>
        <ul className="project-details-tags">
          {project.techStack.map((tech) => (
            <li key={tech} className="tag">
              {tech}
            </li>
          ))}
        </ul>
      </section>

      {/* Optional links: only render the row if at least one is set, and
          only render each link if that particular field is defined.
          The `&&` short-circuit is TypeScript-friendly — inside the truthy
          branch, `project.liveUrl` narrows from `string | undefined` to
          `string`, so `href={project.liveUrl}` is safe. */}
      {(project.liveUrl || project.repoUrl) && (
        <section className="project-details-links">
          {project.liveUrl && (
            <a
              className="btn"
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer noopener"
            >
              Live site ↗
            </a>
          )}
          {project.repoUrl && (
            <a
              className="btn btn-secondary"
              href={project.repoUrl}
              target="_blank"
              rel="noreferrer noopener"
            >
              Source code ↗
            </a>
          )}
        </section>
      )}
    </article>
  );
}
