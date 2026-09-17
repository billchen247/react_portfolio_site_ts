// -----------------------------------------------------------------------------
// Footer.tsx — the site-wide footer.
// Author: Bill Chen
//
// Simplest form of a React component: no state, no props. Just a function
// that returns JSX. If it stays this simple, you never need to reach for a
// hook or a class — plain functions are the modern React default.
// -----------------------------------------------------------------------------
import './Footer.css';

export default function Footer() {
  // Regular JavaScript works inside a component. `new Date().getFullYear()`
  // runs on every render, so the copyright year is always current — no
  // need to bump it manually each January.
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        {/* Anything wrapped in `{ }` inside JSX is a JavaScript expression.
            Here we interpolate the `currentYear` variable into the text. */}
        <span>© {currentYear} Bill Chen. All rights reserved.</span>
        <span className="site-footer-meta">Built with React + Vite.</span>
      </div>
    </footer>
  );
}
