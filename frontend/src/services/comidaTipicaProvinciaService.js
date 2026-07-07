import api from './api';

export const getComidasByProvinciaId = async (provinciaId) => {
    const response = await api.get(`/comidas-tipicas-provincias/provincia/${provinciaId}`);
    return response.data;
};

export const getComidaProvinciaById = async (id) => {
    const response = await api.get(`/comidas-tipicas-provincias/${id}`);
    return response.data;
};

export const createComidaProvincia = async (comidaData) => {
    const response = await api.post('/comidas-tipicas-provincias', comidaData);
    return response.data;
};

export const updateComidaProvincia = async (id, comidaData) => {
    const response = await api.put(`/comidas-tipicas-provincias/${id}`, comidaData);
    return response.data;
};

export const deleteComidaProvincia = async (id) => {
    const response = await api.delete(`/comidas-tipicas-provincias/${id}`);
    return response.data;
};