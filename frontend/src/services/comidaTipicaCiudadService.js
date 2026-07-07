import api from './api';

export const getComidasByCiudadId = async (ciudadId) => {
    const response = await api.get(`/comidas-tipicas-ciudades/ciudad/${ciudadId}`);
    return response.data;
};

export const createComidaCiudad = async (comidaData) => {
    const response = await api.post('/comidas-tipicas-ciudades', comidaData);
    return response.data;
};

export const updateComidaCiudad = async (id, comidaData) => {
    const response = await api.put(`/comidas-tipicas-ciudades/${id}`, comidaData);
    return response.data;
};

export const deleteComidaCiudad = async (id) => {
    const response = await api.delete(`/comidas-tipicas-ciudades/${id}`);
    return response.data;
};