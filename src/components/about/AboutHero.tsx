// -----------------------------------------------------------------------------
// AboutHero.tsx — the headshot + intro block at the top of /about.
// Author: Bill Chen
// -----------------------------------------------------------------------------
import headshotImage from '../../assets/headshot.svg';
import ResumeDownloadButton from '../ResumeDownloadButton';

export default function AboutHero() {
  return (
    // Two columns above md (fixed 280px headshot + fluid text); single column
    // below md, with the headshot cap-widthed so it doesn't fill the screen.
    <div className="grid gap-8 items-start grid-cols-1 md:grid-cols-[280px_1fr]">
      <img
        src={headshotImage}
        alt="Portrait of Bill Chen"
        width={280}
        height={280}
        className="w-full max-w-[280px] h-auto md:w-[280px] md:h-[280px] object-cover rounded-lg bg-surface-2 border border-border shadow-md"
      />

      <div className="grid gap-3">
        <h2 className="mb-0">Bill Chen</h2>
        <p className="text-accent font-medium m-0">Software developer · Web + mobile</p>

        <p className="m-0 leading-relaxed">
          I'm a software developer who enjoys turning tricky problems into simple,
          polished user experiences. Over the past few years I've worked across the
          stack — building React front ends, Node services, and mobile apps — and
          picked up a deep appreciation for tests, thoughtful design, and shipping
          small.
        </p>

        <p className="m-0 leading-relaxed">
          Outside of work I hike, read broadly, and volunteer teaching intro
          programming at the local library. I care about writing code that is kind
          to the next person who reads it.
        </p>

        {/* `justify-self-start` on the button wrapper keeps it from
            stretching to fill the grid cell. */}
        <div className="justify-self-start mt-2">
          <ResumeDownloadButton />
        </div>
      </div>
    </div>
  );
}
