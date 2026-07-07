import api from "./api";

// Listar todos los usuarios
export const getUsers = async () => {
    const response = await api.get("/users");
    return response.data;
};

// Buscar usuarios
export const searchUsers = async (query) => {
    const response = await api.get(
        `/users/search?q=${encodeURIComponent(query)}`,
    );
    return response.data;
};

// Obtener usuario por ID
export const getUserById = async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
};

// Actualizar usuario como administrador
export const updateUserByAdmin = async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
};

// Eliminar usuario como administrador
export const deleteUserByAdmin = async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
};
