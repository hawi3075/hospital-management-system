import { Navigate, Outlet, useLocation, useParams } from 'react-router-dom';
import { normalizeRole } from './roleConfig';

export default function ProtectedRoute({ allowedRoles }) {
  const location = useLocation();
  const { role: requestedRole } = useParams();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const currentRole = normalizeRole(user.role);
  if (allowedRoles && !allowedRoles.includes(currentRole)) {
    return <Navigate to="/403" replace />;
  }

  if (requestedRole && requestedRole.toUpperCase() !== currentRole.toUpperCase()) return <Navigate to="/403" replace />;

  return <Outlet />;
}
