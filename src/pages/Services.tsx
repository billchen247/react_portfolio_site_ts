// -----------------------------------------------------------------------------
// Services.tsx — the /services page.
// Author: Bill Chen
//
// Structurally almost identical to Projects.tsx: a constant array of objects
// mapped to card elements. The takeaway is that this list-of-cards pattern
// scales to almost any "gallery" page in a small site.
// -----------------------------------------------------------------------------
import serviceProgrammingImage from '../assets/service-programming.svg';
import serviceWebImage from '../assets/service-web.svg';
import serviceMobileImage from '../assets/service-mobile.svg';
import './Services.css';

// Shape of one service card.
type Service = {
  id: string;
  title: string;
  image: string;
  imageAlt: string;
  description: string;
};

// Add a service by adding a new object with an imported image and short description.
const SERVICES: Service[] = [
  {
    id: 'programming',
    title: 'Programming',
    image: serviceProgrammingImage,
    imageAlt: 'Illustration of code brackets',
    description:
      'Clean, well-tested code across JavaScript, TypeScript, Python, and Go. Refactors, features, and one-off tools.'
  },
  {
    id: 'web',
    title: 'Web Development',
    image: serviceWebImage,
    imageAlt: 'Illustration of a browser window',
    description:
      'Modern, accessible sites with React, Vite, and Node. Marketing pages, dashboards, and full-stack apps.'
  },
  {
    id: 'mobile',
    title: 'Mobile Development',
    image: serviceMobileImage,
    imageAlt: 'Illustration of a smartphone',
    description:
      'Cross-platform mobile apps with React Native and native modules where it matters. iOS + Android delivery.'
  }
];

export default function Services() {
  return (
    <section className="services">
      <h1 className="section-title">Services</h1>
      <p className="lead">Areas I take on for freelance and contract work.</p>

      <div className="grid grid-3 services-grid">
        {/* Same list-render pattern as Projects: `SERVICES.map(...)` returns
            one <article> per service, keyed by a stable `id`. */}
        {SERVICES.map((service) => (
          <article key={service.id} className="card service-card">
            <img
              className="service-image"
              src={service.image}
              alt={service.imageAlt}
              loading="lazy"
            />
            <h3 className="service-title">{service.title}</h3>
            <p>{service.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
