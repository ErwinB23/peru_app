import api from './api.js';

const buildAuthConfig = (token) => {
  if (!token) return undefined;

  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

export const register = async (
  nombres,
  apellidos,
  fecha_nacimiento,
  email,
  password
) => {
  const response = await api.post('/auth/register', {
    nombres,
    apellidos,
    fecha_nacimiento,
    email,
    password
  });

  return response.data;
};

export const login = async (email, password) => {
  const response = await api.post('/auth/login', {
    email,
    password
  });

  return response.data;
};

export const getProfile = async (token) => {
  const response = await api.get('/auth/profile', buildAuthConfig(token));
  return response.data;
};

export const updateProfile = async (token, profileData) => {
  const response = await api.put(
    '/auth/profile',
    profileData,
    buildAuthConfig(token)
  );

  return response.data;
};
