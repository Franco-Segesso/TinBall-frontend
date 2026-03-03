import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Feed from './pages/Feed';
import Perfil from './pages/Perfil';
import { User, Search, MessageCircle } from 'lucide-react';
import './App.css';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Feed />} />
        <Route path="/perfil" element={<Perfil />} />
      </Routes>

      {/* Barra de Navegación Inferior estilo App Mobile */}
      <nav className="bottom-nav">
        <Link to="/"><Search /></Link>
        <Link to="/mensajes"><MessageCircle /></Link>
        <Link to="/perfil"><User /></Link>
      </nav>
    </div>
  );
}

export default App;