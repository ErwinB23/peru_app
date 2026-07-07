import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AppHeader from '../components/AppHeader';
import { getDepartamentoById } from '../services/departamentoService';
import { getProvinciasByDepartamento } from '../services/provinciaService';
import '../styles/ProvinciasDepartamento.css';
import { AuthContext } from '../context/AuthContext';

const ProvinciasDepartamento = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const isAdmin = user?.rol === 'admin';
    const wheelRef = useRef(null);
    const wheelLockRef = useRef(false);

    const [departamento, setDepartamento] = useState(null);
    const [provincias, setProvincias] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [slideDirection, setSlideDirection] = useState('next');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const getBackendImageUrl = (path) => {
        if (!path) return '';

        if (path.startsWith('http')) {
            return path;
        }

        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const backendUrl = baseUrl.replace('/api', '');

        return `${backendUrl}${path}`;
    };

    const getDepartamentoImage = (data) => {
        return getBackendImageUrl(
            data?.imagen_fondo ||
            data?.imagen_url ||
            data?.imagen ||
            ''
        );
    };

    const getProvinciaImage = (provincia) => {
        const provinciaImage = getBackendImageUrl(
            provincia?.imagen_fondo ||
            provincia?.imagen_url ||
            provincia?.imagen ||
            ''
        );

        if (provinciaImage) {
            return provinciaImage;
        }

        return getDepartamentoImage(departamento);
    };

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

    const cargarDatos = async () => {
        try {
            setLoading(true);
            setError('');

            const [departamentoData, provinciasData] = await Promise.all([
                getDepartamentoById(id),
                getProvinciasByDepartamento(id)
            ]);

            if (departamentoData?.departamento) {
                setDepartamento(departamentoData.departamento);
            } else {
                setDepartamento(departamentoData);
            }

            setProvincias(Array.isArray(provinciasData) ? provinciasData : []);
            setCurrentIndex(0);
        } catch (err) {
            setError(err.response?.data?.error || 'Error al cargar provincias');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarDatos();
    }, [id]);

    const currentProvincia = provincias[currentIndex];

    const backgroundImage = useMemo(() => {
        const image = getProvinciaImage(currentProvincia);

        if (image) {
            return `
                linear-gradient(90deg, rgba(0,0,0,0.76) 0%, rgba(0,0,0,0.44) 48%, rgba(0,0,0,0.18) 100%),
                url(${image})
            `;
        }

        return `
            radial-gradient(circle at 78% 22%, rgba(255, 209, 102, 0.25), transparent 28%),
            radial-gradient(circle at 18% 82%, rgba(16, 111, 142, 0.34), transparent 35%),
            linear-gradient(135deg, #111827 0%, #9f1025 48%, #106f8e 100%)
        `;
    }, [currentProvincia, departamento]);

    const getVisibleCards = () => {
        if (provincias.length <= 1) return [];

        return provincias.filter((_, index) => index !== currentIndex);
    };

    const nextProvincia = () => {
        if (provincias.length === 0) return;

        setSlideDirection('next');

        setCurrentIndex((prev) =>
            prev === provincias.length - 1 ? 0 : prev + 1
        );
    };

    const prevProvincia = () => {
        if (provincias.length === 0) return;

        setSlideDirection('prev');

        setCurrentIndex((prev) =>
            prev === 0 ? provincias.length - 1 : prev - 1
        );
    };

    const irAProvincia = () => {
        if (!currentProvincia?.id) return;

        navigate(`/provincias/${currentProvincia.id}`);
    };

    useEffect(() => {
        const element = wheelRef.current;

        if (!element || provincias.length <= 1) return;

        const handleWheel = (e) => {
            e.preventDefault();

            if (wheelLockRef.current) return;

            wheelLockRef.current = true;

            if (e.deltaY > 0) {
                setSlideDirection('next');

                setCurrentIndex((prev) =>
                    prev === provincias.length - 1 ? 0 : prev + 1
                );
            } else {
                setSlideDirection('prev');

                setCurrentIndex((prev) =>
                    prev === 0 ? provincias.length - 1 : prev - 1
                );
            }

            setTimeout(() => {
                wheelLockRef.current = false;
            }, 650);
        };

        element.addEventListener('wheel', handleWheel, { passive: false });

        return () => {
            element.removeEventListener('wheel', handleWheel);
        };
    }, [provincias.length]);

    if (loading) {
        return (
            <div className="provincias-showcase-page">
                <AppHeader />

                <main className="provincias-state">
                    <div className="provincias-loader"></div>
                    <p>Cargando provincias...</p>
                </main>
            </div>
        );
    }

    if (error) {
        return (
            <div className="provincias-showcase-page">
                <AppHeader />

                <main className="provincias-state">
                    <span>⚠️</span>
                    <h2>No se pudieron cargar las provincias</h2>
                    <p>{error}</p>

                    <button type="button" onClick={cargarDatos}>
                        Reintentar
                    </button>
                </main>
            </div>
        );
    }

    if (!currentProvincia) {
        return (
            <div className="provincias-showcase-page">
                <AppHeader />

                <main className="provincias-state">
                    <span>🏞️</span>
                    <h2>No hay provincias registradas</h2>
                    <p>
                        Aún no se han registrado provincias para el departamento de{' '}
                        {departamento?.nombre || 'este departamento'}.
                    </p>

                    <button
                        type="button"
                        onClick={() => navigate('/explorar-provincias')}
                    >
                        Volver a explorar provincias
                    </button>
                </main>
            </div>
        );
    }

    return (
        <div className="provincias-showcase-page">
            <AppHeader />

            <main
                ref={wheelRef}
                className="provincias-showcase"
                style={{ backgroundImage }}
            >
                <div className="provincias-overlay"></div>

                <section className="provincias-showcase-content">
                    <div className="provincias-left">
                        <div className="provincias-top-actions">
                            <button
                                type="button"
                                className="provincias-back"
                                onClick={() => navigate('/explorar-provincias')}
                            >
                                ← Cambiar departamento
                            </button>

                            {isAdmin && (
                                <button
                                    type="button"
                                    className="provincias-admin-btn"
                                    onClick={() => navigate(`/gestionar-provincias?departamento_id=${id}`)}
                                >
                                    Gestionar provincias
                                </button>
                            )}
                        </div>

                        <div className="provincias-location">
                            <span></span>
                            <p>
                                Provincia de {departamento?.nombre || 'Perú'}
                            </p>
                        </div>

                        <h1>{currentProvincia.nombre}</h1>

                        <p className="provincias-description">
                            {currentProvincia.descripcion_general ||
                                'Sin descripción general registrada para esta provincia.'}
                        </p>

                        <div className="provincias-main-actions">
                            <div className="provincia-action-icon">03</div>

                            <button
                                type="button"
                                className="btn-primary-provincia"
                                onClick={irAProvincia}
                            >
                                Ver provincia
                            </button>
                        </div>

                        <div className="provincias-details">
                            <div>
                                <span>Capital</span>
                                <strong>{currentProvincia.capital || 'No registrada'}</strong>
                            </div>

                            <div>
                                <span>Población</span>
                                <strong>{formatNumber(currentProvincia.poblacion_aprox)}</strong>
                            </div>

                            <div>
                                <span>Área</span>
                                <strong>{formatNumber(currentProvincia.area_km2)} km²</strong>
                            </div>
                        </div>

                        <div className="provincias-extra-details">
                            <div>
                                <span>Actividad económica</span>
                                <strong>
                                    {currentProvincia.actividad_economica_principal || 'No registrada'}
                                </strong>
                            </div>

                            <div>
                                <span>Festividad representativa</span>
                                <strong>
                                    {currentProvincia.festividad_representativa || 'No registrada'}
                                </strong>
                            </div>

                            <div>
                                <span>Número de distritos</span>
                                <strong>{currentProvincia.numero_distritos || 0}</strong>
                            </div>
                        </div>
                    </div>

                    <div className="provincias-right">
                        <div
                            key={`cards-${currentIndex}-${slideDirection}`}
                            className={`provincias-cards-track ${slideDirection === 'next' ? 'cards-next' : 'cards-prev'
                                }`}
                        >
                            {getVisibleCards().map((provincia) => {
                                const cardImage = getProvinciaImage(provincia);

                                return (
                                    <button
                                        type="button"
                                        key={provincia.id}
                                        className="provincia-preview-card"
                                        onClick={() => {
                                            const index = provincias.findIndex(
                                                (item) => item.id === provincia.id
                                            );

                                            if (index !== -1) {
                                                setSlideDirection(index > currentIndex ? 'next' : 'prev');
                                                setCurrentIndex(index);
                                            }
                                        }}
                                    >
                                        <div
                                            className="provincia-preview-bg"
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

                                        <div className="provincia-preview-content">
                                            <span></span>

                                            <small>
                                                {provincia.capital || 'Capital no registrada'}
                                            </small>

                                            <strong>{provincia.nombre}</strong>

                                            <p>
                                                {provincia.numero_distritos || 0} distritos
                                            </p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        <div className="provincias-controls">
                            <button type="button" onClick={prevProvincia}>
                                ‹
                            </button>

                            <button type="button" onClick={nextProvincia}>
                                ›
                            </button>

                            <div className="provincias-progress">
                                <span
                                    style={{
                                        width: `${((currentIndex + 1) / provincias.length) * 100}%`
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

export default ProvinciasDepartamento;