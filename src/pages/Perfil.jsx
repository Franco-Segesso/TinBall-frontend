import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const Perfil = () => {
  const [equipo, setEquipo] = useState({ nombre: '', zona: '', descripcion: '', fotoUrl: '' });
  const [archivo, setArchivo] = useState(null);
  
  // Obtenemos el ID real desde el Login
  const miEquipoId = localStorage.getItem('miEquipoId'); 

  useEffect(() => {
    if(miEquipoId) {
      api.get(`/equipos/${miEquipoId}`).then(res => setEquipo(res.data)).catch(err => console.log(err));
    }
  }, [miEquipoId]);

  const handleSave = async () => {
    try {
      if (archivo) {
        const formData = new FormData();
        formData.append('file', archivo);
        const resFoto = await api.post(`/equipos/${miEquipoId}/foto`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setEquipo(resFoto.data);
      }
      alert("¡Perfil actualizado con tu nueva foto!");
    } catch (err) {
      console.error(err);
      alert("Error al subir el archivo. Revisá la consola de Java.");
    }
  };

  const cerrarSesion = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="perfil-container">
      <h2>Configurar Equipo</h2>
      
      <div className="avatar-edit">
        <img src={equipo.fotoUrl || 'https://placehold.co/150x150/28a745/white?text=Sin+Foto'} alt="Escudo" />
        <input type="file" accept="image/*" onChange={(e) => setArchivo(e.target.files[0])} style={{ marginTop: '15px' }} />
      </div>

      <input type="text" value={equipo.nombre} onChange={e => setEquipo({...equipo, nombre: e.target.value})} placeholder="Nombre del equipo" />
      <textarea value={equipo.descripcion} onChange={e => setEquipo({...equipo, descripcion: e.target.value})} placeholder="Descripción" rows="4" />
      
      <button onClick={handleSave} className="btn-save">Guardar Cambios</button>
      <button onClick={cerrarSesion} style={{marginTop: '10px', background: '#dc3545', color: 'white', padding: '10px', borderRadius: '8px', border: 'none'}}>Cerrar Sesión</button>
    </div>
  );
};

export default Perfil;