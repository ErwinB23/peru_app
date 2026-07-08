import { useEffect, useMemo, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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
    const mapContainerRef = useRef(null);
    const mapInstanceRef = useRef(null);

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

    const normalizeText = (text = '') => {
        return text
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .trim();
    };

    const departamentosMapData = {
        amazonas: { center: [-6.2317, -77.8690], zoom: 8, label: 'Amazonas, Perú' },
        ancash: { center: [-9.5298, -77.5280], zoom: 8, label: 'Áncash, Perú' },
        apurimac: { center: [-13.6340, -72.8810], zoom: 8, label: 'Apurímac, Perú' },
        arequipa: { center: [-16.3989, -71.5350], zoom: 8, label: 'Arequipa, Perú' },
        ayacucho: { center: [-13.1631, -74.2236], zoom: 8, label: 'Ayacucho, Perú' },
        cajamarca: { center: [-7.1617, -78.5128], zoom: 8, label: 'Cajamarca, Perú' },
        callao: { center: [-12.0566, -77.1181], zoom: 11, label: 'Callao, Perú' },
        cusco: { center: [-13.5319, -71.9675], zoom: 8, label: 'Cusco, Perú' },
        huancavelica: { center: [-12.7864, -74.9764], zoom: 8, label: 'Huancavelica, Perú' },
        huanuco: { center: [-9.9306, -76.2422], zoom: 8, label: 'Huánuco, Perú' },
        ica: { center: [-14.0678, -75.7286], zoom: 5, label: 'Ica, Perú' },
        junin: { center: [-12.0651, -75.2049], zoom: 8, label: 'Junín, Perú' },
        'la libertad': { center: [-8.1116, -79.0287], zoom: 8, label: 'La Libertad, Perú' },
        lambayeque: { center: [-6.7714, -79.8409], zoom: 9, label: 'Lambayeque, Perú' },
        lima: { center: [-12.0464, -77.0428], zoom: 8, label: 'Lima, Perú' },
        loreto: { center: [-3.7437, -73.2516], zoom: 7, label: 'Loreto, Perú' },
        'madre de dios': { center: [-12.5933, -69.1891], zoom: 8, label: 'Madre de Dios, Perú' },
        moquegua: { center: [-17.1938, -70.9356], zoom: 9, label: 'Moquegua, Perú' },
        pasco: { center: [-10.6864, -76.2567], zoom: 8, label: 'Pasco, Perú' },
        piura: { center: [-5.1945, -80.6328], zoom: 8, label: 'Piura, Perú' },
        puno: { center: [-15.8402, -70.0219], zoom: 8, label: 'Puno, Perú' },
        'san martin': { center: [-6.0342, -76.9717], zoom: 8, label: 'San Martín, Perú' },
        tacna: { center: [-18.0066, -70.2463], zoom: 9, label: 'Tacna, Perú' },
        tumbes: { center: [-3.5669, -80.4515], zoom: 10, label: 'Tumbes, Perú' },
        ucayali: { center: [-8.3791, -74.5539], zoom: 8, label: 'Ucayali, Perú' }
    };

    const getDepartamentoMapData = (data) => {
        const key = normalizeText(data?.nombre);

        return departamentosMapData[key] || {
            center: [-9.19, -75.0152],
            zoom: 5,
            label: `${data?.nombre || 'Perú'}, Perú`
        };
    };


    const getDepartamentoMapUrl = (data) => {
        const nombre = data?.nombre?.trim();

        if (!nombre) {
            return '';
        }

        return `https://www.google.com/maps?q=${encodeURIComponent(`${nombre} Perú`)}&output=embed`;
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

    const departamentoMapData = useMemo(() => {
        return getDepartamentoMapData(departamento);
    }, [departamento]);

    useEffect(() => {
        if (!departamento || !mapContainerRef.current) return;

        if (mapInstanceRef.current) {
            mapInstanceRef.current.remove();
            mapInstanceRef.current = null;
        }

        const map = L.map(mapContainerRef.current, {
            center: departamentoMapData.center,
            zoom: departamentoMapData.zoom,
            zoomSnap: 0.25,
            zoomDelta: 0.5,
            wheelPxPerZoomLevel: 90,
            scrollWheelZoom: true,
            zoomControl: false,
            keyboard: false,
            attributionControl: true
        });

        L.control.zoom({
            position: 'bottomright'
        }).addTo(map);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            detectRetina: true,
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        const markerIcon = L.divIcon({
            className: 'detalle-dep-custom-marker',
            html: '<div><span>📍</span></div>',
            iconSize: [50, 50],
            iconAnchor: [25, 45],
            popupAnchor: [0, -42]
        });

        L.marker(departamentoMapData.center, {
            icon: markerIcon
        })
            .addTo(map)
            .bindPopup(`<strong>${departamentoMapData.label}</strong>`);

        setTimeout(() => {
            map.invalidateSize();
        }, 100);

        mapInstanceRef.current = map;

        return () => {
            map.remove();
            mapInstanceRef.current = null;
        };
    }, [departamento, departamentoMapData]);

    const departamentoMapUrl = useMemo(() => {
        return getDepartamentoMapUrl(departamento);
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

                    <section className="detalle-dep-intro-section">
                        <div className="detalle-dep-intro-text">
                            <span>Presentación del departamento</span>

                            <h2>
                                Conoce {departamento.nombre}
                            </h2>

                            {departamento.introduccion ? (
                                departamento.introduccion
                                    .split('\n')
                                    .filter((paragraph) => paragraph.trim() !== '')
                                    .map((paragraph, index) => (
                                        <p key={index}>
                                            {paragraph}
                                        </p>
                                    ))
                            ) : (
                                <p>
                                    Aún no se ha registrado una presentación detallada para este departamento.
                                    El administrador podrá agregarla desde la gestión de contenido.
                                </p>
                            )}
                        </div>

                        <div className="detalle-dep-map-card">
                            <div className="detalle-dep-map-header">
                                <span>Ubicación geográfica</span>
                                <h3>Mapa de {departamento.nombre}</h3>
                                <p>
                                    Referencia visual del departamento dentro del territorio peruano.
                                </p>
                            </div>

                            <div
                                ref={mapContainerRef}
                                className="detalle-dep-map-view"
                                aria-label={`Mapa interactivo de ${departamento.nombre}`}
                            ></div>
                        </div>
                    </section>



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
                                        <article
                                            className="detalle-dep-feature-card clickable"
                                            key={lugar.id}
                                            role="button"
                                            tabIndex="0"
                                            onClick={() => navigate(`/lugares-turisticos/${lugar.id}`)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    navigate(`/lugares-turisticos/${lugar.id}`);
                                                }
                                            }}
                                        >
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