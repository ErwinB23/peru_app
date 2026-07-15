import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { user, token, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>
        Validando permisos...
      </div>
    );
  }

  if (!user || !token) {
    return <Navigate to="/" replace />;
  }

  if (user.rol !== 'admin') {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default AdminRoute;
