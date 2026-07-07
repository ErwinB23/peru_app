import { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import logoBandera from '../assets/ImagenLogin/logoBanderita.png';
import '../styles/Sidebar.css';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path) => {
    navigate(path);
    onClose();
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        {/* Header del sidebar */}
        <div className="sidebar-header">
          <button className="sidebar-close" onClick={onClose} title="Cerrar menú">
            ×
          </button>

          <div className="sidebar-brand">
            <div className="sidebar-brand-logo">
              <img src={logoBandera} alt="Logo Perú App" />
            </div>

            <div>
              <h3>Perú App</h3>
              <p>Panel de navegación</p>
            </div>
          </div>

          <div className="sidebar-user">
            <div className="sidebar-avatar">
              {user?.nombres?.charAt(0)?.toUpperCase() || 'U'}
            </div>

            <div className="sidebar-user-info">
              <h4>{user?.nombres} {user?.apellidos}</h4>
              <span className={`sidebar-badge ${user?.rol}`}>
                {user?.rol === 'admin' ? 'Administrador' : 'Usuario'}
              </span>
            </div>
          </div>
        </div>

        {/* Menú de opciones */}
        <nav className="sidebar-nav">
          <div className="sidebar-section-title">Navegación principal</div>

          <button
            className={`sidebar-item ${isActive('/home') ? 'active' : ''}`}
            onClick={() => handleNavigation('/home')}
          >
            <span className="sidebar-icon">🏠</span>
            <span>Inicio</span>
          </button>

          <button
            className={`sidebar-item ${isActive('/departamentos') ? 'active' : ''}`}
            onClick={() => handleNavigation('/departamentos')}
          >
            <span className="sidebar-icon">🗺️</span>
            <span>Departamentos</span>
          </button>

          <button
            className={`sidebar-item ${isActive('/explorar-provincias') ? 'active' : ''}`}
            onClick={() => handleNavigation('/explorar-provincias')}
          >
            <span className="sidebar-icon">🏞️</span>
            <span>Provincias</span>
          </button>

          <button
            className={`sidebar-item ${isActive('/explorar-distritos') ? 'active' : ''}`}
            onClick={() => handleNavigation('/explorar-distritos')}
          >
            <span className="sidebar-icon">🏘️</span>
            <span>Distritos</span>
          </button>

          <button
            className={`sidebar-item ${isActive('/explorar-ciudades') ? 'active' : ''}`}
            onClick={() => handleNavigation('/explorar-ciudades')}
          >
            <span className="sidebar-icon">🏙️</span>
            <span>Ciudades</span>
          </button>

          <div className="sidebar-section-title">Cuenta</div>

          <button
            className={`sidebar-item ${isActive('/perfil') ? 'active' : ''}`}
            onClick={() => handleNavigation('/perfil')}
          >
            <span className="sidebar-icon">👤</span>
            <span>Mi Perfil</span>
          </button>

          <button
            className={`sidebar-item ${isActive('/configuracion') ? 'active' : ''}`}
            onClick={() => handleNavigation('/configuracion')}
          >
            <span className="sidebar-icon">⚙️</span>
            <span>Configuración</span>
          </button>

          {/* Solo para administradores */}
          {user?.rol === 'admin' && (
            <>
              <div className="sidebar-section-title">Administración</div>

              

              <button
                className={`sidebar-item ${isActive('/lista-usuarios') ? 'active' : ''}`}
                onClick={() => handleNavigation('/lista-usuarios')}
              >
                <span className="sidebar-icon">👥</span>
                <span>Lista de usuarios</span>
              </button>
            </>
          )}

          {/* Cerrar Sesión */}
          <div className="sidebar-logout-area">
            <button className="sidebar-item logout" onClick={handleLogout}>
              <span className="sidebar-icon">🚪</span>
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;