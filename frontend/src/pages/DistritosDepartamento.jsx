import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AppHeader from '../components/AppHeader';
import { AuthContext } from '../context/AuthContext';
import { getDepartamentoById } from '../services/departamentoService';
import { getProvinciasByDepartamento } from '../services/provinciaService';
import { getDistritosByProvincia } from '../services/distritoService';
import '../styles/DistritosProvincia.css';

const DistritosDepartamento = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const wheelRef = useRef(null);
    const wheelLockRef = useRef(false);

    const { user } = useContext(AuthContext);
    const isAdmin = user?.rol === 'admin';

    const [departamento, setDepartamento] = useState(null);
    const [distritos, setDistritos] = useState([]);
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

    const getDepartamentoImage = (data) => {
        return getBackendImageUrl(data?.imagen_fondo || data?.imagen_url || data?.imagen || '');
    };

    const getDistritoImage = (distrito) => {
        const image = getBackendImageUrl(distrito?.imagen_fondo || distrito?.imagen_url || distrito?.imagen || '');
        return image || getDepartamentoImage(departamento);
    };

    const formatNumber = (value) => {
        if (value === null || value === undefined || value === '') return 'No registrado';

        const number = Number(value);
        if (Number.isNaN(number)) return value;

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

            const departamentoFinal = departamentoData?.departamento || departamentoData;
            setDepartamento(departamentoFinal);

            const provincias = Array.isArray(provinciasData) ? provinciasData : [];

            const distritosPorProvincia = await Promise.all(
                provincias.map(async (provincia) => {
                    const response = await getDistritosByProvincia(provincia.id, 1, 100);

                    const lista = Array.isArray(response)
                        ? response
                        : response?.data || [];

                    return lista.map((distrito) => ({
                        ...distrito,
                        provincia_nombre: provincia.nombre,
                        departamento_nombre: departamentoFinal?.nombre
                    }));
                })
            );

            setDistritos(distritosPorProvincia.flat());
            setCurrentIndex(0);
        } catch (err) {
            setError(err.response?.data?.error || 'Error al cargar distritos del departamento');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarDatos();
    }, [id]);

    const currentDistrito = distritos[currentIndex];

    const backgroundImage = useMemo(() => {
        const image = getDistritoImage(currentDistrito);

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
    }, [currentDistrito, departamento]);

    const getVisibleCards = () => {
        if (distritos.length <= 1) return [];
        return distritos.filter((_, index) => index !== currentIndex);
    };

    const nextDistrito = () => {
        if (distritos.length === 0) return;

        setSlideDirection('next');
        setCurrentIndex((prev) => prev === distritos.length - 1 ? 0 : prev + 1);
    };

    const prevDistrito = () => {
        if (distritos.length === 0) return;

        setSlideDirection('prev');
        setCurrentIndex((prev) => prev === 0 ? distritos.length - 1 : prev - 1);
    };

    const irADistrito = () => {
        if (!currentDistrito?.id) return;
        navigate(`/distritos/${currentDistrito.id}`);
    };

    useEffect(() => {
        const element = wheelRef.current;

        if (!element || distritos.length <= 1) return;

        const handleWheel = (e) => {
            e.preventDefault();

            if (wheelLockRef.current) return;

            wheelLockRef.current = true;

            if (e.deltaY > 0) {
                setSlideDirection('next');
                setCurrentIndex((prev) => prev === distritos.length - 1 ? 0 : prev + 1);
            } else {
                setSlideDirection('prev');
                setCurrentIndex((prev) => prev === 0 ? distritos.length - 1 : prev - 1);
            }

            setTimeout(() => {
                wheelLockRef.current = false;
            }, 650);
        };

        element.addEventListener('wheel', handleWheel, { passive: false });

        return () => {
            element.removeEventListener('wheel', handleWheel);
        };
    }, [distritos.length]);

    if (loading) {
        return (
            <div className="distritos-showcase-page">
                <AppHeader />
                <main className="distritos-state">
                    <div className="distritos-loader"></div>
                    <p>Cargando distritos...</p>
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
                    <h2>No se pudieron cargar los distritos</h2>
                    <p>{error}</p>
                    <button type="button" onClick={cargarDatos}>Reintentar</button>
                </main>
            </div>
        );
    }

    if (!currentDistrito) {
        return (
            <div className="distritos-showcase-page">
                <AppHeader />
                <main className="distritos-state">
                    <span>🏘️</span>
                    <h2>No hay distritos registrados</h2>
                    <p>
                        Aún no hay distritos registrados para el departamento de{' '}
                        {departamento?.nombre || 'este departamento'}.
                    </p>
                    <button type="button" onClick={() => navigate(`/departamentos/${id}`)}>
                        Volver al departamento
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
                                onClick={() => navigate(`/departamentos/${id}`)}
                            >
                                ← Volver al departamento
                            </button>

                            {isAdmin && (
                                <button
                                    type="button"
                                    className="distritos-admin-btn"
                                    onClick={() => navigate('/gestionar-distritos')}
                                >
                                    Gestionar distritos
                                </button>
                            )}
                        </div>

                        <div className="distritos-location">
                            <span></span>
                            <p>Distrito de {departamento?.nombre || 'Departamento'}</p>
                        </div>

                        <h1>{currentDistrito.nombre}</h1>

                        <p className="distritos-description">
                            {currentDistrito.descripcion || 'Sin descripción registrada para este distrito.'}
                        </p>

                        <div className="distritos-main-actions">
                            <div className="distrito-action-icon">03</div>

                            <button
                                type="button"
                                className="btn-primary-distrito"
                                onClick={irADistrito}
                            >
                                Ver distrito
                            </button>
                        </div>

                        <div className="distritos-details">
                            <div>
                                <span>Provincia</span>
                                <strong>{currentDistrito.provincia_nombre || 'No registrada'}</strong>
                            </div>

                            <div>
                                <span>Población</span>
                                <strong>{formatNumber(currentDistrito.poblacion_aprox)}</strong>
                            </div>

                            <div>
                                <span>Área</span>
                                <strong>{formatNumber(currentDistrito.area_km2)} km²</strong>
                            </div>
                        </div>

                        <div className="distritos-extra-details">
                            <div>
                                <span>Tipo de zona</span>
                                <strong>{currentDistrito.tipo_zona || 'No registrado'}</strong>
                            </div>

                            <div>
                                <span>Nivel de desarrollo</span>
                                <strong>{currentDistrito.nivel_desarrollo || 'No registrado'}</strong>
                            </div>

                            <div>
                                <span>Total ciudades</span>
                                <strong>{currentDistrito.total_ciudades || 0}</strong>
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
                            {getVisibleCards().map((distrito) => {
                                const cardImage = getDistritoImage(distrito);

                                return (
                                    <button
                                        type="button"
                                        key={distrito.id}
                                        className="distrito-preview-card"
                                        onClick={() => {
                                            const index = distritos.findIndex((item) => item.id === distrito.id);

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
                                            <small>{distrito.provincia_nombre || 'Provincia'}</small>
                                            <strong>{distrito.nombre}</strong>
                                            <p>{distrito.total_ciudades || 0} ciudades</p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        <div className="distritos-controls">
                            <button type="button" onClick={prevDistrito}>‹</button>
                            <button type="button" onClick={nextDistrito}>›</button>

                            <div className="distritos-progress">
                                <span
                                    style={{
                                        width: `${((currentIndex + 1) / distritos.length) * 100}%`
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

export default DistritosDepartamento;