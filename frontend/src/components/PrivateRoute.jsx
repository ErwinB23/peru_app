import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const LoadingSession = () => (
  <div
    style={{
      textAlign: 'center',
      padding: '50px',
      fontSize: '18px',
      color: '#666'
    }}
  >
    Validando sesión...
  </div>
);

const PrivateRoute = ({ children }) => {
  const { user, token, loading } = useContext(AuthContext);

  if (loading) {
    return <LoadingSession />;
  }

  return user && token ? children : <Navigate to="/" replace />;
};

export default PrivateRoute;
