import express from "express";
import {
    getComidasByDepartamentoId,
    getComidaById,
    createComidaTipica,
    updateComidaTipica,
    deleteComidaTipica,
} from "../controllers/comidaTipicaController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/roleMiddleware.js";
import { uploadComidaTipicaImage } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.get(
    "/departamento/:departamentoId",
    verifyToken,
    getComidasByDepartamentoId,
);
router.get("/:id", verifyToken, getComidaById);

router.post(
    "/",
    verifyToken,
    isAdmin,
    uploadComidaTipicaImage.single("imagen"),
    createComidaTipica,
);

router.put(
    "/:id",
    verifyToken,
    isAdmin,
    uploadComidaTipicaImage.single("imagen"),
    updateComidaTipica,
);

router.delete("/:id", verifyToken, isAdmin, deleteComidaTipica);

export default router;
