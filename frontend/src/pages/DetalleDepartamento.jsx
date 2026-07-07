import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AppHeader from '../components/AppHeader';
import { getDepartamentoById } from '../services/departamentoService';
import '../styles/DetalleDepartamento.css';
import { getLugaresByDepartamentoId } from '../services/lugarTuristicoService';
import { getComidasByDepartamentoId } from '../services/comidaTipicaService';


const DetalleDepartamento = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [departamento, setDepartamento] = useState(null);
    const [lugaresTuristicos, setLugaresTuristicos] = useState([]);
    const [comidasTipicas, setComidasTipicas] = useState([]);
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

    const cargarDepartamento = async () => {
        try {
            setLoading(true);
            setError('');

            const [departamentoData, lugaresData, comidasData] = await Promise.all([
                getDepartamentoById(id),
                getLugaresByDepartamentoId(id),
                getComidasByDepartamentoId(id)
            ]);

            if (departamentoData?.departamento) {
                setDepartamento(departamentoData.departamento);
            } else {
                setDepartamento(departamentoData);
            }

            setLugaresTuristicos(Array.isArray(lugaresData) ? lugaresData : []);
            setComidasTipicas(Array.isArray(comidasData) ? comidasData : []);
        } catch (err) {
            setError(err.response?.data?.error || 'Error al cargar el departamento');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarDepartamento();
    }, [id]);

    const heroImage = useMemo(() => {
        const image = getDepartamentoImage(departamento);

        if (image) {
            return `
                linear-gradient(90deg, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.46) 48%, rgba(0,0,0,0.18) 100%),
                url(${image})
            `;
        }

        return `
            radial-gradient(circle at 78% 22%, rgba(255, 209, 102, 0.28), transparent 28%),
            radial-gradient(circle at 18% 82%, rgba(16, 111, 142, 0.35), transparent 35%),
            linear-gradient(135deg, #111827 0%, #9f1025 48%, #106f8e 100%)
        `;
    }, [departamento]);

    if (loading) {
        return (
            <div className="detalle-dep-page">
                <AppHeader />

                <main className="detalle-dep-state">
                    <div className="detalle-dep-loader"></div>
                    <p>Cargando información del departamento...</p>
                </main>
            </div>
        );
    }

    if (error || !departamento) {
        return (
            <div className="detalle-dep-page">
                <AppHeader />

                <main className="detalle-dep-state">
                    <span>⚠️</span>
                    <h2>No se pudo cargar el departamento</h2>
                    <p>{error || 'Departamento no encontrado'}</p>

                    <button type="button" onClick={() => navigate('/departamentos')}>
                        Volver a departamentos
                    </button>
                </main>
            </div>
        );
    }

    return (
        <div className="detalle-dep-page">
            <AppHeader />

            <main>
                <section
                    className="detalle-dep-hero"
                    style={{ backgroundImage: heroImage }}
                >
                    <div className="detalle-dep-hero-content">
                        <button
                            type="button"
                            className="detalle-dep-back"
                            onClick={() => navigate('/departamentos')}
                        >
                            ← Volver a departamentos
                        </button>

                        <div className="detalle-dep-location">
                            <span></span>
                            <p>{departamento.region_natural || 'Región no registrada'} - Perú</p>
                        </div>

                        <h1>{departamento.nombre}</h1>

                        <p className="detalle-dep-description">
                            {departamento.descripcion || 'Sin descripción registrada para este departamento.'}
                        </p>

                        <div className="detalle-dep-actions">
                            <button
                                type="button"
                                onClick={() => navigate(`/departamentos/${departamento.id}/provincias`)}
                            >
                                Ver provincias
                            </button>

                            <button
                                type="button"
                                onClick={() => navigate(`/departamentos/${departamento.id}/distritos`)}
                            >
                                Ver distritos
                            </button>

                            <button
                                type="button"
                                onClick={() => navigate(`/departamentos/${departamento.id}/ciudades`)}
                            >
                                Ver ciudades
                            </button>
                        </div>
                    </div>
                </section>

                <section className="detalle-dep-content">
                    <div className="detalle-dep-section-header">
                        <span>Información general</span>
                        <h2>Ficha informativa</h2>
                        <p>
                            Datos principales del departamento para conocer su ubicación,
                            características y actividad turística.
                        </p>
                    </div>

                    <div className="detalle-dep-info-grid">
                        <article>
                            <span>Capital</span>
                            <strong>{departamento.capital || 'No registrada'}</strong>
                        </article>

                        <article>
                            <span>Región natural</span>
                            <strong>{departamento.region_natural || 'No registrada'}</strong>
                        </article>

                        <article>
                            <span>Clima predominante</span>
                            <strong>{departamento.clima_predominante || 'No registrado'}</strong>
                        </article>

                        <article>
                            <span>Área</span>
                            <strong>{formatNumber(departamento.area_km2)} km²</strong>
                        </article>

                        <article>
                            <span>Población aproximada</span>
                            <strong>{formatNumber(departamento.poblacion_aprox)}</strong>
                        </article>

                        <article>
                            <span>Actividades principales</span>
                            <strong>{departamento.principales_actividades || 'No registradas'}</strong>
                        </article>
                    </div>

                    <section className="detalle-dep-tourism-section">
                        <div className="detalle-dep-section-header">
                            <span>Turismo</span>
                            <h2>Lugares turísticos</h2>
                            <p>
                                Principales destinos turísticos registrados para este departamento.
                            </p>
                        </div>

                        {lugaresTuristicos.length === 0 ? (
                            <div className="detalle-dep-empty-card">
                                <h3>No hay lugares turísticos registrados</h3>
                                <p>
                                    Más adelante el administrador podrá agregar lugares turísticos desde la gestión del departamento.
                                </p>
                            </div>
                        ) : (
                            <div className="detalle-dep-card-grid">
                                {lugaresTuristicos.map((lugar) => {
                                    const imageUrl = getBackendImageUrl(lugar.imagen);

                                    return (
                                        <article className="detalle-dep-feature-card" key={lugar.id}>
                                            <div className="detalle-dep-feature-image">
                                                {imageUrl ? (
                                                    <img src={imageUrl} alt={lugar.nombre} />
                                                ) : (
                                                    <div className="detalle-dep-no-image">
                                                        Sin imagen
                                                    </div>
                                                )}
                                            </div>

                                            <div className="detalle-dep-feature-content">
                                                <span>{lugar.ubicacion_referencial || 'Lugar turístico'}</span>
                                                <h3>{lugar.nombre}</h3>
                                                <p>{lugar.descripcion}</p>
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>
                        )}
                    </section>

                    <section className="detalle-dep-tourism-section">
                        <div className="detalle-dep-section-header">
                            <span>Gastronomía</span>
                            <h2>Comidas típicas</h2>
                            <p>
                                Platos representativos del departamento con descripción e imagen.
                            </p>
                        </div>

                        {comidasTipicas.length === 0 ? (
                            <div className="detalle-dep-empty-card">
                                <h3>No hay comidas típicas registradas</h3>
                                <p>
                                    Más adelante el administrador podrá agregar comidas típicas desde la gestión del departamento.
                                </p>
                            </div>
                        ) : (
                            <div className="detalle-dep-card-grid">
                                {comidasTipicas.map((comida) => {
                                    const imageUrl = getBackendImageUrl(comida.imagen);

                                    return (
                                        <article className="detalle-dep-feature-card" key={comida.id}>
                                            <div className="detalle-dep-feature-image">
                                                {imageUrl ? (
                                                    <img src={imageUrl} alt={comida.nombre} />
                                                ) : (
                                                    <div className="detalle-dep-no-image">
                                                        Sin imagen
                                                    </div>
                                                )}
                                            </div>

                                            <div className="detalle-dep-feature-content">
                                                <span>{comida.origen_descripcion || 'Comida típica'}</span>
                                                <h3>{comida.nombre}</h3>
                                                <p>{comida.descripcion}</p>
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>
                        )}
                    </section>
                </section>
            </main>
        </div>
    );
};

export default DetalleDepartamento;