import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function AdminRoute() {
  const { user, loading } = useAuth();

  if (loading) return <div className="loader"></div>;

  return user && user.role === 'ADMIN' ? <Outlet /> : <Navigate to="/" replace />;
}

export default AdminRoute;
