import React, { useState, useEffect } from 'react';
import ChatWindow from './ChatWindow';

const MatchList = ({ currentUser }) => {
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);

  useEffect(() => {
    // Aquí harías un GET a tu backend Java para traer los equipos con los que hiciste match
    // fetch('/api/matches/my-matches') ...
    // Por ahora, usamos datos falsos de ejemplo:
    setMatches([
      { matchId: 1, teamName: 'Los Pibes FC' },
      { matchId: 2, teamName: 'Deportivo Quilmes' }
    ]);
  }, []);

  return (
    <div style={{ display: 'flex' }}>
      {/* Lista lateral de contactos */}
      <div style={{ width: '30%', borderRight: '1px solid #ccc', padding: '10px' }}>
        <h2>Tus Matches</h2>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {matches.map((match) => (
            <li 
              key={match.matchId}
              onClick={() => setSelectedMatch(match)}
              style={{ 
                padding: '15px', 
                borderBottom: '1px solid #eee', 
                cursor: 'pointer',
                backgroundColor: selectedMatch?.matchId === match.matchId ? '#f0f0f0' : 'transparent'
              }}
            >
              {match.teamName}
            </li>
          ))}
        </ul>
      </div>

      {/* Ventana de chat dinámica */}
      <div style={{ width: '70%', padding: '10px' }}>
        {selectedMatch ? (
          <ChatWindow 
            matchId={selectedMatch.matchId} 
            currentUser={currentUser} 
            otherTeamName={selectedMatch.teamName} 
          />
        ) : (
          <div style={{ textAlign: 'center', marginTop: '50px', color: '#888' }}>
            Selecciona un equipo para empezar a organizar el partido.
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchList;