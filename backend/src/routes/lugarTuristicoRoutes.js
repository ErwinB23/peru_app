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
    uploadLugarTuristicoImage.single("imagen"),
    createLugarTuristico,
);

router.put(
    "/:id",
    verifyToken,
    isAdmin,
    uploadLugarTuristicoImage.single("imagen"),
    updateLugarTuristico,
);

router.delete("/:id", verifyToken, isAdmin, deleteLugarTuristico);

export default router;
