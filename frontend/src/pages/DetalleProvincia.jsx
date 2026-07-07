import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AppHeader from '../components/AppHeader';
import { getProvinciaById } from '../services/provinciaService';
import { getLugaresByProvinciaId } from '../services/lugarTuristicoProvinciaService';
import { getComidasByProvinciaId } from '../services/comidaTipicaProvinciaService';
import '../styles/DetalleProvincia.css';

const DetalleProvincia = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [provincia, setProvincia] = useState(null);
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

    const getProvinciaImage = (data) => {
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

            const [provinciaData, lugaresData, comidasData] = await Promise.all([
                getProvinciaById(id),
                getLugaresByProvinciaId(id),
                getComidasByProvinciaId(id)
            ]);

            if (provinciaData?.provincia) {
                setProvincia(provinciaData.provincia);
            } else {
                setProvincia(provinciaData);
            }

            setLugares(Array.isArray(lugaresData) ? lugaresData : []);
            setComidas(Array.isArray(comidasData) ? comidasData : []);
        } catch (err) {
            setError(err.response?.data?.error || 'Error al cargar la provincia');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarDatos();
    }, [id]);

    const heroBackground = useMemo(() => {
        const image = getProvinciaImage(provincia);

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
    }, [provincia]);

    if (loading) {
        return (
            <div className="detalle-provincia-page">
                <AppHeader />

                <main className="detalle-provincia-state">
                    <div className="detalle-provincia-loader"></div>
                    <p>Cargando provincia...</p>
                </main>
            </div>
        );
    }

    if (error || !provincia) {
        return (
            <div className="detalle-provincia-page">
                <AppHeader />

                <main className="detalle-provincia-state">
                    <span>⚠️</span>
                    <h2>No se pudo cargar la provincia</h2>
                    <p>{error || 'Provincia no encontrada'}</p>

                    <button type="button" onClick={() => navigate('/explorar-provincias')}>
                        Volver a explorar provincias
                    </button>
                </main>
            </div>
        );
    }

    return (
        <div className="detalle-provincia-page">
            <AppHeader />

            <main>
                <section
                    className="detalle-provincia-hero"
                    style={{ backgroundImage: heroBackground }}
                >
                    <div className="detalle-provincia-hero-content">
                        <button
                            type="button"
                            className="detalle-provincia-back"
                            onClick={() => navigate(`/departamentos/${provincia.departamento_id}/provincias`)}
                        >
                            ← Volver a provincias
                        </button>

                        <div className="detalle-provincia-label">
                            <span></span>
                            <p>
                                Provincia de {provincia.departamento_nombre || 'Perú'}
                            </p>
                        </div>

                        <h1>{provincia.nombre}</h1>

                        <p className="detalle-provincia-description">
                            {provincia.descripcion_general ||
                                'Sin descripción general registrada para esta provincia.'}
                        </p>

                        <div className="detalle-provincia-actions">
                            <button
                                type="button"
                                onClick={() => navigate(`/provincias/${provincia.id}/distritos`)}
                            >
                                Ver distritos
                            </button>

                            <button
                                type="button"
                                onClick={() => navigate(`/provincias/${provincia.id}/ciudades`)}
                            >
                                Ver ciudades
                            </button>
                        </div>
                    </div>
                </section>

                <section className="detalle-provincia-content">
                    <div className="detalle-provincia-section-header">
                        <span>Información provincial</span>
                        <h2>Ficha informativa</h2>
                        <p>
                            Datos principales de la provincia seleccionada, incluyendo capital,
                            población aproximada, área, actividad económica y festividad representativa.
                        </p>
                    </div>

                    <div className="detalle-provincia-info-grid">
                        <article>
                            <span>Capital</span>
                            <strong>{provincia.capital || 'No registrada'}</strong>
                        </article>

                        <article>
                            <span>Departamento</span>
                            <strong>{provincia.departamento_nombre || 'No registrado'}</strong>
                        </article>

                        <article>
                            <span>Área</span>
                            <strong>{formatNumber(provincia.area_km2)} km²</strong>
                        </article>

                        <article>
                            <span>Población aproximada</span>
                            <strong>{formatNumber(provincia.poblacion_aprox)}</strong>
                        </article>

                        <article>
                            <span>Actividad económica</span>
                            <strong>
                                {provincia.actividad_economica_principal || 'No registrada'}
                            </strong>
                        </article>

                        <article>
                            <span>Festividad representativa</span>
                            <strong>
                                {provincia.festividad_representativa || 'No registrada'}
                            </strong>
                        </article>

                        <article>
                            <span>Número de distritos</span>
                            <strong>{provincia.numero_distritos || 0}</strong>
                        </article>
                    </div>

                    <div className="detalle-provincia-section-header detalle-provincia-section-space">
                        <span>Contenido turístico</span>
                        <h2>Lugares turísticos</h2>
                        <p>
                            Principales espacios turísticos registrados para la provincia de{' '}
                            <strong>{provincia.nombre}</strong>.
                        </p>
                    </div>

                    {lugares.length === 0 ? (
                        <div className="detalle-provincia-empty-grid">
                            <article>
                                <div>📍</div>
                                <h3>No hay lugares turísticos registrados</h3>
                                <p>
                                    Aún no se han agregado lugares turísticos para esta provincia.
                                    Luego podrás registrarlos desde la gestión de contenido.
                                </p>
                            </article>
                        </div>
                    ) : (
                        <div className="detalle-provincia-content-grid">
                            {lugares.map((lugar) => {
                                const image = getContentImage(lugar);

                                return (
                                    <article className="detalle-provincia-tour-card" key={lugar.id}>
                                        <div
                                            className="detalle-provincia-card-image"
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

                                        <div className="detalle-provincia-card-body">
                                            <p>{lugar.descripcion}</p>

                                            {lugar.ubicacion_referencial && (
                                                <div className="detalle-provincia-card-meta">
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

                    <div className="detalle-provincia-section-header detalle-provincia-section-space">
                        <span>Gastronomía</span>
                        <h2>Comidas típicas</h2>
                        <p>
                            Platos y expresiones gastronómicas registradas para la provincia de{' '}
                            <strong>{provincia.nombre}</strong>.
                        </p>
                    </div>

                    {comidas.length === 0 ? (
                        <div className="detalle-provincia-empty-grid">
                            <article>
                                <div>🍽️</div>
                                <h3>No hay comidas típicas registradas</h3>
                                <p>
                                    Aún no se han agregado comidas típicas para esta provincia.
                                    Luego podrás registrarlas desde la gestión de contenido.
                                </p>
                            </article>
                        </div>
                    ) : (
                        <div className="detalle-provincia-content-grid">
                            {comidas.map((comida) => {
                                const image = getContentImage(comida);

                                return (
                                    <article className="detalle-provincia-food-card" key={comida.id}>
                                        <div
                                            className="detalle-provincia-card-image"
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

                                        <div className="detalle-provincia-card-body">
                                            <p>{comida.descripcion}</p>

                                            {comida.origen_descripcion && (
                                                <div className="detalle-provincia-card-meta">
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

export default DetalleProvincia;