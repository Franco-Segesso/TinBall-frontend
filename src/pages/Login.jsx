import React, { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
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
      
      // Guardamos los datos y el TIPO de cuenta para que la app sepa qué mostrar después
      localStorage.setItem('user', JSON.stringify(res.data));
      localStorage.setItem('userType', tipo);
      
      onLogin(); 
    } catch (err) {
      setError('Credenciales incorrectas');
    }
  };

  return (
    <div className="login-container">
      <h2>⚽ TinBall</h2>
      <p>Iniciá sesión para entrar a la cancha</p>
      
      <div className="tipo-selector" style={{display: 'flex', gap: '10px', marginBottom: '20px', marginTop: '10px'}}>
        <button 
          type="button" 
          onClick={() => setTipo('jugador')}
          className={tipo === 'jugador' ? 'btn-save' : 'btn-outline'}
        >Jugador</button>
        <button 
          type="button" 
          onClick={() => setTipo('equipo')}
          className={tipo === 'equipo' ? 'btn-save' : 'btn-outline'}
        >Equipo</button>
      </div>

      <form onSubmit={handleLogin} className="login-form">
        <input type="email" placeholder="Correo electrónico" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {error && <p className="error-msg" style={{color: 'red', margin: 0}}>{error}</p>}
        
        <button type="submit" className="btn-save">Ingresar</button>
        <button type="button" className="btn-outline" onClick={() => navigate('/registro')} style={{marginTop: '10px'}}>
          No tengo cuenta (Registrarme)
        </button>
      </form>
    </div>
  );
};

export default Login;