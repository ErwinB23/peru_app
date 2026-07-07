import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AppHeader from '../components/AppHeader';
import { getDepartamentos } from '../services/departamentoService';
import {
    getProvincias,
    createProvincia,
    updateProvincia,
    deleteProvincia
} from '../services/provinciaService';
import '../styles/GestionProvincias.css';

const initialForm = {
    nombre: '',
    capital: '',
    departamento_id: '',
    area_km2: '',
    poblacion_aprox: '',
    actividad_economica_principal: '',
    festividad_representativa: '',
    descripcion_general: ''
};

const GestionProvincias = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [departamentos, setDepartamentos] = useState([]);
    const [provincias, setProvincias] = useState([]);
    const [filterDepartamento, setFilterDepartamento] = useState(
        searchParams.get('departamento_id') || ''
    );

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('create');
    const [selectedProvincia, setSelectedProvincia] = useState(null);
    const [formData, setFormData] = useState(initialForm);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');

    const [deleteModal, setDeleteModal] = useState(false);
    const [provinciaToDelete, setProvinciaToDelete] = useState(null);

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

            const [departamentosData, provinciasData] = await Promise.all([
                getDepartamentos(),
                getProvincias()
            ]);

            setDepartamentos(
                Array.isArray(departamentosData)
                    ? departamentosData
                    : departamentosData.departamentos || []
            );

            setProvincias(Array.isArray(provinciasData) ? provinciasData : []);
        } catch (err) {
            setError(err.response?.data?.error || 'Error al cargar provincias');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    const provinciasFiltradas = useMemo(() => {
        if (!filterDepartamento) {
            return provincias;
        }

        return provincias.filter(
            (provincia) => String(provincia.departamento_id) === String(filterDepartamento)
        );
    }, [provincias, filterDepartamento]);

    const getDepartamentoNombre = (departamentoId) => {
        const departamento = departamentos.find(
            (item) => String(item.id) === String(departamentoId)
        );

        return departamento?.nombre || 'No registrado';
    };

    const openCreateModal = () => {
        setModalMode('create');
        setSelectedProvincia(null);
        setFormData({
            ...initialForm,
            departamento_id: filterDepartamento || ''
        });
        setImageFile(null);
        setImagePreview('');
        setShowModal(true);
    };

    const openEditModal = (provincia) => {
        setModalMode('edit');
        setSelectedProvincia(provincia);
        setFormData({
            nombre: provincia.nombre || '',
            capital: provincia.capital || '',
            departamento_id: provincia.departamento_id || '',
            area_km2: provincia.area_km2 || '',
            poblacion_aprox: provincia.poblacion_aprox || '',
            actividad_economica_principal: provincia.actividad_economica_principal || '',
            festividad_representativa: provincia.festividad_representativa || '',
            descripcion_general: provincia.descripcion_general || ''
        });
        setImageFile(null);
        setImagePreview(getBackendImageUrl(provincia.imagen_fondo || ''));
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedProvincia(null);
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

            const payload = new FormData();

            payload.append('nombre', formData.nombre);
            payload.append('capital', formData.capital);
            payload.append('departamento_id', formData.departamento_id);
            payload.append('area_km2', formData.area_km2);
            payload.append('poblacion_aprox', formData.poblacion_aprox);
            payload.append(
                'actividad_economica_principal',
                formData.actividad_economica_principal || ''
            );
            payload.append(
                'festividad_representativa',
                formData.festividad_representativa || ''
            );
            payload.append('descripcion_general', formData.descripcion_general || '');

            if (imageFile) {
                payload.append('imagen_fondo', imageFile);
            }

            if (modalMode === 'edit') {
                await updateProvincia(selectedProvincia.id, payload);
            } else {
                await createProvincia(payload);
            }

            await cargarDatos();
            closeModal();
        } catch (err) {
            setError(err.response?.data?.error || 'Error al guardar provincia');
            setSaving(false);
        }
    };

    const openDeleteModal = (provincia) => {
        setProvinciaToDelete(provincia);
        setDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setProvinciaToDelete(null);
        setDeleteModal(false);
    };

    const confirmDelete = async () => {
        if (!provinciaToDelete?.id) return;

        try {
            await deleteProvincia(provinciaToDelete.id);
            await cargarDatos();
            closeDeleteModal();
        } catch (err) {
            setError(err.response?.data?.error || 'Error al eliminar provincia');
        }
    };

    if (loading) {
        return (
            <div className="gestion-provincias-page">
                <AppHeader />

                <main className="gestion-provincias-state">
                    <div className="gestion-provincias-loader"></div>
                    <p>Cargando provincias...</p>
                </main>
            </div>
        );
    }

    return (
        <div className="gestion-provincias-page">
            <AppHeader />

            <main className="gestion-provincias-main">
                <section className="gestion-provincias-hero">
                    <div>
                        <button
                            type="button"
                            className="gestion-provincias-back"
                            onClick={() => navigate('/explorar-provincias')}
                        >
                            ← Volver a explorar provincias
                        </button>

                        <span>Panel administrativo</span>
                        <h1>Gestionar provincias</h1>
                        <p>
                            Administra las provincias del Perú, su información principal,
                            departamento asociado e imagen de fondo.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="gestion-provincias-create-btn"
                        onClick={openCreateModal}
                    >
                        + Agregar provincia
                    </button>
                </section>

                {error && (
                    <div className="gestion-provincias-error">
                        {error}
                    </div>
                )}

                <section className="gestion-provincias-toolbar">
                    <div>
                        <label>Filtrar por departamento</label>

                        <select
                            value={filterDepartamento}
                            onChange={(e) => setFilterDepartamento(e.target.value)}
                        >
                            <option value="">Todos los departamentos</option>

                            {departamentos.map((departamento) => (
                                <option key={departamento.id} value={departamento.id}>
                                    {departamento.nombre}
                                </option>
                            ))}
                        </select>
                    </div>

                    <strong>
                        {provinciasFiltradas.length} provincia(s)
                    </strong>
                </section>

                {provinciasFiltradas.length === 0 ? (
                    <section className="gestion-provincias-empty">
                        <h2>No hay provincias registradas</h2>
                        <p>
                            Agrega una nueva provincia para comenzar a mostrarla en el módulo
                            de exploración.
                        </p>

                        <button type="button" onClick={openCreateModal}>
                            Agregar provincia
                        </button>
                    </section>
                ) : (
                    <section className="gestion-provincias-grid">
                        {provinciasFiltradas.map((provincia) => {
                            const image = getBackendImageUrl(provincia.imagen_fondo || '');

                            return (
                                <article className="gestion-provincia-card" key={provincia.id}>
                                    <div
                                        className="gestion-provincia-image"
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
                                        <span>{getDepartamentoNombre(provincia.departamento_id)}</span>
                                        <h3>{provincia.nombre}</h3>
                                    </div>

                                    <div className="gestion-provincia-body">
                                        <p>
                                            {provincia.descripcion_general ||
                                                'Sin descripción registrada para esta provincia.'}
                                        </p>

                                        <div className="gestion-provincia-info">
                                            <div>
                                                <span>Capital</span>
                                                <strong>{provincia.capital || 'No registrada'}</strong>
                                            </div>

                                            <div>
                                                <span>Población</span>
                                                <strong>{formatNumber(provincia.poblacion_aprox)}</strong>
                                            </div>

                                            <div>
                                                <span>Área</span>
                                                <strong>{formatNumber(provincia.area_km2)} km²</strong>
                                            </div>

                                            <div>
                                                <span>Distritos</span>
                                                <strong>{provincia.numero_distritos || 0}</strong>
                                            </div>
                                        </div>

                                        <div className="gestion-provincia-actions">
                                            <button
                                                type="button"
                                                className="gestion-provincia-content"
                                                onClick={() => navigate(`/gestionar-provincias/${provincia.id}/contenido`)}
                                            >
                                                Contenido
                                            </button>

                                            <button
                                                type="button"
                                                className="gestion-provincia-view"
                                                onClick={() => navigate(`/provincias/${provincia.id}`)}
                                            >
                                                Ver
                                            </button>

                                            <button
                                                type="button"
                                                className="gestion-provincia-edit"
                                                onClick={() => openEditModal(provincia)}
                                            >
                                                Editar
                                            </button>

                                            <button
                                                type="button"
                                                className="gestion-provincia-delete"
                                                onClick={() => openDeleteModal(provincia)}
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
                <div className="gestion-provincias-modal-overlay">
                    <div className="gestion-provincias-modal">
                        <div className="gestion-provincias-modal-header">
                            <div>
                                <span>
                                    {modalMode === 'edit' ? 'Editar provincia' : 'Nueva provincia'}
                                </span>
                                <h2>
                                    {modalMode === 'edit'
                                        ? selectedProvincia?.nombre
                                        : 'Agregar provincia'}
                                </h2>
                            </div>

                            <button type="button" onClick={closeModal}>
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="gestion-provincias-form">
                            <div className="gestion-provincias-form-grid">
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
                                    Capital *
                                    <input
                                        type="text"
                                        name="capital"
                                        value={formData.capital}
                                        onChange={handleChange}
                                        required
                                    />
                                </label>

                                <label>
                                    Departamento *
                                    <select
                                        name="departamento_id"
                                        value={formData.departamento_id}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Selecciona un departamento</option>

                                        {departamentos.map((departamento) => (
                                            <option key={departamento.id} value={departamento.id}>
                                                {departamento.nombre}
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
                                    Actividad económica
                                    <input
                                        type="text"
                                        name="actividad_economica_principal"
                                        value={formData.actividad_economica_principal}
                                        onChange={handleChange}
                                    />
                                </label>

                                <label>
                                    Festividad representativa
                                    <input
                                        type="text"
                                        name="festividad_representativa"
                                        value={formData.festividad_representativa}
                                        onChange={handleChange}
                                    />
                                </label>

                                <label className="gestion-provincias-file-label">
                                    Imagen de fondo
                                    <input
                                        type="file"
                                        accept="image/png,image/jpeg,image/jpg,image/webp"
                                        onChange={handleImageChange}
                                    />
                                </label>
                            </div>

                            <label>
                                Descripción general
                                <textarea
                                    name="descripcion_general"
                                    value={formData.descripcion_general}
                                    onChange={handleChange}
                                    rows="5"
                                ></textarea>
                            </label>

                            {imagePreview && (
                                <div
                                    className="gestion-provincias-preview"
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

                            <div className="gestion-provincias-modal-actions">
                                <button
                                    type="button"
                                    className="gestion-provincias-cancel"
                                    onClick={closeModal}
                                >
                                    Cancelar
                                </button>

                                <button
                                    type="submit"
                                    className="gestion-provincias-save"
                                    disabled={saving}
                                >
                                    {saving ? 'Guardando...' : 'Guardar provincia'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {deleteModal && (
                <div className="gestion-provincias-modal-overlay">
                    <div className="gestion-provincias-delete-modal">
                        <span>⚠️</span>
                        <h2>Eliminar provincia</h2>
                        <p>
                            ¿Seguro que deseas eliminar la provincia{' '}
                            <strong>{provinciaToDelete?.nombre}</strong>?
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

export default GestionProvincias;