import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { ArrowLeft, Users, Trophy, MapPin } from 'lucide-react';
import '../App.css';

const VerEquipo = () => {
  const { id } = useParams(); // Saca el ID de la URL
  const navigate = useNavigate();
  const [equipo, setEquipo] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    api.get(`/equipos/${id}`)
      .then(res => setEquipo(res.data))
      .catch(err => setError(true));
  }, [id]);

  if (error) return <div className="perfil-container"><h2>Equipo no encontrado</h2></div>;
  if (!equipo) return <div className="perfil-container"><h2>Cargando...</h2></div>;

  return (
    <div className="perfil-container">
      <button onClick={() => navigate(-1)} style={{alignSelf: 'flex-start', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', color: '#28a745', fontWeight: 'bold'}}>
        <ArrowLeft size={20} /> Volver
      </button>

      <img 
        src={equipo.fotoUrl || 'https://placehold.co/150x150/28a745/white?text=TinBall'} 
        alt={equipo.nombre} 
        style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover', border: '4px solid #eaeaea', backgroundColor: '#f0f2f5' }}
      />

      <h2 style={{margin: '10px 0 0 0'}}>{equipo.nombre}</h2>
      <p style={{color: '#666', marginTop: '5px'}}><MapPin size={16}/> {equipo.zona}</p>

      <div style={{display: 'flex', gap: '15px', marginTop: '10px', backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '10px', width: '100%', justifyContent: 'space-around', border: '1px solid #ddd'}}>
         <div style={{textAlign: 'center'}}><Trophy size={20} color="#28a745"/><p style={{margin: '5px 0 0 0', fontWeight: 'bold'}}>{equipo.nivelPromedio}</p></div>
         <div style={{textAlign: 'center'}}><Users size={20} color="#28a745"/><p style={{margin: '5px 0 0 0', fontWeight: 'bold'}}>{equipo.jugadores?.length || 0} Jugadores</p></div>
      </div>

      <p style={{marginTop: '15px', textAlign: 'center', color: '#444'}}>{equipo.descripcion}</p>

      {/* --- LISTA DE JUGADORES CLICKEABLES --- */}
      <div style={{width: '100%', marginTop: '20px', background: '#f8f9fa', padding: '15px', borderRadius: '8px', border: '1px solid #ddd'}}>
        <h3 style={{marginBottom: '10px', fontSize: '1.1rem'}}>Plantel</h3>
        <ul style={{listStyle: 'none', padding: 0, margin: 0}}>
          {equipo.jugadores && equipo.jugadores.length > 0 ? (
            equipo.jugadores.map(j => (
              <li key={j.id} 
                  onClick={() => navigate(`/jugador/${j.id}`)} 
                  style={{padding: '12px 0', borderBottom: '1px solid #ddd', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                  <img src={j.fotoPerfilUrl || 'https://placehold.co/40x40/28a745/white?text=Jug'} alt={j.nombre} style={{width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover'}} />
                  <span style={{fontWeight: 'bold', color: '#1a1a1a'}}>{j.nombre}</span>
                </div>
                <span style={{color: '#666', fontSize: '0.85rem', backgroundColor: '#e9ecef', padding: '4px 8px', borderRadius: '12px'}}>{j.posicion || 'Sin Posición'}</span>
              </li>
            ))
          ) : (
            <p style={{fontSize: '0.9rem', color: '#666'}}>Este equipo aún no tiene jugadores públicos.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default VerEquipo;