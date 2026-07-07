import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

// Componente para proteger rutas
// Si el usuario NO está autenticado, lo redirige a /
const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  // Mientras carga, mostramos un mensaje
  if (loading) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '50px',
        fontSize: '18px',
        color: '#666'
      }}>
        Cargando...
      </div>
    );
  }

  // Si hay usuario autenticado, muestra el contenido
  // Si no, redirige a la página principal
  return user ? children : <Navigate to="/" />;
};

export default PrivateRoute;