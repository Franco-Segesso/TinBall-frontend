import React, { useState, useEffect } from 'react';
import ChatWindow from './ChatWindow';
import { MessageCircle } from 'lucide-react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';

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
        const response = await fetch(`${BACKEND_URL}/api/likes/mis-matches/${miId}`);
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
    <div className="chat-layout">
      <div className="contacts-sidebar">
        <h2>Contactos</h2>
        <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
          {matches.map((like) => {
            const rival = like.equipoReceptor;
            return (
              <li 
                key={like.id}
                onClick={() => setSelectedRival(rival)}
                className={`contact-item ${selectedRival?.id === rival.id ? 'active' : ''}`}
              >
                {rival.nombre}
              </li>
            );
          })}
        </ul>
      </div>

      <div className="chat-main">
        {selectedRival ? (
          <ChatWindow 
            salaId={`${Math.min(miId, selectedRival.id)}-${Math.max(miId, selectedRival.id)}`} 
            currentUser={miNombre} 
            otherTeamName={selectedRival.nombre} 
          />
        ) : (
          <div className="empty-chat-state">
            <MessageCircle size={48} color="#ccc" />
            <p>Selecciona un equipo para<br/>empezar a organizar.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchList;