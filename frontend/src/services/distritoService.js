import api from './api';

export const getDistritos = async (page = 1, limit = 100) => {
    const response = await api.get(`/distritos?page=${page}&limit=${limit}`);
    return response.data;
};

export const getDistritosByProvincia = async (provinciaId, page = 1, limit = 100) => {
    const response = await api.get(
        `/distritos?provincia_id=${provinciaId}&page=${page}&limit=${limit}`
    );
    return response.data;
};

export const getDistritoById = async (id) => {
    const response = await api.get(`/distritos/${id}`);
    return response.data;
};

export const createDistrito = async (distritoData) => {
    const response = await api.post('/distritos', distritoData);
    return response.data;
};

export const updateDistrito = async (id, distritoData) => {
    const response = await api.put(`/distritos/${id}`, distritoData);
    return response.data;
};

export const deleteDistrito = async (id) => {
    const response = await api.delete(`/distritos/${id}`);
    return response.data;
};