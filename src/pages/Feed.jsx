import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import EquipoCard from '../components/EquipoCard';
import { AnimatePresence } from 'framer-motion';

const Feed = () => {
  const [equipos, setEquipos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const miEquipoId = 1; // Tu ID simulado

  useEffect(() => {
    api.get('/equipos').then(res => {
      const otros = res.data.filter(e => e.id !== miEquipoId);
      setEquipos(otros);
    });
  }, []);

  const nextCard = () => setCurrentIndex(prev => prev + 1);

  // ESTA ES LA FUNCIÓN QUE FALTABA PARA EL LIKE (Derecha)
  const handleLike = async (receptorId) => {
    try {
      const res = await api.post(`/likes/dar-like/${miEquipoId}/${receptorId}`);
      if(res.data.includes("MATCH")) {
        alert("🎉 ¡HAY MATCH! " + res.data);
      }
      nextCard();
    } catch (err) {
      console.error("Error al dar like", err);
      nextCard();
    }
  };

  // Función para el RECHAZO (Izquierda)
  const handleDislike = (receptorId) => {
    console.log("Rechazaste al equipo:", receptorId);
    nextCard();
  };

  return (
    <div className="feed-page">
      <div className="cards-stack">
        <AnimatePresence>
          {currentIndex < equipos.length ? (
            <EquipoCard 
              key={equipos[currentIndex].id}
              equipo={equipos[currentIndex]} 
              onLike={handleLike} 
              onDislike={handleDislike}
            />
          ) : (
            <div className="no-more">
              <h3>⚽ ¡Eso es todo por ahora!</h3>
              <p>Esperá a que se sumen más equipos.</p>
              <button onClick={() => setCurrentIndex(0)}>Reiniciar</button>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Feed;