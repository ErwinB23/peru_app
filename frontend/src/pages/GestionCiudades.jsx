import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AppHeader from '../components/AppHeader';
import { getDepartamentos } from '../services/departamentoService';
import { getProvincias } from '../services/provinciaService';
import { getDistritos } from '../services/distritoService';
import {
    getCiudades,
    createCiudad,
    updateCiudad,
    deleteCiudad
} from '../services/ciudadService';
import '../styles/GestionCiudades.css';

const initialForm = {
    nombre: '',
    distrito_id: '',
    tipo_ciudad: '',
    poblacion: '',
    latitud: '',
    longitud: '',
    clima: '',
    principal_actividad: '',
    atractivo_turistico: '',
    descripcion_cultural: ''
};

const GestionCiudades = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [departamentos, setDepartamentos] = useState([]);
    const [provincias, setProvincias] = useState([]);
    const [distritos, setDistritos] = useState([]);
    const [ciudades, setCiudades] = useState([]);

    const [filterDepartamento, setFilterDepartamento] = useState(
        searchParams.get('departamento_id') || ''
    );
    const [filterProvincia, setFilterProvincia] = useState(
        searchParams.get('provincia_id') || ''
    );
    const [filterDistrito, setFilterDistrito] = useState(
        searchParams.get('distrito_id') || ''
    );

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('create');
    const [selectedCiudad, setSelectedCiudad] = useState(null);
    const [formData, setFormData] = useState(initialForm);

    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');

    const [deleteModal, setDeleteModal] = useState(false);
    const [ciudadToDelete, setCiudadToDelete] = useState(null);

    const getBackendImageUrl = (path) => {
        if (!path) return '';

        if (path.startsWith('http')) {
            return path;
        }

        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const backendUrl = baseUrl.replace('/api', '');

        return `${backendUrl}${path}`;
    };

    const normalizeList = (data) => {
        if (Array.isArray(data)) return data;
        if (Array.isArray(data?.data)) return data.data;
        if (Array.isArray(data?.departamentos)) return data.departamentos;
        if (Array.isArray(data?.provincias)) return data.provincias;
        if (Array.isArray(data?.distritos)) return data.distritos;
        if (Array.isArray(data?.ciudades)) return data.ciudades;
        return [];
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

    const getProvinciaById = (provinciaId) => {
        return provincias.find(
            (provincia) => String(provincia.id) === String(provinciaId)
        );
    };

    const getDistritoLabel = (distrito) => {
        const provincia = getProvinciaById(distrito.provincia_id);

        const provinciaNombre =
            distrito.provincia_nombre ||
            provincia?.nombre ||
            'Provincia';

        const departamentoNombre =
            distrito.departamento_nombre ||
            provincia?.departamento_nombre ||
            'Departamento';

        return `${distrito.nombre} - ${provinciaNombre} - ${departamentoNombre}`;
    };

    const cargarDatos = async () => {
        try {
            setLoading(true);
            setError('');

            const [
                departamentosData,
                provinciasData,
                distritosData,
                ciudadesData
            ] = await Promise.all([
                getDepartamentos(),
                getProvincias(),
                getDistritos(1, 100),
                getCiudades(1, 100)
            ]);

            setDepartamentos(normalizeList(departamentosData));
            setProvincias(normalizeList(provinciasData));
            setDistritos(normalizeList(distritosData));
            setCiudades(normalizeList(ciudadesData));
        } catch (err) {
            setError(err.response?.data?.error || 'Error al cargar ciudades');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    const provinciasDisponibles = useMemo(() => {
        if (!filterDepartamento) return provincias;

        return provincias.filter(
            (provincia) =>
                String(provincia.departamento_id) === String(filterDepartamento)
        );
    }, [provincias, filterDepartamento]);

    const distritosDisponibles = useMemo(() => {
        return distritos.filter((distrito) => {
            const provincia = getProvinciaById(distrito.provincia_id);

            const matchDepartamento = !filterDepartamento ||
                String(provincia?.departamento_id) === String(filterDepartamento);

            const matchProvincia = !filterProvincia ||
                String(distrito.provincia_id) === String(filterProvincia);

            return matchDepartamento && matchProvincia;
        });
    }, [distritos, provincias, filterDepartamento, filterProvincia]);

    const ciudadesFiltradas = useMemo(() => {
        return ciudades.filter((ciudad) => {
            const matchDepartamento = !filterDepartamento ||
                String(ciudad.departamento_id) === String(filterDepartamento);

            const matchProvincia = !filterProvincia ||
                String(ciudad.provincia_id) === String(filterProvincia);

            const matchDistrito = !filterDistrito ||
                String(ciudad.distrito_id) === String(filterDistrito);

            return matchDepartamento && matchProvincia && matchDistrito;
        });
    }, [ciudades, filterDepartamento, filterProvincia, filterDistrito]);

    const handleDepartamentoFilter = (value) => {
        setFilterDepartamento(value);
        setFilterProvincia('');
        setFilterDistrito('');
    };

    const handleProvinciaFilter = (value) => {
        setFilterProvincia(value);
        setFilterDistrito('');
    };

    const openCreateModal = () => {
        setModalMode('create');
        setSelectedCiudad(null);

        const distritoInicial = filterDistrito || '';

        setFormData({
            ...initialForm,
            distrito_id: distritoInicial
        });

        setImageFile(null);
        setImagePreview('');
        setShowModal(true);
    };

    const openEditModal = (ciudad) => {
        setModalMode('edit');
        setSelectedCiudad(ciudad);

        setFormData({
            nombre: ciudad.nombre || '',
            distrito_id: ciudad.distrito_id || '',
            tipo_ciudad: ciudad.tipo_ciudad || '',
            poblacion: ciudad.poblacion || '',
            latitud: ciudad.latitud || '',
            longitud: ciudad.longitud || '',
            clima: ciudad.clima || '',
            principal_actividad: ciudad.principal_actividad || '',
            atractivo_turistico: ciudad.atractivo_turistico || '',
            descripcion_cultural: ciudad.descripcion_cultural || ''
        });

        setImageFile(null);
        setImagePreview(getBackendImageUrl(ciudad.imagen_fondo || ''));
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setModalMode('create');
        setSelectedCiudad(null);
        setFormData(initialForm);
        setImageFile(null);
        setImagePreview('');
        setSaving(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];

        if (!file) return;

        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);
            setError('');

            const payload = new FormData();

            payload.append('nombre', formData.nombre);
            payload.append('distrito_id', formData.distrito_id);
            payload.append('tipo_ciudad', formData.tipo_ciudad || '');
            payload.append('poblacion', formData.poblacion);
            payload.append('latitud', formData.latitud || '');
            payload.append('longitud', formData.longitud || '');
            payload.append('clima', formData.clima || '');
            payload.append('principal_actividad', formData.principal_actividad || '');
            payload.append('atractivo_turistico', formData.atractivo_turistico || '');
            payload.append('descripcion_cultural', formData.descripcion_cultural || '');

            if (imageFile) {
                payload.append('imagen_fondo', imageFile);
            }

            if (modalMode === 'edit') {
                await updateCiudad(selectedCiudad.id, payload);
            } else {
                await createCiudad(payload);
            }

            await cargarDatos();
            closeModal();
        } catch (err) {
            setError(err.response?.data?.error || 'Error al guardar ciudad');
            setSaving(false);
        }
    };

    const openDeleteModal = (ciudad) => {
        setCiudadToDelete(ciudad);
        setDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setCiudadToDelete(null);
        setDeleteModal(false);
    };

    const confirmDelete = async () => {
        if (!ciudadToDelete?.id) return;

        try {
            await deleteCiudad(ciudadToDelete.id);
            await cargarDatos();
            closeDeleteModal();
        } catch (err) {
            setError(err.response?.data?.error || 'Error al eliminar ciudad');
        }
    };

    if (loading) {
        return (
            <div className="gestion-ciudades-page">
                <AppHeader />

                <main className="gestion-ciudades-state">
                    <div className="gestion-ciudades-loader"></div>
                    <p>Cargando ciudades...</p>
                </main>
            </div>
        );
    }

    return (
        <div className="gestion-ciudades-page">
            <AppHeader />

            <main className="gestion-ciudades-main">
                <section className="gestion-ciudades-hero">
                    <div>
                        <button
                            type="button"
                            className="gestion-ciudades-back"
                            onClick={() => navigate('/home')}
                        >
                            ← Volver al inicio
                        </button>

                        <span>Panel administrativo</span>
                        <h1>Gestionar ciudades</h1>
                        <p>
                            Administra las ciudades, su distrito asociado, datos urbanos,
                            atractivo turístico, actividad principal e imagen de fondo.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="gestion-ciudades-create-btn"
                        onClick={openCreateModal}
                    >
                        + Agregar ciudad
                    </button>
                </section>

                {error && (
                    <div className="gestion-ciudades-error">
                        {error}
                    </div>
                )}

                <section className="gestion-ciudades-toolbar">
                    <div className="gestion-ciudades-filter-grid">
                        <label>
                            Departamento
                            <select
                                value={filterDepartamento}
                                onChange={(e) => handleDepartamentoFilter(e.target.value)}
                            >
                                <option value="">Todos los departamentos</option>

                                {departamentos.map((departamento) => (
                                    <option key={departamento.id} value={departamento.id}>
                                        {departamento.nombre}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label>
                            Provincia
                            <select
                                value={filterProvincia}
                                onChange={(e) => handleProvinciaFilter(e.target.value)}
                            >
                                <option value="">Todas las provincias</option>

                                {provinciasDisponibles.map((provincia) => (
                                    <option key={provincia.id} value={provincia.id}>
                                        {provincia.nombre}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label>
                            Distrito
                            <select
                                value={filterDistrito}
                                onChange={(e) => setFilterDistrito(e.target.value)}
                            >
                                <option value="">Todos los distritos</option>

                                {distritosDisponibles.map((distrito) => (
                                    <option key={distrito.id} value={distrito.id}>
                                        {distrito.nombre}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>

                    <strong>
                        {ciudadesFiltradas.length} ciudad(es)
                    </strong>
                </section>

                {ciudadesFiltradas.length === 0 ? (
                    <section className="gestion-ciudades-empty">
                        <h2>No hay ciudades registradas</h2>
                        <p>
                            Agrega una ciudad para mostrarla dentro del módulo de exploración.
                        </p>

                        <button type="button" onClick={openCreateModal}>
                            Agregar ciudad
                        </button>
                    </section>
                ) : (
                    <section className="gestion-ciudades-grid">
                        {ciudadesFiltradas.map((ciudad) => {
                            const image = getBackendImageUrl(ciudad.imagen_fondo || '');

                            return (
                                <article className="gestion-ciudad-card" key={ciudad.id}>
                                    <div
                                        className="gestion-ciudad-image"
                                        style={
                                            image
                                                ? {
                                                    backgroundImage: `
                                                        linear-gradient(180deg, rgba(0,0,0,0.12), rgba(0,0,0,0.70)),
                                                        url(${image})
                                                    `
                                                }
                                                : undefined
                                        }
                                    >
                                        <span>
                                            {ciudad.provincia_nombre || 'Provincia'}
                                        </span>

                                        <h3>{ciudad.nombre}</h3>
                                    </div>

                                    <div className="gestion-ciudad-body">
                                        <p>
                                            {ciudad.descripcion_cultural ||
                                                ciudad.atractivo_turistico ||
                                                'Sin descripción cultural registrada para esta ciudad.'}
                                        </p>

                                        <div className="gestion-ciudad-info">
                                            <div>
                                                <span>Departamento</span>
                                                <strong>{ciudad.departamento_nombre || 'No registrado'}</strong>
                                            </div>

                                            <div>
                                                <span>Distrito</span>
                                                <strong>{ciudad.distrito_nombre || 'No registrado'}</strong>
                                            </div>

                                            <div>
                                                <span>Población</span>
                                                <strong>{formatNumber(ciudad.poblacion)}</strong>
                                            </div>

                                            <div>
                                                <span>Tipo</span>
                                                <strong>{ciudad.tipo_ciudad || 'No registrado'}</strong>
                                            </div>
                                        </div>

                                        <div className="gestion-ciudad-actions">
                                            <button
                                                type="button"
                                                className="gestion-ciudad-content"
                                                onClick={() => navigate(`/gestionar-ciudades/${ciudad.id}/contenido`)}
                                            >
                                                Contenido
                                            </button>

                                            <button
                                                type="button"
                                                className="gestion-ciudad-view"
                                                onClick={() => navigate(`/ciudades/${ciudad.id}`)}
                                            >
                                                Ver
                                            </button>

                                            <button
                                                type="button"
                                                className="gestion-ciudad-edit"
                                                onClick={() => openEditModal(ciudad)}
                                            >
                                                Editar
                                            </button>

                                            <button
                                                type="button"
                                                className="gestion-ciudad-delete"
                                                onClick={() => openDeleteModal(ciudad)}
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </section>
                )}
            </main>

            {showModal && (
                <div className="gestion-ciudades-modal-overlay">
                    <div className="gestion-ciudades-modal">
                        <div className="gestion-ciudades-modal-header">
                            <div>
                                <span>
                                    {modalMode === 'edit' ? 'Editar ciudad' : 'Nueva ciudad'}
                                </span>

                                <h2>
                                    {modalMode === 'edit'
                                        ? selectedCiudad?.nombre
                                        : 'Agregar ciudad'}
                                </h2>
                            </div>

                            <button type="button" onClick={closeModal}>
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="gestion-ciudades-form">
                            <div className="gestion-ciudades-form-grid">
                                <label>
                                    Nombre *
                                    <input
                                        type="text"
                                        name="nombre"
                                        value={formData.nombre}
                                        onChange={handleChange}
                                        required
                                    />
                                </label>

                                <label>
                                    Distrito *
                                    <select
                                        name="distrito_id"
                                        value={formData.distrito_id}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Selecciona un distrito</option>

                                        {distritos.map((distrito) => (
                                            <option key={distrito.id} value={distrito.id}>
                                                {getDistritoLabel(distrito)}
                                            </option>
                                        ))}
                                    </select>
                                </label>

                                <label>
                                    Tipo de ciudad
                                    <select
                                        name="tipo_ciudad"
                                        value={formData.tipo_ciudad}
                                        onChange={handleChange}
                                    >
                                        <option value="">Selecciona tipo</option>
                                        <option value="Capital">Capital</option>
                                        <option value="Historica">Histórica</option>
                                        <option value="Turistica">Turística</option>
                                        <option value="Comercial">Comercial</option>
                                    </select>
                                </label>

                                <label>
                                    Población *
                                    <input
                                        type="number"
                                        name="poblacion"
                                        value={formData.poblacion}
                                        onChange={handleChange}
                                        required
                                    />
                                </label>

                                <label>
                                    Latitud
                                    <input
                                        type="number"
                                        step="0.00000001"
                                        name="latitud"
                                        value={formData.latitud}
                                        onChange={handleChange}
                                    />
                                </label>

                                <label>
                                    Longitud
                                    <input
                                        type="number"
                                        step="0.00000001"
                                        name="longitud"
                                        value={formData.longitud}
                                        onChange={handleChange}
                                    />
                                </label>

                                <label>
                                    Clima
                                    <input
                                        type="text"
                                        name="clima"
                                        value={formData.clima}
                                        onChange={handleChange}
                                    />
                                </label>

                                <label>
                                    Imagen de fondo
                                    <input
                                        type="file"
                                        accept="image/png,image/jpeg,image/jpg,image/webp"
                                        onChange={handleImageChange}
                                    />
                                </label>
                            </div>

                            <label>
                                Actividad principal
                                <input
                                    type="text"
                                    name="principal_actividad"
                                    value={formData.principal_actividad}
                                    onChange={handleChange}
                                />
                            </label>

                            <label>
                                Atractivo turístico
                                <input
                                    type="text"
                                    name="atractivo_turistico"
                                    value={formData.atractivo_turistico}
                                    onChange={handleChange}
                                />
                            </label>

                            <label>
                                Descripción cultural
                                <textarea
                                    name="descripcion_cultural"
                                    value={formData.descripcion_cultural}
                                    onChange={handleChange}
                                    rows="5"
                                ></textarea>
                            </label>

                            {imagePreview && (
                                <div
                                    className="gestion-ciudades-preview"
                                    style={{
                                        backgroundImage: `
                                            linear-gradient(180deg, rgba(0,0,0,0.05), rgba(0,0,0,0.55)),
                                            url(${imagePreview})
                                        `
                                    }}
                                >
                                    <span>Vista previa</span>
                                </div>
                            )}

                            <div className="gestion-ciudades-modal-actions">
                                <button
                                    type="button"
                                    className="gestion-ciudades-cancel"
                                    onClick={closeModal}
                                >
                                    Cancelar
                                </button>

                                <button
                                    type="submit"
                                    className="gestion-ciudades-save"
                                    disabled={saving}
                                >
                                    {saving ? 'Guardando...' : 'Guardar ciudad'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {deleteModal && (
                <div className="gestion-ciudades-modal-overlay">
                    <div className="gestion-ciudades-delete-modal">
                        <span>⚠️</span>
                        <h2>Eliminar ciudad</h2>
                        <p>
                            ¿Seguro que deseas eliminar la ciudad{' '}
                            <strong>{ciudadToDelete?.nombre}</strong>?
                        </p>

                        <div>
                            <button type="button" onClick={closeDeleteModal}>
                                Cancelar
                            </button>

                            <button type="button" onClick={confirmDelete}>
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GestionCiudades;