import { Link } from 'react-router-dom';

export default function NotFound() {
  return <section className="state-page"><span className="eyebrow">404</span><h1>Page not found.</h1><p>The requested hospital workspace could not be found.</p><Link className="primary-action inline-action" to="/">Return to workspace</Link></section>;
}
