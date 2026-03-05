import React, { useState, useEffect, useRef } from 'react';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Send } from 'lucide-react'; 

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';

const fetchChatHistory = async (salaId) => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/chat/history/${salaId}`);
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
      const socket = new SockJS(`${BACKEND_URL}/ws-tinball`);
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
        salaId: salaId
      };
      
      stompClient.current.send(`/app/chat.send`, {}, JSON.stringify(chatMessage));
      setNewMessage('');
    }
  };

  return (
    <>
      <div className="chat-header">
        {otherTeamName}
      </div>
      
      <div className="chat-messages">
        {messages.map((msg, index) => {
          const isMe = msg.sender === currentUser;
          return (
            <div 
              key={index} 
              className={`message-bubble ${isMe ? 'sent' : 'received'}`}
            >
              {!isMe && <span className="message-sender">{msg.sender}</span>}
              <span>{msg.content}</span>
            </div>
          );
        })}
        <div ref={messagesEndRef} /> 
      </div>

      <form onSubmit={sendMessage} className="chat-input-area">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Escribe un mensaje..."
        />
        <button type="submit">
          <Send size={18} />
        </button>
      </form>
    </>
  );
};

export default ChatWindow;