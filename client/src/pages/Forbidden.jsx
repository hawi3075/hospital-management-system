import { Link } from 'react-router-dom';

export default function Forbidden() {
  return <section className="state-page"><span className="eyebrow">Access denied</span><h1>That workspace is restricted.</h1><p>Your account does not have permission to open this area.</p><Link className="primary-action inline-action" to="/">Return to workspace</Link></section>;
}
