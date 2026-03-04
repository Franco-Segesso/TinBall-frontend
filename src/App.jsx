import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, Navigate, useNavigate } from 'react-router-dom';
import Feed from './pages/Feed';
import Perfil from './pages/Perfil';
import Login from './pages/Login';
import Registro from './pages/Registro';
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

  // Si NO está logueado, solo puede ver Login o Registro
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

  // Si SÍ está logueado, ve la aplicación normal
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