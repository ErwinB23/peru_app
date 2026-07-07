import api from './api';

export const getLugaresByDistritoId = async (distritoId) => {
    const response = await api.get(`/lugares-turisticos-distritos/distrito/${distritoId}`);
    return response.data;
};

export const createLugarDistrito = async (lugarData) => {
    const response = await api.post('/lugares-turisticos-distritos', lugarData);
    return response.data;
};

export const updateLugarDistrito = async (id, lugarData) => {
    const response = await api.put(`/lugares-turisticos-distritos/${id}`, lugarData);
    return response.data;
};

export const deleteLugarDistrito = async (id) => {
    const response = await api.delete(`/lugares-turisticos-distritos/${id}`);
    return response.data;
};