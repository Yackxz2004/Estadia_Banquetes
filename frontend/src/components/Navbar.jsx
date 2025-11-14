import React from 'react';
import { Link } from 'react-router-dom'; 
import '../styles/Navbar.css'; 

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <a href="#inicio">Boyas</a>
      </div>
      <ul className="navbar-links">
        <li><a href="#sobre-nosotros">Nosotros</a></li>
        <li><a href="#sociales">Sociales</a></li>
        <li><a href="#corporativos">Corporativos</a></li>
        <li><a href="#gubernamentales">Gubernamentales</a></li>
        <li><a href="#camerinos">Camerinos</a></li>
        <li><a href="#adicionales">Adicionales</a></li>
        <li><Link to="/inventory/calendar">Calendario</Link></li>
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/register">Register</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
