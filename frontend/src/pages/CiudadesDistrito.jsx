import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AppHeader from '../components/AppHeader';
import { AuthContext } from '../context/AuthContext';
import { getDistritoById } from '../services/distritoService';
import { getCiudadesByDistrito } from '../services/ciudadService';
import '../styles/DistritosProvincia.css';

const CiudadesDistrito = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const wheelRef = useRef(null);
    const wheelLockRef = useRef(false);

    const { user } = useContext(AuthContext);
    const isAdmin = user?.rol === 'admin';

    const [distrito, setDistrito] = useState(null);
    const [ciudades, setCiudades] = useState([]);
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

    const getDistritoImage = (data) => {
        return getBackendImageUrl(
            data?.imagen_fondo ||
            data?.imagen_url ||
            data?.imagen ||
            ''
        );
    };

    const getCiudadImage = (ciudad) => {
        const image = getBackendImageUrl(
            ciudad?.imagen_fondo ||
            ciudad?.imagen_url ||
            ciudad?.imagen ||
            ''
        );

        return image || getDistritoImage(distrito);
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

            const [distritoData, ciudadesData] = await Promise.all([
                getDistritoById(id),
                getCiudadesByDistrito(id, 1, 100)
            ]);

            setDistrito(distritoData?.distrito || distritoData);

            const ciudadesList = Array.isArray(ciudadesData)
                ? ciudadesData
                : ciudadesData?.data || [];

            setCiudades(ciudadesList);
            setCurrentIndex(0);
        } catch (err) {
            setError(err.response?.data?.error || 'Error al cargar ciudades del distrito');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarDatos();
    }, [id]);

    const currentCiudad = ciudades[currentIndex];

    const backgroundImage = useMemo(() => {
        const image = getCiudadImage(currentCiudad);

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
    }, [currentCiudad, distrito]);

    const getVisibleCards = () => {
        if (ciudades.length <= 1) return [];
        return ciudades.filter((_, index) => index !== currentIndex);
    };

    const nextCiudad = () => {
        if (ciudades.length === 0) return;

        setSlideDirection('next');

        setCurrentIndex((prev) =>
            prev === ciudades.length - 1 ? 0 : prev + 1
        );
    };

    const prevCiudad = () => {
        if (ciudades.length === 0) return;

        setSlideDirection('prev');

        setCurrentIndex((prev) =>
            prev === 0 ? ciudades.length - 1 : prev - 1
        );
    };

    const irACiudad = () => {
        if (!currentCiudad?.id) return;

        navigate(`/ciudades/${currentCiudad.id}`);
    };

    useEffect(() => {
        const element = wheelRef.current;

        if (!element || ciudades.length <= 1) return;

        const handleWheel = (e) => {
            e.preventDefault();

            if (wheelLockRef.current) return;

            wheelLockRef.current = true;

            if (e.deltaY > 0) {
                setSlideDirection('next');

                setCurrentIndex((prev) =>
                    prev === ciudades.length - 1 ? 0 : prev + 1
                );
            } else {
                setSlideDirection('prev');

                setCurrentIndex((prev) =>
                    prev === 0 ? ciudades.length - 1 : prev - 1
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
    }, [ciudades.length]);

    if (loading) {
        return (
            <div className="distritos-showcase-page">
                <AppHeader />

                <main className="distritos-state">
                    <div className="distritos-loader"></div>
                    <p>Cargando ciudades...</p>
                </main>
            </div>
        );
    }

    if (error) {
        return (
            <div className="distritos-showcase-page">
                <AppHeader />

                <main className="distritos-state">
                    <span>⚠️</span>
                    <h2>No se pudieron cargar las ciudades</h2>
                    <p>{error}</p>

                    <button type="button" onClick={cargarDatos}>
                        Reintentar
                    </button>
                </main>
            </div>
        );
    }

    if (!currentCiudad) {
        return (
            <div className="distritos-showcase-page">
                <AppHeader />

                <main className="distritos-state">
                    <span>🏙️</span>
                    <h2>No hay ciudades registradas</h2>
                    <p>
                        Aún no se han registrado ciudades para el distrito de{' '}
                        {distrito?.nombre || 'este distrito'}.
                    </p>

                    <button
                        type="button"
                        onClick={() => navigate(`/distritos/${id}`)}
                    >
                        Volver al distrito
                    </button>
                </main>
            </div>
        );
    }

    return (
        <div className="distritos-showcase-page">
            <AppHeader />

            <main
                ref={wheelRef}
                className="distritos-showcase"
                style={{ backgroundImage }}
            >
                <div className="distritos-overlay"></div>

                <section className="distritos-showcase-content">
                    <div className="distritos-left">
                        <div className="distritos-top-actions">
                            <button
                                type="button"
                                className="distritos-back"
                                onClick={() => navigate(`/distritos/${id}`)}
                            >
                                ← Volver al distrito
                            </button>

                            {isAdmin && (
                                <button
                                    type="button"
                                    className="distritos-admin-btn"
                                    onClick={() => navigate(`/gestionar-ciudades?distrito_id=${id}`)}
                                >
                                    Gestionar ciudades
                                </button>
                            )}
                        </div>

                        <div className="distritos-location">
                            <span></span>
                            <p>
                                Ciudad de {distrito?.nombre || 'Distrito'}
                            </p>
                        </div>

                        <h1>{currentCiudad.nombre}</h1>

                        <p className="distritos-description">
                            {currentCiudad.descripcion_cultural ||
                                currentCiudad.atractivo_turistico ||
                                'Sin descripción cultural registrada para esta ciudad.'}
                        </p>

                        <div className="distritos-main-actions">
                            <div className="distrito-action-icon">04</div>

                            <button
                                type="button"
                                className="btn-primary-distrito"
                                onClick={irACiudad}
                            >
                                Ver ciudad
                            </button>
                        </div>

                        <div className="distritos-details">
                            <div>
                                <span>Provincia</span>
                                <strong>{currentCiudad.provincia_nombre || 'No registrada'}</strong>
                            </div>

                            <div>
                                <span>Departamento</span>
                                <strong>{currentCiudad.departamento_nombre || 'No registrado'}</strong>
                            </div>

                            <div>
                                <span>Población</span>
                                <strong>{formatNumber(currentCiudad.poblacion)}</strong>
                            </div>
                        </div>

                        <div className="distritos-extra-details">
                            <div>
                                <span>Tipo ciudad</span>
                                <strong>{currentCiudad.tipo_ciudad || 'No registrado'}</strong>
                            </div>

                            <div>
                                <span>Clima</span>
                                <strong>{currentCiudad.clima || 'No registrado'}</strong>
                            </div>

                            <div>
                                <span>Actividad</span>
                                <strong>{currentCiudad.principal_actividad || 'No registrada'}</strong>
                            </div>
                        </div>
                    </div>

                    <div className="distritos-right">
                        <div
                            key={`cards-${currentIndex}-${slideDirection}`}
                            className={`distritos-cards-track ${
                                slideDirection === 'next' ? 'cards-next' : 'cards-prev'
                            }`}
                        >
                            {getVisibleCards().map((ciudad) => {
                                const cardImage = getCiudadImage(ciudad);

                                return (
                                    <button
                                        type="button"
                                        key={ciudad.id}
                                        className="distrito-preview-card"
                                        onClick={() => {
                                            const index = ciudades.findIndex(
                                                (item) => item.id === ciudad.id
                                            );

                                            if (index !== -1) {
                                                setSlideDirection(index > currentIndex ? 'next' : 'prev');
                                                setCurrentIndex(index);
                                            }
                                        }}
                                    >
                                        <div
                                            className="distrito-preview-bg"
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

                                        <div className="distrito-preview-content">
                                            <span></span>
                                            <small>{ciudad.tipo_ciudad || 'Ciudad'}</small>
                                            <strong>{ciudad.nombre}</strong>
                                            <p>{ciudad.clima || 'Clima no registrado'}</p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        <div className="distritos-controls">
                            <button type="button" onClick={prevCiudad}>
                                ‹
                            </button>

                            <button type="button" onClick={nextCiudad}>
                                ›
                            </button>

                            <div className="distritos-progress">
                                <span
                                    style={{
                                        width: `${((currentIndex + 1) / ciudades.length) * 100}%`
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

export default CiudadesDistrito;