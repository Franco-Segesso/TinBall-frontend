import React, { useState, useEffect } from 'react';
import ChatWindow from './ChatWindow';

const MatchList = () => {
  const [matches, setMatches] = useState([]);
  const [selectedRival, setSelectedRival] = useState(null);

  const userData = JSON.parse(localStorage.getItem('user'));
  const miId = userData ? userData.id : null;
  const miNombre = userData ? userData.nombre : 'Mi Equipo';

  useEffect(() => {
    if (!miId) return;

    const fetchMyMatches = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/likes/mis-matches/${miId}`);
        if (response.ok) {
          const data = await response.json();
          setMatches(data);
        }
      } catch (error) {
        console.error("Error al cargar los matches:", error);
      }
    };

    fetchMyMatches();
  }, [miId]);

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ width: '30%', borderRight: '1px solid #ccc', padding: '10px' }}>
        <h2>Tus Contactos</h2>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {matches.map((like) => {
            const rival = like.equipoReceptor;
            
            return (
              <li 
                key={like.id}
                onClick={() => setSelectedRival(rival)}
                style={{ 
                  padding: '15px', 
                  borderBottom: '1px solid #eee', 
                  cursor: 'pointer',
                  backgroundColor: selectedRival?.id === rival.id ? '#f0f0f0' : 'transparent'
                }}
              >
                {rival.nombre}
              </li>
            );
          })}
        </ul>
      </div>

      <div style={{ width: '70%', padding: '10px' }}>
        {selectedRival ? (
          <ChatWindow 
            salaId={`${Math.min(miId, selectedRival.id)}-${Math.max(miId, selectedRival.id)}`} 
            currentUser={miNombre} 
            otherTeamName={selectedRival.nombre} 
          />
        ) : (
          <div style={{ textAlign: 'center', marginTop: '50px', color: '#888' }}>
            Selecciona un equipo para organizar el partido.
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchList;