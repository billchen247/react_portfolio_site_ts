// -----------------------------------------------------------------------------
// Footer.tsx — the site-wide footer.
// Author: Bill Chen
//
// Simplest form of a React component: no state, no props. Just a function
// that returns JSX. If it stays this simple, you never need to reach for a
// hook or a class — plain functions are the modern React default.
// -----------------------------------------------------------------------------

export default function Footer() {
  // Regular JavaScript works inside a component. `new Date().getFullYear()`
  // runs on every render, so the copyright year is always current — no
  // need to bump it manually each January.
  const currentYear = new Date().getFullYear();

  return (
    // `bg-bg/60` = the theme color `--color-bg` at 60% opacity. The slash
    // syntax is Tailwind's way of layering opacity onto a theme color.
    <footer className="border-t border-border bg-bg/60">
      <div className="max-w-content mx-auto px-5 py-4 flex flex-wrap justify-between gap-4 text-muted text-sm">
        {/* Anything wrapped in `{ }` inside JSX is a JavaScript expression.
            Here we interpolate the `currentYear` variable into the text. */}
        <span>© {currentYear} Bill Chen. All rights reserved.</span>
        <span>Built with React + Vite + Tailwind.</span>
      </div>
    </footer>
  );
}
