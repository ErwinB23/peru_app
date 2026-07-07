import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AppHeader from '../components/AppHeader';
import { getProvinciaById } from '../services/provinciaService';
import {
    getLugaresByProvinciaId,
    createLugarProvincia,
    updateLugarProvincia,
    deleteLugarProvincia
} from '../services/lugarTuristicoProvinciaService';
import {
    getComidasByProvinciaId,
    createComidaProvincia,
    updateComidaProvincia,
    deleteComidaProvincia
} from '../services/comidaTipicaProvinciaService';
import '../styles/GestionContenidoProvincia.css';

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

const GestionContenidoProvincia = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [provincia, setProvincia] = useState(null);
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

            const [provinciaData, lugaresData, comidasData] = await Promise.all([
                getProvinciaById(id),
                getLugaresByProvinciaId(id),
                getComidasByProvinciaId(id)
            ]);

            setProvincia(provinciaData?.provincia || provinciaData);
            setLugares(Array.isArray(lugaresData) ? lugaresData : []);
            setComidas(Array.isArray(comidasData) ? comidasData : []);
        } catch (err) {
            setError(err.response?.data?.error || 'Error al cargar contenido de la provincia');
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

            payload.append('provincia_id', id);

            if (modalType === 'lugar') {
                payload.append('nombre', lugarForm.nombre);
                payload.append('descripcion', lugarForm.descripcion);
                payload.append('ubicacion_referencial', lugarForm.ubicacion_referencial || '');

                if (imageFile) {
                    payload.append('imagen', imageFile);
                }

                if (modalMode === 'edit') {
                    await updateLugarProvincia(selectedItem.id, payload);
                } else {
                    await createLugarProvincia(payload);
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
                    await updateComidaProvincia(selectedItem.id, payload);
                } else {
                    await createComidaProvincia(payload);
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
                await deleteLugarProvincia(itemToDelete.id);
            }

            if (deleteType === 'comida') {
                await deleteComidaProvincia(itemToDelete.id);
            }

            await cargarDatos();
            closeDeleteModal();
        } catch (err) {
            setError(err.response?.data?.error || 'Error al eliminar contenido');
        }
    };

    if (loading) {
        return (
            <div className="gestion-contenido-prov-page">
                <AppHeader />

                <main className="gestion-contenido-prov-state">
                    <div className="gestion-contenido-prov-loader"></div>
                    <p>Cargando contenido...</p>
                </main>
            </div>
        );
    }

    return (
        <div className="gestion-contenido-prov-page">
            <AppHeader />

            <main className="gestion-contenido-prov-main">
                <section className="gestion-contenido-prov-hero">
                    <div>
                        <button
                            type="button"
                            className="gestion-contenido-prov-back"
                            onClick={() => navigate('/gestionar-provincias')}
                        >
                            ← Volver a gestionar provincias
                        </button>

                        <span>Contenido turístico</span>
                        <h1>{provincia?.nombre || 'Provincia'}</h1>
                        <p>
                            Administra los lugares turísticos y comidas típicas propias de esta provincia.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="gestion-contenido-prov-view-btn"
                        onClick={() => navigate(`/provincias/${id}`)}
                    >
                        Ver provincia
                    </button>
                </section>

                {error && (
                    <div className="gestion-contenido-prov-error">
                        {error}
                    </div>
                )}

                <section className="gestion-contenido-prov-tabs">
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
                        <div className="gestion-contenido-prov-section-head">
                            <div>
                                <span>Turismo provincial</span>
                                <h2>Lugares turísticos</h2>
                                <p>
                                    Registra los lugares turísticos más importantes de la provincia.
                                </p>
                            </div>

                            <button type="button" onClick={openCreateLugar}>
                                + Agregar lugar
                            </button>
                        </div>

                        {lugares.length === 0 ? (
                            <div className="gestion-contenido-prov-empty">
                                <h3>No hay lugares turísticos registrados</h3>
                                <p>Agrega el primer lugar turístico de esta provincia.</p>
                                <button type="button" onClick={openCreateLugar}>
                                    Agregar lugar
                                </button>
                            </div>
                        ) : (
                            <div className="gestion-contenido-prov-grid">
                                {lugares.map((lugar) => {
                                    const image = getBackendImageUrl(lugar.imagen || '');

                                    return (
                                        <article className="gestion-contenido-prov-card" key={lugar.id}>
                                            <div
                                                className="gestion-contenido-prov-card-image"
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

                                            <div className="gestion-contenido-prov-card-body">
                                                <p>{lugar.descripcion}</p>

                                                <div className="gestion-contenido-prov-meta">
                                                    <span>Ubicación</span>
                                                    <strong>
                                                        {lugar.ubicacion_referencial || 'No registrada'}
                                                    </strong>
                                                </div>

                                                <div className="gestion-contenido-prov-actions">
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
                        <div className="gestion-contenido-prov-section-head">
                            <div>
                                <span>Gastronomía provincial</span>
                                <h2>Comidas típicas</h2>
                                <p>
                                    Registra los platos típicos o expresiones gastronómicas de la provincia.
                                </p>
                            </div>

                            <button type="button" onClick={openCreateComida}>
                                + Agregar comida
                            </button>
                        </div>

                        {comidas.length === 0 ? (
                            <div className="gestion-contenido-prov-empty">
                                <h3>No hay comidas típicas registradas</h3>
                                <p>Agrega la primera comida típica de esta provincia.</p>
                                <button type="button" onClick={openCreateComida}>
                                    Agregar comida
                                </button>
                            </div>
                        ) : (
                            <div className="gestion-contenido-prov-grid">
                                {comidas.map((comida) => {
                                    const image = getBackendImageUrl(comida.imagen || '');

                                    return (
                                        <article className="gestion-contenido-prov-card" key={comida.id}>
                                            <div
                                                className="gestion-contenido-prov-card-image"
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

                                            <div className="gestion-contenido-prov-card-body">
                                                <p>{comida.descripcion}</p>

                                                <div className="gestion-contenido-prov-meta">
                                                    <span>Origen / referencia</span>
                                                    <strong>
                                                        {comida.origen_descripcion || 'No registrado'}
                                                    </strong>
                                                </div>

                                                <div className="gestion-contenido-prov-actions">
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
                <div className="gestion-contenido-prov-modal-overlay">
                    <div className="gestion-contenido-prov-modal">
                        <div className="gestion-contenido-prov-modal-head">
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

                        <form onSubmit={handleSubmit} className="gestion-contenido-prov-form">
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
                                    className="gestion-contenido-prov-preview"
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

                            <div className="gestion-contenido-prov-modal-actions">
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
                <div className="gestion-contenido-prov-modal-overlay">
                    <div className="gestion-contenido-prov-delete-modal">
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

export default GestionContenidoProvincia;