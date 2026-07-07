import { useEffect, useState } from 'react';
import AppHeader from '../components/AppHeader';
import { getUsers, searchUsers, updateUserByAdmin, deleteUserByAdmin } from '../services/userService';
import '../styles/ListaUsuarios.css';
import { useNavigate } from 'react-router-dom';

const ListaUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [usuariosFiltrados, setUsuariosFiltrados] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [editForm, setEditForm] = useState({ nombres: '', apellidos: '', fecha_nacimiento: '', email: '', rol: 'usuario' });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const navigate = useNavigate();

  const ordenarUsuarios = (listaUsuarios) => {
    return [...listaUsuarios].sort((a, b) => {
      const rolA = a.rol === 'admin' ? 0 : 1;
      const rolB = b.rol === 'admin' ? 0 : 1;

      if (rolA !== rolB) {
        return rolA - rolB;
      }

      const fechaA = new Date(a.fecha_registro || 0).getTime();
      const fechaB = new Date(b.fecha_registro || 0).getTime();

      return fechaA - fechaB;
    });
  };

  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      setError('');

      const data = await getUsers();
      console.log('Usuarios recibidos:', data);

      let lista = [];

      if (Array.isArray(data)) {
        lista = data;
      } else if (Array.isArray(data.usuarios)) {
        lista = data.usuarios;
      } else if (Array.isArray(data.users)) {
        lista = data.users;
      }

      const usuariosOrdenados = ordenarUsuarios(lista);

      setUsuarios(usuariosOrdenados);
      setUsuariosFiltrados(usuariosOrdenados);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al cargar usuarios');
    } finally {
      setLoading(false);
    }

  };

  useEffect(() => {
    cargarUsuarios();

  }, []);

  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearch(value);

    if (!value.trim()) {
      setUsuariosFiltrados(usuarios);
      return;
    }

    try {
      setSearching(true);
      setError('');

      const data = await searchUsers(value.trim());

      let lista = [];

      if (Array.isArray(data)) {
        lista = data;
      } else if (Array.isArray(data.usuarios)) {
        lista = data.usuarios;
      } else if (Array.isArray(data.users)) {
        lista = data.users;
      }

      setUsuariosFiltrados(ordenarUsuarios(lista));

    } catch (err) {
      setError(err.response?.data?.error || 'Error al buscar usuarios');
    } finally {
      setSearching(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No registrado';

    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      return 'Fecha inválida';
    }

    return date.toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getFechaNacimiento = (usuario) => {
    return (
      usuario.fecha_nacimiento ||
      usuario.fechaNacimiento ||
      usuario.fechaNacimientoUsuario ||
      usuario.fecha_nac ||
      null
    );
  };

  const getInitials = (usuario) => {
    const nombre = usuario.nombres || 'U';
    const apellido = usuario.apellidos || '';

    return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase();
  };

  const toInputDate = (dateString) => {
    if (!dateString) return '';
    return String(dateString).split('T')[0];
  };

  const openEditModal = (usuario) => {
    setSelectedUser(usuario);

    setEditForm({
      nombres: usuario.nombres || '',
      apellidos: usuario.apellidos || '',
      fecha_nacimiento: toInputDate(usuario.fecha_nacimiento),
      email: usuario.email || '',
      rol: usuario.rol || 'usuario'
    });

    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setSelectedUser(null);
    setShowEditModal(false);
    setSaving(false);

    setEditForm({
      nombres: '',
      apellidos: '',
      fecha_nacimiento: '',
      email: '',
      rol: 'usuario'
    });
  };

  const handleEditChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();

    if (!selectedUser) return;

    try {
      setSaving(true);
      setError('');

      await updateUserByAdmin(selectedUser.id, {
        nombres: editForm.nombres.trim(),
        apellidos: editForm.apellidos.trim(),
        fecha_nacimiento: editForm.fecha_nacimiento,
        email: editForm.email.trim().toLowerCase(),
        rol: editForm.rol
      });

      await cargarUsuarios();
      closeEditModal();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al actualizar usuario');
      setSaving(false);
    }
  };

  const openDeleteModal = (usuario) => {
    setUserToDelete(usuario);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setUserToDelete(null);
    setShowDeleteModal(false);
    setDeletingId(null);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      setDeletingId(userToDelete.id);
      setError('');

      await deleteUserByAdmin(userToDelete.id);
      await cargarUsuarios();
      closeDeleteModal();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al eliminar usuario');
      setDeletingId(null);
    }
  };

  const totalUsuarios = usuarios.length;
  const totalAdmins = usuarios.filter((usuario) => usuario.rol === 'admin').length;
  const totalNormales = usuarios.filter((usuario) => usuario.rol === 'usuario').length;

  return (
    <div className="lista-usuarios-page">
      <AppHeader />
      {showDeleteModal && (
        <div className="delete-modal-overlay">
          <div className="delete-modal">
            <div className="delete-modal-icon">
              ⚠️
            </div>

            <h2>Eliminar usuario</h2>

            <p>
              ¿Estás seguro de que deseas eliminar al usuario?
            </p>

            <div className="delete-user-preview">
              <div className="delete-user-avatar">
                {userToDelete ? getInitials(userToDelete) : 'U'}
              </div>

              <div>
                <strong>
                  {userToDelete?.nombres} {userToDelete?.apellidos}
                </strong>
                <span>{userToDelete?.email}</span>
              </div>
            </div>

            <p className="delete-warning">
              Esta acción moverá la cuenta fuera del sistema y no debe realizarse si el usuario todavía necesita acceso.
            </p>

            <div className="delete-modal-actions">
              <button
                type="button"
                className="btn-delete-cancel"
                onClick={closeDeleteModal}
                disabled={deletingId === userToDelete?.id}
              >
                Cancelar
              </button>

              <button
                type="button"
                className="btn-delete-confirm"
                onClick={handleDeleteUser}
                disabled={deletingId === userToDelete?.id}
              >
                {deletingId === userToDelete?.id ? 'Eliminando...' : 'Sí, eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="lista-usuarios-main">
        {/* ==================== HERO ==================== */}
      <section className="usuarios-hero">
        <div className="usuarios-hero-content">
          <div className="usuarios-hero-top">
            <button
              type="button"
              className="usuarios-back-btn"
              onClick={() => navigate('/home')}
            >
              ← Volver al inicio
            </button>
          </div>
          
          <span className="usuarios-badge">
              Panel administrativo
            </span>
          <h1>Gestión de usuarios</h1>
          <p>
            Visualiza, busca y administra las cuentas registradas en la
            plataforma turístico-educativa Perú App.
          </p>
          </div>
        </section>

        {/* ==================== PANEL PRINCIPAL ==================== */}
        <section className="usuarios-panel">
          {/* Estadísticas rápidas */}
          <div className="usuarios-stats">
            <div className="usuario-stat-card">
              <span className="stat-icon">👥</span>
              <div>
                <strong>{totalUsuarios}</strong>
                <p>Total usuarios</p>
              </div>
            </div>

            <div className="usuario-stat-card">
              <span className="stat-icon">🛡️</span>
              <div>
                <strong>{totalAdmins}</strong>
                <p>Administradores</p>
              </div>
            </div>

            <div className="usuario-stat-card">
              <span className="stat-icon">👤</span>
              <div>
                <strong>{totalNormales}</strong>
                <p>Usuarios normales</p>
              </div>
            </div>
          </div>

          {/* Barra superior */}
          <div className="usuarios-toolbar">
            <div>
              <h2>Usuarios registrados</h2>
              <p>Administra las cuentas creadas en el sistema.</p>
            </div>

            <div className="usuarios-search-box">
              <span>🔍</span>
              <input
                type="text"
                value={search}
                onChange={handleSearch}
                placeholder="Buscar por nombre, apellido, email o rol..."
              />
            </div>
          </div>

          {error && (
            <div className="usuarios-alert error">
              ⚠️ {error}
            </div>
          )}

          {loading ? (
            <div className="usuarios-loading">
              <div className="usuarios-loader"></div>
              <p>Cargando usuarios...</p>
            </div>
          ) : (
            <>
              {searching && (
                <div className="usuarios-searching">
                  Buscando usuarios...
                </div>
              )}

              {usuariosFiltrados.length === 0 ? (
                <div className="usuarios-empty">
                  <span>📭</span>
                  <h3>No se encontraron usuarios</h3>
                  <p>Prueba con otro nombre, correo o rol.</p>
                </div>
              ) : (
                <div className="usuarios-table-card">
                  <table className="usuarios-table">
                    <thead>
                      <tr>
                        <th>Usuario</th>
                        <th>Email</th>
                        <th>Rol</th>
                        <th>Fecha nacimiento</th>
                        <th>Registro</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>

                    <tbody>
                      {usuariosFiltrados.map((usuario) => (
                        <tr key={usuario.id}>
                          <td>
                            <div className="usuario-cell usuario-cell-simple">
                              <strong>
                                {usuario.nombres} {usuario.apellidos}
                              </strong>
                              <small>ID: {usuario.id}</small>
                            </div>
                          </td>

                          <td className="usuario-email">
                            {usuario.email}
                          </td>

                          <td>
                            <span className={`usuario-rol ${usuario.rol}`}>
                              {usuario.rol === 'admin' ? 'Administrador' : 'Usuario'}
                            </span>
                          </td>

                          <td>
                            {formatDate(getFechaNacimiento(usuario))}
                          </td>

                          <td>
                            {formatDate(usuario.fecha_registro)}
                          </td>

                          <td>
                            <span className="usuario-estado activo">
                              Activo
                            </span>
                          </td>
                          <td>
                            <div className="usuario-actions">
                              <button
                                className="btn-user-action edit"
                                onClick={() => openEditModal(usuario)}
                              >
                                Editar
                              </button>

                              <button
                                className="btn-user-action delete"
                                onClick={() => openDeleteModal(usuario)}
                                disabled={deletingId === usuario.id}
                              >
                                Eliminar
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </section>
      </main>

      {showEditModal && (
        <div className="user-modal-overlay">
          <div className="user-modal">
            <div className="user-modal-header">
              <div>
                <span>Editar usuario</span>
                <h2>{selectedUser?.nombres} {selectedUser?.apellidos}</h2>
              </div>

              <button className="user-modal-close" onClick={closeEditModal}>
                ×
              </button>
            </div>

            <form className="user-modal-form" onSubmit={handleUpdateUser}>
              <div className="user-form-grid">
                <div className="user-input-group">
                  <label>Nombres</label>
                  <input
                    type="text"
                    name="nombres"
                    value={editForm.nombres}
                    onChange={handleEditChange}
                    required
                  />
                </div>

                <div className="user-input-group">
                  <label>Apellidos</label>
                  <input
                    type="text"
                    name="apellidos"
                    value={editForm.apellidos}
                    onChange={handleEditChange}
                    required
                  />
                </div>

                <div className="user-input-group user-input-wide">
                  <label>Correo electrónico</label>
                  <input
                    type="email"
                    name="email"
                    value={editForm.email}
                    onChange={handleEditChange}
                    required
                  />
                </div>

                <div className="user-input-group">
                  <label>Fecha de nacimiento</label>
                  <input
                    type="date"
                    name="fecha_nacimiento"
                    value={editForm.fecha_nacimiento}
                    onChange={handleEditChange}
                    required
                  />
                </div>

                <div className="user-input-group">
                  <label>Rol</label>
                  <select
                    name="rol"
                    value={editForm.rol}
                    onChange={handleEditChange}
                    required
                  >
                    <option value="usuario">Usuario</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
              </div>

              <div className="user-modal-actions">
                <button
                  type="button"
                  className="btn-modal-cancel"
                  onClick={closeEditModal}
                  disabled={saving}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="btn-modal-save"
                  disabled={saving}
                >
                  {saving ? 'Guardando...' : 'Guardar cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListaUsuarios;