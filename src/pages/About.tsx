// -----------------------------------------------------------------------------
// About.tsx — the /about page.
// Author: Bill Chen
//
// Concepts introduced here:
//   • Importing an image as if it were a module. Vite (the build tool) rewrites
//     the import to the final asset URL and fingerprints it for cache-busting.
//     That's why we can plug the imported value straight into <img src={...}>.
//   • import.meta.env.BASE_URL — the deploy prefix (e.g. "/" locally,
//     "/react_portfolio_site_ts/" on GitHub Pages). Prepending it makes links
//     to files in /public work no matter where the site is hosted.
// -----------------------------------------------------------------------------
import headshotImage from '../assets/headshot.svg';
import './About.css';

export default function About() {
  return (
    <section className="about">
      <h1 className="section-title">About Me</h1>

      <div className="about-grid">
        {/* alt text is required for accessibility — describe what the image
            shows so screen-reader users get the same information. */}
        <img
          className="about-headshot"
          src={headshotImage}
          alt="Portrait of Bill Chen"
          width={280}
          height={280}
        />

        <div>
          <h2 className="about-name">Bill Chen</h2>
          <p className="about-tagline">Software developer · Web + mobile</p>

          <p>
            I'm a software developer who enjoys turning tricky problems into simple,
            polished user experiences. Over the past few years I've worked across the
            stack — building React front ends, Node services, and mobile apps — and
            picked up a deep appreciation for tests, thoughtful design, and shipping
            small.
          </p>

          <p>
            Outside of work I hike, read broadly, and volunteer teaching intro
            programming at the local library. I care about writing code that is kind
            to the next person who reads it.
          </p>

          {/*
            The résumé PDF lives under /public. Anything in /public is copied
            to the site root at build time (no import needed) — we just have
            to build the correct URL to it.

            `import.meta.env.BASE_URL` always ends with a slash, so simply
            concatenating "resume.pdf" produces "/resume.pdf" on Netlify and
            "/react_portfolio_site_ts/resume.pdf" on GitHub Pages.

            `target="_blank"` opens in a new tab; `rel="noopener noreferrer"`
            is a security best-practice for external tabs; `download` hints to
            the browser that this should be saved-as instead of previewed.
          */}
          <a
            className="btn"
            href={`${import.meta.env.BASE_URL}resume.pdf`}
            target="_blank"
            rel="noopener noreferrer"
            download
          >
            Download Résumé (PDF)
          </a>
        </div>
      </div>
    </section>
  );
}
