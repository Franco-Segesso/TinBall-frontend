import axios from 'axios';

// Toma la URL de la nube, o usa localhost si estás programando local
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: `${BACKEND_URL}/api`,
});

export default api;