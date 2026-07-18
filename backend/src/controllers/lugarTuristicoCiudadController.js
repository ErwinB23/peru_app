import * as lugarModel from '../models/lugarTuristicoCiudadModel.js';
import * as ciudadModel from '../models/ciudadModel.js';
import { handleControllerError } from '../utils/httpErrors.js';
import { cleanupReplacedImages, cleanupResourceImages } from '../utils/imageLifecycle.js';
import { getUploadedFileUrl } from '../utils/uploadedFile.js';

export const getLugaresByCiudadId = async (req, res) => {
    try {
        const ciudadId = Number(req.params.ciudadId);

        if (!Number.isInteger(ciudadId) || ciudadId <= 0) {
            return res.status(400).json({ error: 'ID de ciudad inválido' });
        }

        const lugares = await lugarModel.getLugaresByCiudadId(ciudadId);
        res.json(lugares);
    } catch (error) {
      return handleControllerError(error, req, res, 'Error al obtener lugares turísticos de la ciudad');
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
        const ciudadId = Number(req.body.ciudad_id);

        if (!Number.isInteger(ciudadId) || ciudadId <= 0) {
            return res.status(400).json({ error: 'ID de ciudad inválido' });
        }

        const ciudad = await ciudadModel.getCiudadById(ciudadId);

        if (!ciudad) {
            return res.status(404).json({ error: 'Ciudad asociada no encontrada' });
        }

        const imagen = getUploadedFileUrl(req.file, 'lugares-turisticos-ciudades')
            || req.body.imagen || null;

        const nuevoLugar = await lugarModel.createLugar({
            ...req.body,
            ciudad_id: ciudadId,
            imagen
        });

        res.status(201).json({
            message: 'Lugar turístico de ciudad creado exitosamente',
            lugar: nuevoLugar
        });
    } catch (error) {
      return handleControllerError(error, req, res, 'Error al crear lugar turístico de ciudad');
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

        const imagen = getUploadedFileUrl(req.file, 'lugares-turisticos-ciudades')
            || req.body.imagen || lugarActual.imagen || null;

        const lugarActualizado = await lugarModel.updateLugar(id, {
            ...req.body,
            imagen
        });

        await cleanupReplacedImages(lugarActual, lugarActualizado, ['imagen']);

        res.json({
            message: 'Lugar turístico de ciudad actualizado exitosamente',
            lugar: lugarActualizado
        });
    } catch (error) {
      return handleControllerError(error, req, res, 'Error al actualizar lugar turístico de ciudad');
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
            message: 'Lugar turístico de ciudad eliminado exitosamente',
            lugar: lugarEliminado
        });
    } catch (error) {
      return handleControllerError(error, req, res, 'Error al eliminar lugar turístico de ciudad');
    }
};
