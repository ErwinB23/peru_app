import api from './api';

export const getProvincias = async () => {
    const response = await api.get('/provincias');
    return response.data;
};

export const getProvinciasByDepartamento = async (departamentoId) => {
    const response = await api.get(`/provincias?departamento_id=${departamentoId}`);
    return response.data;
};

export const getProvinciaById = async (id) => {
    const response = await api.get(`/provincias/${id}`);
    return response.data;
};

export const createProvincia = async (provinciaData) => {
    const response = await api.post('/provincias', provinciaData);
    return response.data;
};

export const updateProvincia = async (id, provinciaData) => {
    const response = await api.put(`/provincias/${id}`, provinciaData);
    return response.data;
};

export const deleteProvincia = async (id) => {
    const response = await api.delete(`/provincias/${id}`);
    return response.data;
};