// -----------------------------------------------------------------------------
// Blog.tsx — the /blog listing page.
// Author: Bill Chen
//
// Concepts introduced here:
//   • Deriving a sorted list from imported data. Sorting inside the module
//     top-level (not inside the component) means it happens once at import
//     time, not on every render.
//   • Formatting a date for display with Intl.DateTimeFormat — the standard
//     browser-provided formatter. No date library required for this.
//   • <Link to={`…${var}…`}> — react-router's <Link> takes template strings
//     just fine, so each card can link into a dynamic /blog/:slug route.
// -----------------------------------------------------------------------------
import { Link } from 'react-router-dom';
import { BLOG_POSTS } from '../data/blogPosts';
import './Blog.css';

// Copy the imported array before sorting — `Array.prototype.sort` mutates in
// place, and we don't want to change the module-level BLOG_POSTS list for
// other importers. Sorting newest-first via ISO-date string compare works
// because ISO-8601 dates sort lexicographically the same as chronologically.
const POSTS_NEWEST_FIRST = [...BLOG_POSTS].sort((a, b) =>
  b.publishedOn.localeCompare(a.publishedOn)
);

// A single formatter reused for every card — cheaper than constructing one
// per render. `undefined` locale means "use the browser's".
const DATE_FORMATTER = new Intl.DateTimeFormat(undefined, {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});

export default function Blog() {
  return (
    <section className="blog">
      <h1 className="section-title">Writing</h1>
      <p className="lead">
        Occasional notes on frontend, TypeScript, and pragmatic engineering.
      </p>

      <ol className="blog-list">
        {POSTS_NEWEST_FIRST.map((post) => (
          <li key={post.slug} className="card blog-card">
            {/* The whole card is not a link (that would break the tag
                buttons and nested anchors); the title is the primary link
                target and the "Read →" affordance mirrors it. */}
            <h2 className="blog-card-title">
              <Link to={`/blog/${post.slug}`}>{post.title}</Link>
            </h2>

            <p className="blog-card-meta">
              {/* <time> is the semantic HTML for dates. `dateTime` is the
                  machine-readable value; the text content is what users see. */}
              <time dateTime={post.publishedOn}>
                {DATE_FORMATTER.format(new Date(post.publishedOn))}
              </time>
              <span aria-hidden="true"> · </span>
              <span>{post.readingTimeMinutes} min read</span>
            </p>

            <p className="blog-card-excerpt">{post.excerpt}</p>

            <ul className="blog-card-tags">
              {post.tags.map((tag) => (
                <li key={tag} className="tag">
                  {tag}
                </li>
              ))}
            </ul>

            <Link to={`/blog/${post.slug}`} className="blog-card-more">
              Read →
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
