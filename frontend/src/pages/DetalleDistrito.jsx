import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AppHeader from '../components/AppHeader';
import { getDistritoById } from '../services/distritoService';
import { getLugaresByDistritoId } from '../services/lugarTuristicoDistritoService';
import { getComidasByDistritoId } from '../services/comidaTipicaDistritoService';
import '../styles/DetalleDistrito.css';

const DetalleDistrito = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [distrito, setDistrito] = useState(null);
    const [lugares, setLugares] = useState([]);
    const [comidas, setComidas] = useState([]);
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

    const getDistritoImage = (data) => {
        return getBackendImageUrl(
            data?.imagen_fondo ||
            data?.imagen_url ||
            data?.imagen ||
            ''
        );
    };

    const getContentImage = (data) => {
        return getBackendImageUrl(
            data?.imagen ||
            data?.imagen_fondo ||
            data?.imagen_url ||
            ''
        );
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

            const [distritoData, lugaresData, comidasData] = await Promise.all([
                getDistritoById(id),
                getLugaresByDistritoId(id),
                getComidasByDistritoId(id)
            ]);

            setDistrito(distritoData?.distrito || distritoData);
            setLugares(Array.isArray(lugaresData) ? lugaresData : []);
            setComidas(Array.isArray(comidasData) ? comidasData : []);
        } catch (err) {
            setError(err.response?.data?.error || 'Error al cargar el distrito');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarDatos();
    }, [id]);

    const heroBackground = useMemo(() => {
        const image = getDistritoImage(distrito);

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
    }, [distrito]);

    if (loading) {
        return (
            <div className="detalle-distrito-page">
                <AppHeader />

                <main className="detalle-distrito-state">
                    <div className="detalle-distrito-loader"></div>
                    <p>Cargando distrito...</p>
                </main>
            </div>
        );
    }

    if (error || !distrito) {
        return (
            <div className="detalle-distrito-page">
                <AppHeader />

                <main className="detalle-distrito-state">
                    <span>⚠️</span>
                    <h2>No se pudo cargar el distrito</h2>
                    <p>{error || 'Distrito no encontrado'}</p>

                    <button type="button" onClick={() => navigate('/explorar-distritos')}>
                        Volver a explorar distritos
                    </button>
                </main>
            </div>
        );
    }

    return (
        <div className="detalle-distrito-page">
            <AppHeader />

            <main>
                <section
                    className="detalle-distrito-hero"
                    style={{ backgroundImage: heroBackground }}
                >
                    <div className="detalle-distrito-hero-content">
                        <button
                            type="button"
                            className="detalle-distrito-back"
                            onClick={() => navigate(`/provincias/${distrito.provincia_id}/distritos`)}
                        >
                            ← Volver a distritos
                        </button>

                        <div className="detalle-distrito-label">
                            <span></span>
                            <p>
                                Distrito de {distrito.provincia_nombre || 'Provincia'}
                            </p>
                        </div>

                        <h1>{distrito.nombre}</h1>

                        <p className="detalle-distrito-description">
                            {distrito.descripcion ||
                                'Sin descripción registrada para este distrito.'}
                        </p>

                        <div className="detalle-distrito-actions">
                            <button
                                type="button"
                                onClick={() => navigate(`/distritos/${distrito.id}/ciudades`)}
                            >
                                Ver ciudades
                            </button>
                        </div>
                    </div>
                </section>

                <section className="detalle-distrito-content">
                    <div className="detalle-distrito-section-header">
                        <span>Información distrital</span>
                        <h2>Ficha informativa</h2>
                        <p>
                            Datos principales del distrito seleccionado, incluyendo provincia,
                            departamento, población, área, altitud, tipo de zona y nivel de desarrollo.
                        </p>
                    </div>

                    <div className="detalle-distrito-info-grid">
                        <article>
                            <span>Provincia</span>
                            <strong>{distrito.provincia_nombre || 'No registrada'}</strong>
                        </article>

                        <article>
                            <span>Departamento</span>
                            <strong>{distrito.departamento_nombre || 'No registrado'}</strong>
                        </article>

                        <article>
                            <span>Área</span>
                            <strong>{formatNumber(distrito.area_km2)} km²</strong>
                        </article>

                        <article>
                            <span>Población aproximada</span>
                            <strong>{formatNumber(distrito.poblacion_aprox)}</strong>
                        </article>

                        <article>
                            <span>Altitud</span>
                            <strong>
                                {distrito.altitud_msnm
                                    ? `${formatNumber(distrito.altitud_msnm)} msnm`
                                    : 'No registrada'}
                            </strong>
                        </article>

                        <article>
                            <span>Tipo de zona</span>
                            <strong>{distrito.tipo_zona || 'No registrado'}</strong>
                        </article>

                        <article>
                            <span>Nivel de desarrollo</span>
                            <strong>{distrito.nivel_desarrollo || 'No registrado'}</strong>
                        </article>

                    </div>

                    <div className="detalle-distrito-section-header detalle-distrito-section-space">
                        <span>Contenido turístico</span>
                        <h2>Lugares turísticos</h2>
                        <p>
                            Principales espacios turísticos registrados para el distrito de{' '}
                            <strong>{distrito.nombre}</strong>.
                        </p>
                    </div>

                    {lugares.length === 0 ? (
                        <div className="detalle-distrito-empty-card">
                            <div>📍</div>
                            <h3>No hay lugares turísticos registrados</h3>
                            <p>
                                Aún no se han agregado lugares turísticos para este distrito.
                                Luego podrás registrarlos desde la gestión de contenido.
                            </p>
                        </div>
                    ) : (
                        <div className="detalle-distrito-content-grid">
                            {lugares.map((lugar) => {
                                const image = getContentImage(lugar);

                                return (
                                    <article className="detalle-distrito-tour-card" key={lugar.id}>
                                        <div
                                            className="detalle-distrito-card-image"
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

                                        <div className="detalle-distrito-card-body">
                                            <p>{lugar.descripcion}</p>

                                            {lugar.ubicacion_referencial && (
                                                <div className="detalle-distrito-card-meta">
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

                    <div className="detalle-distrito-section-header detalle-distrito-section-space">
                        <span>Gastronomía</span>
                        <h2>Comidas típicas</h2>
                        <p>
                            Platos y expresiones gastronómicas registradas para el distrito de{' '}
                            <strong>{distrito.nombre}</strong>.
                        </p>
                    </div>

                    {comidas.length === 0 ? (
                        <div className="detalle-distrito-empty-card">
                            <div>🍽️</div>
                            <h3>No hay comidas típicas registradas</h3>
                            <p>
                                Aún no se han agregado comidas típicas para este distrito.
                                Luego podrás registrarlas desde la gestión de contenido.
                            </p>
                        </div>
                    ) : (
                        <div className="detalle-distrito-content-grid">
                            {comidas.map((comida) => {
                                const image = getContentImage(comida);

                                return (
                                    <article className="detalle-distrito-food-card" key={comida.id}>
                                        <div
                                            className="detalle-distrito-card-image"
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

                                        <div className="detalle-distrito-card-body">
                                            <p>{comida.descripcion}</p>

                                            {comida.origen_descripcion && (
                                                <div className="detalle-distrito-card-meta">
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
                </section>
            </main>
        </div>
    );
};

export default DetalleDistrito;