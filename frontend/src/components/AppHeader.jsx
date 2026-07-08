import { useContext, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Compass, BarChart3, MapPinned } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import UserDropdown from './UserDropdown';
import Sidebar from './Sidebar';
import logoBandera from '../assets/ImagenLogin/logoBanderita.png';
import '../styles/AppHeader.css';

const AppHeader = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const [sidebarOpen, setSidebarOpen] = useState(false);

    const irAHome = () => {
        navigate('/home');
    };

    const irASeccionHome = (sectionId) => {
        if (location.pathname === '/home') {
            document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
        } else {
            navigate('/home', { state: { scrollTo: sectionId } });
        }
    };

    const irADepartamentos = () => {
        navigate('/departamentos');
    };

    return (
        <>
            {/* ==================== HEADER ROJO ==================== */}
            <header className="home-header">
                <div className="header-content">
                    <div className="header-left" onClick={irAHome}>
                        <div className="logo-bandera">
                            <img src={logoBandera} alt="Logo Perú App" />
                        </div>

                        <div className="header-text">
                            <p className="header-greeting">
                                ¡Hola, {user?.nombres || 'bienvenido'}!
                            </p>
                            <p className="header-title">Perú en tus manos</p>
                        </div>
                    </div>

                    <nav className="header-nav">
                        <button type="button" onClick={irAHome}>
                            <Home size={17} strokeWidth={2.4} />
                            Inicio
                        </button>

                        <button type="button" onClick={() => irASeccionHome('sobre-nosotros')}>
                            <Compass size={17} strokeWidth={2.4} />
                            Explorar
                        </button>

                        <button type="button" onClick={() => irASeccionHome('estadisticas')}>
                            <BarChart3 size={17} strokeWidth={2.4} />
                            Estadísticas
                        </button>

                        <button type="button" onClick={irADepartamentos}>
                            <MapPinned size={17} strokeWidth={2.4} />
                            Departamentos
                        </button>
                    </nav>

                    <UserDropdown onAvatarClick={() => setSidebarOpen(true)} />
                </div>
            </header>

            {/* Sidebar */}
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        </>
    );
};

export default AppHeader;