import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AppHeader from '../components/AppHeader';
import { getProvincias } from '../services/provinciaService';
import {
    getDistritos,
    createDistrito,
    updateDistrito,
    deleteDistrito
} from '../services/distritoService';
import '../styles/GestionDistritos.css';

const initialForm = {
    nombre: '',
    provincia_id: '',
    area_km2: '',
    poblacion_aprox: '',
    altitud_msnm: '',
    tipo_zona: '',
    nivel_desarrollo: '',
    descripcion: ''
};

const GestionDistritos = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [provincias, setProvincias] = useState([]);
    const [distritos, setDistritos] = useState([]);
    const [filterProvincia, setFilterProvincia] = useState(
        searchParams.get('provincia_id') || ''
    );

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('create');
    const [selectedDistrito, setSelectedDistrito] = useState(null);
    const [formData, setFormData] = useState(initialForm);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');

    const [deleteModal, setDeleteModal] = useState(false);
    const [distritoToDelete, setDistritoToDelete] = useState(null);

    const getBackendImageUrl = (path) => {
        if (!path) return '';

        if (path.startsWith('http')) {
            return path;
        }

        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const backendUrl = baseUrl.replace('/api', '');

        return `${backendUrl}${path}`;
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

            const [provinciasData, distritosData] = await Promise.all([
                getProvincias(),
                getDistritos(1, 100)
            ]);

            setProvincias(Array.isArray(provinciasData) ? provinciasData : []);

            const distritosList = Array.isArray(distritosData)
                ? distritosData
                : distritosData?.data || [];

            setDistritos(distritosList);
        } catch (err) {
            setError(err.response?.data?.error || 'Error al cargar distritos');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    const distritosFiltrados = useMemo(() => {
        if (!filterProvincia) {
            return distritos;
        }

        return distritos.filter(
            (distrito) => String(distrito.provincia_id) === String(filterProvincia)
        );
    }, [distritos, filterProvincia]);

    const getProvinciaNombre = (provinciaId) => {
        const provincia = provincias.find(
            (item) => String(item.id) === String(provinciaId)
        );

        return provincia?.nombre || 'No registrada';
    };

    const openCreateModal = () => {
        setModalMode('create');
        setSelectedDistrito(null);
        setFormData({
            ...initialForm,
            provincia_id: filterProvincia || ''
        });
        setImageFile(null);
        setImagePreview('');
        setShowModal(true);
    };

    const openEditModal = (distrito) => {
        setModalMode('edit');
        setSelectedDistrito(distrito);
        setFormData({
            nombre: distrito.nombre || '',
            provincia_id: distrito.provincia_id || '',
            area_km2: distrito.area_km2 || '',
            poblacion_aprox: distrito.poblacion_aprox || '',
            altitud_msnm: distrito.altitud_msnm || '',
            tipo_zona: distrito.tipo_zona || '',
            nivel_desarrollo: distrito.nivel_desarrollo || '',
            descripcion: distrito.descripcion || ''
        });
        setImageFile(null);
        setImagePreview(getBackendImageUrl(distrito.imagen_fondo || ''));
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedDistrito(null);
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
            payload.append('provincia_id', formData.provincia_id);
            payload.append('area_km2', formData.area_km2);
            payload.append('poblacion_aprox', formData.poblacion_aprox);
            payload.append('altitud_msnm', formData.altitud_msnm || '');
            payload.append('tipo_zona', formData.tipo_zona || '');
            payload.append('nivel_desarrollo', formData.nivel_desarrollo || '');
            payload.append('descripcion', formData.descripcion || '');

            if (imageFile) {
                payload.append('imagen_fondo', imageFile);
            }

            if (modalMode === 'edit') {
                await updateDistrito(selectedDistrito.id, payload);
            } else {
                await createDistrito(payload);
            }

            await cargarDatos();
            closeModal();
        } catch (err) {
            setError(err.response?.data?.error || 'Error al guardar distrito');
            setSaving(false);
        }
    };

    const openDeleteModal = (distrito) => {
        setDistritoToDelete(distrito);
        setDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setDistritoToDelete(null);
        setDeleteModal(false);
    };

    const confirmDelete = async () => {
        if (!distritoToDelete?.id) return;

        try {
            await deleteDistrito(distritoToDelete.id);
            await cargarDatos();
            closeDeleteModal();
        } catch (err) {
            setError(err.response?.data?.error || 'Error al eliminar distrito');
        }
    };

    if (loading) {
        return (
            <div className="gestion-distritos-page">
                <AppHeader />

                <main className="gestion-distritos-state">
                    <div className="gestion-distritos-loader"></div>
                    <p>Cargando distritos...</p>
                </main>
            </div>
        );
    }

    return (
        <div className="gestion-distritos-page">
            <AppHeader />

            <main className="gestion-distritos-main">
                <section className="gestion-distritos-hero">
                    <div>
                        <button
                            type="button"
                            className="gestion-distritos-back"
                            onClick={() => navigate('/home')}
                        >
                            ← Volver al inicio
                        </button>

                        <span>Panel administrativo</span>
                        <h1>Gestionar distritos</h1>
                        <p>
                            Administra los distritos, su provincia asociada, datos territoriales,
                            descripción local, datos territoriales e imagen de fondo.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="gestion-distritos-create-btn"
                        onClick={openCreateModal}
                    >
                        + Agregar distrito
                    </button>
                </section>

                {error && (
                    <div className="gestion-distritos-error">
                        {error}
                    </div>
                )}

                <section className="gestion-distritos-toolbar">
                    <div>
                        <label>Filtrar por provincia</label>

                        <select
                            value={filterProvincia}
                            onChange={(e) => setFilterProvincia(e.target.value)}
                        >
                            <option value="">Todas las provincias</option>

                            {provincias.map((provincia) => (
                                <option key={provincia.id} value={provincia.id}>
                                    {provincia.nombre}
                                    {provincia.departamento_nombre
                                        ? ` - ${provincia.departamento_nombre}`
                                        : ''}
                                </option>
                            ))}
                        </select>
                    </div>

                    <strong>
                        {distritosFiltrados.length} distrito(s)
                    </strong>
                </section>

                {distritosFiltrados.length === 0 ? (
                    <section className="gestion-distritos-empty">
                        <h2>No hay distritos registrados</h2>
                        <p>
                            Agrega un distrito para mostrarlo dentro del módulo de exploración.
                        </p>

                        <button type="button" onClick={openCreateModal}>
                            Agregar distrito
                        </button>
                    </section>
                ) : (
                    <section className="gestion-distritos-grid">
                        {distritosFiltrados.map((distrito) => {
                            const image = getBackendImageUrl(distrito.imagen_fondo || '');

                            return (
                                <article className="gestion-distrito-card" key={distrito.id}>
                                    <div
                                        className="gestion-distrito-image"
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
                                        <span>{getProvinciaNombre(distrito.provincia_id)}</span>
                                        <h3>{distrito.nombre}</h3>
                                    </div>

                                    <div className="gestion-distrito-body">
                                        <p>
                                            {distrito.descripcion ||
                                                'Sin descripción registrada para este distrito.'}
                                        </p>

                                        <div className="gestion-distrito-info">
                                            <div>
                                                <span>Población</span>
                                                <strong>{formatNumber(distrito.poblacion_aprox)}</strong>
                                            </div>

                                            <div>
                                                <span>Área</span>
                                                <strong>{formatNumber(distrito.area_km2)} km²</strong>
                                            </div>

                                            <div>
                                                <span>Altitud</span>
                                                <strong>
                                                    {distrito.altitud_msnm
                                                        ? `${formatNumber(distrito.altitud_msnm)} msnm`
                                                        : 'No registrada'}
                                                </strong>
                                            </div>

                                            <div>
                                                <span>Zona</span>
                                                <strong>{distrito.tipo_zona || 'No registrada'}</strong>
                                            </div>
                                        </div>

                                        <div className="gestion-distrito-actions">
                                            <button
                                                type="button"
                                                className="gestion-distrito-content"
                                                onClick={() => navigate(`/gestionar-distritos/${distrito.id}/contenido`)}
                                            >
                                                Contenido
                                            </button>

                                            <button
                                                type="button"
                                                className="gestion-distrito-view"
                                                onClick={() => navigate(`/distritos/${distrito.id}`)}
                                            >
                                                Ver
                                            </button>

                                            <button
                                                type="button"
                                                className="gestion-distrito-edit"
                                                onClick={() => openEditModal(distrito)}
                                            >
                                                Editar
                                            </button>

                                            <button
                                                type="button"
                                                className="gestion-distrito-delete"
                                                onClick={() => openDeleteModal(distrito)}
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
                <div className="gestion-distritos-modal-overlay">
                    <div className="gestion-distritos-modal">
                        <div className="gestion-distritos-modal-header">
                            <div>
                                <span>
                                    {modalMode === 'edit' ? 'Editar distrito' : 'Nuevo distrito'}
                                </span>
                                <h2>
                                    {modalMode === 'edit'
                                        ? selectedDistrito?.nombre
                                        : 'Agregar distrito'}
                                </h2>
                            </div>

                            <button type="button" onClick={closeModal}>
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="gestion-distritos-form">
                            <div className="gestion-distritos-form-grid">
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
                                    Provincia *
                                    <select
                                        name="provincia_id"
                                        value={formData.provincia_id}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Selecciona una provincia</option>

                                        {provincias.map((provincia) => (
                                            <option key={provincia.id} value={provincia.id}>
                                                {provincia.nombre}
                                                {provincia.departamento_nombre
                                                    ? ` - ${provincia.departamento_nombre}`
                                                    : ''}
                                            </option>
                                        ))}
                                    </select>
                                </label>

                                <label>
                                    Área km² *
                                    <input
                                        type="number"
                                        step="0.01"
                                        name="area_km2"
                                        value={formData.area_km2}
                                        onChange={handleChange}
                                        required
                                    />
                                </label>

                                <label>
                                    Población aproximada *
                                    <input
                                        type="number"
                                        name="poblacion_aprox"
                                        value={formData.poblacion_aprox}
                                        onChange={handleChange}
                                        required
                                    />
                                </label>

                                <label>
                                    Altitud msnm
                                    <input
                                        type="number"
                                        name="altitud_msnm"
                                        value={formData.altitud_msnm}
                                        onChange={handleChange}
                                    />
                                </label>

                                <label>
                                    Tipo de zona
                                    <select
                                        name="tipo_zona"
                                        value={formData.tipo_zona}
                                        onChange={handleChange}
                                    >
                                        <option value="">Selecciona tipo de zona</option>
                                        <option value="Urbano">Urbano</option>
                                        <option value="Rural">Rural</option>
                                        <option value="Mixto">Mixto</option>
                                    </select>
                                </label>

                                <label>
                                    Nivel de desarrollo
                                    <select
                                        name="nivel_desarrollo"
                                        value={formData.nivel_desarrollo}
                                        onChange={handleChange}
                                    >
                                        <option value="">Selecciona nivel</option>
                                        <option value="Alto">Alto</option>
                                        <option value="Medio">Medio</option>
                                        <option value="Bajo">Bajo</option>
                                    </select>
                                </label>

                                <label className="gestion-distritos-file-label">
                                    Imagen de fondo
                                    <input
                                        type="file"
                                        accept="image/png,image/jpeg,image/jpg,image/webp"
                                        onChange={handleImageChange}
                                    />
                                </label>
                            </div>


                            <label>
                                Descripción
                                <textarea
                                    name="descripcion"
                                    value={formData.descripcion}
                                    onChange={handleChange}
                                    rows="5"
                                ></textarea>
                            </label>

                            {imagePreview && (
                                <div
                                    className="gestion-distritos-preview"
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

                            <div className="gestion-distritos-modal-actions">
                                <button
                                    type="button"
                                    className="gestion-distritos-cancel"
                                    onClick={closeModal}
                                >
                                    Cancelar
                                </button>

                                <button
                                    type="submit"
                                    className="gestion-distritos-save"
                                    disabled={saving}
                                >
                                    {saving ? 'Guardando...' : 'Guardar distrito'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {deleteModal && (
                <div className="gestion-distritos-modal-overlay">
                    <div className="gestion-distritos-delete-modal">
                        <span>⚠️</span>
                        <h2>Eliminar distrito</h2>
                        <p>
                            ¿Seguro que deseas eliminar el distrito{' '}
                            <strong>{distritoToDelete?.nombre}</strong>?
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

export default GestionDistritos;