import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import '../App.css';

const Perfil = () => {
  const [perfil, setPerfil] = useState({
    nombre: '', zona: '', descripcion: '', fotoUrl: '', 
    posicion: '', edad: '', nivel: '', nivelPromedio: '',
    jugadores: [] 
  });
  const [archivo, setArchivo] = useState(null);
  const [emailJugador, setEmailJugador] = useState('');
  
  // NUEVO: Estado para guardar los equipos del jugador
  const [misEquipos, setMisEquipos] = useState([]);

  const userType = localStorage.getItem('userType'); 
  const userData = JSON.parse(localStorage.getItem('user'));
  const perfilId = userData ? userData.id : null;

  useEffect(() => {
    if (userData) {
      setPerfil({
        ...userData,
        fotoUrl: userType === 'jugador' ? userData.fotoPerfilUrl : userData.fotoUrl
      });

      const endpoint = userType === 'jugador' ? `/usuarios/${perfilId}` : `/equipos/${perfilId}`;
      api.get(endpoint)
        .then(res => {
          const data = res.data;
          setPerfil({
            ...data,
            fotoUrl: userType === 'jugador' ? data.fotoPerfilUrl : data.fotoUrl
          });
          localStorage.setItem('user', JSON.stringify(data));
        })
        .catch(err => console.log("Error al obtener datos recientes:", err));

      // NUEVO: Si somos un jugador, pedimos a Java la lista de nuestros equipos
      if (userType === 'jugador') {
        api.get(`/usuarios/${perfilId}/equipos`)
          .then(res => setMisEquipos(res.data))
          .catch(err => console.log("Error al cargar mis equipos:", err));
      }
    }
  }, [perfilId, userType]);

  const handleSave = async () => {
    try {
      const endpointDatos = userType === 'jugador' ? `/usuarios/${perfilId}` : `/equipos/${perfilId}`;
      const resDatos = await api.put(endpointDatos, perfil);
      let datosActualizados = resDatos.data;

      if (archivo) {
        const formData = new FormData();
        formData.append('file', archivo);
        
        const endpointFoto = userType === 'jugador' ? `/usuarios/${perfilId}/foto` : `/equipos/${perfilId}/foto`;
        const resFoto = await api.post(endpointFoto, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        datosActualizados = resFoto.data;
      }

      setPerfil({
        ...datosActualizados,
        fotoUrl: userType === 'jugador' ? datosActualizados.fotoPerfilUrl : datosActualizados.fotoUrl
      });
      localStorage.setItem('user', JSON.stringify(datosActualizados));
      alert("¡Perfil actualizado correctamente!");
      
    } catch (err) {
      console.error(err);
      alert("Error al guardar los cambios.");
    }
  };

  const handleAgregarJugador = async () => {
    if (!emailJugador) return;
    try {
      const res = await api.post(`/equipos/${perfilId}/jugadores`, { email: emailJugador });
      const datosActualizados = res.data;
      
      setPerfil({
        ...datosActualizados,
        fotoUrl: datosActualizados.fotoUrl
      });
      localStorage.setItem('user', JSON.stringify(datosActualizados));
      setEmailJugador('');
      alert("¡Jugador agregado al plantel exitosamente!");
      
    } catch (err) {
      alert(err.response?.data || "Error al agregar jugador.");
    }
  };

  const cerrarSesion = () => {
    localStorage.clear();
    window.location.reload();
  };

  if (!userData) {
    return <div className="perfil-container"><h2>Cargando perfil...</h2></div>;
  }

  return (
    <div className="perfil-container">
      <h2>Mi Perfil ({userType === 'jugador' ? 'Jugador' : 'Equipo'})</h2>
      
      <div className="avatar-edit">
        <img 
          src={perfil.fotoUrl || 'https://placehold.co/150x150/28a745/white?text=Sin+Foto'} 
          alt="Perfil" 
        />
        <input 
          type="file" 
          accept="image/*" 
          onChange={(e) => setArchivo(e.target.files[0])} 
          style={{ marginTop: '15px' }} 
        />
      </div>

      <input 
        type="text" 
        value={perfil.nombre || ''} 
        onChange={e => setPerfil({...perfil, nombre: e.target.value})} 
        placeholder="Nombre" 
      />
      <input 
        type="text" 
        value={perfil.zona || ''} 
        onChange={e => setPerfil({...perfil, zona: e.target.value})} 
        placeholder="Zona" 
      />

      {userType === 'jugador' ? (
        <>
          <input 
            type="text" 
            value={perfil.posicion || ''} 
            onChange={e => setPerfil({...perfil, posicion: e.target.value})} 
            placeholder="Posición (Ej: Delantero)" 
          />
          <input 
            type="number" 
            value={perfil.edad || ''} 
            onChange={e => setPerfil({...perfil, edad: e.target.value})} 
            placeholder="Edad" 
          />
          <input 
            type="text" 
            value={perfil.nivel || ''} 
            onChange={e => setPerfil({...perfil, nivel: e.target.value})} 
            placeholder="Nivel (Ej: Amateur)" 
          />

          {/* --- NUEVO: MIS EQUIPOS (Solo Jugador) --- */}
          <div style={{width: '100%', marginTop: '15px', background: '#f8f9fa', padding: '15px', borderRadius: '8px', border: '1px solid #ddd'}}>
            <h3 style={{marginBottom: '10px', fontSize: '1.1rem'}}>Mis Equipos</h3>
            
            <ul style={{listStyle: 'none', padding: 0, margin: 0}}>
              {misEquipos && misEquipos.length > 0 ? (
                misEquipos.map(eq => (
                  <li key={eq.id} style={{padding: '10px 0', borderBottom: '1px solid #ddd', display: 'flex', alignItems: 'center', gap: '15px'}}>
                    <img 
                      src={eq.fotoUrl || 'https://placehold.co/40x40/28a745/white?text=Eq'} 
                      alt={eq.nombre} 
                      style={{width: '45px', height: '45px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #eaeaea'}}
                    />
                    <div style={{display: 'flex', flexDirection: 'column'}}>
                      <span style={{fontWeight: 'bold', color: '#1a1a1a'}}>{eq.nombre}</span>
                      <span style={{color: '#666', fontSize: '0.85rem'}}>{eq.zona}</span>
                    </div>
                  </li>
                ))
              ) : (
                <p style={{fontSize: '0.9rem', color: '#666'}}>Aún no estás en ningún equipo.</p>
              )}
            </ul>
          </div>
        </>
      ) : (
        <>
          <input 
            type="text" 
            value={perfil.nivelPromedio || ''} 
            onChange={e => setPerfil({...perfil, nivelPromedio: e.target.value})} 
            placeholder="Nivel Promedio" 
          />
          <textarea 
            value={perfil.descripcion || ''} 
            onChange={e => setPerfil({...perfil, descripcion: e.target.value})} 
            placeholder="Descripción del equipo" 
            rows="4" 
          />

          {/* --- PLANTEL (Solo Equipo) --- */}
          <div style={{width: '100%', marginTop: '15px', background: '#f8f9fa', padding: '15px', borderRadius: '8px', border: '1px solid #ddd'}}>
            <h3 style={{marginBottom: '10px', fontSize: '1.1rem'}}>Plantel del Equipo</h3>
            
            <div style={{display: 'flex', gap: '10px', marginBottom: '15px'}}>
              <input 
                type="email" 
                placeholder="Ingresá el email del jugador..." 
                value={emailJugador} 
                onChange={e => setEmailJugador(e.target.value)} 
                style={{marginBottom: 0}}
              />
              <button onClick={handleAgregarJugador} className="btn-save" style={{width: 'auto', padding: '0 20px'}}>+</button>
            </div>

            <ul style={{listStyle: 'none', padding: 0, margin: 0}}>
              {perfil.jugadores && perfil.jugadores.length > 0 ? (
                perfil.jugadores.map(j => (
                  <li key={j.id} style={{padding: '8px 0', borderBottom: '1px solid #ddd', fontSize: '0.9rem', display: 'flex', justifyContent: 'space-between'}}>
                    <span><strong>{j.nombre}</strong></span>
                    <span style={{color: '#666'}}>{j.posicion || 'Sin Posición'}</span>
                  </li>
                ))
              ) : (
                <p style={{fontSize: '0.9rem', color: '#666'}}>Aún no hay jugadores registrados.</p>
              )}
            </ul>
          </div>
        </>
      )}
      
      <button onClick={handleSave} className="btn-save" style={{marginTop: '15px'}}>Guardar Cambios</button>
      
      <button 
        onClick={cerrarSesion} 
        style={{marginTop: '10px', background: '#dc3545', color: 'white', padding: '10px', borderRadius: '8px', border: 'none', cursor: 'pointer', width: '100%'}}
      >
        Cerrar Sesión
      </button>
    </div>
  );
};

export default Perfil;