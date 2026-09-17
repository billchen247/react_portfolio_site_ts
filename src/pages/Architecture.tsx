// -----------------------------------------------------------------------------
// Architecture.tsx — the /architecture page.
// Author: Bill Chen
//
// This is a "meta" page: it explains how the site itself is built. Structure-
// wise it's very similar to Projects/Services (static array → mapped cards),
// but the data is prose, not project cards.
//
// The educational goal here is showing that a "page" is just a component —
// there is no framework magic making it special. You define it, add a
// <Route> for it in App.tsx, and add a link to it in the Navbar.
// -----------------------------------------------------------------------------
import './Architecture.css';

// A small "topic" is a titled block of prose. Keeping the shape narrow lets
// the JSX loop stay simple.
type Topic = {
  id: string;
  title: string;
  paragraphs: string[];
};

const TOPICS: Topic[] = [
  {
    id: 'stack',
    title: 'The stack',
    paragraphs: [
      'The site is a single-page React 18 app compiled by Vite 5 and typed with TypeScript. Routing is handled by react-router-dom 6, in browser-history mode. There is no server: the built output in dist/ is deployed as static files to Netlify (with GitHub Pages as a fallback via the same build).',
      'That is deliberately a small stack. Zero external state library, zero data-fetching library, and one dev server — Vite\'s. Everything else can be added later if a real need shows up.'
    ]
  },
  {
    id: 'routing',
    title: 'Routing',
    paragraphs: [
      'App.tsx renders a <Routes> element with one <Route> per page component. When the URL changes, react-router picks the best-matching route and swaps its element in place of the previous page — the surrounding <Navbar> and <Footer> stay mounted.',
      'Dynamic segments (like /projects/:id and /blog/:slug) let one component render N different URLs. The page reads its parameters with useParams() and looks the data up in the shared data module.'
    ]
  },
  {
    id: 'data',
    title: 'Data & state',
    paragraphs: [
      'Static content — projects, blog posts, qualifications — lives in typed arrays under src/data. Both list pages and detail pages import from the same module, so a fix in one place reflects everywhere.',
      'The only stateful pieces on the site are the Contact form (useState + validation) and the "message sent" banner on Home (read from useLocation state, held locally so a refresh does not re-trigger it).'
    ]
  },
  {
    id: 'styling',
    title: 'Styling',
    paragraphs: [
      'Plain CSS, one file per component, imported for its side effect at the top of the component file. Vite hashes the output and injects it into the built HTML.',
      'Shared design tokens (colors, radii, spacing) live as CSS custom properties in src/styles/index.css. Individual components reference them by var(...) name, so a theme change is a one-line edit.'
    ]
  },
  {
    id: 'deploy',
    title: 'Deploy',
    paragraphs: [
      'A GitHub Actions workflow runs `npm run build` on every push to main and uploads the resulting dist/ to Netlify. Pull requests get a preview URL commented back on the PR.',
      'The same build also targets GitHub Pages via a VITE_BASE_PATH env var, which reconfigures Vite\'s base URL and react-router\'s basename so deep links keep working when the site is served from a subdirectory.'
    ]
  }
];

export default function Architecture() {
  return (
    <section className="architecture">
      <h1 className="section-title">How this site is built</h1>
      <p className="lead">
        A short tour of the moving parts behind this portfolio — kept intentionally
        small so it stays legible.
      </p>

      {/* One card per topic. Because TOPICS is just data, adding a section is
          a matter of adding one more object. */}
      <div className="architecture-list">
        {TOPICS.map((topic) => (
          <article key={topic.id} className="card architecture-card">
            <h2 className="architecture-heading">{topic.title}</h2>
            {topic.paragraphs.map((paragraph, index) => (
              // Using the array index as the key is OK ONLY when the items
              // are static and never reordered. That's the case here — the
              // paragraphs list for a given topic doesn't change at runtime.
              <p key={index}>{paragraph}</p>
            ))}
          </article>
        ))}
      </div>
    </section>
  );
}
