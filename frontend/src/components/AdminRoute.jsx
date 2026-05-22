import { Navigate } from 'react-router-dom';

/**
 * Protected route — only allows users with role === 'admin'
 * Redirects to /admin/login if not authenticated as admin
 */
const AdminRoute = ({ children }) => {
  const currentUser = JSON.parse(localStorage.getItem('tinclo_current_user') || 'null');
  const isAdmin = currentUser?.role === 'admin' || localStorage.getItem('tinclo_admin_session') === 'true';

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default AdminRoute;
