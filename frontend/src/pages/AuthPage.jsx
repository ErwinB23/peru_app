// PÁGINA COMPLETA DE AUTENTICACIÓN
// Muestra el mensaje de bienvenida primero
// Al hacer click en "Comenzar", aparece el login/register con slider effect
// TODO EN UNA SOLA VENTANA

import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UserRound,
  BookOpen,
  CalendarDays,
  Mail,
  LockKeyhole,
  X,
  CircleAlert,
  CheckCircle2
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { login as loginService, register as registerService } from '../services/authService';
import '../styles/AuthPage.css';
import overlayVideo from '../assets/ImagenLogin/overlayVideo.mp4';
import logoBanderita from '../assets/ImagenLogin/logoBanderita.png';

const AuthPage = () => {
  // Estado para controlar si mostramos bienvenida o formularios
  const [showAuth, setShowAuth] = useState(false);
  
  // Estado para controlar qué panel está activo (login o register)
  const [isLoginActive, setIsLoginActive] = useState(true);

  // Estados para el formulario de LOGIN
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Estados para el formulario de REGISTER
  const [registerNombres, setRegisterNombres] = useState('');
  const [registerApellidos, setRegisterApellidos] = useState('');
  const [registerFechaNacimiento, setRegisterFechaNacimiento] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Estados para mensajes y carga
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // Función para mostrar los formularios de autenticación
  const handleStartAuth = () => {
    setShowAuth(true);
  };

  // Función para cerrar los formularios y volver a la bienvenida
  const handleCloseAuth = () => {
    setShowAuth(false);
    setError('');
    setSuccess('');
    // Resetear formularios
    setLoginEmail('');
    setLoginPassword('');
    setRegisterNombres('');
    setRegisterApellidos('');
    setRegisterFechaNacimiento('');
    setRegisterEmail('');
    setRegisterPassword('');
    setConfirmPassword('');
  };

  // Función para cambiar entre Login y Register
  const togglePanel = () => {
    setIsLoginActive(!isLoginActive);
    setError('');
    setSuccess('');
  };

  // Manejar envío del formulario de LOGIN
const handleLoginSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setSuccess('');

  const email = loginEmail.trim().toLowerCase();
  const password = loginPassword.trim();

  if (!email || !password) {
    setError('Ingresa tu correo y contraseña');
    return;
  }

  setLoading(true);

  try {
    const data = await loginService(email, password);
    login(data.user, data.token);
    navigate('/home');
  } catch (err) {
    setError(err.response?.data?.error || 'Credenciales inválidas');
  } finally {
    setLoading(false);
  }
};

  // Manejar envío del formulario de REGISTER
const handleRegisterSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setSuccess('');

  const nombres = registerNombres.trim();
  const apellidos = registerApellidos.trim();
  const fechaNacimiento = registerFechaNacimiento;
  const email = registerEmail.trim().toLowerCase();
  const password = registerPassword.trim();
  const passwordConfirmada = confirmPassword.trim();

  if (!nombres || !apellidos || !fechaNacimiento || !email || !password || !passwordConfirmada) {
    setError('Completa todos los campos del registro');
    return;
  }

  if (password !== passwordConfirmada) {
    setError('Las contraseñas no coinciden');
    return;
  }

  if (password.length < 6) {
    setError('La contraseña debe tener al menos 6 caracteres');
    return;
  }

  setLoading(true);

  try {
    await registerService(nombres, apellidos, fechaNacimiento, email, password);

    setSuccess('¡Registro exitoso! Ahora puedes iniciar sesión');

    setRegisterNombres('');
    setRegisterApellidos('');
    setRegisterFechaNacimiento('');
    setRegisterEmail('');
    setRegisterPassword('');
    setConfirmPassword('');

    setTimeout(() => {
      setIsLoginActive(true);
      setSuccess('');
    }, 1800);
  } catch (err) {
    setError(err.response?.data?.error || 'Error al registrar usuario');
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="auth-page-container">
      {/* Fondo de Machu Picchu - Siempre visible */}
      <div className="auth-background"></div>

      {/* ==================== MENSAJE DE BIENVENIDA ==================== */}
      <div className={`welcome-screen ${showAuth ? 'hide' : ''}`}>
        {/* Título principal */}
        <h1 className="welcome-title">
        {/* Primera línea */}
        {"¡BIENVENIDO A CONOCER UN PAÍS"
          .split("")
          .map((char, index) => (
            <span
              key={`line1-${index}`}
              style={{ animationDelay: `${index * 0.04}s` }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}

        <br />

        {/* Segunda línea */}
        {"MÁGICO Y MARAVILLOSO!"
          .split("")
          .map((char, index) => (
            <span
              key={`line2-${index}`}
              style={{ animationDelay: `${(index * 0.04) + 1.4}s` }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </h1>

        {/* Subtítulo */}
        <p className="welcome-subtitle">
        {"Explora los departamentos, provincias y distritos del Perú"
          .split("")
          .map((char, index) => (
            <span
              key={index}
              style={{ animationDelay: `${index * 0.02 + 2}s` }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </p>

        {/* Botón Comenzar */}
        <button className="btn-comenzar" onClick={handleStartAuth}>
          Comenzar
        </button>
      </div>

      {/* ==================== FORMULARIOS LOGIN/REGISTER ==================== */}
      <div className={`auth-forms-container ${showAuth ? 'show' : ''}`}>
        <div className={`auth-box-slider ${isLoginActive ? 'login-active' : 'register-active'}`}>
          
          {/* Botón X para cerrar y volver a la bienvenida */}
          <button type="button" className="btn-close-auth" onClick={handleCloseAuth} title="Volver">
            <X size={22} strokeWidth={2.8} />
          </button>
          
          {/* Panel de REGISTRO */}
          <div className="form-panel register-panel">
            <form onSubmit={handleRegisterSubmit} className="auth-form">
              <h2 className="form-title">Crear Cuenta</h2>
              <p className="form-subtitle">Completa tus datos</p>

              <div className="input-group">
                <span className="input-icon"><UserRound size={18} strokeWidth={2.4} /></span>
                <input
                  type="text"
                  name="nombres"
                  placeholder="Nombres"
                  value={registerNombres}
                  onChange={(e) => setRegisterNombres(e.target.value)}
                  required
                  disabled={loading}
                  autoComplete="given-name"
                />
              </div>

              <div className="input-group">
                <span className="input-icon"><BookOpen size={18} strokeWidth={2.4} /></span>
                <input
                  type="text"
                  name="apellidos"
                  placeholder="Apellidos"
                  value={registerApellidos}
                  onChange={(e) => setRegisterApellidos(e.target.value)}
                  required
                  disabled={loading}
                  autoComplete="family-name"
                />
              </div>

              <div className="input-group">
                <span className="input-icon"><CalendarDays size={18} strokeWidth={2.4} /></span>
                <input
                  type="date"
                  name="fecha_nacimiento"
                  value={registerFechaNacimiento}
                  onChange={(e) => setRegisterFechaNacimiento(e.target.value)}
                  required
                  disabled={loading}
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="input-group">
                <span className="input-icon"><Mail size={18} strokeWidth={2.4} /></span>
                <input
                  type="email"
                  name="email"
                  placeholder="Correo electrónico"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  required
                  disabled={loading}
                  autoComplete="email"
                />
              </div>

              <div className="input-group">
                <span className="input-icon"><LockKeyhole size={18} strokeWidth={2.4} /></span>
                <input
                  type="password"
                  name="password"
                  placeholder="Contraseña (mínimo 6 caracteres)"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  required
                  minLength="6"
                  disabled={loading}
                  autoComplete="new-password"
                />
              </div>

              <div className="input-group">
                <span className="input-icon"><LockKeyhole size={18} strokeWidth={2.4} /></span>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirmar contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength="6"
                  disabled={loading}
                  autoComplete="new-password"
                />
              </div>

              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? 'Registrando...' : 'REGISTRARSE'}
              </button>
            </form>
          </div>

          {/* Panel de LOGIN */}
          <div className="form-panel login-panel">
            <form onSubmit={handleLoginSubmit} className="auth-form">
              <img 
                src={logoBanderita} 
                alt="Logo Perú App" 
                className="login-logo" 
              />
              <h2 className="form-title">Iniciar Sesión</h2>
              <p className="form-subtitle">Ingresa tus credenciales</p>

              <div className="input-group">
                <span className="input-icon"><Mail size={18} strokeWidth={2.4} /></span>
                <input
                  type="email"
                  name="email"
                  placeholder="Correo electrónico"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                  disabled={loading}
                  autoComplete="email"
                />
              </div>

              <div className="input-group">
                <span className="input-icon"><LockKeyhole size={18} strokeWidth={2.4} /></span>
                <input
                  type="password"
                  name="password"
                  placeholder="Contraseña"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                  disabled={loading}
                  autoComplete="current-password"
                />
              </div>

              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? 'Iniciando...' : 'INICIAR SESIÓN'}
              </button>
            </form>
          </div>

          {/* ==================== PANEL OVERLAY CON VIDEO ==================== */}
          <div className="overlay-panel-container">
            <div className="overlay-content">

              {/* VIDEO DE FONDO */}
              <video
                className="overlay-video"
                autoPlay
                muted
                loop
                playsInline
              >
                <source src={overlayVideo} type="video/mp4" />
              </video>

              {/* CAPA OSCURA PARA LEGIBILIDAD */}
              <div className="overlay-dark"></div>

              {/* CONTENIDO DEL OVERLAY */}
              <div className="overlay-overlay">
                
                {/* Lado izquierdo: aparece cuando REGISTER está activo */}
                <div className="overlay-side overlay-left">
                  <h2>¡Bienvenido de nuevo!</h2>
                  <p>Inicia sesión para continuar explorando el Perú</p>
                  <button type="button" className="btn-ghost" onClick={togglePanel}>
                    INICIAR SESIÓN
                  </button>
                </div>

                {/* Lado derecho: aparece cuando LOGIN está activo */}
                <div className="overlay-side overlay-right">
                  <h2>¡Hola, Perú!</h2>
                  <p>Regístrate y descubre las maravillas que tiene el Perú</p>
                  <button type="button" className="btn-ghost" onClick={togglePanel}>
                    REGISTRARSE
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mensajes emergentes */}
      {error && (
        <div className="toast toast-error">
          <CircleAlert size={18} strokeWidth={2.5} /> {error}
        </div>
      )}
      {success && (
        <div className="toast toast-success">
          <CheckCircle2 size={18} strokeWidth={2.5} /> {success}
        </div>
      )}
    </div>
  );
};

export default AuthPage;