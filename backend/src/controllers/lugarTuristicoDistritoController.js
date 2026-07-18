import * as lugarModel from '../models/lugarTuristicoDistritoModel.js';
import * as distritoModel from '../models/distritoModel.js';
import { handleControllerError } from '../utils/httpErrors.js';
import { cleanupReplacedImages, cleanupResourceImages } from '../utils/imageLifecycle.js';

export const getLugaresByDistritoId = async (req, res) => {
    try {
        const distritoId = Number(req.params.distritoId);

        if (!Number.isInteger(distritoId) || distritoId <= 0) {
            return res.status(400).json({ error: 'ID de distrito inválido' });
        }

        const lugares = await lugarModel.getLugaresByDistritoId(distritoId);

        res.json(lugares);
    } catch (error) {
      return handleControllerError(error, req, res, 'Error al obtener lugares turísticos del distrito');
    }
};

export const getLugarById = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({ error: 'ID de lugar turístico inválido' });
        }

        const lugar = await lugarModel.getLugarById(id);

        if (!lugar) {
            return res.status(404).json({ error: 'Lugar turístico no encontrado' });
        }

        res.json(lugar);
    } catch (error) {
      return handleControllerError(error, req, res, 'Error al obtener lugar turístico');
    }
};

export const createLugar = async (req, res) => {
    try {
        const distritoId = Number(req.body.distrito_id);

        if (!Number.isInteger(distritoId) || distritoId <= 0) {
            return res.status(400).json({ error: 'ID de distrito inválido' });
        }

        const distrito = await distritoModel.getDistritoById(distritoId);

        if (!distrito) {
            return res.status(404).json({ error: 'Distrito asociado no encontrado' });
        }

        const imagen = req.file
            ? `/uploads/lugares-turisticos-distritos/${req.file.filename}`
            : req.body.imagen || null;

        const nuevoLugar = await lugarModel.createLugar({
            ...req.body,
            distrito_id: distritoId,
            imagen
        });

        res.status(201).json({
            message: 'Lugar turístico de distrito creado exitosamente',
            lugar: nuevoLugar
        });
    } catch (error) {
      return handleControllerError(error, req, res, 'Error al crear lugar turístico de distrito');
    }
};

export const updateLugar = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({ error: 'ID de lugar turístico inválido' });
        }

        const lugarActual = await lugarModel.getLugarById(id);

        if (!lugarActual) {
            return res.status(404).json({ error: 'Lugar turístico no encontrado' });
        }

        const imagen = req.file
            ? `/uploads/lugares-turisticos-distritos/${req.file.filename}`
            : req.body.imagen || lugarActual.imagen || null;

        const lugarActualizado = await lugarModel.updateLugar(id, {
            ...req.body,
            imagen
        });

        await cleanupReplacedImages(lugarActual, lugarActualizado, ['imagen']);

        res.json({
            message: 'Lugar turístico de distrito actualizado exitosamente',
            lugar: lugarActualizado
        });
    } catch (error) {
      return handleControllerError(error, req, res, 'Error al actualizar lugar turístico de distrito');
    }
};

export const deleteLugar = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({ error: 'ID de lugar turístico inválido' });
        }

        const lugarEliminado = await lugarModel.deleteLugar(id);

        if (!lugarEliminado) {
            return res.status(404).json({ error: 'Lugar turístico no encontrado' });
        }

        await cleanupResourceImages(lugarEliminado, ['imagen']);

        res.json({
            message: 'Lugar turístico de distrito eliminado exitosamente',
            lugar: lugarEliminado
        });
    } catch (error) {
      return handleControllerError(error, req, res, 'Error al eliminar lugar turístico de distrito');
    }
};