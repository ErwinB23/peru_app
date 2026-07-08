import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import AppHeader from '../components/AppHeader';
import { getLugarTuristicoById } from '../services/lugarTuristicoService';
import '../styles/DetalleLugarTuristico.css';

const DetalleLugarTuristico = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [lugar, setLugar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const mapRef = useRef(null);
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

    const renderParagraphs = (text, fallback) => {
        if (!text) {
            return <p>{fallback}</p>;
        }

        return text
            .split('\n')
            .filter((paragraph) => paragraph.trim() !== '')
            .map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
            ));
    };

    const renderRecommendations = (text) => {
        if (!text) {
            return (
                <li>No se registraron recomendaciones para esta sección.</li>
            );
        }

        return text
            .split('\n')
            .map((item) => item.replace(/^[-•]\s*/, '').trim())
            .filter((item) => item !== '')
            .map((item, index) => (
                <li key={index}>{item}</li>
            ));
    };

    const cargarLugar = async () => {
        try {
            setLoading(true);
            setError('');

            const data = await getLugarTuristicoById(id);
            setLugar(data?.lugar || data);
        } catch (err) {
            setError(err.response?.data?.error || 'Error al cargar el lugar turístico');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarLugar();
    }, [id]);

    const heroImage = useMemo(() => {
        const image = getBackendImageUrl(lugar?.imagen);

        if (image) {
            return `
                linear-gradient(90deg, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.48) 50%, rgba(0,0,0,0.20) 100%),
                url(${image})
            `;
        }

        return `
            radial-gradient(circle at 78% 22%, rgba(255, 209, 102, 0.26), transparent 28%),
            linear-gradient(135deg, #111827 0%, #9f1025 48%, #106f8e 100%)
        `;
    }, [lugar]);

    const galleryImages = useMemo(() => {
        if (!lugar) return [];

        return [
            lugar.imagen,
            lugar.imagen_2,
            lugar.imagen_3,
            lugar.imagen_4,
        ]
            .filter(Boolean)
            .map((image) => getBackendImageUrl(image));
    }, [lugar]);

    const routeTextData = useMemo(() => {
        return {
            origenNombre: lugar?.origen_nombre || 'Punto de origen',
            origenBusqueda: lugar?.origen_busqueda || lugar?.origen_nombre || '',
            destinoNombre: lugar?.destino_nombre || lugar?.nombre || 'Destino',
            destinoBusqueda:
                lugar?.destino_busqueda ||
                lugar?.ubicacion_referencial ||
                lugar?.nombre ||
                '',
        };
    }, [lugar]);

    const getCoordinatesFromText = async (query) => {
        if (!query) return null;

        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`
        );

        const data = await response.json();

        if (!Array.isArray(data) || data.length === 0) {
            return null;
        }

        return {
            lat: Number(data[0].lat),
            lon: Number(data[0].lon),
        };
    };

    const getRoadRoute = async (origin, destination) => {
        if (!origin || !destination) return null;

        const response = await fetch(
            `https://router.project-osrm.org/route/v1/driving/${origin.lon},${origin.lat};${destination.lon},${destination.lat}?overview=full&geometries=geojson`
        );

        const data = await response.json();

        return data.routes?.[0] || null;
    };

    useEffect(() => {
        if (!lugar || !mapRef.current) return;

        let cancelled = false;

        const loadMapRoute = async () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }

            const map = L.map(mapRef.current, {
                center: [-9.19, -75.0152],
                zoom: 5,
                scrollWheelZoom: true,
                zoomControl: false,
                keyboard: false,
                attributionControl: true,
            });

            L.control.zoom({
                position: 'bottomright',
            }).addTo(map);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                detectRetina: true,
                attribution: '© OpenStreetMap contributors',
            }).addTo(map);

            mapInstanceRef.current = map;

            try {
                const originCoords = await getCoordinatesFromText(routeTextData.origenBusqueda);
                const destinationCoords = await getCoordinatesFromText(routeTextData.destinoBusqueda);

                if (cancelled) return;

                const origenIcon = L.divIcon({
                    className: 'detalle-lugar-marker origen',
                    html: '<div>INICIO</div>',
                    iconSize: [74, 34],
                    iconAnchor: [37, 17],
                });

                const destinoIcon = L.divIcon({
                    className: 'detalle-lugar-marker destino',
                    html: '<div>DESTINO</div>',
                    iconSize: [86, 34],
                    iconAnchor: [43, 17],
                });

                const points = [];

                if (originCoords) {
                    const originPoint = [originCoords.lat, originCoords.lon];

                    L.marker(originPoint, { icon: origenIcon })
                        .addTo(map)
                        .bindPopup(`<strong>${routeTextData.origenNombre}</strong>`);

                    points.push(originPoint);
                }

                if (destinationCoords) {
                    const destinationPoint = [destinationCoords.lat, destinationCoords.lon];

                    L.marker(destinationPoint, { icon: destinoIcon })
                        .addTo(map)
                        .bindPopup(`<strong>${routeTextData.destinoNombre}</strong>`);

                    points.push(destinationPoint);
                }

                if (originCoords && destinationCoords) {
                    const route = await getRoadRoute(originCoords, destinationCoords);

                    if (cancelled) return;

                    if (route?.geometry) {
                        const routeLine = L.geoJSON(route.geometry, {
                            style: {
                                color: '#D91023',
                                weight: 6,
                                opacity: 0.95,
                            },
                        }).addTo(map);

                        map.fitBounds(routeLine.getBounds(), {
                            padding: [70, 70],
                        });
                    } else if (points.length > 1) {
                        const fallbackLine = L.polyline(points, {
                            color: '#D91023',
                            weight: 5,
                            opacity: 0.85,
                            dashArray: '10 8',
                        }).addTo(map);

                        map.fitBounds(fallbackLine.getBounds(), {
                            padding: [70, 70],
                        });
                    }
                } else if (points.length > 0) {
                    map.setView(points[0], 8);
                }

                setTimeout(() => {
                    map.invalidateSize();
                }, 150);
            } catch (err) {
                console.error('Error al calcular ruta:', err);
            }
        };

        loadMapRoute();

        return () => {
            cancelled = true;

            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, [lugar, routeTextData]);

    if (loading) {
        return (
            <div className="detalle-lugar-page">
                <AppHeader />

                <main className="detalle-lugar-state">
                    <div className="detalle-lugar-loader"></div>
                    <p>Cargando lugar turístico...</p>
                </main>
            </div>
        );
    }

    if (error || !lugar) {
        return (
            <div className="detalle-lugar-page">
                <AppHeader />

                <main className="detalle-lugar-state">
                    <span>⚠️</span>
                    <h2>No se pudo cargar el lugar turístico</h2>
                    <p>{error || 'Lugar turístico no encontrado'}</p>

                    <button type="button" onClick={() => navigate(-1)}>
                        Volver
                    </button>
                </main>
            </div>
        );
    }

    return (
        <div className="detalle-lugar-page">
            <AppHeader />

            <main>
                <section
                    className="detalle-lugar-hero"
                    style={{ backgroundImage: heroImage }}
                >
                    <div className="detalle-lugar-hero-content">
                        <button
                            type="button"
                            className="detalle-lugar-back"
                            onClick={() => navigate(-1)}
                        >
                            ← Volver
                        </button>

                        <span className="detalle-lugar-badge">
                            Lugar turístico
                        </span>

                        <h1>{lugar.nombre}</h1>

                        <p>
                            {lugar.ubicacion_referencial ||
                                `${lugar.departamento_nombre || 'Perú'}`}
                        </p>
                    </div>
                </section>

                <section className="detalle-lugar-content">
                    <section className="detalle-lugar-about">
                        <div>
                            <span>Acerca de</span>
                            <h2>Descubre {lugar.nombre}</h2>
                        </div>

                        <div className="detalle-lugar-text">
                            {renderParagraphs(
                                lugar.acerca || lugar.descripcion,
                                'Aún no se ha registrado información detallada para este lugar turístico.'
                            )}
                        </div>
                    </section>

                    <section className="detalle-lugar-grid-section">
                        <div className="detalle-lugar-info-card">
                            <span>Información general</span>
                            <h2>Datos del destino</h2>

                            <div className="detalle-lugar-info-grid">
                                <article>
                                    <small>Departamento</small>
                                    <strong>{lugar.departamento_nombre || 'No registrado'}</strong>
                                </article>

                                <article>
                                    <small>Provincia</small>
                                    <strong>{lugar.provincia || 'No registrada'}</strong>
                                </article>

                                <article>
                                    <small>Distrito</small>
                                    <strong>{lugar.distrito || 'No registrado'}</strong>
                                </article>

                                <article>
                                    <small>Clima</small>
                                    <strong>{lugar.clima || 'No registrado'}</strong>
                                </article>

                                <article>
                                    <small>Altura</small>
                                    <strong>{lugar.altura || 'No registrada'}</strong>
                                </article>

                                <article>
                                    <small>Ubicación</small>
                                    <strong>{lugar.ubicacion_referencial || 'No registrada'}</strong>
                                </article>
                            </div>
                        </div>

                        <div className="detalle-lugar-gallery-card">
                            <span>Galería</span>
                            <h2>Fotos del lugar</h2>

                            {galleryImages.length === 0 ? (
                                <div className="detalle-lugar-gallery-empty">
                                    Sin imágenes registradas
                                </div>
                            ) : (
                                <div className="detalle-lugar-gallery-grid">
                                    {galleryImages.map((image, index) => (
                                        <img
                                            key={index}
                                            src={image}
                                            alt={`${lugar.nombre} ${index + 1}`}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>

                    <section className="detalle-lugar-route-section">
                        <div className="detalle-lugar-route-info">
                            <span>Cómo llegar</span>
                            <h2>Ruta referencial</h2>

                            <p>
                                El mapa muestra una ruta por carretera desde{' '}
                                <strong>{routeTextData.origenNombre}</strong>{' '}
                                hasta <strong>{routeTextData.destinoNombre}</strong>.
                            </p>

                            <small>
                                La ruta se calcula automáticamente usando el origen y destino registrados.
                            </small>
                        </div>

                        <div
                            ref={mapRef}
                            className="detalle-lugar-map"
                            aria-label={`Mapa de ruta hacia ${lugar.nombre}`}
                        ></div>
                    </section>

                    <section className="detalle-lugar-recommendations">
                        <div className="detalle-lugar-rec-card">
                            <span>Antes del viaje</span>
                            <h2>Recomendaciones previas</h2>

                            <ul>
                                {renderRecommendations(lugar.recomendaciones_antes)}
                            </ul>
                        </div>

                        <div className="detalle-lugar-rec-card">
                            <span>Durante el viaje</span>
                            <h2>Recomendaciones en destino</h2>

                            <ul>
                                {renderRecommendations(lugar.recomendaciones_durante)}
                            </ul>
                        </div>
                    </section>
                </section>
            </main>
        </div>
    );
};

export default DetalleLugarTuristico;