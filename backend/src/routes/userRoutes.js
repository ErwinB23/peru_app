import express from "express";
import {
    getUsers,
    searchUsersController,
    getUserById,
    updateUserAdmin,
    deleteUserAdmin,
} from "../controllers/userController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/roleMiddleware.js";

const router = express.Router();

// Todas estas rutas son solo para administradores
router.get("/", verifyToken, isAdmin, getUsers);
router.get("/search", verifyToken, isAdmin, searchUsersController);
router.get("/:id", verifyToken, isAdmin, getUserById);
router.put("/:id", verifyToken, isAdmin, updateUserAdmin);
router.delete("/:id", verifyToken, isAdmin, deleteUserAdmin);

export default router;
