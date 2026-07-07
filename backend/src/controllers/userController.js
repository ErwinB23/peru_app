import {
    getAllUsers,
    findUserById,
    findUserByEmail,
    searchUsers,
    updateUserByAdmin,
    deleteUser,
    countAdmins,
} from "../models/userModel.js";

// LISTAR USUARIOS
export const getUsers = async (req, res) => {
    try {
        const users = await getAllUsers();
        res.json(users);
    } catch (error) {
        console.error("Error en getUsers:", error);
        res.status(500).json({ error: "Error al listar usuarios" });
    }
};

// BUSCAR USUARIOS
export const searchUsersController = async (req, res) => {
    try {
        const { q } = req.query;

        if (!q || q.trim() === "") {
            return res
                .status(400)
                .json({ error: "Debe ingresar un texto de búsqueda" });
        }

        const users = await searchUsers(q.trim());
        res.json(users);
    } catch (error) {
        console.error("Error en searchUsersController:", error);
        res.status(500).json({ error: "Error al buscar usuarios" });
    }
};

// OBTENER USUARIO POR ID
export const getUserById = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({ error: "ID de usuario inválido" });
        }

        const user = await findUserById(id);

        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        res.json(user);
    } catch (error) {
        console.error("Error en getUserById:", error);
        res.status(500).json({ error: "Error al obtener usuario" });
    }
};

// ACTUALIZAR USUARIO COMO ADMIN
export const updateUserAdmin = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { nombres, apellidos, fecha_nacimiento, email, rol } = req.body;

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({ error: "ID de usuario inválido" });
        }

        if (!nombres || !apellidos || !fecha_nacimiento || !email || !rol) {
            return res
                .status(400)
                .json({ error: "Todos los campos son obligatorios" });
        }

        if (!["usuario", "admin"].includes(rol)) {
            return res
                .status(400)
                .json({ error: "Rol inválido. Use usuario o admin" });
        }

        const user = await findUserById(id);

        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        const emailNormalizado = email.trim().toLowerCase();

        const existingUser = await findUserByEmail(emailNormalizado);

        if (existingUser && existingUser.id !== id) {
            return res
                .status(400)
                .json({ error: "El email ya está en uso por otro usuario" });
        }

        // Evitar que el admin actual se quite su propio rol de admin
        if (id === req.user.id && rol !== "admin") {
            return res.status(400).json({
                error: "No puedes quitarte tu propio rol de administrador",
            });
        }

        // Evitar dejar el sistema sin administradores
        if (user.rol === "admin" && rol !== "admin") {
            const totalAdmins = await countAdmins();

            if (totalAdmins <= 1) {
                return res.status(400).json({
                    error: "No se puede cambiar el rol del último administrador",
                });
            }
        }

        const updatedUser = await updateUserByAdmin(id, {
            nombres: nombres.trim(),
            apellidos: apellidos.trim(),
            fecha_nacimiento,
            email: emailNormalizado,
            rol,
        });

        res.json({
            message: "Usuario actualizado exitosamente",
            user: updatedUser,
        });
    } catch (error) {
        console.error("Error en updateUserAdmin:", error);
        res.status(500).json({ error: "Error al actualizar usuario" });
    }
};

// ELIMINAR USUARIO COMO ADMIN
export const deleteUserAdmin = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({ error: "ID de usuario inválido" });
        }

        if (id === req.user.id) {
            return res.status(400).json({
                error: "No puedes eliminar tu propio usuario administrador",
            });
        }

        const user = await findUserById(id);

        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        if (user.rol === "admin") {
            const totalAdmins = await countAdmins();

            if (totalAdmins <= 1) {
                return res.status(400).json({
                    error: "No se puede eliminar el último administrador",
                });
            }
        }

        const deletedUser = await deleteUser(id);

        res.json({
            message: "Usuario eliminado exitosamente",
            user: deletedUser,
        });
    } catch (error) {
        console.error("Error en deleteUserAdmin:", error);
        res.status(500).json({ error: "Error al eliminar usuario" });
    }
};
