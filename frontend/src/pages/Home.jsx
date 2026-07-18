import { useState, useEffect, useRef } from 'react';
import '../styles/Home.css';
import { useNavigate, useLocation } from 'react-router-dom';
import AppHeader from '../components/AppHeader';
import logoBandera from '../assets/ImagenLogin/logoBanderita.png';
import arequipaImg from '../assets/ImagenHome/Arequipa.webp';
import ayacuchoImg from '../assets/ImagenHome/Ayacucho.webp';
import cuscoImg from '../assets/ImagenHome/Cusco.webp';
import limaImg from '../assets/ImagenHome/Lima.webp';
import pascoImg from '../assets/ImagenHome/Pasco.webp';
import {
  MapPinned,
  Mountain,
  Landmark,
  Building2,
  ChevronUp,
  ChevronDown
} from 'lucide-react';



// Datos de departamentos con imágenes
const departamentos = [
  {
    id: 1,
    nombre: 'Ayacucho',
    descripcion: 'Tierra de historia, arte popular, iglesias coloniales, Semana Santa y paisajes naturales como las Aguas Turquesas de Millpu.',
    imagen: ayacuchoImg,
    fondo: ayacuchoImg,
    posicionFondo: 'center center'
  },
  {
    id: 2,
    nombre: 'Cusco',
    descripcion: 'Capital histórica del Imperio Inca, hogar de Machu Picchu, Sacsayhuamán y una de las culturas más importantes del Perú.',
    imagen: cuscoImg,
    fondo: cuscoImg,
    posicionFondo: 'center center'
  },
  {
    id: 3,
    nombre: 'Arequipa',
    descripcion: 'La Ciudad Blanca, reconocida por su arquitectura en sillar, el volcán Misti, el Cañón del Colca y su gastronomía tradicional.',
    imagen: arequipaImg,
    fondo: arequipaImg,
    posicionFondo: 'center center'
  },
  {
    id: 4,
    nombre: 'Lima',
    descripcion: 'Capital del Perú, centro gastronómico, cultural e histórico, donde conviven la modernidad y la tradición colonial.',
    imagen: limaImg,
    fondo: limaImg,
    posicionFondo: 'center center'
  },

  {
    id: 5,
    nombre: 'Pasco',
    descripcion: ' Pasco es que es el departamento de los contrastes extremos, definido por la dualidad radical entre su puna minera gélida y su selva alta austro-alemana y amazónica',
    imagen: pascoImg,
    fondo: pascoImg,
    posicionFondo: 'center center'
  }
];

const Home = () => {

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);
  const carouselRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Navegación anterior
  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? departamentos.length - 1 : prev - 1));
  };

  // Navegación siguiente
  const handleNext = () => {
    setCurrentIndex((prev) => (prev === departamentos.length - 1 ? 0 : prev + 1));
  };



  // Ir a una sección del Home cuando se navega desde otra pantalla
  useEffect(() => {
    const sectionId = location.state?.scrollTo;

    if (!sectionId) return;

    setTimeout(() => {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  }, [location.state]);

  // Calcula la posición circular de cada tarjeta
  const getCardPosition = (index) => {
    let position = index - currentIndex;

    if (position > departamentos.length / 2) {
      position -= departamentos.length;
    }

    if (position < -departamentos.length / 2) {
      position += departamentos.length;
    }

    return position;
  };

  // Scroll del mouse solo dentro del carrusel sin mover la página
  useEffect(() => {
    const carouselElement = carouselRef.current;

    if (!carouselElement) return;

    let isWheelLocked = false;

    const handleWheel = (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (isWheelLocked) return;

      isWheelLocked = true;

      if (e.deltaY > 0) {
        setCurrentIndex((prev) =>
          prev === departamentos.length - 1 ? 0 : prev + 1
        );
      } else {
        setCurrentIndex((prev) =>
          prev === 0 ? departamentos.length - 1 : prev - 1
        );
      }

      setTimeout(() => {
        isWheelLocked = false;
      }, 550);
    };

    carouselElement.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      carouselElement.removeEventListener('wheel', handleWheel);
    };
  }, []);

  // Movimiento automático del carrusel
  useEffect(() => {
    if (isCarouselPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === departamentos.length - 1 ? 0 : prev + 1));
    }, 3500);

    return () => clearInterval(timer);
  }, [isCarouselPaused]);

  const currentDepartamento = departamentos[currentIndex];

  return (
    <div className="home-container">

      {/* ==================== HEADER ==================== */}
      <AppHeader />

      {/* ==================== HERO CON CAROUSEL ==================== */}
      <section
        id="inicio"
        className="hero-section"
        style={{
          backgroundImage: `
            linear-gradient(120deg, rgba(3, 10, 18, 0.64), rgba(6, 34, 44, 0.34), rgba(0, 0, 0, 0.58)),
            url(${currentDepartamento.fondo})
          `,
          backgroundPosition: currentDepartamento.posicionFondo
        }}
      >
        <div className="hero-content">

          {/* Texto principal */}
          <div className="hero-text">
            <span className="hero-badge">Guía turístico - cultural del Perú</span>

            <h1>
              Descubre <span>{currentDepartamento.nombre}</span>
            </h1>

            <p>{currentDepartamento.descripcion}</p>

            <div className="hero-actions">
              <button
                className="hero-primary-btn"
                onClick={() => document.getElementById('sobre-nosotros')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Explorar ahora
              </button>

              <button
                className="hero-secondary-btn"
                onClick={() => navigate('/departamentos')}
              >
                Ver departamentos
              </button>
            </div>
          </div>

          {/* Carrusel de tarjetas */}
          <div
            ref={carouselRef}
            className="hero-carousel"
            onMouseEnter={() => setIsCarouselPaused(true)}
            onMouseLeave={() => setIsCarouselPaused(false)}
          >
            <div className="carousel-glow"></div>

            <div className="carousel-cards">
              {departamentos.map((dep, index) => {
                const position = getCardPosition(index);
                const isActive = position === 0;
                const isVisible = Math.abs(position) <= 2;

                return (
                  <div
                    key={dep.id}
                    className={`carousel-card ${isActive ? 'active' : ''}`}
                    onClick={() => setCurrentIndex(index)}
                    style={{
                      transform: `
                        translate3d(${position * 38}px, ${position * 34}px, ${Math.abs(position) * -90}px)
                        rotateZ(${position * -3}deg)
                        scale(${isActive ? 1 : 0.88})
                      `,
                      opacity: isVisible ? 1 - Math.abs(position) * 0.22 : 0,
                      zIndex: 20 - Math.abs(position),
                      pointerEvents: isVisible ? 'auto' : 'none'
                    }}
                  >
                    <img src={dep.imagen} alt={dep.nombre} />

                    <div className="card-overlay">
                      <span>Destino destacado</span>
                      <h3>{dep.nombre}</h3>
                      <p>{dep.descripcion}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Controles */}
            <div className="carousel-controls">
              <button className="carousel-btn up" onClick={handlePrev} aria-label="Anterior">
                <ChevronUp size={24} strokeWidth={2.8} />
              </button>

              <button className="carousel-btn down" onClick={handleNext} aria-label="Siguiente">
                <ChevronDown size={24} strokeWidth={2.8} />
              </button>
            </div>

            {/* Indicadores */}
            <div className="carousel-indicators">
              {departamentos.map((dep, index) => (
                <button
                  key={dep.id}
                  className={`carousel-dot ${index === currentIndex ? 'active' : ''}`}
                  onClick={() => setCurrentIndex(index)}
                  aria-label={`Ver ${dep.nombre}`}
                />
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ==================== SECCIÓN DE EXPLORACIÓN ==================== */}
      <section id="sobre-nosotros" className="explore-section">
        <div className="explore-header">
          <span className="explore-badge">Explora el Perú</span>
          <h2>Organiza tu viaje por regiones, provincias y ciudades</h2>
          <p >
            Navega por la información turística, cultural y geográfica del Perú de una
            manera ordenada, visual y fácil de entender.
          </p>
        </div>

        <div className="explore-cards">
          <div className="explore-card card-departamentos">
            <div className="card-top">
              <div className="card-icon"> <MapPinned size={34} strokeWidth={2.2} /></div>
              <span className="card-number">01</span>
            </div>

            <h3>Departamentos</h3>
            <p>
              Explora los departamentos del Perú con información general, capital,
              región natural, actividades principales y atractivos turísticos.
            </p>

            <button className="card-btn" onClick={() => navigate('/departamentos')}>
              Explorar
            </button>
          </div>

          <div className="explore-card card-provincias">
            <div className="card-top">
              <div className="card-icon"> <Mountain size={34} strokeWidth={2.2} /> </div>
              <span className="card-number">02</span>
            </div>

            <h3>Provincias</h3>
            <p>
              Consulta las provincias según cada departamento, su capital, población,
              festividades representativas y actividad económica.
            </p>

            <button
              className="card-btn"
              type="button"
              onClick={() => navigate('/explorar-provincias')}
            >
              Explorar provincias
            </button>
          </div>

          <div className="explore-card card-distritos">
            <div className="card-top">
              <div className="card-icon"> <Landmark size={34} strokeWidth={2.2} /> </div>
              <span className="card-number">03</span>
            </div>

            <h3>Distritos</h3>
            <p>
              Revisa información distrital como tipo de zona, nivel de
              desarrollo, descripción local, lugares turísticos y comidas típicas.
            </p>

            <button
              className="card-btn"
              type="button"
              onClick={() => navigate('/explorar-distritos')}
            >
              Explorar distritos
            </button>
          </div>

          <div className="explore-card card-ciudades">
            <div className="card-top">
              <div className="card-icon"> <Building2 size={34} strokeWidth={2.2} /> </div>
              <span className="card-number">04</span>
            </div>

            <h3>Ciudades</h3>
            <p>
              Selecciona un departamento y consulta sus ciudades, actividad principal,
              atractivo turístico, clima y descripción cultural.
            </p>

            <button
              className="card-btn"
              type="button"
              onClick={() => navigate('/explorar-ciudades')}
            >
              Explorar ciudades
            </button>
          </div>
        </div>
      </section>

      {/* ==================== ESTADÍSTICAS ==================== */}
      <section id="estadisticas" className="stats-section">
        <div className="stats-background-detail"></div>

        <div className="stats-content">
          <div className="stats-header">
            <span className="stats-badge">Datos del Perú</span>
            <h2>Información organizada para explorar el país</h2>
            <p>
              La plataforma centraliza información geográfica, cultural y turística
              para facilitar la exploración del Perú por niveles administrativos.
            </p>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon"> <MapPinned size={34} strokeWidth={2.2} /> </div>
              <div className="stat-number">25</div>
              <div className="stat-label">Departamentos</div>
              <p>Información general, capital, región natural y atractivos principales.</p>
            </div>

            <div className="stat-card">
              <div className="stat-icon"> <Mountain size={34} strokeWidth={2.2} /> </div>
              <div className="stat-number">196</div>
              <div className="stat-label">Provincias</div>
              <p>Datos organizados por departamento, festividades y economía local.</p>
            </div>

            <div className="stat-card">
              <div className="stat-icon"> <Landmark size={34} strokeWidth={2.2} /> </div>
              <div className="stat-number">1874</div>
              <div className="stat-label">Distritos</div>
              <p>Información distrital sobre tipo de zona, desarrollo y contenido turístico local.</p>
            </div>

            <div className="stat-card">
              <div className="stat-icon"> <Building2 size={34} strokeWidth={2.2} /> </div>
              <div className="stat-number">100+</div>
              <div className="stat-label">Ciudades</div>
              <p>Ciudades turísticas, históricas y comerciales del territorio peruano.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="home-footer">
        <div className="footer-content">

          <div className="footer-brand">
            <div className="footer-logo">
              <img src={logoBandera} alt="Logo Perú App" />
            </div>

            <div>
              <h3>Perú App</h3>
              <p>
                Plataforma turístico-educativa para explorar la riqueza geográfica,
                cultural y turística del Perú.
              </p>
            </div>
          </div>

          <div className="footer-links">
            <div className="footer-column">
              <h4>Explorar</h4>
              <a href="#inicio">Inicio</a>
              <a href="#sobre-nosotros">Secciones</a>
              <a href="#estadisticas">Estadísticas</a>
            </div>

            <div className="footer-column">
              <h4>Módulos</h4>
              <button type="button" onClick={() => navigate('/departamentos')}>
                Departamentos
              </button>
              <button type="button" onClick={() => navigate('/explorar-provincias')}>
                Provincias
              </button>
              <button type="button" onClick={() => navigate('/explorar-distritos')}>
                Distritos
              </button>
              <button type="button" onClick={() => navigate('/explorar-ciudades')}>
                Ciudades
              </button>
            </div>

            <div className="footer-column">
              <h4>Proyecto</h4>
              <span>Turismo</span>
              <span>Cultura</span>
              <span>Educación</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 Perú App. Todos los derechos reservados.</p>
          <p>Desarrollado para la exploración turística y cultural del Perú.</p>
        </div>
      </footer>



      {/* Sidebar */}


    </div>
  );
};

export default Home;