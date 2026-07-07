import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// Registrar usuario
export const register = async (nombres, apellidos, fecha_nacimiento, email, password) => {
  const response = await axios.post(`${API_URL}/auth/register`, {
    nombres,
    apellidos,
    fecha_nacimiento,
    email,
    password
  });
  return response.data;
};

// Iniciar sesión
export const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/auth/login`, {
    email,
    password
  });
  return response.data;
};

// Obtener perfil
export const getProfile = async (token) => {
  const response = await axios.get(`${API_URL}/auth/profile`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

// Actualizar perfil
export const updateProfile = async (token, profileData) => {
  const response = await axios.put(`${API_URL}/auth/profile`, profileData, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

