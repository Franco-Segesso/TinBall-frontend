import React from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { MapPin, Trophy, Users, X, Heart } from 'lucide-react';

const EquipoCard = ({ equipo, onLike, onDislike }) => {
  // Configuración del movimiento de la tarjeta
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-100, 100], [-10, 10]);
  const opacity = useTransform(x, [-150, -100, 0, 100, 150], [0, 1, 1, 1, 0]);

  // Detectar cuándo termina el arrastre para disparar la acción
  const handleDragEnd = (event, info) => {
    if (info.offset.x > 100) {
      onLike(equipo.id);
    } else if (info.offset.x < -100) {
      onDislike(equipo.id);
    }
  };

  return (
    <motion.div
      className="tinder-card"
      style={{ 
        x, 
        rotate, 
        opacity, 
        position: 'absolute', 
        cursor: 'grab' 
      }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      whileTap={{ cursor: 'grabbing' }}
    >
      <div className="card-content">
        {/* Imagen principal del equipo */}
        <img 
          src={equipo.fotoUrl || 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=500'} 
          alt={equipo.nombre} 
          draggable="false"
        />
        
        <div className="card-info">
          <div className="card-header">
            <h2>{equipo.nombre}</h2>
            <span className="zona-badge">
              <MapPin size={14} /> {equipo.zona}
            </span>
          </div>
          
          <div className="card-stats">
            <p><Trophy size={16} /> <span>Nivel: {equipo.nivelPromedio}</span></p>
            <p><Users size={16} /> <span>{equipo.jugadores?.length || 0} Integrantes</span></p>
          </div>
          
          <p className="card-description">{equipo.descripcion}</p>
        </div>

        {/* Botones inferiores para acción manual */}
        <div className="card-buttons">
          <button className="btn-dislike" onClick={() => onDislike(equipo.id)}>
            <X size={30} />
          </button>
          <button className="btn-like" onClick={() => onLike(equipo.id)}>
            <Heart size={30} fill="currentColor" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default EquipoCard;