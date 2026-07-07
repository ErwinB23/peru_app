import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AppHeader from '../components/AppHeader';
import { getDistritoById } from '../services/distritoService';
import {
    getLugaresByDistritoId,
    createLugarDistrito,
    updateLugarDistrito,
    deleteLugarDistrito
} from '../services/lugarTuristicoDistritoService';
import {
    getComidasByDistritoId,
    createComidaDistrito,
    updateComidaDistrito,
    deleteComidaDistrito
} from '../services/comidaTipicaDistritoService';
import '../styles/GestionContenidoDistrito.css';

const initialLugarForm = {
    nombre: '',
    descripcion: '',
    ubicacion_referencial: ''
};

const initialComidaForm = {
    nombre: '',
    descripcion: '',
    origen_descripcion: ''
};

const GestionContenidoDistrito = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [distrito, setDistrito] = useState(null);
    const [lugares, setLugares] = useState([]);
    const [comidas, setComidas] = useState([]);

    const [activeTab, setActiveTab] = useState('lugares');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('lugar');
    const [modalMode, setModalMode] = useState('create');
    const [selectedItem, setSelectedItem] = useState(null);

    const [lugarForm, setLugarForm] = useState(initialLugarForm);
    const [comidaForm, setComidaForm] = useState(initialComidaForm);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');

    const [deleteModal, setDeleteModal] = useState(false);
    const [deleteType, setDeleteType] = useState('');
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
            setError(err.response?.data?.error || 'Error al cargar contenido del distrito');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarDatos();
    }, [id]);

    const closeModal = () => {
        setShowModal(false);
        setModalType('lugar');
        setModalMode('create');
        setSelectedItem(null);
        setLugarForm(initialLugarForm);
        setComidaForm(initialComidaForm);
        setImageFile(null);
        setImagePreview('');
        setSaving(false);
    };

    const openCreateLugar = () => {
        setModalType('lugar');
        setModalMode('create');
        setSelectedItem(null);
        setLugarForm(initialLugarForm);
        setImageFile(null);
        setImagePreview('');
        setShowModal(true);
    };

    const openEditLugar = (lugar) => {
        setModalType('lugar');
        setModalMode('edit');
        setSelectedItem(lugar);

        setLugarForm({
            nombre: lugar.nombre || '',
            descripcion: lugar.descripcion || '',
            ubicacion_referencial: lugar.ubicacion_referencial || ''
        });

        setImageFile(null);
        setImagePreview(getBackendImageUrl(lugar.imagen || ''));
        setShowModal(true);
    };

    const openCreateComida = () => {
        setModalType('comida');
        setModalMode('create');
        setSelectedItem(null);
        setComidaForm(initialComidaForm);
        setImageFile(null);
        setImagePreview('');
        setShowModal(true);
    };

    const openEditComida = (comida) => {
        setModalType('comida');
        setModalMode('edit');
        setSelectedItem(comida);

        setComidaForm({
            nombre: comida.nombre || '',
            descripcion: comida.descripcion || '',
            origen_descripcion: comida.origen_descripcion || ''
        });

        setImageFile(null);
        setImagePreview(getBackendImageUrl(comida.imagen || ''));
        setShowModal(true);
    };

    const handleLugarChange = (e) => {
        const { name, value } = e.target;

        setLugarForm((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleComidaChange = (e) => {
        const { name, value } = e.target;

        setComidaForm((prev) => ({
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

            payload.append('distrito_id', id);

            if (modalType === 'lugar') {
                payload.append('nombre', lugarForm.nombre);
                payload.append('descripcion', lugarForm.descripcion);
                payload.append('ubicacion_referencial', lugarForm.ubicacion_referencial || '');

                if (imageFile) {
                    payload.append('imagen', imageFile);
                }

                if (modalMode === 'edit') {
                    await updateLugarDistrito(selectedItem.id, payload);
                } else {
                    await createLugarDistrito(payload);
                }
            }

            if (modalType === 'comida') {
                payload.append('nombre', comidaForm.nombre);
                payload.append('descripcion', comidaForm.descripcion);
                payload.append('origen_descripcion', comidaForm.origen_descripcion || '');

                if (imageFile) {
                    payload.append('imagen', imageFile);
                }

                if (modalMode === 'edit') {
                    await updateComidaDistrito(selectedItem.id, payload);
                } else {
                    await createComidaDistrito(payload);
                }
            }

            await cargarDatos();
            closeModal();
        } catch (err) {
            setError(err.response?.data?.error || 'Error al guardar contenido');
            setSaving(false);
        }
    };

    const openDeleteModal = (type, item) => {
        setDeleteType(type);
        setItemToDelete(item);
        setDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setDeleteType('');
        setItemToDelete(null);
        setDeleteModal(false);
    };

    const confirmDelete = async () => {
        if (!itemToDelete?.id) return;

        try {
            if (deleteType === 'lugar') {
                await deleteLugarDistrito(itemToDelete.id);
            }

            if (deleteType === 'comida') {
                await deleteComidaDistrito(itemToDelete.id);
            }

            await cargarDatos();
            closeDeleteModal();
        } catch (err) {
            setError(err.response?.data?.error || 'Error al eliminar contenido');
        }
    };

    if (loading) {
        return (
            <div className="gestion-contenido-dist-page">
                <AppHeader />

                <main className="gestion-contenido-dist-state">
                    <div className="gestion-contenido-dist-loader"></div>
                    <p>Cargando contenido...</p>
                </main>
            </div>
        );
    }

    return (
        <div className="gestion-contenido-dist-page">
            <AppHeader />

            <main className="gestion-contenido-dist-main">
                <section className="gestion-contenido-dist-hero">
                    <div>
                        <button
                            type="button"
                            className="gestion-contenido-dist-back"
                            onClick={() => navigate('/gestionar-distritos')}
                        >
                            ← Volver a gestionar distritos
                        </button>

                        <span>Contenido turístico</span>
                        <h1>{distrito?.nombre || 'Distrito'}</h1>
                        <p>
                            Administra los lugares turísticos y comidas típicas propias de este distrito.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="gestion-contenido-dist-view-btn"
                        onClick={() => navigate(`/distritos/${id}`)}
                    >
                        Ver distrito
                    </button>
                </section>

                {error && (
                    <div className="gestion-contenido-dist-error">
                        {error}
                    </div>
                )}

                <section className="gestion-contenido-dist-tabs">
                    <button
                        type="button"
                        className={activeTab === 'lugares' ? 'active' : ''}
                        onClick={() => setActiveTab('lugares')}
                    >
                        Lugares turísticos ({lugares.length})
                    </button>

                    <button
                        type="button"
                        className={activeTab === 'comidas' ? 'active' : ''}
                        onClick={() => setActiveTab('comidas')}
                    >
                        Comidas típicas ({comidas.length})
                    </button>
                </section>

                {activeTab === 'lugares' && (
                    <section>
                        <div className="gestion-contenido-dist-section-head">
                            <div>
                                <span>Turismo distrital</span>
                                <h2>Lugares turísticos</h2>
                                <p>
                                    Registra los lugares turísticos más importantes del distrito.
                                </p>
                            </div>

                            <button type="button" onClick={openCreateLugar}>
                                + Agregar lugar
                            </button>
                        </div>

                        {lugares.length === 0 ? (
                            <div className="gestion-contenido-dist-empty">
                                <h3>No hay lugares turísticos registrados</h3>
                                <p>Agrega el primer lugar turístico de este distrito.</p>

                                <button type="button" onClick={openCreateLugar}>
                                    Agregar lugar
                                </button>
                            </div>
                        ) : (
                            <div className="gestion-contenido-dist-grid">
                                {lugares.map((lugar) => {
                                    const image = getBackendImageUrl(lugar.imagen || '');

                                    return (
                                        <article className="gestion-contenido-dist-card" key={lugar.id}>
                                            <div
                                                className="gestion-contenido-dist-card-image"
                                                style={
                                                    image
                                                        ? {
                                                            backgroundImage: `
                                                                linear-gradient(180deg, rgba(0,0,0,0.08), rgba(0,0,0,0.74)),
                                                                url(${image})
                                                            `
                                                        }
                                                        : undefined
                                                }
                                            >
                                                <span>Turismo</span>
                                                <h3>{lugar.nombre}</h3>
                                            </div>

                                            <div className="gestion-contenido-dist-card-body">
                                                <p>{lugar.descripcion}</p>

                                                <div className="gestion-contenido-dist-meta">
                                                    <span>Ubicación</span>
                                                    <strong>
                                                        {lugar.ubicacion_referencial || 'No registrada'}
                                                    </strong>
                                                </div>

                                                <div className="gestion-contenido-dist-actions">
                                                    <button
                                                        type="button"
                                                        className="edit"
                                                        onClick={() => openEditLugar(lugar)}
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
                    </section>
                )}

                {activeTab === 'comidas' && (
                    <section>
                        <div className="gestion-contenido-dist-section-head">
                            <div>
                                <span>Gastronomía distrital</span>
                                <h2>Comidas típicas</h2>
                                <p>
                                    Registra los platos típicos o expresiones gastronómicas del distrito.
                                </p>
                            </div>

                            <button type="button" onClick={openCreateComida}>
                                + Agregar comida
                            </button>
                        </div>

                        {comidas.length === 0 ? (
                            <div className="gestion-contenido-dist-empty">
                                <h3>No hay comidas típicas registradas</h3>
                                <p>Agrega la primera comida típica de este distrito.</p>

                                <button type="button" onClick={openCreateComida}>
                                    Agregar comida
                                </button>
                            </div>
                        ) : (
                            <div className="gestion-contenido-dist-grid">
                                {comidas.map((comida) => {
                                    const image = getBackendImageUrl(comida.imagen || '');

                                    return (
                                        <article className="gestion-contenido-dist-card" key={comida.id}>
                                            <div
                                                className="gestion-contenido-dist-card-image"
                                                style={
                                                    image
                                                        ? {
                                                            backgroundImage: `
                                                                linear-gradient(180deg, rgba(0,0,0,0.08), rgba(0,0,0,0.74)),
                                                                url(${image})
                                                            `
                                                        }
                                                        : undefined
                                                }
                                            >
                                                <span>Gastronomía</span>
                                                <h3>{comida.nombre}</h3>
                                            </div>

                                            <div className="gestion-contenido-dist-card-body">
                                                <p>{comida.descripcion}</p>

                                                <div className="gestion-contenido-dist-meta">
                                                    <span>Origen / referencia</span>
                                                    <strong>
                                                        {comida.origen_descripcion || 'No registrado'}
                                                    </strong>
                                                </div>

                                                <div className="gestion-contenido-dist-actions">
                                                    <button
                                                        type="button"
                                                        className="edit"
                                                        onClick={() => openEditComida(comida)}
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
                    </section>
                )}
            </main>

            {showModal && (
                <div className="gestion-contenido-dist-modal-overlay">
                    <div className="gestion-contenido-dist-modal">
                        <div className="gestion-contenido-dist-modal-head">
                            <div>
                                <span>
                                    {modalType === 'lugar' ? 'Lugar turístico' : 'Comida típica'}
                                </span>

                                <h2>
                                    {modalMode === 'edit' ? 'Editar contenido' : 'Nuevo contenido'}
                                </h2>
                            </div>

                            <button type="button" onClick={closeModal}>
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="gestion-contenido-dist-form">
                            {modalType === 'lugar' && (
                                <>
                                    <label>
                                        Nombre *
                                        <input
                                            type="text"
                                            name="nombre"
                                            value={lugarForm.nombre}
                                            onChange={handleLugarChange}
                                            required
                                        />
                                    </label>

                                    <label>
                                        Ubicación referencial
                                        <input
                                            type="text"
                                            name="ubicacion_referencial"
                                            value={lugarForm.ubicacion_referencial}
                                            onChange={handleLugarChange}
                                        />
                                    </label>

                                    <label>
                                        Descripción *
                                        <textarea
                                            name="descripcion"
                                            value={lugarForm.descripcion}
                                            onChange={handleLugarChange}
                                            rows="5"
                                            required
                                        ></textarea>
                                    </label>
                                </>
                            )}

                            {modalType === 'comida' && (
                                <>
                                    <label>
                                        Nombre *
                                        <input
                                            type="text"
                                            name="nombre"
                                            value={comidaForm.nombre}
                                            onChange={handleComidaChange}
                                            required
                                        />
                                    </label>

                                    <label>
                                        Origen / referencia
                                        <input
                                            type="text"
                                            name="origen_descripcion"
                                            value={comidaForm.origen_descripcion}
                                            onChange={handleComidaChange}
                                        />
                                    </label>

                                    <label>
                                        Descripción *
                                        <textarea
                                            name="descripcion"
                                            value={comidaForm.descripcion}
                                            onChange={handleComidaChange}
                                            rows="5"
                                            required
                                        ></textarea>
                                    </label>
                                </>
                            )}

                            <label>
                                Imagen
                                <input
                                    type="file"
                                    accept="image/png,image/jpeg,image/jpg,image/webp"
                                    onChange={handleImageChange}
                                />
                            </label>

                            {imagePreview && (
                                <div
                                    className="gestion-contenido-dist-preview"
                                    style={{
                                        backgroundImage: `
                                            linear-gradient(180deg, rgba(0,0,0,0.06), rgba(0,0,0,0.62)),
                                            url(${imagePreview})
                                        `
                                    }}
                                >
                                    <span>Vista previa</span>
                                </div>
                            )}

                            <div className="gestion-contenido-dist-modal-actions">
                                <button
                                    type="button"
                                    className="cancel"
                                    onClick={closeModal}
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

            {deleteModal && (
                <div className="gestion-contenido-dist-modal-overlay">
                    <div className="gestion-contenido-dist-delete-modal">
                        <span>⚠️</span>
                        <h2>Eliminar contenido</h2>
                        <p>
                            ¿Seguro que deseas eliminar{' '}
                            <strong>{itemToDelete?.nombre}</strong>?
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

export default GestionContenidoDistrito;