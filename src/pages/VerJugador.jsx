import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { ArrowLeft, MapPin } from 'lucide-react';
import '../App.css';

const VerJugador = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [jugador, setJugador] = useState(null);
  const [equipos, setEquipos] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    api.get(`/usuarios/${id}`)
      .then(res => setJugador(res.data))
      .catch(err => setError(true));

    api.get(`/usuarios/${id}/equipos`)
      .then(res => setEquipos(res.data))
      .catch(err => console.log(err));
  }, [id]);

  if (error) return <div className="perfil-container"><h2>Jugador no encontrado</h2></div>;
  if (!jugador) return <div className="perfil-container"><h2>Cargando...</h2></div>;

  return (
    <div className="perfil-container">
      <button onClick={() => navigate(-1)} style={{alignSelf: 'flex-start', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', color: '#28a745', fontWeight: 'bold'}}>
        <ArrowLeft size={20} /> Volver
      </button>

      <img 
        src={jugador.fotoPerfilUrl || 'https://placehold.co/150x150/28a745/white?text=Jugador'} 
        alt={jugador.nombre} 
        style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover', border: '4px solid #eaeaea', backgroundColor: '#f0f2f5' }}
      />

      <h2 style={{margin: '10px 0 0 0'}}>{jugador.nombre}</h2>
      <p style={{color: '#666', marginTop: '5px'}}><MapPin size={16}/> {jugador.zona}</p>

      <div style={{display: 'flex', gap: '10px', marginTop: '10px', width: '100%', flexWrap: 'wrap', justifyContent: 'center'}}>
         <span style={{backgroundColor: '#e9ecef', padding: '6px 12px', borderRadius: '15px', fontSize: '0.9rem'}}><strong>Posición:</strong> {jugador.posicion || 'N/A'}</span>
         <span style={{backgroundColor: '#e9ecef', padding: '6px 12px', borderRadius: '15px', fontSize: '0.9rem'}}><strong>Edad:</strong> {jugador.edad || 'N/A'}</span>
         <span style={{backgroundColor: '#e9ecef', padding: '6px 12px', borderRadius: '15px', fontSize: '0.9rem'}}><strong>Nivel:</strong> {jugador.nivel || 'N/A'}</span>
      </div>

      {/* --- LISTA DE EQUIPOS CLICKEABLES --- */}
      <div style={{width: '100%', marginTop: '20px', background: '#f8f9fa', padding: '15px', borderRadius: '8px', border: '1px solid #ddd'}}>
        <h3 style={{marginBottom: '10px', fontSize: '1.1rem'}}>Equipos donde juega</h3>
        <ul style={{listStyle: 'none', padding: 0, margin: 0}}>
          {equipos && equipos.length > 0 ? (
            equipos.map(eq => (
              <li key={eq.id} 
                  onClick={() => navigate(`/equipo/${eq.id}`)}
                  style={{padding: '10px 0', borderBottom: '1px solid #ddd', display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer'}}>
                <img 
                  src={eq.fotoUrl || 'https://placehold.co/40x40/28a745/white?text=Eq'} 
                  alt={eq.nombre} 
                  style={{width: '45px', height: '45px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #eaeaea'}}
                />
                <div style={{display: 'flex', flexDirection: 'column'}}>
                  <span style={{fontWeight: 'bold', color: '#1a1a1a'}}>{eq.nombre}</span>
                  <span style={{color: '#666', fontSize: '0.85rem'}}>{eq.zona}</span>
                </div>
              </li>
            ))
          ) : (
            <p style={{fontSize: '0.9rem', color: '#666'}}>Aún no está en ningún equipo.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default VerJugador;