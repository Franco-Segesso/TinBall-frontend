import React, { useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { MapPin, Trophy, X, Heart } from 'lucide-react'; 
import { useNavigate } from 'react-router-dom';

const EquipoCard = ({ equipo, onLike, onDislike, userType }) => {
  const navigate = useNavigate();
  const [exitX, setExitX] = useState(0);

  // --- LÓGICA AVANZADA DE ANIMACIÓN ---
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacityLike = useTransform(x, [0, 100], [0, 1]);
  const opacityDislike = useTransform(x, [0, -100], [0, 1]);

  const isJugador = userType === 'jugador';

  const handleDragEnd = (event, info) => {
    const swipeThreshold = 100; 

    // AHORA TODOS PUEDEN ARRASTRAR PARA PASAR DE TARJETA
    if (info.offset.x > swipeThreshold) {
      setExitX(500); 
      onLike(equipo.id);
    } else if (info.offset.x < -swipeThreshold) {
      setExitX(-500); 
      onDislike(equipo.id);
    }
  };

  const handleButtonLike = () => {
    setExitX(500);
    onLike(equipo.id);
  };

  const handleButtonDislike = () => {
    setExitX(-500);
    onDislike(equipo.id);
  };

  return (
    <motion.div 
      className="tinder-card"
      drag="x" // <-- ACÁ ESTABA EL ERROR, AHORA TODOS PUEDEN DESLIZAR
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragEnd={handleDragEnd}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1, x: 0, rotate: 0 }}
      exit={{ x: exitX, opacity: 0, transition: { duration: 0.3 } }}
      style={{ x, rotate, touchAction: 'none' }} 
    >
      
      {/* --- EFECTOS VISUALES AL ARRASTRAR (SELLOS) --- */}
      {/* Los sellos solo aparecen si sos un equipo buscando hacer match */}
      {!isJugador && (
        <>
          <motion.div
            style={{
              opacity: opacityLike,
              position: 'absolute',
              top: 40,
              left: 30,
              zIndex: 10,
              border: '4px solid #28a745',
              color: '#28a745',
              fontSize: '2rem',
              fontWeight: '900',
              padding: '5px 15px',
              borderRadius: '10px',
              transform: 'rotate(-15deg)',
              pointerEvents: 'none',
              letterSpacing: '2px',
              backgroundColor: 'rgba(255,255,255,0.8)'
            }}
          >
            LIKE
          </motion.div>

          <motion.div
            style={{
              opacity: opacityDislike,
              position: 'absolute',
              top: 40,
              right: 30,
              zIndex: 10,
              border: '4px solid #fd5c63',
              color: '#fd5c63',
              fontSize: '2rem',
              fontWeight: '900',
              padding: '5px 15px',
              borderRadius: '10px',
              transform: 'rotate(15deg)',
              pointerEvents: 'none',
              letterSpacing: '2px',
              backgroundColor: 'rgba(255,255,255,0.8)'
            }}
          >
            NOPE
          </motion.div>
        </>
      )}

      {/* --- CONTENIDO DE LA TARJETA --- */}
      <img 
        src={equipo.fotoUrl || "https://images.unsplash.com/photo-1518605368461-1e1e38ce8ba6?auto=format&fit=crop&q=80"} 
        alt={equipo.nombre} 
        className="card-image-bg"
        style={{ pointerEvents: 'none' }} 
      />

      <div className="card-gradient-overlay"></div>

      <div className="card-info-overlay">
        <h2 
          onClick={() => navigate(`/equipo/${equipo.id}`)}
          style={{ cursor: 'pointer', display: 'inline-block' }}
          title="Ver perfil del equipo"
        >
          {equipo.nombre}
        </h2>
        
        {equipo.zona && (
          <p><MapPin size={18} /> {equipo.zona}</p>
        )}
        
        {equipo.nivelPromedio && (
          <p><Trophy size={18} /> Nivel: {equipo.nivelPromedio}</p>
        )}
        
        {equipo.descripcion && (
          <p style={{ marginTop: '8px', fontSize: '0.95rem', fontStyle: 'italic', opacity: 0.85, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            "{equipo.descripcion}"
          </p>
        )}
      </div>

      {/* --- BOTONES DE ACCIÓN --- */}
      <div className="card-action-buttons">
        <button 
          className="action-btn dislike" 
          onClick={handleButtonDislike}
        >
          <X size={34} strokeWidth={3} />
        </button>

        {/* El corazón de LIKE solo aparece si sos un equipo */}
        {!isJugador && (
          <button 
            className="action-btn like" 
            onClick={handleButtonLike}
          >
            <Heart size={36} fill="currentColor" strokeWidth={1} />
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default EquipoCard;