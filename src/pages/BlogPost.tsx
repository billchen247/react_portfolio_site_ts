// -----------------------------------------------------------------------------
// BlogPost.tsx — the /blog/:slug detail page.
// Author: Bill Chen
//
// Concepts introduced here:
//   • useParams — reads the dynamic segments of the current URL into a
//     plain object. For a route defined as /blog/:slug, useParams() returns
//     { slug: 'the-actual-slug' } (or undefined if the segment is missing).
//   • Generic hooks — `useParams<{ slug: string }>()` tells TypeScript the
//     expected params shape. The value is still `string | undefined`; the
//     generic just names what to expect.
//   • 404 handling in an SPA — the URL might contain a slug we don't have
//     a post for. We render a friendly "not found" state instead of
//     crashing or showing an empty article.
// -----------------------------------------------------------------------------
import { Link, useParams } from 'react-router-dom';
import { BLOG_POSTS } from '../data/blogPosts';

const DATE_FORMATTER = new Intl.DateTimeFormat(undefined, {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = BLOG_POSTS.find((entry) => entry.slug === slug);

  if (!post) {
    return (
      <section className="max-w-2xl">
        <h1 className="section-title">Post not found</h1>
        <p className="lead">
          The article you tried to open doesn't exist (or was renamed).
        </p>
        <p>
          <Link className="btn" to="/blog">
            ← Back to writing
          </Link>
        </p>
      </section>
    );
  }

  return (
    <article className="max-w-2xl">
      {/* Small breadcrumb-style back link. */}
      <p className="mb-4 text-sm">
        <Link
          to="/blog"
          className="text-muted no-underline hover:text-accent hover:underline"
        >
          ← Back to writing
        </Link>
      </p>

      <header className="mb-6 grid gap-1.5">
        <h1 className="m-0 text-3xl leading-tight">{post.title}</h1>
        <p className="m-0 text-muted text-sm">
          <time dateTime={post.publishedOn}>
            {DATE_FORMATTER.format(new Date(post.publishedOn))}
          </time>
          <span aria-hidden="true"> · </span>
          <span>{post.readingTimeMinutes} min read</span>
        </p>

        <ul className="list-none p-0 mt-1.5 flex flex-wrap gap-1.5">
          {post.tags.map((tag) => (
            <li key={tag} className="tag">
              {tag}
            </li>
          ))}
        </ul>
      </header>

      {/* Paragraphs stored as an array of strings — safer than
          dangerouslySetInnerHTML. `leading-7` = tall line-height for
          long-form reading. */}
      <div className="grid gap-4 text-text leading-7">
        {post.paragraphs.map((paragraph, index) => (
          <p key={index} className="m-0">
            {paragraph}
          </p>
        ))}
      </div>
    </article>
  );
}
