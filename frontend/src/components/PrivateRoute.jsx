import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function PrivateRoute() {
  const { user, loading } = useAuth();

  if (loading) return <div className="loader"></div>;

  return user ? <Outlet /> : <Navigate to="/login" replace />;
}

export default PrivateRoute;
