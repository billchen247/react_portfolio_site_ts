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

// Copy before sorting — Array.prototype.sort mutates in place. ISO-8601 dates
// sort lexicographically the same as chronologically, so localeCompare is safe.
const POSTS_NEWEST_FIRST = [...BLOG_POSTS].sort((a, b) =>
  b.publishedOn.localeCompare(a.publishedOn)
);

const DATE_FORMATTER = new Intl.DateTimeFormat(undefined, {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});

export default function Blog() {
  return (
    <section>
      <h1 className="section-title">Writing</h1>
      <p className="lead">
        Occasional notes on frontend, TypeScript, and pragmatic engineering.
      </p>

      <ol className="list-none p-0 mt-6 grid gap-4">
        {POSTS_NEWEST_FIRST.map((post) => (
          <li key={post.slug} className="card grid gap-2">
            {/* The whole card is not a link (that would break nested tags);
                the title is the primary link and "Read →" mirrors it. */}
            <h2 className="m-0 text-[1.35rem]">
              <Link
                to={`/blog/${post.slug}`}
                className="text-text no-underline hover:text-accent hover:underline"
              >
                {post.title}
              </Link>
            </h2>

            <p className="m-0 text-muted text-sm">
              <time dateTime={post.publishedOn}>
                {DATE_FORMATTER.format(new Date(post.publishedOn))}
              </time>
              <span aria-hidden="true"> · </span>
              <span>{post.readingTimeMinutes} min read</span>
            </p>

            <p className="m-0 text-text leading-relaxed">{post.excerpt}</p>

            <ul className="list-none p-0 mt-0.5 flex flex-wrap gap-1.5">
              {post.tags.map((tag) => (
                <li key={tag} className="tag">
                  {tag}
                </li>
              ))}
            </ul>

            <Link
              to={`/blog/${post.slug}`}
              className="self-start mt-1 text-accent font-semibold no-underline hover:underline"
            >
              Read →
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
