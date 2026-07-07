import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../components/AppHeader';
import { AuthContext } from '../context/AuthContext';
import { getDepartamentos } from '../services/departamentoService';
import '../styles/ExplorarProvincias.css';

const ExplorarDistritos = () => {
    const navigate = useNavigate();
    const wheelRef = useRef(null);
    const wheelLockRef = useRef(false);

    const { user } = useContext(AuthContext);
    const isAdmin = user?.rol === 'admin';

    const [departamentos, setDepartamentos] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [slideDirection, setSlideDirection] = useState('next');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const getBackendImageUrl = (path) => {
        if (!path) return '';
        if (path.startsWith('http')) return path;

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

    const formatNumber = (value) => {
        if (value === null || value === undefined || value === '') return 'No registrado';

        const number = Number(value);
        if (Number.isNaN(number)) return value;

        return number.toLocaleString('es-PE');
    };

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

    const backgroundImage = useMemo(() => {
        const image = getDepartamentoImage(currentDepartamento);

        if (image) {
            return `
                linear-gradient(90deg, rgba(0,0,0,0.74) 0%, rgba(0,0,0,0.42) 48%, rgba(0,0,0,0.18) 100%),
                url(${image})
            `;
        }

        return `
            radial-gradient(circle at 78% 22%, rgba(255, 209, 102, 0.25), transparent 28%),
            radial-gradient(circle at 18% 82%, rgba(16, 111, 142, 0.34), transparent 35%),
            linear-gradient(135deg, #111827 0%, #9f1025 48%, #106f8e 100%)
        `;
    }, [currentDepartamento]);

    const getVisibleCards = () => {
        if (departamentos.length <= 1) return [];
        return departamentos.filter((_, index) => index !== currentIndex);
    };

    const nextDepartamento = () => {
        if (departamentos.length === 0) return;

        setSlideDirection('next');
        setCurrentIndex((prev) => prev === departamentos.length - 1 ? 0 : prev + 1);
    };

    const prevDepartamento = () => {
        if (departamentos.length === 0) return;

        setSlideDirection('prev');
        setCurrentIndex((prev) => prev === 0 ? departamentos.length - 1 : prev - 1);
    };

    const irADistritos = () => {
        if (!currentDepartamento?.id) return;
        navigate(`/departamentos/${currentDepartamento.id}/distritos`);
    };

    useEffect(() => {
        const element = wheelRef.current;

        if (!element || departamentos.length <= 1) return;

        const handleWheel = (e) => {
            e.preventDefault();

            if (wheelLockRef.current) return;

            wheelLockRef.current = true;

            if (e.deltaY > 0) {
                setSlideDirection('next');
                setCurrentIndex((prev) => prev === departamentos.length - 1 ? 0 : prev + 1);
            } else {
                setSlideDirection('prev');
                setCurrentIndex((prev) => prev === 0 ? departamentos.length - 1 : prev - 1);
            }

            setTimeout(() => {
                wheelLockRef.current = false;
            }, 650);
        };

        element.addEventListener('wheel', handleWheel, { passive: false });

        return () => {
            element.removeEventListener('wheel', handleWheel);
        };
    }, [departamentos.length]);

    if (loading) {
        return (
            <div className="explorar-prov-page">
                <AppHeader />
                <main className="explorar-prov-state">
                    <div className="explorar-prov-loader"></div>
                    <p>Cargando departamentos...</p>
                </main>
            </div>
        );
    }

    if (error || !currentDepartamento) {
        return (
            <div className="explorar-prov-page">
                <AppHeader />
                <main className="explorar-prov-state">
                    <span>⚠️</span>
                    <h2>No se pudieron cargar los departamentos</h2>
                    <p>{error || 'No hay departamentos registrados'}</p>
                    <button type="button" onClick={() => navigate('/home')}>
                        Volver al inicio
                    </button>
                </main>
            </div>
        );
    }

    return (
        <div className="explorar-prov-page">
            <AppHeader />

            <main
                ref={wheelRef}
                className="explorar-prov-showcase"
                style={{ backgroundImage }}
            >
                <div className="explorar-prov-overlay"></div>

                <section className="explorar-prov-content">
                    <div className="explorar-prov-left">
                        <div className="explorar-prov-top-actions">
                            <button
                                type="button"
                                className="explorar-prov-back"
                                onClick={() => navigate('/home')}
                            >
                                ← Volver al inicio
                            </button>

                            {isAdmin && (
                                <button
                                    type="button"
                                    className="explorar-prov-admin-btn"
                                    onClick={() => navigate('/gestionar-distritos')}
                                >
                                    Gestionar distritos
                                </button>
                            )}
                        </div>

                        <div className="explorar-prov-location">
                            <span></span>
                            <p>Explorar distritos por departamento</p>
                        </div>

                        <h1>{currentDepartamento.nombre}</h1>

                        <p className="explorar-prov-description">
                            Selecciona un departamento para consultar sus distritos,
                            organización territorial, servicios básicos, tipo de zona
                            e información turística.
                        </p>

                        <div className="explorar-prov-actions">
                            <div className="explorar-prov-action-icon">▣</div>

                            <button
                                type="button"
                                className="btn-primary-explorar-prov"
                                onClick={irADistritos}
                            >
                                Ver distritos
                            </button>
                        </div>

                        <div className="explorar-prov-details">
                            <div>
                                <span>Capital</span>
                                <strong>{currentDepartamento.capital || 'No registrada'}</strong>
                            </div>

                            <div>
                                <span>Región</span>
                                <strong>{currentDepartamento.region_natural || 'No registrada'}</strong>
                            </div>

                            <div>
                                <span>Población</span>
                                <strong>{formatNumber(currentDepartamento.poblacion_aprox)}</strong>
                            </div>
                        </div>
                    </div>

                    <div className="explorar-prov-right">
                        <div
                            key={`cards-${currentIndex}-${slideDirection}`}
                            className={`explorar-prov-cards-track ${
                                slideDirection === 'next' ? 'cards-next' : 'cards-prev'
                            }`}
                        >
                            {getVisibleCards().map((departamento) => {
                                const cardImage = getDepartamentoImage(departamento);

                                return (
                                    <button
                                        type="button"
                                        key={departamento.id}
                                        className="explorar-prov-preview-card"
                                        onClick={() => {
                                            const index = departamentos.findIndex((item) => item.id === departamento.id);

                                            if (index !== -1) {
                                                setSlideDirection(index > currentIndex ? 'next' : 'prev');
                                                setCurrentIndex(index);
                                            }
                                        }}
                                    >
                                        <div
                                            className="explorar-prov-preview-bg"
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

                                        <div className="explorar-prov-preview-content">
                                            <span></span>
                                            <small>{departamento.region_natural || 'Perú'}</small>
                                            <strong>{departamento.nombre}</strong>
                                            <p>{departamento.capital || 'Capital no registrada'}</p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        <div className="explorar-prov-controls">
                            <button type="button" onClick={prevDepartamento}>‹</button>
                            <button type="button" onClick={nextDepartamento}>›</button>

                            <div className="explorar-prov-progress">
                                <span
                                    style={{
                                        width: `${((currentIndex + 1) / departamentos.length) * 100}%`
                                    }}
                                ></span>
                            </div>

                            <strong>{String(currentIndex + 1).padStart(2, '0')}</strong>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default ExplorarDistritos;