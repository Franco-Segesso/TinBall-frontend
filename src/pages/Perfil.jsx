import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const Perfil = () => {
  const [equipo, setEquipo] = useState({
    nombre: '',
    zona: '',
    descripcion: '',
    fotoUrl: '',
    nivelPromedio: 'Amateur'
  });

  useEffect(() => {
    // Cargamos los datos de nuestro equipo (suponiendo que somos ID 1)
    api.get('/equipos').then(res => {
      const miEquipo = res.data.find(e => e.id === 1);
      if (miEquipo) setEquipo(miEquipo);
    });
  }, []);

  const handleSave = async () => {
    try {
      await api.post('/equipos', equipo);
      alert("Perfil actualizado correctamente");
    } catch (err) {
      alert("Error al guardar");
    }
  };

  return (
    <div className="perfil-container">
      <h2>Mi Equipo</h2>
      <div className="avatar-edit">
        <img src={equipo.fotoUrl || 'https://via.placeholder.com/150'} alt="Escudo" />
        <input 
          type="text" 
          placeholder="URL de la imagen del equipo" 
          value={equipo.fotoUrl} 
          onChange={e => setEquipo({...equipo, fotoUrl: e.target.value})} 
        />
      </div>
      <input 
        type="text" 
        value={equipo.nombre} 
        onChange={e => setEquipo({...equipo, nombre: e.target.value})} 
        placeholder="Nombre del equipo"
      />
      <textarea 
        value={equipo.descripcion} 
        onChange={e => setEquipo({...equipo, descripcion: e.target.value})} 
        placeholder="Descripción"
      />
      <button onClick={handleSave} className="btn-save">Guardar Cambios</button>
    </div>
  );
};

export default Perfil;