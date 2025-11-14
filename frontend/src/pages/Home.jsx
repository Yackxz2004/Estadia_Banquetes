import React from 'react';
import Navbar from '../components/Navbar'; 
import '../styles/Home.new.css'; 

const Home = () => {
  return (
    <div className="home-container">
      <Navbar />
      <section id="inicio" className="hero-section">
        <span className="reference-number">01</span>
        <div className="hero-content">
          <h1>BANQUETES</h1>
          <p className="brand-name">Boyás</p>
        </div>
      </section>

      <section id="sobre-nosotros" className="about-section">
        <div className="container">
          <h2 className="section-title">Sobre Nosotros</h2>
          <div className="about-content">
            <div className="about-image">
              <div className="image-placeholder">
                <span>Imagen de presentación</span>
              </div>
            </div>
            <div className="about-text">
              <p className="about-description">
                Desde el corazón de Morelos, hemos dedicado más de 35 años a perfeccionar el arte de los momentos que solo ocurren una vez. Ya sea la magia de una boda, la emoción de unos XV años, el orgullo de una graduación o hasta de una gira. Nuestra cobertura nacional nos permite garantizar que tu "por qué" siempre encuentre su "cómo" , sin importar dónde te encuentres. Ya sea que estés planeando un evento íntimo para 50 personas o una gran producción para 5000 asistentes, contamos con la capacidad y la experiencia para hacerlo realidad.
              </p>
              <div className="about-features">
                <div className="feature-item">
                  <span className="feature-icon">✓</span>
                  <span>Servicio personalizado para cada evento</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">✓</span>
                  <span>Menús adaptables a cualquier necesidad</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">✓</span>
                  <span>Equipo profesional y certificado</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">✓</span>
                  <span>Materiales y equipos de la más alta calidad</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="sociales" className="social-section">
        <div className="container">
          <h2 className="section-title">Sociales</h2>
          <div className="social-grid">
            <div className="social-item">
              <div className="social-image-placeholder">
                <span>Imagen 1</span>
              </div>
              <h3 className="social-item-title">Bodas</h3>
            </div>
            <div className="social-item">
              <div className="social-image-placeholder">
                <span>Imagen 2</span>
              </div>
              <h3 className="social-item-title">XV Años</h3>
            </div>
            <div className="social-item">
              <div className="social-image-placeholder">
                <span>Imagen 3</span>
              </div>
              <h3 className="social-item-title">Graduaciones</h3>
            </div>
          </div>
          <div className="social-events">
            <p>Cumpleaños • Bautizos • Gender Reveal • Baby Shower • Fiestas Temáticas</p>
          </div>
        </div>
      </section>

      <section id="corporativos" className="corporate-section">
        <div className="container">
          <h2 className="section-title">Corporativos</h2>
          <div className="corporate-grid">
            <div className="corporate-item">
              <div className="corporate-image-placeholder">
                <span>Imagen 1</span>
              </div>
              <h3 className="corporate-item-title">Eventos de Fin de Año</h3>
            </div>
            <div className="corporate-item">
              <div className="corporate-image-placeholder">
                <span>Imagen 2</span>
              </div>
              <h3 className="corporate-item-title">Desayunos</h3>
            </div>
            <div className="corporate-item">
              <div className="corporate-image-placeholder">
                <span>Imagen 3</span>
              </div>
              <h3 className="corporate-item-title">Coctelería</h3>
            </div>
          </div>
          <div className="corporate-events">
            <p>COFFEE BREAKS • ANIVERSARIOS • BOCADILLOS GOURMET</p>
          </div>
        </div>
      </section>

      <section id="gubernamentales" className="government-section">
        <div className="container">
          <h2 className="section-title">Gubernamentales</h2>
          <div className="government-grid">
            <div className="government-item">
              <div className="government-image-placeholder">
                <span>Imagen 1</span>
              </div>
              <h3 className="government-item-title">EVENTOS DE FIN DE AÑO</h3>
            </div>
            <div className="government-item">
              <div className="government-image-placeholder">
                <span>Imagen 2</span>
              </div>
              <h3 className="government-item-title">CAMPAÑAS POLÍTICAS</h3>
            </div>
            <div className="government-item">
              <div className="government-image-placeholder">
                <span>Imagen 3</span>
              </div>
              <h3 className="government-item-title">EVENTOS DE DÍAS FESTIVOS</h3>
            </div>
          </div>
        </div>
      </section>

      <section id="camerinos" className="dressing-room-section">
        <div className="container">
          <h2 className="section-title">Camerinos</h2>
          <div className="dressing-room-grid">
            <div className="dressing-room-item">
              <div className="dressing-room-image-placeholder">
                <span>Imagen 1</span>
              </div>
            </div>
            <div className="dressing-room-item">
              <div className="dressing-room-image-placeholder">
                <span>Imagen 2</span>
              </div>
            </div>
            <div className="dressing-room-item">
              <div className="dressing-room-image-placeholder">
                <span>Imagen 3</span>
              </div>
            </div>
          </div>
          <div className="dressing-room-title">
            <h3>CATERING DE CAMERINOS PARA FESTIVALES Y CONCIERTOS</h3>
            <div className="dressing-room-artists">
              <p>ALEJANDRO FERNÁNDEZ • GRUPO FIRME • JOAN SEBASTIAN • MODERATTO • PISO 21 • MATISSE • MOLOTOV • YURIDIA • PANTEÓN ROCOCO • ALEMÁN • MANUEL TURIZO • MIJARES</p>
            </div>
          </div>
        </div>
      </section>

      <section id="adicionales" className="additional-section">
        <div className="container">
          <h2 className="section-title">Adicionales</h2>
          <div className="additional-grid">
            <div className="additional-item">
              <div className="additional-image-placeholder">
                <span>Imagen 1</span>
              </div>
            </div>
            <div className="additional-item">
              <div className="additional-image-placeholder">
                <span>Imagen 2</span>
              </div>
            </div>
            <div className="additional-item">
              <div className="additional-image-placeholder">
                <span>Imagen 3</span>
              </div>
            </div>
          </div>
          <div className="additional-services">
            <p>MESA DE POSTRES • MESA DE DULCES • BOX LUNCH • PAQUETES MUSICALES • RENTA DE MOBILIARIO • PISTAS TARIMAS • PHOTO OPPORTUNITIES • CABINAS DE FOTOS • LETRAS GIGANTES • MESA DE CHARCUTERÍA • ESQUITES Y ELOTES • PIROTECNIA • BARRA DE CHAMPAÑA</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
