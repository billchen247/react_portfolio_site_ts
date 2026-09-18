// -----------------------------------------------------------------------------
// Home.tsx — the landing page ("/").
// Author: Bill Chen
//
// Concepts introduced here:
//   • useEffect — a hook that runs code AFTER render, useful for reacting to
//     things like URL/state changes without blocking the initial paint.
//   • useLocation — reads the current URL and any "state" that was passed to
//     it via `navigate('/', { state: {...} })`.
//   • useNavigate — imperatively navigates ("go to page X") from JavaScript,
//     e.g. after a form submit or when we want to scrub router state.
//   • Conditional rendering with `{value && <JSX/>}` — React renders nothing
//     when the value is falsy, so this is a common shorthand for "show X only
//     if Y is true."
// -----------------------------------------------------------------------------
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';

type ContactRedirectState = {
  justSubmitted?: boolean;
  firstName?: string;
  lastName?: string;
};

type Confirmation = {
  firstName: string;
  lastName: string;
};

export default function Home() {
  const location = useLocation();
  const navigate = useNavigate();

  // Explicit `<Confirmation | null>` generic is required: with a null
  // initial value, TypeScript would otherwise infer state as `null` only.
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);

  // useEffect runs AFTER React renders the component.
  // Think of it as "do this after the page is shown".
  // Here, we use it to react to a route change: when Contact sends us back
  // with a redirect state saying the form was submitted, we show a success
  // banner and then immediately clear the router state.
  //
  // Why this matters:
  // - the initial render happens first
  // - then this effect checks the URL/state
  // - if the user just submitted a form, we update the component state
  // - React re-renders, and the banner appears
  //
  // The dependency array tells React when to re-run the effect:
  // - [location.state, navigate] means: run again when the route state or
  //   navigate function changes.
  // - `navigate` is included because it is a function from React Router and
  //   we use it inside the effect.
  useEffect(() => {
    // `location.state` is the data sent when navigating with something like:
    // navigate('/about', { state: { justSubmitted: true, firstName: 'Alice' } })
    // Here we read it and extract the data if it exists.
    const state = location.state as ContactRedirectState | null;

    // If the Contact page told us the form was submitted, show the banner.
    if (state?.justSubmitted) {
      setConfirmation({
        firstName: state.firstName || '',
        lastName: state.lastName || '',
      });

      // Clear the router state so the message does not keep showing again on
      // refresh or if the user navigates back to the home page.
      navigate('/', { replace: true, state: null });
    }
  }, [location.state, navigate]);

  return (
    <section>
      {confirmation && (
        // Confirmation banner — an accent-tinted panel with a dismiss button.
        // `role="status" aria-live="polite"` announces the text to screen
        // readers without stealing focus.
        <div
          role="status"
          aria-live="polite"
          className="flex items-center justify-between gap-4 px-4 py-3 mb-6 rounded-md bg-accent/15 border border-accent text-text"
        >
          <span>
            {/* Ternary inside JSX: include ", firstName" only when we have one. */}
            Thanks{confirmation.firstName ? `, ${confirmation.firstName}` : ''}{confirmation.lastName ? ` ${confirmation.lastName}` : ''} — your
            message was received. I'll get back to you shortly.
          </span>
          <button
            type="button"
            aria-label="Dismiss confirmation"
            onClick={() => setConfirmation(null)}
            className="bg-transparent text-text border-0 text-2xl leading-none cursor-pointer px-1 hover:text-accent"
          >
            ×
          </button>
        </div>
      )}

      {/* Hero grid. `md:grid-cols-[1.4fr_1fr]` uses an arbitrary value —
          Tailwind lets you drop any CSS value into brackets when the
          built-in scale doesn't fit. */}
      <div className="grid gap-8 mb-10 items-center grid-cols-1 md:grid-cols-[1.4fr_1fr]">
        <div>
          <p className="uppercase tracking-[0.14em] text-accent font-semibold text-sm mb-2">
            Welcome
          </p>
          <h1>Hi, I'm Bill Chen. This is my portfolio. Demo for COMP229 class.</h1>
          <p className="lead">
            I design and build fast, accessible web experiences that turn ideas into
            products people enjoy using. Take a look around — the tour starts on the
            About page.
          </p>

          <div className="flex flex-wrap gap-3 mt-5">
            <Link className="btn" to="/about">
              About Me
            </Link>
            <Link className="btn btn-secondary" to="/projects">
              See Projects
            </Link>
          </div>
        </div>

        {/* aria-hidden="true" tells screen readers to skip decorative content.
            The radial-gradient background isn't expressible as a single
            utility, so we use an arbitrary `bg-[...]` value. */}
        <div
          aria-hidden="true"
          className="flex items-center justify-center p-8 rounded-lg bg-[radial-gradient(circle_at_30%_30%,rgba(110,231,183,0.18),transparent_60%)]"
        >
          <Logo size={220} />
        </div>
      </div>

      {/* Mission card — the "card" component class from index.css, plus an
          accent-colored left border added via utilities. */}
      <div className="card border-l-4 border-l-accent">
        <h2>Mission Statement</h2>
        <p>
          To craft honest, useful software — clean code paired with clear thinking —
          and to leave every project, teammate, and codebase a little better than I
          found it.
        </p>
      </div>
    </section>
  );
}
