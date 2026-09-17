// -----------------------------------------------------------------------------
// Navbar.tsx — the sticky top navigation bar.
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
//   • Tailwind utility classes — every visual detail (padding, colors,
//     hover states, responsive behavior) is expressed inline as class names.
//     The `md:` prefix means "apply from the `md` breakpoint up"; `max-md:`
//     means "apply below the `md` breakpoint" (i.e. mobile).
// -----------------------------------------------------------------------------
import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import Logo from './Logo';

type NavLinkItem = {
  to: string;
  label: string;
  end?: boolean;
};

const NAV_LINKS: NavLinkItem[] = [
  { to: '/', label: 'Home', end: true },
  { to: '/about', label: 'About Me' },
  { to: '/projects', label: 'Projects' },
  { to: '/education', label: 'Education' },
  { to: '/services', label: 'Services' },
  { to: '/blog', label: 'Blog' },
  { to: '/architecture', label: 'Architecture' },
  { to: '/contact', label: 'Contact Me' }
];

// The active-link style. Extracted as a constant so both the utility list
// and the "active" branch below stay readable.
const NAV_LINK_BASE =
  'px-3.5 py-2 rounded-md font-medium no-underline transition-colors hover:bg-white/5';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    // The bar is sticky and translucent — a blurred backdrop shows page
    // scroll behind it. `backdrop-blur` + `bg-bg/75` is Tailwind's way of
    // spelling "background: rgba(15,18,38,0.75); backdrop-filter: blur"
    // using the theme color and an opacity modifier.
    <header className="sticky top-0 z-20 backdrop-blur-md bg-bg/75 border-b border-border">
      <div className="relative max-w-content mx-auto px-5 py-3 flex items-center gap-4">
        <Link
          to="/"
          onClick={closeMobileMenu}
          className="flex items-center gap-2.5 text-text no-underline font-bold tracking-wide hover:no-underline"
        >
          <Logo size={38} />
          <span className="text-[1.05rem]">Bill Chen</span>
        </Link>

        {/* Hamburger button, shown only on narrow screens (below md).
            `md:hidden` = visible until md; `flex` layout keeps the 3 bars
            stacked as a column. */}
        <button
          type="button"
          aria-label="Toggle navigation menu"
          aria-expanded={isMobileMenuOpen}
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          className="ml-auto md:hidden inline-flex flex-col gap-1 border border-border rounded-md px-2.5 py-2 cursor-pointer bg-transparent"
        >
          <span className="block w-[22px] h-0.5 bg-text rounded-sm" />
          <span className="block w-[22px] h-0.5 bg-text rounded-sm" />
          <span className="block w-[22px] h-0.5 bg-text rounded-sm" />
        </button>

        {/* The nav is a normal flex row from md up. Below md it's absolutely
            positioned under the header and toggled by `hidden` vs `flex`. */}
        <nav
          className={[
            'md:ml-auto md:static md:flex md:flex-row md:items-center md:gap-1 md:flex-wrap md:bg-transparent md:border-0 md:p-0',
            'absolute left-0 right-0 top-full flex-col items-stretch gap-1 px-5 pt-3 pb-5 bg-bg/95 border-b border-border',
            isMobileMenuOpen ? 'flex' : 'hidden'
          ].join(' ')}
        >
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={closeMobileMenu}
              // NavLink's `className` can be a function receiving
              // `{ isActive }`. Active links get an accent gradient
              // background and dark text; inactive links use the muted style.
              className={({ isActive }) =>
                [
                  NAV_LINK_BASE,
                  isActive
                    ? 'text-[#05221a] bg-gradient-to-br from-accent to-accent-strong hover:bg-transparent'
                    : 'text-muted hover:text-text'
                ].join(' ')
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
