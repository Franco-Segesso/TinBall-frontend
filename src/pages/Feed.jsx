import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import EquipoCard from '../components/EquipoCard';
import { AnimatePresence } from 'framer-motion';

const Feed = () => {
  const [equipos, setEquipos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const miEquipoId = 1; 

  useEffect(() => {
    api.get('/equipos').then(res => {
      const otros = res.data.filter(e => e.id !== miEquipoId);
      setEquipos(otros);
    });
  }, []);

  const nextCard = () => setCurrentIndex(prev => prev + 1);

  return (
    <div className="feed-page">
      <div className="cards-stack">
        <AnimatePresence>
          {currentIndex < equipos.length ? (
            <EquipoCard 
              key={equipos[currentIndex].id}
              equipo={equipos[currentIndex]} 
              onLike={() => nextCard()} 
              onDislike={() => nextCard()}
            />
          ) : (
            <div className="no-more">
              <h3>⚽ ¡Eso es todo por ahora!</h3>
              <button onClick={() => setCurrentIndex(0)}>Reiniciar</button>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Feed;