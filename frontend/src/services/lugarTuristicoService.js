
import api from "./api";

export const getLugaresByDepartamentoId = async (departamentoId) => {
    const response = await api.get(
        `/lugares-turisticos/departamento/${departamentoId}`,
    );
    return response.data;
};

export const getLugarTuristicoById = async (id) => {
    const response = await api.get(`/lugares-turisticos/${id}`);
    return response.data;
};

export const createLugarTuristico = async (lugarData) => {
    const response = await api.post("/lugares-turisticos", lugarData);
    return response.data;
};

export const updateLugarTuristico = async (id, lugarData) => {
    const response = await api.put(`/lugares-turisticos/${id}`, lugarData);
    return response.data;
};

export const deleteLugarTuristico = async (id) => {
    const response = await api.delete(`/lugares-turisticos/${id}`);
    return response.data;
};