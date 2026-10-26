import { Link } from 'react-router-dom';

export function Brand() {
  return <Link to="/dashboard" className="brand-lockup" aria-label="HomeConcept SalesBrief dashboard">
    <span className="brand-mark" aria-hidden="true"><span /><i /></span>
    <span className="brand-wordmark"><strong>homeconcept</strong><small>SALESBRIEF</small></span>
  </Link>;
}
