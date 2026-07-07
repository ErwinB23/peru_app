import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AppHeader from '../components/AppHeader';
import { getCiudadById } from '../services/ciudadService';
import { getLugaresByCiudadId } from '../services/lugarTuristicoCiudadService';
import { getComidasByCiudadId } from '../services/comidaTipicaCiudadService';
import '../styles/DetalleCiudad.css';

const DetalleCiudad = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [ciudad, setCiudad] = useState(null);
    const [lugares, setLugares] = useState([]);
    const [comidas, setComidas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const getBackendImageUrl = (path) => {
        if (!path) return '';
        if (path.startsWith('http')) return path;

        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const backendUrl = baseUrl.replace('/api', '');

        return `${backendUrl}${path}`;
    };

    const getCiudadImage = (data) => {
        return getBackendImageUrl(data?.imagen_fondo || data?.imagen_url || data?.imagen || '');
    };

    const getContentImage = (data) => {
        return getBackendImageUrl(data?.imagen || data?.imagen_fondo || data?.imagen_url || '');
    };

    const formatNumber = (value) => {
        if (value === null || value === undefined || value === '') return 'No registrado';

        const number = Number(value);
        if (Number.isNaN(number)) return value;

        return number.toLocaleString('es-PE');
    };

    const formatCoordinate = (value) => {
        if (value === null || value === undefined || value === '') return 'No registrada';

        const number = Number(value);
        if (Number.isNaN(number)) return value;

        return number.toFixed(6);
    };

    const cargarDatos = async () => {
        try {
            setLoading(true);
            setError('');

            const [ciudadData, lugaresData, comidasData] = await Promise.all([
                getCiudadById(id),
                getLugaresByCiudadId(id),
                getComidasByCiudadId(id)
            ]);

            setCiudad(ciudadData?.ciudad || ciudadData);
            setLugares(Array.isArray(lugaresData) ? lugaresData : []);
            setComidas(Array.isArray(comidasData) ? comidasData : []);
        } catch (err) {
            setError(err.response?.data?.error || 'Error al cargar la ciudad');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarDatos();
    }, [id]);

    const heroBackground = useMemo(() => {
        const image = getCiudadImage(ciudad);

        if (image) {
            return `
                linear-gradient(90deg, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.48) 52%, rgba(0,0,0,0.22) 100%),
                url(${image})
            `;
        }

        return `
            radial-gradient(circle at 78% 22%, rgba(255, 209, 102, 0.25), transparent 28%),
            radial-gradient(circle at 18% 82%, rgba(16, 111, 142, 0.34), transparent 35%),
            linear-gradient(135deg, #111827 0%, #9f1025 48%, #106f8e 100%)
        `;
    }, [ciudad]);

    if (loading) {
        return (
            <div className="detalle-ciudad-page">
                <AppHeader />

                <main className="detalle-ciudad-state">
                    <div className="detalle-ciudad-loader"></div>
                    <p>Cargando ciudad...</p>
                </main>
            </div>
        );
    }

    if (error || !ciudad) {
        return (
            <div className="detalle-ciudad-page">
                <AppHeader />

                <main className="detalle-ciudad-state">
                    <span>⚠️</span>
                    <h2>No se pudo cargar la ciudad</h2>
                    <p>{error || 'Ciudad no encontrada'}</p>

                    <button type="button" onClick={() => navigate('/explorar-ciudades')}>
                        Volver a explorar ciudades
                    </button>
                </main>
            </div>
        );
    }

    return (
        <div className="detalle-ciudad-page">
            <AppHeader />

            <main>
                <section
                    className="detalle-ciudad-hero"
                    style={{ backgroundImage: heroBackground }}
                >
                    <div className="detalle-ciudad-hero-content">
                        <button
                            type="button"
                            className="detalle-ciudad-back"
                            onClick={() => navigate(`/departamentos/${ciudad.departamento_id}/ciudades`)}
                        >
                            ← Volver a ciudades
                        </button>

                        <div className="detalle-ciudad-label">
                            <span></span>
                            <p>Ciudad de {ciudad.departamento_nombre || 'Perú'}</p>
                        </div>

                        <h1>{ciudad.nombre}</h1>

                        <p className="detalle-ciudad-description">
                            {ciudad.descripcion_cultural ||
                                ciudad.atractivo_turistico ||
                                'Sin descripción cultural registrada para esta ciudad.'}
                        </p>
                    </div>
                </section>

                <section className="detalle-ciudad-content">
                    <div className="detalle-ciudad-section-header">
                        <span>Información urbana</span>
                        <h2>Ficha informativa</h2>
                        <p>
                            Datos principales de la ciudad seleccionada, incluyendo distrito,
                            provincia, departamento, población, clima, tipo de ciudad y actividad principal.
                        </p>
                    </div>

                    <div className="detalle-ciudad-info-grid">
                        <article>
                            <span>Departamento</span>
                            <strong>{ciudad.departamento_nombre || 'No registrado'}</strong>
                        </article>

                        <article>
                            <span>Provincia</span>
                            <strong>{ciudad.provincia_nombre || 'No registrada'}</strong>
                        </article>

                        <article>
                            <span>Distrito</span>
                            <strong>{ciudad.distrito_nombre || 'No registrado'}</strong>
                        </article>

                        <article>
                            <span>Tipo de ciudad</span>
                            <strong>{ciudad.tipo_ciudad || 'No registrado'}</strong>
                        </article>

                        <article>
                            <span>Población</span>
                            <strong>{formatNumber(ciudad.poblacion)}</strong>
                        </article>

                        <article>
                            <span>Clima</span>
                            <strong>{ciudad.clima || 'No registrado'}</strong>
                        </article>

                        <article>
                            <span>Actividad principal</span>
                            <strong>{ciudad.principal_actividad || 'No registrada'}</strong>
                        </article>

                        <article>
                            <span>Atractivo turístico</span>
                            <strong>{ciudad.atractivo_turistico || 'No registrado'}</strong>
                        </article>
                    </div>

                    <div className="detalle-ciudad-section-header detalle-ciudad-section-space">
                        <span>Contenido turístico</span>
                        <h2>Lugares turísticos</h2>
                        <p>
                            Principales lugares turísticos registrados para la ciudad de{' '}
                            <strong>{ciudad.nombre}</strong>.
                        </p>
                    </div>

                    {lugares.length === 0 ? (
                        <div className="detalle-ciudad-empty-card">
                            <div>📍</div>
                            <h3>No hay lugares turísticos registrados</h3>
                            <p>
                                Aún no se han agregado lugares turísticos para esta ciudad.
                            </p>
                        </div>
                    ) : (
                        <div className="detalle-ciudad-content-grid">
                            {lugares.map((lugar) => {
                                const image = getContentImage(lugar);

                                return (
                                    <article className="detalle-ciudad-tour-card" key={lugar.id}>
                                        <div
                                            className="detalle-ciudad-card-image"
                                            style={
                                                image
                                                    ? {
                                                        backgroundImage: `
                                                            linear-gradient(180deg, rgba(0,0,0,0.08), rgba(0,0,0,0.72)),
                                                            url(${image})
                                                        `
                                                    }
                                                    : undefined
                                            }
                                        >
                                            <span>Turismo</span>
                                            <h3>{lugar.nombre}</h3>
                                        </div>

                                        <div className="detalle-ciudad-card-body">
                                            <p>{lugar.descripcion}</p>

                                            {lugar.ubicacion_referencial && (
                                                <div className="detalle-ciudad-card-meta">
                                                    <span>Ubicación referencial</span>
                                                    <strong>{lugar.ubicacion_referencial}</strong>
                                                </div>
                                            )}
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    )}

                    <div className="detalle-ciudad-section-header detalle-ciudad-section-space">
                        <span>Gastronomía</span>
                        <h2>Comidas típicas</h2>
                        <p>
                            Platos y expresiones gastronómicas registradas para la ciudad de{' '}
                            <strong>{ciudad.nombre}</strong>.
                        </p>
                    </div>

                    {comidas.length === 0 ? (
                        <div className="detalle-ciudad-empty-card">
                            <div>🍽️</div>
                            <h3>No hay comidas típicas registradas</h3>
                            <p>
                                Aún no se han agregado comidas típicas para esta ciudad.
                            </p>
                        </div>
                    ) : (
                        <div className="detalle-ciudad-content-grid">
                            {comidas.map((comida) => {
                                const image = getContentImage(comida);

                                return (
                                    <article className="detalle-ciudad-food-card" key={comida.id}>
                                        <div
                                            className="detalle-ciudad-card-image"
                                            style={
                                                image
                                                    ? {
                                                        backgroundImage: `
                                                            linear-gradient(180deg, rgba(0,0,0,0.08), rgba(0,0,0,0.72)),
                                                            url(${image})
                                                        `
                                                    }
                                                    : undefined
                                            }
                                        >
                                            <span>Gastronomía</span>
                                            <h3>{comida.nombre}</h3>
                                        </div>

                                        <div className="detalle-ciudad-card-body">
                                            <p>{comida.descripcion}</p>

                                            {comida.origen_descripcion && (
                                                <div className="detalle-ciudad-card-meta">
                                                    <span>Origen / referencia</span>
                                                    <strong>{comida.origen_descripcion}</strong>
                                                </div>
                                            )}
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    )}

                    <div className="detalle-ciudad-section-header detalle-ciudad-section-space">
                        <span>Ubicación</span>
                        <h2>Coordenadas geográficas</h2>
                        <p>
                            Coordenadas registradas para ubicar referencialmente la ciudad.
                        </p>
                    </div>

                    <div className="detalle-ciudad-location-grid">
                        <article>
                            <span>Latitud</span>
                            <strong>{formatCoordinate(ciudad.latitud)}</strong>
                        </article>

                        <article>
                            <span>Longitud</span>
                            <strong>{formatCoordinate(ciudad.longitud)}</strong>
                        </article>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default DetalleCiudad;