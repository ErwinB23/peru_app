import express from "express";
import {
    getLugaresByDepartamentoId,
    getLugarById,
    createLugarTuristico,
    updateLugarTuristico,
    deleteLugarTuristico,
} from "../controllers/lugarTuristicoController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/roleMiddleware.js";
import { uploadLugarTuristicoImage } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.get(
    "/departamento/:departamentoId",
    verifyToken,
    getLugaresByDepartamentoId,
);
router.get("/:id", verifyToken, getLugarById);

router.post(
    "/",
    verifyToken,
    isAdmin,
    uploadLugarTuristicoImage.fields([
        { name: "imagen", maxCount: 1 },
        { name: "imagen_2", maxCount: 1 },
        { name: "imagen_3", maxCount: 1 },
        { name: "imagen_4", maxCount: 1 },
    ]),
    createLugarTuristico,
);

router.put(
    "/:id",
    verifyToken,
    isAdmin,
    uploadLugarTuristicoImage.fields([
        { name: "imagen", maxCount: 1 },
        { name: "imagen_2", maxCount: 1 },
        { name: "imagen_3", maxCount: 1 },
        { name: "imagen_4", maxCount: 1 },
    ]),
    updateLugarTuristico,
);

router.delete("/:id", verifyToken, isAdmin, deleteLugarTuristico);

export default router;
