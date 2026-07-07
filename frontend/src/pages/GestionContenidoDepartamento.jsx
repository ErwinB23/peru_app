import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AppHeader from '../components/AppHeader';
import { getDepartamentoById } from '../services/departamentoService';
import {
    getLugaresByDepartamentoId,
    createLugarTuristico,
    updateLugarTuristico,
    deleteLugarTuristico
} from '../services/lugarTuristicoService';
import {
    getComidasByDepartamentoId,
    createComidaTipica,
    updateComidaTipica,
    deleteComidaTipica
} from '../services/comidaTipicaService';
import '../styles/GestionContenidoDepartamento.css';

const emptyLugarForm = {
    nombre: '',
    descripcion: '',
    ubicacion_referencial: '',
    imagen: null
};

const emptyComidaForm = {
    nombre: '',
    descripcion: '',
    origen_descripcion: '',
    imagen: null
};

const GestionContenidoDepartamento = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [departamento, setDepartamento] = useState(null);
    const [lugares, setLugares] = useState([]);
    const [comidas, setComidas] = useState([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const [modalType, setModalType] = useState(null);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState(emptyLugarForm);
    const [previewImage, setPreviewImage] = useState('');

    const [deleteType, setDeleteType] = useState(null);
    const [itemToDelete, setItemToDelete] = useState(null);

    const getBackendImageUrl = (path) => {
        if (!path) return '';

        if (path.startsWith('http')) {
            return path;
        }

        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const backendUrl = baseUrl.replace('/api', '');

        return `${backendUrl}${path}`;
    };

    const cargarContenido = async () => {
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

            setLugares(Array.isArray(lugaresData) ? lugaresData : []);
            setComidas(Array.isArray(comidasData) ? comidasData : []);
        } catch (err) {
            setError(err.response?.data?.error || 'Error al cargar contenido del departamento');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarContenido();
    }, [id]);

    const openCreateModal = (type) => {
        setModalType(type);
        setEditingItem(null);
        setPreviewImage('');
        setError('');
        setMessage('');

        if (type === 'lugar') {
            setFormData(emptyLugarForm);
        } else {
            setFormData(emptyComidaForm);
        }
    };

    const openEditModal = (type, item) => {
        setModalType(type);
        setEditingItem(item);
        setError('');
        setMessage('');
        setPreviewImage(getBackendImageUrl(item.imagen));

        if (type === 'lugar') {
            setFormData({
                nombre: item.nombre || '',
                descripcion: item.descripcion || '',
                ubicacion_referencial: item.ubicacion_referencial || '',
                imagen: null
            });
        } else {
            setFormData({
                nombre: item.nombre || '',
                descripcion: item.descripcion || '',
                origen_descripcion: item.origen_descripcion || '',
                imagen: null
            });
        }
    };

    const closeModal = () => {
        setModalType(null);
        setEditingItem(null);
        setPreviewImage('');
        setSaving(false);
        setFormData(emptyLugarForm);
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
            imagen: file || null
        }));

        if (file) {
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const buildPayload = () => {
        const payload = new FormData();

        payload.append('departamento_id', id);
        payload.append('nombre', formData.nombre);
        payload.append('descripcion', formData.descripcion);

        if (modalType === 'lugar') {
            payload.append('ubicacion_referencial', formData.ubicacion_referencial || '');
        }

        if (modalType === 'comida') {
            payload.append('origen_descripcion', formData.origen_descripcion || '');
        }

        if (formData.imagen) {
            payload.append('imagen', formData.imagen);
        }

        return payload;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);
            setError('');
            setMessage('');

            const payload = buildPayload();

            if (modalType === 'lugar') {
                if (editingItem) {
                    await updateLugarTuristico(editingItem.id, payload);
                    setMessage('Lugar turístico actualizado correctamente');
                } else {
                    await createLugarTuristico(payload);
                    setMessage('Lugar turístico agregado correctamente');
                }
            }

            if (modalType === 'comida') {
                if (editingItem) {
                    await updateComidaTipica(editingItem.id, payload);
                    setMessage('Comida típica actualizada correctamente');
                } else {
                    await createComidaTipica(payload);
                    setMessage('Comida típica agregada correctamente');
                }
            }

            await cargarContenido();
            closeModal();
        } catch (err) {
            setError(err.response?.data?.error || 'Error al guardar contenido');
            setSaving(false);
        }
    };

    const openDeleteModal = (type, item) => {
        setDeleteType(type);
        setItemToDelete(item);
        setError('');
        setMessage('');
    };

    const closeDeleteModal = () => {
        setDeleteType(null);
        setItemToDelete(null);
        setDeleting(false);
    };

    const handleDelete = async () => {
        if (!itemToDelete || !deleteType) return;

        try {
            setDeleting(true);
            setError('');
            setMessage('');

            if (deleteType === 'lugar') {
                await deleteLugarTuristico(itemToDelete.id);
                setMessage('Lugar turístico eliminado correctamente');
            }

            if (deleteType === 'comida') {
                await deleteComidaTipica(itemToDelete.id);
                setMessage('Comida típica eliminada correctamente');
            }

            await cargarContenido();
            closeDeleteModal();
        } catch (err) {
            setError(err.response?.data?.error || 'Error al eliminar contenido');
            setDeleting(false);
        }
    };

    const modalTitle = modalType === 'lugar'
        ? editingItem ? 'Editar lugar turístico' : 'Agregar lugar turístico'
        : editingItem ? 'Editar comida típica' : 'Agregar comida típica';

    if (loading) {
        return (
            <div className="gestion-contenido-page">
                <AppHeader />

                <main className="gestion-contenido-state">
                    <div className="gestion-contenido-loader"></div>
                    <p>Cargando contenido turístico...</p>
                </main>
            </div>
        );
    }

    return (
        <div className="gestion-contenido-page">
            <AppHeader />

            <main className="gestion-contenido-main">
                <section className="gestion-contenido-hero">
                    <div className="gestion-contenido-hero-content">
                        <button
                            type="button"
                            className="gestion-contenido-back"
                            onClick={() => navigate('/gestionar-departamentos')}
                        >
                            ← Volver a gestión
                        </button>

                        <span className="gestion-contenido-badge">
                            Contenido turístico
                        </span>

                        <h1>{departamento?.nombre || 'Departamento'}</h1>

                        <p>
                            Administra los lugares turísticos y comidas típicas que se mostrarán
                            en la página pública del departamento.
                        </p>
                    </div>
                </section>

                <section className="gestion-contenido-panel">
                    {message && (
                        <div className="gestion-contenido-alert success">
                            {message}
                        </div>
                    )}

                    {error && (
                        <div className="gestion-contenido-alert error">
                            {error}
                        </div>
                    )}

                    <div className="gestion-contenido-section">
                        <div className="gestion-contenido-toolbar">
                            <div>
                                <span>Turismo</span>
                                <h2>Lugares turísticos</h2>
                                <p>Total: {lugares.length} registros</p>
                            </div>

                            <button
                                type="button"
                                onClick={() => openCreateModal('lugar')}
                            >
                                + Agregar lugar
                            </button>
                        </div>

                        {lugares.length === 0 ? (
                            <div className="gestion-contenido-empty">
                                <h3>No hay lugares turísticos registrados</h3>
                                <p>Agrega el primer lugar turístico para este departamento.</p>
                            </div>
                        ) : (
                            <div className="gestion-contenido-grid">
                                {lugares.map((lugar) => {
                                    const imageUrl = getBackendImageUrl(lugar.imagen);

                                    return (
                                        <article className="gestion-contenido-card" key={lugar.id}>
                                            <div className="gestion-contenido-image">
                                                {imageUrl ? (
                                                    <img src={imageUrl} alt={lugar.nombre} />
                                                ) : (
                                                    <div className="gestion-contenido-no-image">
                                                        Sin imagen
                                                    </div>
                                                )}
                                            </div>

                                            <div className="gestion-contenido-card-body">
                                                <span>{lugar.ubicacion_referencial || 'Lugar turístico'}</span>
                                                <h3>{lugar.nombre}</h3>
                                                <p>{lugar.descripcion}</p>

                                                <div className="gestion-contenido-card-actions">
                                                    <button
                                                        type="button"
                                                        className="edit"
                                                        onClick={() => openEditModal('lugar', lugar)}
                                                    >
                                                        Editar
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="delete"
                                                        onClick={() => openDeleteModal('lugar', lugar)}
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
                    </div>

                    <div className="gestion-contenido-section">
                        <div className="gestion-contenido-toolbar">
                            <div>
                                <span>Gastronomía</span>
                                <h2>Comidas típicas</h2>
                                <p>Total: {comidas.length} registros</p>
                            </div>

                            <button
                                type="button"
                                onClick={() => openCreateModal('comida')}
                            >
                                + Agregar comida
                            </button>
                        </div>

                        {comidas.length === 0 ? (
                            <div className="gestion-contenido-empty">
                                <h3>No hay comidas típicas registradas</h3>
                                <p>Agrega la primera comida típica para este departamento.</p>
                            </div>
                        ) : (
                            <div className="gestion-contenido-grid">
                                {comidas.map((comida) => {
                                    const imageUrl = getBackendImageUrl(comida.imagen);

                                    return (
                                        <article className="gestion-contenido-card" key={comida.id}>
                                            <div className="gestion-contenido-image">
                                                {imageUrl ? (
                                                    <img src={imageUrl} alt={comida.nombre} />
                                                ) : (
                                                    <div className="gestion-contenido-no-image">
                                                        Sin imagen
                                                    </div>
                                                )}
                                            </div>

                                            <div className="gestion-contenido-card-body">
                                                <span>{comida.origen_descripcion || 'Comida típica'}</span>
                                                <h3>{comida.nombre}</h3>
                                                <p>{comida.descripcion}</p>

                                                <div className="gestion-contenido-card-actions">
                                                    <button
                                                        type="button"
                                                        className="edit"
                                                        onClick={() => openEditModal('comida', comida)}
                                                    >
                                                        Editar
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="delete"
                                                        onClick={() => openDeleteModal('comida', comida)}
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
                    </div>
                </section>
            </main>

            {modalType && (
                <div className="gestion-contenido-modal-overlay">
                    <div className="gestion-contenido-modal">
                        <div className="gestion-contenido-modal-header">
                            <div>
                                <span>{modalType === 'lugar' ? 'Turismo' : 'Gastronomía'}</span>
                                <h2>{modalTitle}</h2>
                            </div>

                            <button
                                type="button"
                                onClick={closeModal}
                            >
                                ×
                            </button>
                        </div>

                        <form className="gestion-contenido-form" onSubmit={handleSubmit}>
                            <div className="gestion-contenido-input-group">
                                <label>Nombre</label>
                                <input
                                    type="text"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {modalType === 'lugar' && (
                                <div className="gestion-contenido-input-group">
                                    <label>Ubicación referencial</label>
                                    <input
                                        type="text"
                                        name="ubicacion_referencial"
                                        value={formData.ubicacion_referencial}
                                        onChange={handleChange}
                                        placeholder="Ejemplo: Ica, Perú"
                                    />
                                </div>
                            )}

                            {modalType === 'comida' && (
                                <div className="gestion-contenido-input-group">
                                    <label>Origen o referencia</label>
                                    <input
                                        type="text"
                                        name="origen_descripcion"
                                        value={formData.origen_descripcion}
                                        onChange={handleChange}
                                        placeholder="Ejemplo: Plato tradicional de la costa sur"
                                    />
                                </div>
                            )}

                            <div className="gestion-contenido-input-group">
                                <label>Descripción</label>
                                <textarea
                                    name="descripcion"
                                    value={formData.descripcion}
                                    onChange={handleChange}
                                    rows="4"
                                    required
                                ></textarea>
                            </div>

                            <div className="gestion-contenido-input-group">
                                <label>Imagen</label>

                                <div className="gestion-contenido-file-box">
                                    <input
                                        type="file"
                                        accept="image/png,image/jpeg,image/jpg,image/webp"
                                        onChange={handleImageChange}
                                    />

                                    <small>
                                        Campo de imagen opcional al editar. Si no seleccionas otra imagen,
                                        se mantiene la actual.
                                    </small>
                                </div>
                            </div>

                            {previewImage && (
                                <div className="gestion-contenido-preview">
                                    <img src={previewImage} alt="Vista previa" />
                                </div>
                            )}

                            <div className="gestion-contenido-modal-actions">
                                <button
                                    type="button"
                                    className="cancel"
                                    onClick={closeModal}
                                    disabled={saving}
                                >
                                    Cancelar
                                </button>

                                <button
                                    type="submit"
                                    className="save"
                                    disabled={saving}
                                >
                                    {saving ? 'Guardando...' : 'Guardar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {itemToDelete && (
                <div className="gestion-contenido-delete-overlay">
                    <div className="gestion-contenido-delete-modal">
                        <div className="gestion-contenido-delete-icon">⚠️</div>

                        <h2>Eliminar contenido</h2>

                        <p>
                            ¿Seguro que deseas eliminar{' '}
                            <strong>{itemToDelete.nombre}</strong>?
                        </p>

                        <div className="gestion-contenido-delete-actions">
                            <button
                                type="button"
                                className="cancel"
                                onClick={closeDeleteModal}
                                disabled={deleting}
                            >
                                Cancelar
                            </button>

                            <button
                                type="button"
                                className="confirm"
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

export default GestionContenidoDepartamento;