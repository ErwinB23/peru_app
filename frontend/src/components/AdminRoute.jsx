import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
    const { user, token } = useContext(AuthContext);

    if (!token) {
        return <Navigate to="/" replace />;
    }

    if (user?.rol !== 'admin') {
        return <Navigate to="/home" replace />;
    }

    return children;
};

export default AdminRoute;