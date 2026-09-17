// -----------------------------------------------------------------------------
// AboutHero.tsx — the headshot + intro block at the top of /about.
// Author: Bill Chen
//
// Concepts introduced here:
//   • Extracting a page section into its own component. The About page used
//     to hold this JSX inline; pulling it out makes About.tsx a short
//     "layout" file that composes children, and makes this block reusable
//     (or replaceable) on its own.
//   • Static component with no props. Not every component needs props — if
//     the content is fixed for the page, a bare function component is fine.
//     When we later want to pass in name/tagline/photo, we would add a
//     typed props parameter (see SkillsList.tsx / TechStack.tsx for that).
// -----------------------------------------------------------------------------
import headshotImage from '../../assets/headshot.svg';
import ResumeDownloadButton from '../ResumeDownloadButton';
import './AboutHero.css';

export default function AboutHero() {
  return (
    <div className="about-hero">
      {/* alt text is required for accessibility — describe what the image
          shows so screen-reader users get the same information. */}
      <img
        className="about-hero-headshot"
        src={headshotImage}
        alt="Portrait of Bill Chen"
        width={280}
        height={280}
      />

      <div className="about-hero-body">
        <h2 className="about-hero-name">Bill Chen</h2>
        <p className="about-hero-tagline">Software developer · Web + mobile</p>

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

        {/* The résumé PDF lives under /public. The button component handles
            the BASE_URL prefix, target/rel/download attributes, and the
            default label — a single element on this page. */}
        <ResumeDownloadButton />
      </div>
    </div>
  );
}
