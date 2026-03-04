import React from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { MapPin, Trophy, Users, X, Heart } from 'lucide-react';

const EquipoCard = ({ equipo, onLike, onDislike }) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-150, 150], [-15, 15]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  // Si x > 100 (Derecha) es Like. Si x < -100 (Izquierda) es Rechazo.
  const handleDragEnd = (event, info) => {
    const offset = info.offset.x;
    if (offset > 100) {
      onLike(equipo.id);
    } else if (offset < -100) {
      onDislike(equipo.id);
    }
  };

  return (
    <motion.div
      className="tinder-card"
      style={{ x, rotate, opacity, position: 'absolute', cursor: 'grab' }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      whileTap={{ cursor: 'grabbing' }}
    >
      <div className="card-content">
        <img 
          src={equipo.fotoUrl || 'https://placehold.co/600x400/28a745/white?text=Sin+Foto'} 
          alt={equipo.nombre} 
          draggable="false"
          style={{ width: '100%', minHeight: '280px', objectFit: 'cover', backgroundColor: '#e9ecef' }}
          onError={(e) => {
            e.target.onerror = null; 
            // Si el usuario pone un link roto, mostramos un cartel rojo
            e.target.src = 'https://placehold.co/600x400/dc3545/white?text=Link+Roto';
          }}
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

        {/* SOLUCIÓN: onPointerDown evita que el clic arrastre la tarjeta por accidente */}
        <div className="card-buttons" onPointerDown={(e) => e.stopPropagation()}>
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