import * as lugarTuristicoModel from "../models/lugarTuristicoModel.js";
import { handleControllerError } from '../utils/httpErrors.js';
import { cleanupReplacedImages, cleanupResourceImages } from '../utils/imageLifecycle.js';
import { getUploadedFileUrl } from '../utils/uploadedFile.js';

export const getLugaresByDepartamentoId = async (req, res) => {
    try {
        const departamentoId = Number(req.params.departamentoId);

        if (!Number.isInteger(departamentoId) || departamentoId <= 0) {
            return res.status(400).json({ error: "ID de departamento inválido" });
        }

        const lugares =
            await lugarTuristicoModel.getLugaresByDepartamentoId(departamentoId);

        res.json(lugares);
    } catch (error) {
      return handleControllerError(error, req, res, 'Error al obtener lugares turísticos');
    }
};

export const getLugarById = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({ error: "ID de lugar turístico inválido" });
        }

        const lugar = await lugarTuristicoModel.getLugarById(id);

        if (!lugar) {
            return res.status(404).json({ error: "Lugar turístico no encontrado" });
        }

        res.json(lugar);
    } catch (error) {
      return handleControllerError(error, req, res, 'Error al obtener lugar turístico');
    }
};

export const createLugarTuristico = async (req, res) => {
    try {
        const imagen = (getUploadedFileUrl(req.files?.imagen?.[0], 'lugares-turisticos')
            || getUploadedFileUrl(req.file, 'lugares-turisticos'))
            || req.body.imagen || null;

        const imagen_2 = getUploadedFileUrl(req.files?.imagen_2?.[0], 'lugares-turisticos')
            || req.body.imagen_2 || null;

        const imagen_3 = getUploadedFileUrl(req.files?.imagen_3?.[0], 'lugares-turisticos')
            || req.body.imagen_3 || null;

        const imagen_4 = getUploadedFileUrl(req.files?.imagen_4?.[0], 'lugares-turisticos')
            || req.body.imagen_4 || null;

        const nuevoLugar = await lugarTuristicoModel.createLugarTuristico({
            ...req.body,
            departamento_id: Number(req.body.departamento_id),
            imagen,
            imagen_2,
            imagen_3,
            imagen_4,
        });

        res.status(201).json({
            message: "Lugar turístico creado exitosamente",
            lugar: nuevoLugar,
        });
    } catch (error) {
      return handleControllerError(error, req, res, 'Error al crear lugar turístico');
    }
};

export const updateLugarTuristico = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({ error: "ID de lugar turístico inválido" });
        }

        const lugarActual = await lugarTuristicoModel.getLugarById(id);

        if (!lugarActual) {
            return res.status(404).json({ error: "Lugar turístico no encontrado" });
        }

        const imagen = (getUploadedFileUrl(req.files?.imagen?.[0], 'lugares-turisticos')
            || getUploadedFileUrl(req.file, 'lugares-turisticos'))
            || req.body.imagen || lugarActual.imagen || null;

        const imagen_2 = getUploadedFileUrl(req.files?.imagen_2?.[0], 'lugares-turisticos')
            || req.body.imagen_2 || lugarActual.imagen_2 || null;

        const imagen_3 = getUploadedFileUrl(req.files?.imagen_3?.[0], 'lugares-turisticos')
            || req.body.imagen_3 || lugarActual.imagen_3 || null;

        const imagen_4 = getUploadedFileUrl(req.files?.imagen_4?.[0], 'lugares-turisticos')
            || req.body.imagen_4 || lugarActual.imagen_4 || null;

        const lugarActualizado = await lugarTuristicoModel.updateLugarTuristico(
            id,
            {
                ...lugarActual,
                ...req.body,
                imagen,
                imagen_2,
                imagen_3,
                imagen_4,
            },
        );

        await cleanupReplacedImages(lugarActual, lugarActualizado, ['imagen', 'imagen_2', 'imagen_3', 'imagen_4']);

        res.json({
            message: "Lugar turístico actualizado exitosamente",
            lugar: lugarActualizado,
        });
    } catch (error) {
      return handleControllerError(error, req, res, 'Error al actualizar lugar turístico');
    }
};

export const deleteLugarTuristico = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({ error: "ID de lugar turístico inválido" });
        }

        const lugarEliminado = await lugarTuristicoModel.deleteLugarTuristico(id);

        if (!lugarEliminado) {
            return res.status(404).json({ error: "Lugar turístico no encontrado" });
        }

        await cleanupResourceImages(lugarEliminado, ['imagen', 'imagen_2', 'imagen_3', 'imagen_4']);

        res.json({
            message: "Lugar turístico eliminado exitosamente",
            lugar: lugarEliminado,
        });
    } catch (error) {
      return handleControllerError(error, req, res, 'Error al eliminar lugar turístico');
    }
};
