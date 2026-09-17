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
import './Home.css';

// Shape of the router state sent by the Contact form after submission.
type ContactRedirectState = {
  justSubmitted?: boolean;
  firstName?: string;
};

// Shape of the local "message sent" banner state we keep on Home.
type Confirmation = {
  firstName: string;
};

export default function Home() {
  // Router hooks. `location` re-runs the component when the URL changes;
  // `navigate` is the function-form equivalent of clicking a <Link>.
  const location = useLocation();
  const navigate = useNavigate();

  // Local UI state for the "message sent" banner. We keep our OWN copy so the
  // banner survives even after we wipe the router state — otherwise pressing
  // browser Refresh on Home would re-show the banner from stale history.
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);

  // useEffect(fn, [deps]) → run `fn` after render whenever any dep changes.
  // Here: when we arrive at Home from the Contact form, `location.state`
  // includes `justSubmitted: true`. We copy the interesting bit into our own
  // state, then call navigate(..., { replace: true }) to clear the router
  // state so a refresh won't trigger this again.
  useEffect(() => {
    // `location.state` is typed as `unknown` by react-router, so we narrow
    // it to the expected shape before reading fields.
    const state = location.state as ContactRedirectState | null;
    if (state?.justSubmitted) {
      setConfirmation({ firstName: state.firstName || '' });
      navigate('/', { replace: true, state: null });
    }
  }, [location.state, navigate]);

  return (
    <section className="home">
      {/* Show the banner ONLY when `confirmation` is truthy. The `&&`
          short-circuits: if `confirmation` is null, React renders nothing. */}
      {confirmation && (
        <div className="confirmation-banner" role="status" aria-live="polite">
          <span>
            {/* Ternary inside JSX: include ", firstName" only when we have one. */}
            Thanks{confirmation.firstName ? `, ${confirmation.firstName}` : ''} — your
            message was received. I'll get back to you shortly.
          </span>
          <button
            type="button"
            className="confirmation-close"
            aria-label="Dismiss confirmation"
            // Inline arrow function is fine for one-off handlers. For hot
            // paths you'd extract it to avoid re-creating on every render.
            onClick={() => setConfirmation(null)}
          >
            ×
          </button>
        </div>
      )}

      <div className="home-hero">
        <div className="home-hero-copy">
          <p className="eyebrow">Welcome</p>
          <h1>Hi, I'm Bill Chen.</h1>
          <p className="lead">
            I design and build fast, accessible web experiences that turn ideas into
            products people enjoy using. Take a look around — the tour starts on the
            About page.
          </p>

          <div className="home-cta-row">
            {/* <Link> is the react-router replacement for <a>. It updates the
                URL and swaps in the new page WITHOUT a full page reload. */}
            <Link className="btn" to="/about">
              About Me
            </Link>
            <Link className="btn secondary" to="/projects">
              See Projects
            </Link>
          </div>
        </div>

        {/* aria-hidden="true" tells screen readers to skip decorative content. */}
        <div className="home-hero-art" aria-hidden="true">
          <Logo size={220} />
        </div>
      </div>

      <div className="card mission">
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
