import React, { useState, useEffect, useRef } from 'react';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const fetchChatHistory = async (salaId) => {
  try {
    const response = await fetch(`http://localhost:8080/api/chat/history/${salaId}`);
    if (!response.ok) {
      throw new Error('Error de red al intentar descargar el historial');
    }
    return await response.json();
  } catch (error) {
    console.error("Hubo un problema con la petición Fetch:", error);
    return [];
  }
};

const ChatWindow = ({ salaId, currentUser, otherTeamName }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const stompClient = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const loadHistory = async () => {
      const history = await fetchChatHistory(salaId);
      setMessages(history);
    };
    
    loadHistory().then(() => {
      const socket = new SockJS('http://localhost:8080/ws-tinball');
      stompClient.current = Stomp.over(socket);

      stompClient.current.connect({}, () => {
        stompClient.current.subscribe(`/topic/sala/${salaId}`, (message) => {
          const receivedMessage = JSON.parse(message.body);
          setMessages((prev) => [...prev, receivedMessage]);
        });
      });
    });

    return () => {
      if (stompClient.current) stompClient.current.disconnect();
    };
  }, [salaId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && stompClient.current) {
      const chatMessage = {
        sender: currentUser,
        content: newMessage,
        salaId: salaId,
        timestamp: new Date().toISOString()
      };
      
      stompClient.current.send(`/app/chat.send`, {}, JSON.stringify(chatMessage));
      setNewMessage('');
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
        <div ref={messagesEndRef} /> 
      </div>

      <form onSubmit={sendMessage} className="chat-input-area" style={{ display: 'flex', marginTop: '10px' }}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Escribe un mensaje..."
          style={{ flexGrow: 1, padding: '10px' }}
        />
        <button type="submit" style={{ padding: '10px 20px', marginLeft: '10px' }}>Enviar</button>
      </form>
    </div>
  );
};

export default ChatWindow;