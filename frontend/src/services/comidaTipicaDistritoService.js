import api from './api';

export const getComidasByDistritoId = async (distritoId) => {
    const response = await api.get(`/comidas-tipicas-distritos/distrito/${distritoId}`);
    return response.data;
};

export const createComidaDistrito = async (comidaData) => {
    const response = await api.post('/comidas-tipicas-distritos', comidaData);
    return response.data;
};

export const updateComidaDistrito = async (id, comidaData) => {
    const response = await api.put(`/comidas-tipicas-distritos/${id}`, comidaData);
    return response.data;
};

export const deleteComidaDistrito = async (id) => {
    const response = await api.delete(`/comidas-tipicas-distritos/${id}`);
    return response.data;
};