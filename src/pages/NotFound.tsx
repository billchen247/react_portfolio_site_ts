import { Link } from 'react-router-dom';
import './NotFound.css';

export default function NotFound() {
  return (
    <section className="not-found" aria-labelledby="not-found-title">
      <p className="not-found__code">404</p>
      <h1 id="not-found-title">React Component/Page not found</h1>
      <p className="not-found__message">
        The page you are looking for does not exist or may have moved.
      </p>
      <Link className="btn" to="/">
        Return home
      </Link>
    </section>
  );
}