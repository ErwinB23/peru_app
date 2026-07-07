import api from './api';

export const getLugaresByCiudadId = async (ciudadId) => {
    const response = await api.get(`/lugares-turisticos-ciudades/ciudad/${ciudadId}`);
    return response.data;
};

export const createLugarCiudad = async (lugarData) => {
    const response = await api.post('/lugares-turisticos-ciudades', lugarData);
    return response.data;
};

export const updateLugarCiudad = async (id, lugarData) => {
    const response = await api.put(`/lugares-turisticos-ciudades/${id}`, lugarData);
    return response.data;
};

export const deleteLugarCiudad = async (id) => {
    const response = await api.delete(`/lugares-turisticos-ciudades/${id}`);
    return response.data;
};