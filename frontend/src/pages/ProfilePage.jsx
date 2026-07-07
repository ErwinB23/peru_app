import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getProfile, updateProfile } from '../services/authService';
import AppHeader from '../components/AppHeader';
import '../styles/ProfilePage.css';

const ProfilePage = () => {
  const { token, user, login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [profileData, setProfileData] = useState({
    nombres: '',
    apellidos: '',
    email: '',
    fecha_nacimiento: '',
    rol: '',
    fecha_registro: ''
  });

  const [editData, setEditData] = useState({
    nombres: '',
    apellidos: '',
    email: '',
    fecha_nacimiento: '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  // Cargar datos del perfil
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoadingProfile(true);

        const data = await getProfile(token);

        setProfileData(data);

        setEditData({
          nombres: data.nombres || '',
          apellidos: data.apellidos || '',
          email: data.email || '',
          fecha_nacimiento: data.fecha_nacimiento?.split('T')[0] || '',
          currentPassword: '',
          newPassword: '',
          confirmNewPassword: ''
        });
      } catch (error) {
        setMessage({
          type: 'error',
          text: error.response?.data?.error || 'Error al cargar el perfil'
        });
      } finally {
        setLoadingProfile(false);
      }
    };

    loadProfile();
  }, [token]);

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value
    });
  };

  // Formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return 'No registrado';

    return new Date(dateString).toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Obtener iniciales del usuario
  const getInitials = () => {
    const nombre = profileData.nombres || user?.nombres || 'U';
    const apellido = profileData.apellidos || user?.apellidos || '';

    return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase();
  };

  // Cancelar edición y restaurar datos
  const handleCancelEdit = () => {
    setIsEditing(false);
    setMessage({ type: '', text: '' });

    setEditData({
      nombres: profileData.nombres || '',
      apellidos: profileData.apellidos || '',
      email: profileData.email || '',
      fecha_nacimiento: profileData.fecha_nacimiento?.split('T')[0] || '',
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    });
  };

  // Guardar cambios
  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    const quiereCambiarPassword =
      editData.currentPassword ||
      editData.newPassword ||
      editData.confirmNewPassword;

    if (quiereCambiarPassword) {
      if (!editData.currentPassword || !editData.newPassword || !editData.confirmNewPassword) {
        setMessage({
          type: 'error',
          text: 'Completa todos los campos para cambiar la contraseña'
        });
        setLoading(false);
        return;
      }

      if (editData.newPassword.length < 6) {
        setMessage({
          type: 'error',
          text: 'La nueva contraseña debe tener al menos 6 caracteres'
        });
        setLoading(false);
        return;
      }

      if (editData.newPassword !== editData.confirmNewPassword) {
        setMessage({
          type: 'error',
          text: 'La nueva contraseña y la confirmación no coinciden'
        });
        setLoading(false);
        return;
      }
    }

    try {
      const payload = {
        nombres: editData.nombres.trim(),
        apellidos: editData.apellidos.trim(),
        email: editData.email.trim().toLowerCase(),
        fecha_nacimiento: editData.fecha_nacimiento
      };

      if (quiereCambiarPassword) {
        payload.currentPassword = editData.currentPassword;
        payload.newPassword = editData.newPassword;
      }

      const response = await updateProfile(token, payload);

      login(response.user, token);

      const updatedData = await getProfile(token);
      setProfileData(updatedData);

      setEditData({
        nombres: updatedData.nombres || '',
        apellidos: updatedData.apellidos || '',
        email: updatedData.email || '',
        fecha_nacimiento: updatedData.fecha_nacimiento?.split('T')[0] || '',
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      });

      setIsEditing(false);

      setMessage({
        type: 'success',
        text: 'Perfil actualizado exitosamente'
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.error || 'Error al actualizar el perfil'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <AppHeader />

      <main className="profile-main">
        {/* ==================== ENCABEZADO DE PÁGINA ==================== */}
        <section className="profile-hero">
          <div className="profile-hero-content">
            <button className="profile-back-btn" onClick={() => navigate('/home')}>
              ← Volver al inicio
            </button>

            <div className="profile-title-area">
              <span className="profile-page-badge">Cuenta de usuario</span>
              <h1>Mi Perfil</h1>
              <p>
                Administra tus datos personales, revisa tu información de acceso
                y actualiza tu contraseña de manera segura.
              </p>
            </div>
          </div>
        </section>

        {/* ==================== CONTENIDO PRINCIPAL ==================== */}
        <section className="profile-layout">
          {loadingProfile ? (
            <div className="profile-loading-card">
              <div className="profile-loader"></div>
              <p>Cargando información del perfil...</p>
            </div>
          ) : (
            <>
              {/* ==================== PANEL IZQUIERDO ==================== */}
              <aside className="profile-summary-card">
                <div className="profile-summary-bg"></div>

                <div className="profile-avatar-large">
                  {getInitials()}
                </div>

                <h2>{profileData.nombres} {profileData.apellidos}</h2>
                <p className="profile-email">{profileData.email}</p>

                <span className={`profile-role-badge ${profileData.rol}`}>
                  {profileData.rol === 'admin' ? 'Administrador' : 'Usuario'}
                </span>

                <div className="profile-summary-list">
                  <div className="summary-item">
                    <span className="summary-icon">🎂</span>
                    <div>
                      <small>Fecha de nacimiento</small>
                      <strong>{formatDate(profileData.fecha_nacimiento)}</strong>
                    </div>
                  </div>

                  <div className="summary-item">
                    <span className="summary-icon">📅</span>
                    <div>
                      <small>Miembro desde</small>
                      <strong>{formatDate(profileData.fecha_registro)}</strong>
                    </div>
                  </div>

                  <div className="summary-item">
                    <span className="summary-icon">🛡️</span>
                    <div>
                      <small>Tipo de acceso</small>
                      <strong>{profileData.rol === 'admin' ? 'Panel administrativo' : 'Exploración turística'}</strong>
                    </div>
                  </div>
                </div>
              </aside>

              {/* ==================== PANEL DERECHO ==================== */}
              <div className="profile-content-card">
                <div className="profile-card-header">
                  <div>
                    <span className="section-kicker">
                      {isEditing ? 'Modo edición' : 'Información personal'}
                    </span>
                    <h2>
                      {isEditing ? 'Actualizar datos del perfil' : 'Datos registrados'}
                    </h2>
                  </div>

                  {!isEditing && (
                    <button className="profile-edit-btn" onClick={() => setIsEditing(true)}>
                      ✏️ Editar perfil
                    </button>
                  )}
                </div>

                {message.text && (
                  <div className={`profile-alert ${message.type}`}>
                    {message.type === 'success' ? '✅' : '⚠️'}
                    <span>{message.text}</span>
                  </div>
                )}

                {!isEditing ? (
                  <div className="profile-details-grid">
                    <div className="detail-card">
                      <span className="detail-icon">👤</span>
                      <small>Nombres</small>
                      <strong>{profileData.nombres}</strong>
                    </div>

                    <div className="detail-card">
                      <span className="detail-icon">📘</span>
                      <small>Apellidos</small>
                      <strong>{profileData.apellidos}</strong>
                    </div>

                    <div className="detail-card detail-card-wide">
                      <span className="detail-icon">✉️</span>
                      <small>Correo electrónico</small>
                      <strong>{profileData.email}</strong>
                    </div>

                    <div className="detail-card">
                      <span className="detail-icon">🎂</span>
                      <small>Fecha de nacimiento</small>
                      <strong>{formatDate(profileData.fecha_nacimiento)}</strong>
                    </div>

                    <div className="detail-card">
                      <span className="detail-icon">🔐</span>
                      <small>Rol de usuario</small>
                      <strong>{profileData.rol === 'admin' ? 'Administrador' : 'Usuario'}</strong>
                    </div>
                  </div>
                ) : (
                  <form className="profile-edit-form" onSubmit={handleSave}>
                    <div className="form-section-title">
                      <span>01</span>
                      <div>
                        <h3>Datos personales</h3>
                        <p>Actualiza tu información básica de usuario.</p>
                      </div>
                    </div>

                    <div className="profile-form-grid">
                      <div className="profile-input-group">
                        <label>Nombres *</label>
                        <input
                          type="text"
                          name="nombres"
                          value={editData.nombres}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="profile-input-group">
                        <label>Apellidos *</label>
                        <input
                          type="text"
                          name="apellidos"
                          value={editData.apellidos}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="profile-input-group profile-input-wide">
                        <label>Correo electrónico *</label>
                        <input
                          type="email"
                          name="email"
                          value={editData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="profile-input-group profile-input-wide">
                        <label>Fecha de nacimiento *</label>
                        <input
                          type="date"
                          name="fecha_nacimiento"
                          value={editData.fecha_nacimiento}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="password-panel">
                      <div className="form-section-title">
                        <span>02</span>
                        <div>
                          <h3>Seguridad de la cuenta</h3>
                          <p>Cambia tu contraseña solo si lo necesitas.</p>
                        </div>
                      </div>

                      <div className="profile-form-grid">
                        <div className="profile-input-group profile-input-wide">
                          <label>Contraseña actual</label>
                          <input
                            type="password"
                            name="currentPassword"
                            value={editData.currentPassword}
                            onChange={handleChange}
                            placeholder="Ingresa tu contraseña actual"
                            autoComplete="current-password"
                          />
                        </div>

                        <div className="profile-input-group">
                          <label>Nueva contraseña</label>
                          <input
                            type="password"
                            name="newPassword"
                            value={editData.newPassword}
                            onChange={handleChange}
                            placeholder="Mínimo 6 caracteres"
                            autoComplete="new-password"
                          />
                        </div>

                        <div className="profile-input-group">
                          <label>Confirmar contraseña</label>
                          <input
                            type="password"
                            name="confirmNewPassword"
                            value={editData.confirmNewPassword}
                            onChange={handleChange}
                            placeholder="Repite la nueva contraseña"
                            autoComplete="new-password"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="profile-form-actions">
                      <button
                        type="button"
                        className="profile-cancel-btn"
                        onClick={handleCancelEdit}
                        disabled={loading}
                      >
                        Cancelar
                      </button>

                      <button
                        type="submit"
                        className="profile-save-btn"
                        disabled={loading}
                      >
                        {loading ? 'Guardando...' : 'Guardar cambios'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
};

export default ProfilePage;