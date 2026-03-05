import React, { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, MapPin, Hash, Trophy } from 'lucide-react'; 
import '../App.css';

const Registro = () => {
  const navigate = useNavigate();
  const [tipo, setTipo] = useState('jugador'); 
  const [formData, setFormData] = useState({
    nombre: '', email: '', password: '', zona: '', 
    posicion: '', edad: '', nivel: 'Amateur',
    nivelPromedio: 'Amateur', descripcion: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegistro = async (e) => {
    e.preventDefault();
    try {
      const endpoint = tipo === 'jugador' ? '/auth/registro/jugador' : '/auth/registro/equipo';
      await api.post(endpoint, formData);
      alert("¡Cuenta creada con éxito! Ahora podés iniciar sesión.");
      navigate('/login'); 
    } catch (err) {
      alert("Error al registrar. Revisá que el email no esté repetido o falten datos.");
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card" style={{ padding: '25px', maxWidth: '400px' }}>
        
        <div className="auth-logo" style={{ marginBottom: '15px' }}>
          <h2 style={{ fontSize: '1.8rem' }}>Crear Cuenta</h2>
          <p>Unite a la comunidad de TinBall</p>
        </div>

        <div className="role-selector" style={{ marginBottom: '15px' }}>
          <button 
            type="button" 
            onClick={() => setTipo('jugador')}
            className={`role-btn ${tipo === 'jugador' ? 'active' : ''}`}
          >
            Soy Jugador
          </button>
          <button 
            type="button" 
            onClick={() => setTipo('equipo')}
            className={`role-btn ${tipo === 'equipo' ? 'active' : ''}`}
          >
            Soy Equipo
          </button>
        </div>

        <form onSubmit={handleRegistro} className="auth-form" style={{ gap: '12px' }}>
          
          {/* Campos Comunes */}
          <div className="input-group">
            <User size={18} className="input-icon" />
            <input 
              type="text" 
              name="nombre" 
              /* CORRECCIÓN 1: El placeholder cambia mágicamente según lo que toques arriba */
              placeholder={tipo === 'jugador' ? 'Nombre completo' : 'Nombre del equipo'} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="input-group">
            <Mail size={18} className="input-icon" />
            <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
          </div>

          <div className="input-group">
            <Lock size={18} className="input-icon" />
            <input type="password" name="password" placeholder="Contraseña" onChange={handleChange} required />
          </div>

          <div className="input-group">
            <MapPin size={18} className="input-icon" />
            <input type="text" name="zona" placeholder="Zona (Ej: Quilmes)" onChange={handleChange} required />
          </div>

          {/* Campos Específicos */}
          {tipo === 'jugador' ? (
            <div style={{ display: 'flex', gap: '10px' }}>
              <div className="input-group" style={{ flex: 1 }}>
                <Trophy size={18} className="input-icon" />
                <input type="text" name="posicion" placeholder="Posición (Ej: Arquero)" onChange={handleChange} />
              </div>
              {/* CORRECCIÓN 2: Le dimos un poco más de aire (130px) para que entre perfecto la edad con el ícono */}
              <div className="input-group" style={{ width: '130px' }}>
                <Hash size={18} className="input-icon" />
                <input type="number" name="edad" placeholder="Edad" onChange={handleChange} />
              </div>
            </div>
          ) : (
            <div className="input-group">
              <textarea name="descripcion" placeholder="Descripción breve del equipo..." onChange={handleChange} rows="2" />
            </div>
          )}
          
          <button type="submit" className="auth-submit-btn" style={{ marginTop: '5px' }}>
            Registrarme
          </button>
        </form>

        <button 
          type="button" 
          className="auth-switch-link" 
          onClick={() => navigate('/login')}
        >
          ¿Ya tenés cuenta? <span>Iniciá Sesión</span>
        </button>

      </div>
    </div>
  );
};

export default Registro;