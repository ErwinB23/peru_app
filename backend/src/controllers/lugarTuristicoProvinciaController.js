import * as lugarModel from '../models/lugarTuristicoProvinciaModel.js';
import * as provinciaModel from '../models/provinciaModel.js';
import { handleControllerError } from '../utils/httpErrors.js';
import { cleanupReplacedImages, cleanupResourceImages } from '../utils/imageLifecycle.js';

export const getLugaresByProvinciaId = async (req, res) => {
    try {
        const provinciaId = Number(req.params.provinciaId);

        if (!Number.isInteger(provinciaId) || provinciaId <= 0) {
            return res.status(400).json({ error: 'ID de provincia inválido' });
        }

        const lugares = await lugarModel.getLugaresByProvinciaId(provinciaId);

        res.json(lugares);
    } catch (error) {
      return handleControllerError(error, req, res, 'Error al obtener lugares turísticos de la provincia');
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
        const provinciaId = Number(req.body.provincia_id);

        if (!Number.isInteger(provinciaId) || provinciaId <= 0) {
            return res.status(400).json({ error: 'ID de provincia inválido' });
        }

        const provincia = await provinciaModel.getProvinciaById(provinciaId);

        if (!provincia) {
            return res.status(404).json({ error: 'Provincia asociada no encontrada' });
        }

        const imagen = req.file
            ? `/uploads/lugares-turisticos-provincias/${req.file.filename}`
            : req.body.imagen || null;

        const nuevoLugar = await lugarModel.createLugar({
            ...req.body,
            provincia_id: provinciaId,
            imagen
        });

        res.status(201).json({
            message: 'Lugar turístico de provincia creado exitosamente',
            lugar: nuevoLugar
        });
    } catch (error) {
      return handleControllerError(error, req, res, 'Error al crear lugar turístico de provincia');
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
            ? `/uploads/lugares-turisticos-provincias/${req.file.filename}`
            : req.body.imagen || lugarActual.imagen || null;

        const lugarActualizado = await lugarModel.updateLugar(id, {
            ...req.body,
            imagen
        });

        await cleanupReplacedImages(lugarActual, lugarActualizado, ['imagen']);

        res.json({
            message: 'Lugar turístico de provincia actualizado exitosamente',
            lugar: lugarActualizado
        });
    } catch (error) {
      return handleControllerError(error, req, res, 'Error al actualizar lugar turístico de provincia');
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
            message: 'Lugar turístico de provincia eliminado exitosamente',
            lugar: lugarEliminado
        });
    } catch (error) {
      return handleControllerError(error, req, res, 'Error al eliminar lugar turístico de provincia');
    }
};