import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../components/AppHeader';
import '../styles/Departamentos.css';
import { getDepartamentos } from '../services/departamentoService';
import { AuthContext } from '../context/AuthContext';


const Departamentos = () => {
    const navigate = useNavigate();
    const wheelRef = useRef(null);
    const { user } = useContext(AuthContext);

    const [departamentos, setDepartamentos] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [slideDirection, setSlideDirection] = useState('next');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const cargarDepartamentos = async () => {
        try {
            setLoading(true);
            setError('');

            const data = await getDepartamentos();

            if (Array.isArray(data)) {
                setDepartamentos(data);
            } else if (Array.isArray(data.departamentos)) {
                setDepartamentos(data.departamentos);
            } else {
                setDepartamentos([]);
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Error al cargar departamentos');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarDepartamentos();
    }, []);

    const currentDepartamento = departamentos[currentIndex];

    const nextDepartamento = () => {
        if (departamentos.length === 0) return;

        setSlideDirection('next');

        setCurrentIndex((prev) =>
            prev === departamentos.length - 1 ? 0 : prev + 1
        );
    };

    const prevDepartamento = () => {
        if (departamentos.length === 0) return;

        setSlideDirection('prev');

        setCurrentIndex((prev) =>
            prev === 0 ? departamentos.length - 1 : prev - 1
        );
    };

    useEffect(() => {
        const element = wheelRef.current;

        if (!element || departamentos.length <= 1) return;

        let locked = false;

        const handleWheel = (e) => {
            e.preventDefault();
            e.stopPropagation();

            if (locked) return;

            locked = true;

            if (e.deltaY > 0) {
                setSlideDirection('next');

                setCurrentIndex((prev) =>
                    prev === departamentos.length - 1 ? 0 : prev + 1
                );
            } else {
                setSlideDirection('prev');

                setCurrentIndex((prev) =>
                    prev === 0 ? departamentos.length - 1 : prev - 1
                );
            }

            setTimeout(() => {
                locked = false;
            }, 650);
        };

        element.addEventListener('wheel', handleWheel, { passive: false });

        return () => {
            element.removeEventListener('wheel', handleWheel);
        };
    }, [departamentos.length]);

    const getBackendImageUrl = (path) => {
        if (!path) return '';

        if (path.startsWith('http')) {
            return path;
        }

        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const backendUrl = baseUrl.replace('/api', '');

        return `${backendUrl}${path}`;
    };

    const getDepartamentoImage = (departamento) => {
        return getBackendImageUrl(
            departamento?.imagen_fondo ||
            departamento?.imagen_url ||
            departamento?.imagen ||
            ''
        );
    };

    const backgroundImage = useMemo(() => {
        const image = getDepartamentoImage(currentDepartamento);

        if (image) {
            return `
        linear-gradient(90deg, rgba(0,0,0,0.74) 0%, rgba(0,0,0,0.48) 42%, rgba(0,0,0,0.24) 100%),
        url(${image})`;
        }

        return `
        radial-gradient(circle at 78% 22%, rgba(255, 209, 102, 0.28), transparent 28%),
        radial-gradient(circle at 18% 82%, rgba(16, 111, 142, 0.35), transparent 35%),
        linear-gradient(135deg, #111827 0%, #9f1025 48%, #106f8e 100%)`;
    }, [currentDepartamento]);

    const formatNumber = (value) => {
        if (value === null || value === undefined || value === '') {
            return 'No registrado';
        }

        const number = Number(value);

        if (Number.isNaN(number)) {
            return value;
        }

        return number.toLocaleString('es-PE');
    };

    const truncateText = (text, maxLength = 230) => {
        if (!text) return 'Sin descripción registrada para este departamento.';

        if (text.length <= maxLength) return text;

        return `${text.substring(0, maxLength).trim()}...`;
    };

    const getVisibleCards = () => {
        if (departamentos.length <= 1) return [];

        return departamentos.filter((_, index) => index !== currentIndex);
    };

    const irADetalleDepartamento = () => {
        if (!currentDepartamento?.id) return;
        navigate(`/departamentos/${currentDepartamento.id}`);
    };

    const irAGestionarDepartamentos = () => {
        navigate('/gestionar-departamentos');
    };



    if (loading) {
        return (
            <div className="departamentos-page">
                <AppHeader />

                <main className="departamentos-loading-screen">
                    <div className="departamentos-loader"></div>
                    <p>Cargando departamentos...</p>
                </main>
            </div>
        );
    }

    if (error) {
        return (
            <div className="departamentos-page">
                <AppHeader />

                <main className="departamentos-error-screen">
                    <span>⚠️</span>
                    <h2>No se pudieron cargar los departamentos</h2>
                    <p>{error}</p>

                    <button type="button" onClick={cargarDepartamentos}>
                        Reintentar
                    </button>
                </main>
            </div>
        );
    }

    if (!currentDepartamento) {
        return (
            <div className="departamentos-page">
                <AppHeader />

                <main className="departamentos-empty-screen">
                    <span>📌</span>
                    <h2>No hay departamentos registrados</h2>
                    <p>
                        Cuando agregues departamentos desde el backend o el panel administrador,
                        aparecerán en esta pantalla.
                    </p>

                    <div className="departamentos-top-actions">
                        <button
                            type="button"
                            className="departamentos-back"
                            onClick={() => navigate('/home')}
                        >
                            ← Volver al inicio
                        </button>

                        {user?.rol === 'admin' && (
                            <button
                                type="button"
                                className="departamentos-admin-btn"
                                onClick={irAGestionarDepartamentos}
                            >
                                Gestionar departamentos
                            </button>
                        )}
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="departamentos-page">
            <AppHeader />

            <main
                ref={wheelRef}
                className={`departamentos-showcase changing-${currentIndex}`}
                style={{ backgroundImage }}
            >
                <div className="departamentos-overlay"></div>

                <section className="departamentos-showcase-content">
                    <div className="departamentos-left">
                        <div className="departamentos-top-actions">
                            <button
                                type="button"
                                className="departamentos-back"
                                onClick={() => navigate('/home')}
                            >
                                ← Volver al inicio
                            </button>

                            {user?.rol === 'admin' && (
                                <button
                                    type="button"
                                    className="departamentos-admin-btn"
                                    onClick={irAGestionarDepartamentos}
                                >
                                    Gestionar departamentos
                                </button>
                            )}
                        </div>

                        <div className="departamentos-location">
                            <span></span>
                            <p>
                                {currentDepartamento.region_natural || 'Región no registrada'} - Perú
                            </p>
                        </div>

                        <h1>{currentDepartamento.nombre}</h1>

                        <p className="departamentos-description">
                            {truncateText(currentDepartamento.descripcion)}
                        </p>

                        <div className="departamentos-main-actions">
                            <span className="departamento-action-icon">
                                ▣
                            </span>

                            <button
                                type="button"
                                className="btn-primary-departamento"
                                onClick={irADetalleDepartamento}
                            >
                                Ver departamento
                            </button>
                        </div>

                        <div className="departamentos-details">
                            <div>
                                <span>Capital</span>
                                <strong>{currentDepartamento.capital || 'No registrada'}</strong>
                            </div>

                            <div>
                                <span>Área</span>
                                <strong>{formatNumber(currentDepartamento.area_km2)} km²</strong>
                            </div>

                            <div>
                                <span>Población</span>
                                <strong>{formatNumber(currentDepartamento.poblacion_aprox)}</strong>
                            </div>

                            <div>
                                <span>Clima</span>
                                <strong>{currentDepartamento.clima_predominante || 'No registrado'}</strong>
                            </div>
                        </div>
                    </div>

                    <div className="departamentos-right">
                        <div
                            key={`cards-${currentIndex}-${slideDirection}`}
                            className={`departamentos-cards-track ${
                                slideDirection === 'next' ? 'cards-next' : 'cards-prev'
                            }`}
                        >
                            {getVisibleCards().map((departamento) => {
                                const cardImage = getDepartamentoImage(departamento);

                                return (
                                    <button
                                        type="button"
                                        key={departamento.id}
                                        className="departamento-preview-card"
                                        onClick={() => {
                                            const index = departamentos.findIndex(
                                                (item) => item.id === departamento.id
                                            );

                                            if (index !== -1) {
                                                setSlideDirection(index > currentIndex ? 'next' : 'prev');
                                                setCurrentIndex(index);
                                            }
                                        }}
                                    >
                                        <div
                                            className="departamento-preview-bg"
                                            style={
                                                cardImage
                                                    ? {
                                                        backgroundImage: `
                                                            linear-gradient(180deg, rgba(0,0,0,0.12), rgba(0,0,0,0.72)),
                                                            url(${cardImage})
                                                        `
                                                    }
                                                    : undefined
                                            }
                                        ></div>

                                        <div className="departamento-preview-content">
                                            <span></span>

                                            <small>
                                                {departamento.region_natural || 'Perú'}
                                            </small>

                                            <strong>{departamento.nombre}</strong>

                                            <p>{departamento.capital || 'Capital no registrada'}</p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        <div className="departamentos-controls">
                            <button type="button" onClick={prevDepartamento}>
                                ‹
                            </button>

                            <button type="button" onClick={nextDepartamento}>
                                ›
                            </button>

                            <div className="departamentos-progress">
                                <span
                                    style={{
                                        width: `${((currentIndex + 1) / departamentos.length) * 100}%`
                                    }}
                                ></span>
                            </div>

                            <strong>
                                {String(currentIndex + 1).padStart(2, '0')}
                            </strong>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Departamentos;