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
import './BlogPost.css';

// Same formatter approach as Blog.tsx — reuse a single Intl object.
const DATE_FORMATTER = new Intl.DateTimeFormat(undefined, {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});

export default function BlogPost() {
  // Type parameter documents the shape react-router promises. The `slug`
  // field is still typed as `string | undefined` because URLs can be
  // missing/malformed at runtime.
  const { slug } = useParams<{ slug: string }>();

  // Array.prototype.find returns `undefined` when nothing matches, which
  // is exactly the "post not found" case we handle below.
  const post = BLOG_POSTS.find((entry) => entry.slug === slug);

  if (!post) {
    return (
      <section className="blog-post">
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
    <article className="blog-post">
      {/* Small breadcrumb-style back link. Users on a detail page almost
          always want a way back to the list. */}
      <p className="blog-post-back">
        <Link to="/blog">← Back to writing</Link>
      </p>

      <header className="blog-post-header">
        <h1 className="blog-post-title">{post.title}</h1>
        <p className="blog-post-meta">
          <time dateTime={post.publishedOn}>
            {DATE_FORMATTER.format(new Date(post.publishedOn))}
          </time>
          <span aria-hidden="true"> · </span>
          <span>{post.readingTimeMinutes} min read</span>
        </p>

        <ul className="blog-post-tags">
          {post.tags.map((tag) => (
            <li key={tag} className="tag">
              {tag}
            </li>
          ))}
        </ul>
      </header>

      {/* The body is stored as an array of paragraph strings — safer than
          dangerouslySetInnerHTML for arbitrary content. If we later need
          rich formatting, we can either switch to a Markdown renderer or
          keep this shape and add a small "inline element" schema. */}
      <div className="blog-post-body">
        {post.paragraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </article>
  );
}
