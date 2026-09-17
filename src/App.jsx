// -----------------------------------------------------------------------------
// App.jsx — the top-level "shell" component.
// Author: Bill Chen
//
// This is the single React component that main.jsx renders. It defines the
// layout that surrounds every page (Navbar on top, Footer on the bottom) and
// tells react-router which page component to show for each URL path.
// -----------------------------------------------------------------------------

// <Routes> is a container. <Route> maps a URL path to a component.
// Only the <Route> whose `path` matches the current URL is rendered.
import { Routes, Route } from 'react-router-dom';

// Component imports use relative paths. The `./components/` prefix means
// "look in the components folder next to this file." The `.jsx` extension
// is optional in Vite but including it is explicit and IDE-friendly.
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';

// Each "page" is just a plain React component — nothing special makes it a
// page except that we mount it inside a <Route>.
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Projects from './pages/Projects.jsx';
import Education from './pages/Education.jsx';
import Services from './pages/Services.jsx';
import Contact from './pages/Contact.jsx';

// Importing a CSS file for its side-effect: Vite bundles it and injects it
// into the page. There's no variable to import — just the URL.
import './styles/App.css';

// A React "function component" is any JavaScript function whose name starts
// with a capital letter and returns JSX. `export default` makes it the
// primary export so other files can do `import App from './App.jsx'`.
export default function App() {
  return (
    // JSX must return a single parent element. We use a <div> here, but
    // <> </> (a "fragment") also works when you don't want an extra wrapper.
    <div className="app-shell">
      <Navbar />

      {/* <main> is the semantic HTML tag for the page's primary content.
          Screen readers use it to skip past the nav straight to the content. */}
      <main className="page">
        <Routes>
          {/* Each <Route> is "if URL is X, render this component."
              Order does not matter — react-router picks the best match. */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/education" element={<Education />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />

          {/* The wildcard "*" is the catch-all. Any URL that didn't match
              a route above (e.g. /foo/bar) falls through to Home so the
              site stays usable instead of showing a blank page. */}
          <Route path="*" element={<Home />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}
