import api from "./api";

// Listar departamentos
export const getDepartamentos = async () => {
    const response = await api.get("/departamentos");
    return response.data;
};

// Obtener departamento por ID
export const getDepartamentoById = async (id) => {
    const response = await api.get(`/departamentos/${id}`);
    return response.data;
};

// Crear departamento
export const createDepartamento = async (departamentoData) => {
    const response = await api.post("/departamentos", departamentoData);
    return response.data;
};

// Actualizar departamento
export const updateDepartamento = async (id, departamentoData) => {
    const response = await api.put(`/departamentos/${id}`, departamentoData);
    return response.data;
};

// Eliminar departamento
export const deleteDepartamento = async (id) => {
    const response = await api.delete(`/departamentos/${id}`);
    return response.data;
};
