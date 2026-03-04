import React, { useState, useEffect, useRef } from 'react';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
// Asumimos que tienes una función para hacer fetch a tu API
import { fetchChatHistory } from './api'; 

const ChatWindow = ({ matchId, currentUser, otherTeamName }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const stompClient = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // 1. Cargar el historial desde SQL al abrir la ventana
    const loadHistory = async () => {
      try {
        const history = await fetchChatHistory(matchId); // Ej: GET /api/matches/{matchId}/messages
        setMessages(history);
      } catch (error) {
        console.error("Error cargando historial:", error);
      }
    };
    
    loadHistory().then(() => {
      // 2. Conectar al WebSocket SOLO después de cargar el historial
      const socket = new SockJS('http://localhost:8080/ws-tinball');
      stompClient.current = Stomp.over(socket);

      stompClient.current.connect({}, () => {
        stompClient.current.subscribe(`/topic/match/${matchId}`, (message) => {
          const receivedMessage = JSON.parse(message.body);
          setMessages((prev) => [...prev, receivedMessage]);
        });
      });
    });

    return () => {
      if (stompClient.current) stompClient.current.disconnect();
    };
  }, [matchId]);

  // Efecto para hacer auto-scroll hacia abajo cuando hay un nuevo mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && stompClient.current) {
      const chatMessage = {
        sender: currentUser,
        content: newMessage,
        matchId: matchId,
        timestamp: new Date().toISOString()
      };
      
      // 4. Enviar el mensaje al backend en Java
      stompClient.current.send(`/app/chat.send`, {}, JSON.stringify(chatMessage));
      setNewMessage('');
    }
  };

  // Función para consumir el nuevo endpoint de Java
const fetchChatHistory = async (matchId) => {
  try {
    const response = await fetch(`http://localhost:8080/api/chat/history/${matchId}`);
    
    if (!response.ok) {
      throw new Error('Error de red al intentar descargar el historial');
    }
    
    const data = await response.json();
    return data; // Retorna el array de mensajes desde tu SQL
  } catch (error) {
    console.error("Hubo un problema con la petición Fetch:", error);
    return []; // Retorna un array vacío si falla, para que no se rompa la app
  }
};

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h3>Chat con {otherTeamName}</h3>
      </div>
      
      <div className="chat-messages" style={{ height: '400px', overflowY: 'scroll' }}>
        {messages.map((msg, index) => (
          <div 
            key={index} 
            className={`message ${msg.sender === currentUser ? 'sent' : 'received'}`}
            style={{ textAlign: msg.sender === currentUser ? 'right' : 'left', margin: '10px' }}
          >
            <strong>{msg.sender}: </strong>
            <span>{msg.content}</span>
          </div>
        ))}
        {/* Este div invisible sirve para el auto-scroll */}
        <div ref={messagesEndRef} /> 
      </div>

      <form onSubmit={sendMessage} className="chat-input-area">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Escribe un mensaje..."
          style={{ width: '80%', padding: '10px' }}
        />
        <button type="submit" style={{ padding: '10px 20px' }}>Enviar</button>
      </form>
    </div>
  );
};

export default ChatWindow;