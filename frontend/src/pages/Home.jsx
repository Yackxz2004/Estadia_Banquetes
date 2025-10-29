import React from 'react';
import Navbar from '../components/Navbar'; 
import '../styles/Home.css'; 

const Home = () => {
  return (
    <div className="home-container">
      <Navbar />
      <section id="inicio" className="hero-section">
        <div className="hero-content">
          <h1>Banquetees</h1>
          <p className="brand-name">Boyas</p>
        </div>
      </section>

      <section id="sobre-nosotros" className="content-section">
        <h2>Sobre Nosotros</h2>
        {/* Aquí irá el contenido de la sección */}
      </section>

      <section id="sociales" className="content-section">
        <h2>Sociales</h2>
        {/* Aquí irá el contenido de la sección */}
      </section>

      <section id="corporativos" className="content-section">
        <h2>Corporativos</h2>
        {/* Aquí irá el contenido de la sección */}
      </section>

      <section id="gubernamentales" className="content-section">
        <h2>Gubernamentales</h2>
        {/* Aquí irá el contenido de la sección */}
      </section>

      <section id="camerinos" className="content-section">
        <h2>Camerinos</h2>
        {/* Aquí irá el contenido de la sección */}
      </section>

      <section id="adicionales" className="content-section">
        <h2>Adicionales</h2>
        {/* Aquí irá el contenido de la sección */}
      </section>
    </div>
  );
};

export default Home;
