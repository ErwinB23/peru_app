import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../components/AppHeader';
import {
    getDepartamentos,
    createDepartamento,
    updateDepartamento,
    deleteDepartamento
} from '../services/departamentoService';
import '../styles/GestionDepartamentos.css';

const emptyForm = {
    nombre: '',
    capital: '',
    region_natural: '',
    descripcion: '',
    area_km2: '',
    poblacion_aprox: '',
    clima_predominante: '',
    principales_actividades: '',
    atractivo_turistico_principal: '',
    imagen_fondo: null
};

const GestionDepartamentos = () => {
    const navigate = useNavigate();

    const [departamentos, setDepartamentos] = useState([]);
    const [formData, setFormData] = useState(emptyForm);
    const [selectedDepartamento, setSelectedDepartamento] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [departamentoToDelete, setDepartamentoToDelete] = useState(null);
    const [previewImage, setPreviewImage] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const getBackendImageUrl = (path) => {
        if (!path) return '';

        if (path.startsWith('http')) {
            return path;
        }

        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const backendUrl = baseUrl.replace('/api', '');

        return `${backendUrl}${path}`;
    };

    const cargarDepartamentos = async () => {
        try {
            setLoading(true);
            setError('');

            const data = await getDepartamentos();

            if (Array.isArray(data)) {
                setDepartamentos(data);
            } else if (Array.isArray(data.departamentos)) {
                setDepartamentos(data.departamentos);
            } else {
                setDepartamentos([]);
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Error al cargar departamentos');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarDepartamentos();
    }, []);

    const openCreateModal = () => {
        setSelectedDepartamento(null);
        setFormData(emptyForm);
        setPreviewImage('');
        setError('');
        setMessage('');
        setShowModal(true);
    };

    const openEditModal = (departamento) => {
        setSelectedDepartamento(departamento);

        setFormData({
            nombre: departamento.nombre || '',
            capital: departamento.capital || '',
            region_natural: departamento.region_natural || '',
            descripcion: departamento.descripcion || '',
            area_km2: departamento.area_km2 || '',
            poblacion_aprox: departamento.poblacion_aprox || '',
            clima_predominante: departamento.clima_predominante || '',
            principales_actividades: departamento.principales_actividades || '',
            atractivo_turistico_principal: departamento.atractivo_turistico_principal || '',
            imagen_fondo: null
        });

        setPreviewImage(getBackendImageUrl(departamento.imagen_fondo));
        setError('');
        setMessage('');
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedDepartamento(null);
        setFormData(emptyForm);
        setPreviewImage('');
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

        setFormData((prev) => ({
            ...prev,
            imagen_fondo: file || null
        }));

        if (file) {
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const buildFormData = () => {
        const payload = new FormData();

        payload.append('nombre', formData.nombre);
        payload.append('capital', formData.capital);
        payload.append('region_natural', formData.region_natural);
        payload.append('descripcion', formData.descripcion);
        payload.append('area_km2', formData.area_km2);
        payload.append('poblacion_aprox', formData.poblacion_aprox);
        payload.append('clima_predominante', formData.clima_predominante);
        payload.append('principales_actividades', formData.principales_actividades);
        payload.append('atractivo_turistico_principal', formData.atractivo_turistico_principal);

        if (formData.imagen_fondo) {
            payload.append('imagen_fondo', formData.imagen_fondo);
        }

        return payload;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);
            setError('');
            setMessage('');

            const payload = buildFormData();

            if (selectedDepartamento) {
                await updateDepartamento(selectedDepartamento.id, payload);
                setMessage('Departamento actualizado correctamente');
            } else {
                await createDepartamento(payload);
                setMessage('Departamento creado correctamente');
            }

            await cargarDepartamentos();
            closeModal();
        } catch (err) {
            setError(err.response?.data?.error || 'Error al guardar departamento');
            setSaving(false);
        }
    };

    const openDeleteModal = (departamento) => {
        setDepartamentoToDelete(departamento);
        setShowDeleteModal(true);
        setError('');
        setMessage('');
    };

    const closeDeleteModal = () => {
        setDepartamentoToDelete(null);
        setShowDeleteModal(false);
        setDeleting(false);
    };

    const handleDelete = async () => {
        if (!departamentoToDelete) return;

        try {
            setDeleting(true);
            setError('');
            setMessage('');

            await deleteDepartamento(departamentoToDelete.id);
            await cargarDepartamentos();

            setMessage('Departamento eliminado correctamente');
            closeDeleteModal();
        } catch (err) {
            setError(err.response?.data?.error || 'Error al eliminar departamento');
            setDeleting(false);
        }
    };

    return (
        <div className="gestion-dep-page">
            <AppHeader />

            <main className="gestion-dep-main">
                <section className="gestion-dep-hero">
                    <div className="gestion-dep-hero-content">
                        <div className="gestion-dep-top">
                            <button
                                type="button"
                                className="gestion-dep-back"
                                onClick={() => navigate('/departamentos')}
                            >
                                ← Volver a departamentos
                            </button>

                            <span className="gestion-dep-badge">
                                Panel administrador
                            </span>
                        </div>

                        <h1>Gestionar departamentos</h1>
                        <p>
                            Agrega, edita y administra los departamentos que aparecerán en la pantalla turística principal.
                        </p>
                    </div>
                </section>

                <section className="gestion-dep-panel">
                    {message && (
                        <div className="gestion-dep-alert success">
                            {message}
                        </div>
                    )}

                    {error && (
                        <div className="gestion-dep-alert error">
                            {error}
                        </div>
                    )}

                    <div className="gestion-dep-toolbar">
                        <div>
                            <h2>Departamentos registrados</h2>
                            <p>
                                Total: {departamentos.length} departamentos
                            </p>
                        </div>

                        <button
                            type="button"
                            className="gestion-dep-add"
                            onClick={openCreateModal}
                        >
                            + Agregar departamento
                        </button>
                    </div>

                    {loading ? (
                        <div className="gestion-dep-loading">
                            <div className="gestion-dep-loader"></div>
                            <p>Cargando departamentos...</p>
                        </div>
                    ) : departamentos.length === 0 ? (
                        <div className="gestion-dep-empty">
                            <span>📌</span>
                            <h3>No hay departamentos registrados</h3>
                            <p>Agrega el primer departamento para mostrarlo en la vista principal.</p>
                        </div>
                    ) : (
                        <div className="gestion-dep-grid">
                            {departamentos.map((departamento) => {
                                const imageUrl = getBackendImageUrl(departamento.imagen_fondo);

                                return (
                                    <article className="gestion-dep-card" key={departamento.id}>
                                        <div className="gestion-dep-image">
                                            {imageUrl ? (
                                                <img src={imageUrl} alt={departamento.nombre} />
                                            ) : (
                                                <div className="gestion-dep-no-image">
                                                    Sin imagen
                                                </div>
                                            )}
                                        </div>

                                        <div className="gestion-dep-card-content">
                                            <span>{departamento.region_natural || 'Región no registrada'}</span>
                                            <h3>{departamento.nombre}</h3>
                                            <p>Capital: {departamento.capital || 'No registrada'}</p>

                                            <div className="gestion-dep-card-actions">
                                                <button
                                                    type="button"
                                                    className="gestion-dep-content-btn"
                                                    onClick={() => navigate(`/gestionar-departamentos/${departamento.id}/contenido`)}
                                                >
                                                    Contenido
                                                </button>

                                                <button
                                                    type="button"
                                                    className="gestion-dep-edit"
                                                    onClick={() => openEditModal(departamento)}
                                                >
                                                    Editar
                                                </button>

                                                <button
                                                    type="button"
                                                    className="gestion-dep-delete"
                                                    onClick={() => openDeleteModal(departamento)}
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    )}
                </section>
            </main>

            {showModal && (
                <div className="gestion-modal-overlay">
                    <div className="gestion-modal">
                        <div className="gestion-modal-header">
                            <div>
                                <span>
                                    {selectedDepartamento ? 'Editar departamento' : 'Nuevo departamento'}
                                </span>
                                <h2>
                                    {selectedDepartamento ? selectedDepartamento.nombre : 'Agregar departamento'}
                                </h2>
                            </div>

                            <button
                                type="button"
                                className="gestion-modal-close"
                                onClick={closeModal}
                            >
                                ×
                            </button>
                        </div>

                        <form className="gestion-form" onSubmit={handleSubmit}>
                            <div className="gestion-form-grid">
                                <div className="gestion-input-group">
                                    <label>Nombre</label>
                                    <input
                                        type="text"
                                        name="nombre"
                                        value={formData.nombre}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="gestion-input-group">
                                    <label>Capital</label>
                                    <input
                                        type="text"
                                        name="capital"
                                        value={formData.capital}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="gestion-input-group">
                                    <label>Región natural</label>
                                    <input
                                        type="text"
                                        name="region_natural"
                                        value={formData.region_natural}
                                        onChange={handleChange}
                                        placeholder="Costa, Sierra o Selva"
                                        required
                                    />
                                </div>

                                <div className="gestion-input-group">
                                    <label>Área km²</label>
                                    <input
                                        type="number"
                                        name="area_km2"
                                        value={formData.area_km2}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="gestion-input-group">
                                    <label>Población aproximada</label>
                                    <input
                                        type="number"
                                        name="poblacion_aprox"
                                        value={formData.poblacion_aprox}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="gestion-input-group">
                                    <label>Clima predominante</label>
                                    <input
                                        type="text"
                                        name="clima_predominante"
                                        value={formData.clima_predominante}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="gestion-input-group gestion-input-wide">
                                    <label>Principales actividades</label>
                                    <input
                                        type="text"
                                        name="principales_actividades"
                                        value={formData.principales_actividades}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="gestion-input-group gestion-input-wide">
                                    <label>Atractivo turístico principal</label>
                                    <input
                                        type="text"
                                        name="atractivo_turistico_principal"
                                        value={formData.atractivo_turistico_principal}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="gestion-input-group gestion-input-wide">
                                    <label>Descripción</label>
                                    <textarea
                                        name="descripcion"
                                        value={formData.descripcion}
                                        onChange={handleChange}
                                        rows="4"
                                        required
                                    ></textarea>
                                </div>

                                <div className="gestion-input-group gestion-input-wide">
                                    <label>Imagen del departamento</label>

                                    <div className="gestion-file-box">
                                        <input
                                            type="file"
                                            accept="image/png,image/jpeg,image/jpg,image/webp"
                                            onChange={handleImageChange}
                                        />

                                        <small>
                                            Formatos permitidos: JPG, PNG o WEBP. Tamaño máximo recomendado: 5 MB.
                                        </small>
                                    </div>
                                </div>

                                {previewImage && (
                                    <div className="gestion-preview gestion-input-wide">
                                        <img src={previewImage} alt="Vista previa" />
                                    </div>
                                )}
                            </div>

                            <div className="gestion-modal-actions">
                                <button
                                    type="button"
                                    className="gestion-cancel"
                                    onClick={closeModal}
                                    disabled={saving}
                                >
                                    Cancelar
                                </button>

                                <button
                                    type="submit"
                                    className="gestion-save"
                                    disabled={saving}
                                >
                                    {saving ? 'Guardando...' : 'Guardar departamento'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showDeleteModal && (
                <div className="gestion-delete-overlay">
                    <div className="gestion-delete-modal">
                        <div className="gestion-delete-icon">⚠️</div>

                        <h2>Eliminar departamento</h2>

                        <p>
                            ¿Seguro que deseas eliminar el departamento{' '}
                            <strong>{departamentoToDelete?.nombre}</strong>?
                        </p>

                        <div className="gestion-delete-actions">
                            <button
                                type="button"
                                className="gestion-delete-cancel"
                                onClick={closeDeleteModal}
                                disabled={deleting}
                            >
                                Cancelar
                            </button>

                            <button
                                type="button"
                                className="gestion-delete-confirm"
                                onClick={handleDelete}
                                disabled={deleting}
                            >
                                {deleting ? 'Eliminando...' : 'Sí, eliminar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GestionDepartamentos;