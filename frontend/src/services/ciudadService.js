import api from './api';

export const getCiudades = async (page = 1, limit = 100) => {
    const response = await api.get(`/ciudades?page=${page}&limit=${limit}`);
    return response.data;
};

export const getCiudadesByDepartamento = async (departamentoId, page = 1, limit = 100) => {
    const response = await api.get(
        `/ciudades?departamento_id=${departamentoId}&page=${page}&limit=${limit}`
    );
    return response.data;
};

export const getCiudadesByProvincia = async (provinciaId, page = 1, limit = 100) => {
    const response = await api.get(
        `/ciudades?provincia_id=${provinciaId}&page=${page}&limit=${limit}`
    );
    return response.data;
};

export const getCiudadesByDistrito = async (distritoId, page = 1, limit = 100) => {
    const response = await api.get(
        `/ciudades?distrito_id=${distritoId}&page=${page}&limit=${limit}`
    );
    return response.data;
};

export const getCiudadById = async (id) => {
    const response = await api.get(`/ciudades/${id}`);
    return response.data;
};

export const createCiudad = async (ciudadData) => {
    const response = await api.post('/ciudades', ciudadData);
    return response.data;
};

export const updateCiudad = async (id, ciudadData) => {
    const response = await api.put(`/ciudades/${id}`, ciudadData);
    return response.data;
};

export const deleteCiudad = async (id) => {
    const response = await api.delete(`/ciudades/${id}`);
    return response.data;
};