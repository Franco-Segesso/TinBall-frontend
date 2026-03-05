import React, { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react'; // Importamos íconos para los inputs
import '../App.css';

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [tipo, setTipo] = useState('jugador');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const endpoint = tipo === 'jugador' ? '/auth/login/jugador' : '/auth/login/equipo';
      const res = await api.post(endpoint, { email, password });
      
      localStorage.setItem('user', JSON.stringify(res.data));
      localStorage.setItem('userType', tipo);
      
      onLogin(); 
    } catch (err) {
      setError('Credenciales incorrectas. Verificá tu correo y contraseña.');
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        
        <div className="auth-logo">
          <h2>TinBall ⚽</h2>
          <p>Entrá a la cancha y encontrá rivales</p>
        </div>

        {/* Toggle Jugador/Equipo */}
        <div className="role-selector">
          <button 
            type="button" 
            onClick={() => setTipo('jugador')}
            className={`role-btn ${tipo === 'jugador' ? 'active' : ''}`}
          >
            Jugador
          </button>
          <button 
            type="button" 
            onClick={() => setTipo('equipo')}
            className={`role-btn ${tipo === 'equipo' ? 'active' : ''}`}
          >
            Equipo
          </button>
        </div>

        {error && <div className="error-msg-auth">{error}</div>}

        <form onSubmit={handleLogin} className="auth-form">
          <div className="input-group">
            <Mail size={18} className="input-icon" />
            <input 
              type="email" 
              placeholder="Correo electrónico" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>

          <div className="input-group">
            <Lock size={18} className="input-icon" />
            <input 
              type="password" 
              placeholder="Contraseña" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          
          <button type="submit" className="auth-submit-btn">
            Iniciar Sesión
          </button>
        </form>

        <button 
          type="button" 
          className="auth-switch-link" 
          onClick={() => navigate('/registro')}
        >
          ¿No tenés cuenta? <span>Registrate acá</span>
        </button>

      </div>
    </div>
  );
};

export default Login;