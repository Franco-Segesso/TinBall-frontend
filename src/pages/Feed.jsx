import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import EquipoCard from '../components/EquipoCard';
import { AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react'; // Importamos el ícono para la barra

const Feed = () => {
  const [equiposOriginales, setEquiposOriginales] = useState([]); // Guardamos la lista completa
  const [equipos, setEquipos] = useState([]); // Los que mostramos en pantalla (filtrados)
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filtroZona, setFiltroZona] = useState(''); // Lo que el usuario escribe

  const userType = localStorage.getItem('userType');
  const userData = JSON.parse(localStorage.getItem('user'));
  const miId = userData ? userData.id : null;

  useEffect(() => {
    api.get('/equipos')
      .then(res => {
        let data = res.data;
        if (userType === 'equipo') {
          data = data.filter(e => e.id !== miId); // Ocultar mi propio equipo
        }
        setEquiposOriginales(data);
        setEquipos(data);
      })
      .catch(err => console.error("Error al cargar equipos:", err));
  }, [miId, userType]);

  // NUEVO: Efecto que se dispara cada vez que escribís en el buscador
  useEffect(() => {
    if (filtroZona.trim() === '') {
      // Si la barra está vacía, mostramos todos
      setEquipos(equiposOriginales);
    } else {
      // Filtramos ignorando mayúsculas y minúsculas
      const filtrados = equiposOriginales.filter(eq => 
        eq.zona && eq.zona.toLowerCase().includes(filtroZona.toLowerCase())
      );
      setEquipos(filtrados);
    }
    setCurrentIndex(0); // Reiniciamos la pila de tarjetas para ver los resultados desde el principio
  }, [filtroZona, equiposOriginales]);

  const nextCard = () => setCurrentIndex(prev => prev + 1);

  const handleLike = async (receptorId) => {
    if (userType === 'jugador') {
      nextCard();
      return;
    }

    try {
      const res = await api.post(`/likes/dar-like/${miId}/${receptorId}`);
      if (res.data.includes("MATCH")) {
        alert("🎉 ¡HAY MATCH! " + res.data);
      }
      nextCard();
    } catch (err) {
      console.error("Error al dar like", err);
      nextCard(); 
    }
  };

  const handleDislike = (receptorId) => {
    nextCard();
  };

  return (
    <div className="feed-page">
      
      {/* --- NUEVA BARRA DE BÚSQUEDA --- */}
      <div style={{ 
        width: '100%', maxWidth: '350px', marginBottom: '15px', 
        display: 'flex', alignItems: 'center', background: 'white', 
        padding: '12px 20px', borderRadius: '30px', 
        boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid #eaeaea'
      }}>
        <Search size={20} color="#28a745" style={{marginRight: '10px'}} />
        <input 
          type="text" 
          placeholder="Buscar por zona (Ej: Quilmes)..." 
          value={filtroZona}
          onChange={(e) => setFiltroZona(e.target.value)}
          style={{ border: 'none', outline: 'none', width: '100%', fontSize: '1rem', color: '#333' }}
        />
      </div>

      <div className="cards-stack">
        <AnimatePresence>
          {currentIndex < equipos.length ? (
            <EquipoCard 
              key={equipos[currentIndex].id}
              equipo={equipos[currentIndex]} 
              onLike={handleLike} 
              onDislike={handleDislike}
              userType={userType}
            />
          ) : (
            <div className="no-more">
              <h3>⚽ ¡Cancha vacía!</h3>
              {/* Mensaje dinámico si no hay resultados en esa zona */}
              {filtroZona !== '' ? (
                <p>No encontramos equipos en "{filtroZona}".</p>
              ) : (
                <p>Ya viste a todos los equipos disponibles.</p>
              )}
              <button onClick={() => { setFiltroZona(''); setCurrentIndex(0); }} className="btn-save" style={{marginTop: '15px'}}>Ver todos</button>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Feed;