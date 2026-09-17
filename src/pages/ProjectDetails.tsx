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
// rendering the corresponding link.
// -----------------------------------------------------------------------------
import { Link, useParams } from 'react-router-dom';
import { PROJECTS } from '../data/projects';

export default function ProjectDetails() {
  const { id } = useParams<{ id: string }>();
  const project = PROJECTS.find((entry) => entry.id === id);

  if (!project) {
    return (
      <section className="max-w-3xl">
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
    <article className="max-w-3xl">
      <p className="mb-4 text-sm">
        <Link
          to="/projects"
          className="text-muted no-underline hover:text-accent hover:underline"
        >
          ← Back to projects
        </Link>
      </p>

      <header className="grid gap-1 mb-5">
        <h1 className="m-0 text-3xl leading-tight">{project.title}</h1>
        <p className="m-0 text-accent font-semibold">{project.role}</p>
        <p className="m-0 text-muted text-sm">{project.timeline}</p>
      </header>

      <img
        src={project.image}
        alt={project.imageAlt}
        className="w-full h-64 object-cover rounded-md bg-surface-2 mb-5"
      />

      <div className="grid gap-4 text-text leading-7 mb-6">
        {project.description.map((paragraph, index) => (
          <p key={index} className="m-0">
            {paragraph}
          </p>
        ))}
      </div>

      <section className="mb-6">
        <h2 className="m-0 mb-2 text-base text-muted font-semibold uppercase tracking-wider">
          Tech stack
        </h2>
        <ul className="list-none p-0 m-0 flex flex-wrap gap-1.5">
          {project.techStack.map((tech) => (
            <li key={tech} className="tag">
              {tech}
            </li>
          ))}
        </ul>
      </section>

      {(project.liveUrl || project.repoUrl) && (
        <section className="flex flex-wrap gap-2.5">
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
