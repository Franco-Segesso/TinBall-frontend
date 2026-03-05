import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import EquipoCard from '../components/EquipoCard';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, Map } from 'lucide-react'; 

const Feed = () => {
  const [equiposOriginales, setEquiposOriginales] = useState([]); 
  const [equipos, setEquipos] = useState([]); 
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filtroZona, setFiltroZona] = useState(''); 

  const userType = localStorage.getItem('userType');
  const userData = JSON.parse(localStorage.getItem('user'));
  const miId = userData ? userData.id : null;

  useEffect(() => {
    api.get('/equipos')
      .then(res => {
        let data = res.data;
        if (userType === 'equipo') {
          data = data.filter(e => e.id !== miId); 
        }
        setEquiposOriginales(data);
        setEquipos(data);
      })
      .catch(err => console.error("Error al cargar equipos:", err));
  }, [miId, userType]);

  useEffect(() => {
    if (filtroZona.trim() === '') {
      setEquipos(equiposOriginales);
    } else {
      const filtrados = equiposOriginales.filter(eq => 
        eq.zona && eq.zona.toLowerCase().includes(filtroZona.toLowerCase())
      );
      setEquipos(filtrados);
    }
    setCurrentIndex(0); 
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
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 125px)', width: '100%', backgroundColor: '#f8f9fa' }}>
      
      {/* --- BARRA DE BÚSQUEDA MODERNA --- */}
      <div className="feed-header">
        <div className="search-bar-modern">
          <Search size={20} color="#888" />
          <input 
            type="text" 
            placeholder="Buscar equipos en tu zona..." 
            value={filtroZona}
            onChange={(e) => setFiltroZona(e.target.value)}
          />
        </div>
      </div>

      {/* --- CONTENEDOR DE TARJETAS --- */}
      <div className="cards-container">
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
              <motion.div 
                className="no-more-cards"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              >
                <div style={{ padding: '20px', background: 'white', borderRadius: '50%', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                  <Map size={48} color="#ccc" />
                </div>
                <h3>¡Cancha vacía!</h3>
                {filtroZona !== '' ? (
                  <p>No encontramos más equipos en <b>"{filtroZona}"</b>.</p>
                ) : (
                  <p>Ya viste a todos los equipos disponibles.</p>
                )}
                <button 
                  onClick={() => { setFiltroZona(''); setCurrentIndex(0); }} 
                  className="btn-save" 
                  style={{marginTop: '20px', width: 'auto', padding: '10px 30px', borderRadius: '25px'}}
                >
                  Volver a buscar
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Feed;