import React, { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const Registro = () => {
  const navigate = useNavigate();
  const [tipo, setTipo] = useState('jugador'); // 'jugador' o 'equipo'
  const [formData, setFormData] = useState({
    nombre: '', email: '', password: '', zona: '', 
    // Extras Jugador
    posicion: '', edad: '', nivel: 'Amateur',
    // Extras Equipo
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
      navigate('/login'); // Lo mandamos a loguearse
    } catch (err) {
      alert("Error al registrar. Revisá que el email no esté repetido.");
    }
  };

  return (
    <div className="login-container">
      <h2>Crear Cuenta</h2>
      
      <div className="tipo-selector" style={{display: 'flex', gap: '10px', marginBottom: '20px'}}>
        <button 
          type="button" 
          onClick={() => setTipo('jugador')}
          className={tipo === 'jugador' ? 'btn-save' : 'btn-outline'}
        >Soy Jugador</button>
        <button 
          type="button" 
          onClick={() => setTipo('equipo')}
          className={tipo === 'equipo' ? 'btn-save' : 'btn-outline'}
        >Soy Equipo</button>
      </div>

      <form onSubmit={handleRegistro} className="login-form">
        <input type="text" name="nombre" placeholder="Nombre" onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Contraseña" onChange={handleChange} required />
        <input type="text" name="zona" placeholder="Zona (Ej: Quilmes)" onChange={handleChange} required />

        {tipo === 'jugador' ? (
          <>
            <input type="text" name="posicion" placeholder="Posición (Ej: Delantero)" onChange={handleChange} />
            <input type="number" name="edad" placeholder="Edad" onChange={handleChange} />
          </>
        ) : (
          <>
            <textarea name="descripcion" placeholder="Descripción del equipo" onChange={handleChange} rows="3" />
          </>
        )}
        
        <button type="submit" className="btn-save" style={{marginTop: '10px'}}>Registrarme</button>
        <button type="button" className="btn-outline" onClick={() => navigate('/login')} style={{marginTop: '10px'}}>
          Ya tengo cuenta (Iniciar Sesión)
        </button>
      </form>
    </div>
  );
};

export default Registro;