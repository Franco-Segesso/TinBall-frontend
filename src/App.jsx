import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, Navigate, useNavigate } from 'react-router-dom';
import Feed from './pages/Feed';
import Perfil from './pages/Perfil';
import Login from './pages/Login';
import Registro from './pages/Registro';
import VerEquipo from './pages/VerEquipo';     // <-- NUEVO
import VerJugador from './pages/VerJugador';   // <-- NUEVO
import { User, Search, MessageCircle } from 'lucide-react';
import './App.css';

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) setIsAuthenticated(true);
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login onLogin={() => setIsAuthenticated(true)} />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    );
  }

  return (
    <div className="App">
      {location.pathname !== '/perfil' && (
        <nav className="navbar">
          <h1>TinBall ⚽</h1>
        </nav>
      )}

      <Routes>
        <Route path="/" element={<Feed />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/equipo/:id" element={<VerEquipo />} />     {/* <-- NUEVO */}
        <Route path="/jugador/:id" element={<VerJugador />} />   {/* <-- NUEVO */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      <nav className="bottom-nav">
        <Link to="/" className={location.pathname === '/' ? 'active' : ''}><Search size={28} /></Link>
        <Link to="/mensajes" className={location.pathname === '/mensajes' ? 'active' : ''}><MessageCircle size={28} /></Link>
        <Link to="/perfil" className={location.pathname === '/perfil' ? 'active' : ''}><User size={28} /></Link>
      </nav>
    </div>
  );
}

export default App;