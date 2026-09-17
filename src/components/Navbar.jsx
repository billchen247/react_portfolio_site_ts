// -----------------------------------------------------------------------------
// Navbar.jsx — the sticky top navigation bar.
// Author: Bill Chen
//
// Concepts introduced here:
//   • useState — React "hook" for storing values that change over time.
//   • Link vs NavLink — both navigate without a page reload; NavLink also
//     tells you whether its `to` matches the current URL (used for the
//     "active" highlight).
//   • Rendering a list — arrays get turned into JSX with `.map(...)`.
//   • The `key` prop — required whenever you render a list; React uses it to
//     tell items apart between re-renders. Must be unique among siblings.
// -----------------------------------------------------------------------------
import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import Logo from './Logo.jsx';
import './Navbar.css';

// Data-driven UI: define the list of pages once, then render them with .map().
// Adding a page = add one entry here (and one <Route> in App.jsx).
//
// `end: true` on "/" makes NavLink treat it as exact-match only — otherwise
// "/" would be considered "active" on every page since every path starts
// with "/".
const NAV_LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/about', label: 'About Me' },
  { to: '/projects', label: 'Projects' },
  { to: '/education', label: 'Education' },
  { to: '/services', label: 'Services' },
  { to: '/contact', label: 'Contact Me' }
];

export default function Navbar() {
  // useState returns a [value, setterFunction] pair.
  //   isMobileMenuOpen        → current value (starts as `false`).
  //   setIsMobileMenuOpen(x)  → call this to change it; component re-renders.
  //
  // React re-runs this function every render, but useState remembers the
  // last value across renders — that's what makes it "state".
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Small helper we reuse from multiple click handlers below.
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* <Link to="/"> navigates without reloading the page. Clicking the
            brand also collapses the mobile menu if it's open. */}
        <Link to="/" className="brand" onClick={closeMobileMenu}>
          <Logo size={38} />
          <span className="brand-name">Bill Chen</span>
        </Link>

        {/* Hamburger button, shown only on narrow screens via CSS.
            aria-expanded tells assistive tech whether the menu is open. */}
        <button
          type="button"
          className="nav-toggle"
          aria-label="Toggle navigation menu"
          aria-expanded={isMobileMenuOpen}
          // The setter can take a function: (prev) => newValue.
          // We use it here because the new value depends on the previous one.
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
        >
          {/* Three bars styled by CSS to look like a hamburger icon. */}
          <span className="nav-toggle-bar" />
          <span className="nav-toggle-bar" />
          <span className="nav-toggle-bar" />
        </button>

        {/* Template-literal className: appends " open" when the menu is
            expanded so the CSS can flip its display. */}
        <nav className={`nav-links ${isMobileMenuOpen ? 'open' : ''}`}>
          {NAV_LINKS.map((link) => (
            <NavLink
              // `key` is React-internal — not visible in the DOM. Using the
              // stable URL path is a good key here because each is unique.
              key={link.to}
              to={link.to}
              end={link.end}
              // NavLink's `className` can be a function. It receives an
              // object with `isActive: true` when the URL matches, and we
              // return a class string that includes "active" in that case.
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
