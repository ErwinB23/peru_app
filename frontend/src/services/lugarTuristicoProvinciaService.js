import api from './api';

export const getLugaresByProvinciaId = async (provinciaId) => {
    const response = await api.get(`/lugares-turisticos-provincias/provincia/${provinciaId}`);
    return response.data;
};

export const getLugarProvinciaById = async (id) => {
    const response = await api.get(`/lugares-turisticos-provincias/${id}`);
    return response.data;
};

export const createLugarProvincia = async (lugarData) => {
    const response = await api.post('/lugares-turisticos-provincias', lugarData);
    return response.data;
};

export const updateLugarProvincia = async (id, lugarData) => {
    const response = await api.put(`/lugares-turisticos-provincias/${id}`, lugarData);
    return response.data;
};

export const deleteLugarProvincia = async (id) => {
    const response = await api.delete(`/lugares-turisticos-provincias/${id}`);
    return response.data;
};