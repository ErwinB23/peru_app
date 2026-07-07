import api from './api';

export const getComidasByDepartamentoId = async (departamentoId) => {
    const response = await api.get(`/comidas-tipicas/departamento/${departamentoId}`);
    return response.data;
};

export const getComidaTipicaById = async (id) => {
    const response = await api.get(`/comidas-tipicas/${id}`);
    return response.data;
};

export const createComidaTipica = async (comidaData) => {
    const response = await api.post('/comidas-tipicas', comidaData);
    return response.data;
};

export const updateComidaTipica = async (id, comidaData) => {
    const response = await api.put(`/comidas-tipicas/${id}`, comidaData);
    return response.data;
};

export const deleteComidaTipica = async (id) => {
    const response = await api.delete(`/comidas-tipicas/${id}`);
    return response.data;
};