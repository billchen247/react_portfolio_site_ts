// -----------------------------------------------------------------------------
// blogPosts.ts — single source of truth for blog post data.
// Author: Bill Chen
//
// A tiny "static CMS" — a typed array of post objects. Both the /blog list
// page and the /blog/:slug detail page import from here. In a real site
// you'd fetch this from a headless CMS or generate it from Markdown files
// at build time, but the React shape stays the same either way.
// -----------------------------------------------------------------------------

export type BlogPost = {
  slug: string;
  title: string;
  publishedOn: string; // ISO-8601 (YYYY-MM-DD). Parseable by new Date(...).
  readingTimeMinutes: number;
  excerpt: string;
  tags: string[];
  // Each string in `paragraphs` becomes one <p> in the rendered post.
  // Keeping the body as an array of paragraphs (instead of a single string
  // with `\n\n`) means the JSX loop stays simple: paragraphs.map(...).
  paragraphs: string[];
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'why-i-still-reach-for-plain-css',
    title: 'Why I still reach for plain CSS',
    publishedOn: '2026-08-04',
    readingTimeMinutes: 5,
    excerpt:
      'A short defense of hand-written CSS in a landscape of utility classes and CSS-in-JS. Sometimes the fewer moving parts, the better.',
    tags: ['css', 'opinion', 'frontend'],
    paragraphs: [
      'Every few years the frontend community picks a new default for styling: BEM, CSS-in-JS, atomic CSS, and now utility-first frameworks. Each pass adds real value, but each also arrives with a set of costs that only show up 18 months in.',
      'On this site I went back to plain CSS files, one per component, with a shared set of custom properties in a single index.css. It\'s not glamorous, but it has three properties that keep paying off: zero runtime, zero build coupling, and the ability to hit "view source" and understand every rule.',
      'The real trick isn\'t which approach you pick — it\'s whether the seam between "shared" and "component-specific" styles is clear. Custom properties turned out to be a fantastic seam.'
    ]
  },
  {
    slug: 'typescript-utility-types-i-actually-use',
    title: 'TypeScript utility types I actually use',
    publishedOn: '2026-06-19',
    readingTimeMinutes: 8,
    excerpt:
      'Partial, Pick, Omit, Record, Awaited — a shortlist of the utility types that show up in most of the TypeScript I write, with real examples.',
    tags: ['typescript', 'types', 'reference'],
    paragraphs: [
      'The TypeScript handbook lists a dozen utility types and it\'s tempting to memorize them all. In practice, I reach for about five, and I reach for them a LOT.',
      'Partial<T> is the workhorse for form state, error maps, and any "these fields might be missing" scenario. Pick<T, K> and Omit<T, K> come up whenever a function or component accepts a subset of a bigger interface — usually derived from a shared entity type.',
      'Record<K, V> is my default for "map of well-known keys". If K is a string union, you get exhaustive checks for free — miss a key, TS yells at you. Awaited<T> is the one I didn\'t know I needed until I did: it unwraps the return type of async functions cleanly.'
    ]
  },
  {
    slug: 'the-case-for-boring-technology',
    title: 'The case for boring technology',
    publishedOn: '2026-04-02',
    readingTimeMinutes: 6,
    excerpt:
      'Novel tools ship faster than the operational knowledge to run them. A note on choosing tools your future self will thank you for.',
    tags: ['engineering', 'opinion'],
    paragraphs: [
      'Every team has an "innovation budget" — the number of new, unfamiliar technologies it can absorb before delivery starts to suffer. Spend it on the pieces where being new actually matters, and use boring, well-understood tools for everything else.',
      'The clearest signal that a tool is boring, in the good sense, is that failure modes are documented and stack traces are searchable. Postgres, HTTP, cron: these have thirty years of Stack Overflow behind them.',
      'None of this is an argument against learning new things. It\'s an argument about where to put them. A brand-new database beneath a critical write path is a bet on your evenings and weekends; a brand-new frontend animation library is a Tuesday afternoon.'
    ]
  }
];
