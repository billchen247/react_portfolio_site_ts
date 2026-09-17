// -----------------------------------------------------------------------------
// Projects.jsx — the /projects page.
// Author: Bill Chen
//
// Concepts introduced here:
//   • Data-driven rendering: keep the list of projects as a plain JS array of
//     objects, then use `.map(...)` to turn each object into a card. When you
//     want another project, add another object — no JSX changes required.
//   • The `key` prop when rendering lists: React uses `key` to match items
//     between renders (so it can update instead of re-creating them). Use a
//     stable, unique value per item — never the array index if items can be
//     reordered or filtered.
//   • `loading="lazy"` on <img>: a browser hint to defer loading offscreen
//     images. Cheap performance win with no code cost.
// -----------------------------------------------------------------------------
import projectDashboardImage from '../assets/project-dashboard.svg';
import projectMobileImage from '../assets/project-mobile.svg';
import projectApiImage from '../assets/project-api.svg';
import './Projects.css';

// Each entry drives one project card. Add a new object to add another project.
// UPPER_SNAKE_CASE is a common convention for module-level constants that
// never change after being defined.
const PROJECTS = [
  {
    id: 'insight-dashboard',
    title: 'Insight Analytics Dashboard',
    image: projectDashboardImage,
    imageAlt: 'Illustration of an analytics dashboard with charts',
    role: 'Lead front-end developer',
    outcome:
      'Delivered a real-time dashboard adopted by 40+ internal teams; cut report generation time from hours to under a minute.'
  },
  {
    id: 'trailtracker',
    title: 'TrailTracker Mobile App',
    image: projectMobileImage,
    imageAlt: 'Illustration of a phone showing a trail map',
    role: 'React Native developer',
    outcome:
      'Shipped an offline-first hiking companion to iOS and Android with 4.8-star ratings and 15k+ downloads in the first quarter.'
  },
  {
    id: 'orderflow-api',
    title: 'OrderFlow API Platform',
    image: projectApiImage,
    imageAlt: 'Illustration of API endpoints and data flow',
    role: 'Backend engineer',
    outcome:
      'Designed a Node/Express service handling 2M+ orders/day; reduced p95 latency by 62% through query and cache redesign.'
  }
];

export default function Projects() {
  return (
    <section className="projects">
      <h1 className="section-title">Projects</h1>
      <p className="lead">
        A few things I've shipped recently. Each card describes my role and the
        outcome the work produced.
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
            <h3 className="project-title">{project.title}</h3>
            <p className="project-role">{project.role}</p>
            <p className="project-outcome">{project.outcome}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
