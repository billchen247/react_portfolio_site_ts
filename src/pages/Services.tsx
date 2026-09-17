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

type Service = {
  id: string;
  title: string;
  image: string;
  imageAlt: string;
  description: string;
};

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
    <section>
      <h1 className="section-title">Services</h1>
      <p className="lead">Areas I take on for freelance and contract work.</p>

      {/* One-column stack below md, three columns above. `md:grid-cols-3`
          is the responsive form of `grid-cols-3`. */}
      <div className="grid gap-5 mt-6 grid-cols-1 md:grid-cols-3">
        {SERVICES.map((service) => (
          <article
            key={service.id}
            className="card flex flex-col items-center text-center gap-1"
          >
            <img
              className="w-24 h-24 my-2"
              src={service.image}
              alt={service.imageAlt}
              loading="lazy"
            />
            <h3 className="mb-1">{service.title}</h3>
            <p>{service.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
