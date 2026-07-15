import * as comidaModel from '../models/comidaTipicaCiudadModel.js';
import * as ciudadModel from '../models/ciudadModel.js';
import { handleControllerError } from '../utils/httpErrors.js';
import { cleanupReplacedImages, cleanupResourceImages } from '../utils/imageLifecycle.js';

export const getComidasByCiudadId = async (req, res) => {
    try {
        const ciudadId = Number(req.params.ciudadId);

        if (!Number.isInteger(ciudadId) || ciudadId <= 0) {
            return res.status(400).json({ error: 'ID de ciudad inválido' });
        }

        const comidas = await comidaModel.getComidasByCiudadId(ciudadId);
        res.json(comidas);
    } catch (error) {
      return handleControllerError(error, req, res, 'Error al obtener comidas típicas de la ciudad');
    }
};

export const getComidaById = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({ error: 'ID de comida típica inválido' });
        }

        const comida = await comidaModel.getComidaById(id);

        if (!comida) {
            return res.status(404).json({ error: 'Comida típica no encontrada' });
        }

        res.json(comida);
    } catch (error) {
      return handleControllerError(error, req, res, 'Error al obtener comida típica');
    }
};

export const createComida = async (req, res) => {
    try {
        const ciudadId = Number(req.body.ciudad_id);

        if (!Number.isInteger(ciudadId) || ciudadId <= 0) {
            return res.status(400).json({ error: 'ID de ciudad inválido' });
        }

        const ciudad = await ciudadModel.getCiudadById(ciudadId);

        if (!ciudad) {
            return res.status(404).json({ error: 'Ciudad asociada no encontrada' });
        }

        const imagen = req.file
            ? `/uploads/comidas-tipicas-ciudades/${req.file.filename}`
            : req.body.imagen || null;

        const nuevaComida = await comidaModel.createComida({
            ...req.body,
            ciudad_id: ciudadId,
            imagen
        });

        res.status(201).json({
            message: 'Comida típica de ciudad creada exitosamente',
            comida: nuevaComida
        });
    } catch (error) {
      return handleControllerError(error, req, res, 'Error al crear comida típica de ciudad');
    }
};

export const updateComida = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({ error: 'ID de comida típica inválido' });
        }

        const comidaActual = await comidaModel.getComidaById(id);

        if (!comidaActual) {
            return res.status(404).json({ error: 'Comida típica no encontrada' });
        }

        const imagen = req.file
            ? `/uploads/comidas-tipicas-ciudades/${req.file.filename}`
            : req.body.imagen || comidaActual.imagen || null;

        const comidaActualizada = await comidaModel.updateComida(id, {
            ...req.body,
            imagen
        });

        await cleanupReplacedImages(comidaActual, comidaActualizada, ['imagen']);

        res.json({
            message: 'Comida típica de ciudad actualizada exitosamente',
            comida: comidaActualizada
        });
    } catch (error) {
      return handleControllerError(error, req, res, 'Error al actualizar comida típica de ciudad');
    }
};

export const deleteComida = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({ error: 'ID de comida típica inválido' });
        }

        const comidaEliminada = await comidaModel.deleteComida(id);

        if (!comidaEliminada) {
            return res.status(404).json({ error: 'Comida típica no encontrada' });
        }

        await cleanupResourceImages(comidaEliminada, ['imagen']);

        res.json({
            message: 'Comida típica de ciudad eliminada exitosamente',
            comida: comidaEliminada
        });
    } catch (error) {
      return handleControllerError(error, req, res, 'Error al eliminar comida típica de ciudad');
    }
};