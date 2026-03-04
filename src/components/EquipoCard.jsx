import React from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { MapPin, Trophy, Users, X, Heart, ArrowRight, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // <-- NUEVO IMPORT

const EquipoCard = ({ equipo, onLike, onDislike, userType }) => {
  const navigate = useNavigate(); // <-- INICIAMOS NAVEGACIÓN
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-150, 150], [-15, 15]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  const handleDragEnd = (event, info) => {
    const offset = info.offset.x;
    if (offset > 100) {
      userType === 'equipo' ? onLike(equipo.id) : onDislike(equipo.id);
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
          src={equipo.fotoUrl && equipo.fotoUrl !== "" ? equipo.fotoUrl : 'https://placehold.co/600x400/28a745/white?text=Sin+Foto'} 
          alt={equipo.nombre} 
          draggable="false"
          onError={(e) => {
            e.target.onerror = null; 
            e.target.src = 'https://placehold.co/600x400/28a745/white?text=Foto+No+Disponible';
          }}
        />
        
        <div className="card-info">
          {/* NUEVO: CABECERA CON BOTÓN DE INFO */}
          <div className="card-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
            <div>
              <h2 style={{margin: 0}}>{equipo.nombre}</h2>
              <span className="zona-badge" style={{display: 'inline-block', marginTop: '5px'}}>
                <MapPin size={14} /> {equipo.zona}
              </span>
            </div>
            <button 
              onPointerDown={(e) => e.stopPropagation()} 
              onClick={() => navigate(`/equipo/${equipo.id}`)}
              style={{background: 'none', border: 'none', color: '#28a745', cursor: 'pointer', padding: '5px'}}
            >
              <Info size={28} />
            </button>
          </div>
          
          <div className="card-stats" style={{marginTop: '10px'}}>
            <p><Trophy size={16} /> <span>Nivel: {equipo.nivelPromedio}</span></p>
            <p><Users size={16} /> <span>{equipo.jugadores?.length || 0} Integrantes</span></p>
          </div>
          
          <p className="card-description">{equipo.descripcion}</p>
        </div>

        <div className="card-buttons" onPointerDown={(e) => e.stopPropagation()}>
          {userType === 'equipo' ? (
            <>
              <button className="btn-dislike" onClick={() => onDislike(equipo.id)}>
                <X size={30} />
              </button>
              <button className="btn-like" onClick={() => onLike(equipo.id)}>
                <Heart size={30} fill="currentColor" />
              </button>
            </>
          ) : (
            <button 
              onClick={() => onDislike(equipo.id)} 
              style={{
                width: '90%', padding: '12px', borderRadius: '12px', border: 'none', 
                backgroundColor: '#f0f2f5', color: '#555', fontSize: '1.1rem', fontWeight: 'bold',
                display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', cursor: 'pointer'
              }}
            >
              Siguiente Equipo <ArrowRight size={20} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default EquipoCard;