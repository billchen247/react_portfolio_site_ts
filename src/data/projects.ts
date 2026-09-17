// -----------------------------------------------------------------------------
// projects.ts — single source of truth for project data.
// Author: Bill Chen
//
// This file has no JSX and no React imports on purpose: it's just a typed
// array of plain objects. Both the /projects listing page and the
// /projects/:id detail page import from here, so adding a project or fixing
// a typo happens in exactly one place.
//
// The `.ts` extension (not `.tsx`) signals to TypeScript that there's no
// JSX inside. If you ever add a React element to this file, rename it to
// `.tsx` — otherwise the compiler will refuse to parse the angle brackets.
// -----------------------------------------------------------------------------
import projectDashboardImage from '../assets/project-dashboard.svg';
import projectMobileImage from '../assets/project-mobile.svg';
import projectApiImage from '../assets/project-api.svg';

// Shape of one project entry. Grouping the list-card fields (image, role,
// outcome) together with the detail-page fields (description, techStack,
// timeline) into one type means the listing and detail views can't get
// out of sync — both read from the same object.
export type Project = {
  id: string;
  title: string;
  image: string;
  imageAlt: string;
  role: string;
  outcome: string;
  // Detail-only fields:
  description: string[];
  techStack: string[];
  timeline: string;
  liveUrl?: string;
  repoUrl?: string;
};

export const PROJECTS: Project[] = [
  {
    id: 'insight-dashboard',
    title: 'Insight Analytics Dashboard',
    image: projectDashboardImage,
    imageAlt: 'Illustration of an analytics dashboard with charts',
    role: 'Lead front-end developer',
    outcome:
      'Delivered a real-time dashboard adopted by 40+ internal teams; cut report generation time from hours to under a minute.',
    description: [
      'Insight is an internal analytics dashboard used by data teams to explore product usage, funnels, and cohort retention without writing SQL.',
      'I led the front-end architecture: a virtualized data grid, a chart library wrapper, and a query builder driven by a JSON schema so new metrics can be added without a code change.',
      'The biggest win was cutting the p95 render time for a 10k-row cohort report from 4.8s to 380ms by moving the aggregation off the main thread and streaming rows as they arrived.'
    ],
    techStack: ['React', 'TypeScript', 'Recharts', 'Web Workers', 'Vite', 'Vitest'],
    timeline: 'Jan 2024 – Nov 2024'
  },
  {
    id: 'trailtracker',
    title: 'TrailTracker Mobile App',
    image: projectMobileImage,
    imageAlt: 'Illustration of a phone showing a trail map',
    role: 'React Native developer',
    outcome:
      'Shipped an offline-first hiking companion to iOS and Android with 4.8-star ratings and 15k+ downloads in the first quarter.',
    description: [
      'TrailTracker is an offline-first mobile app for hikers: download a park, get turn-by-turn trail guidance, and log elevation profiles with no cell signal.',
      'I built the offline sync layer (SQLite + a delta-based tile fetcher), the map rendering pipeline (MapLibre with a custom tile server), and the trip-planning UI.',
      'Post-launch we measured a 62% week-1 retention on iOS thanks to a background heuristic that pre-downloads maps for the user\'s next weekend when they\'re on wifi.'
    ],
    techStack: ['React Native', 'TypeScript', 'SQLite', 'MapLibre', 'Expo'],
    timeline: 'Feb 2023 – Jul 2023'
  },
  {
    id: 'orderflow-api',
    title: 'OrderFlow API Platform',
    image: projectApiImage,
    imageAlt: 'Illustration of API endpoints and data flow',
    role: 'Backend engineer',
    outcome:
      'Designed a Node/Express service handling 2M+ orders/day; reduced p95 latency by 62% through query and cache redesign.',
    description: [
      'OrderFlow is the order-management API behind a mid-size e-commerce platform. It fans out to inventory, payments, and shipping services and enforces the store\'s idempotency + retry semantics.',
      'I inherited a service pinned by a single hot Postgres query. Splitting reads into a Redis materialized-view cache with a change-data-capture invalidation loop dropped p95 from 480ms to 180ms.',
      'The service also grew a small SDK that internal teams use to publish and consume order-events without touching the underlying queue.'
    ],
    techStack: ['Node.js', 'Express', 'PostgreSQL', 'Redis', 'Kafka', 'OpenTelemetry'],
    timeline: 'Aug 2022 – Dec 2023'
  }
];
