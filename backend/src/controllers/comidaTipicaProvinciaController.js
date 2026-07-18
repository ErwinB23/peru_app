import * as comidaModel from '../models/comidaTipicaProvinciaModel.js';
import * as provinciaModel from '../models/provinciaModel.js';
import { handleControllerError } from '../utils/httpErrors.js';
import { cleanupReplacedImages, cleanupResourceImages } from '../utils/imageLifecycle.js';

export const getComidasByProvinciaId = async (req, res) => {
    try {
        const provinciaId = Number(req.params.provinciaId);

        if (!Number.isInteger(provinciaId) || provinciaId <= 0) {
            return res.status(400).json({ error: 'ID de provincia inválido' });
        }

        const comidas = await comidaModel.getComidasByProvinciaId(provinciaId);

        res.json(comidas);
    } catch (error) {
      return handleControllerError(error, req, res, 'Error al obtener comidas típicas de la provincia');
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
        const provinciaId = Number(req.body.provincia_id);

        if (!Number.isInteger(provinciaId) || provinciaId <= 0) {
            return res.status(400).json({ error: 'ID de provincia inválido' });
        }

        const provincia = await provinciaModel.getProvinciaById(provinciaId);

        if (!provincia) {
            return res.status(404).json({ error: 'Provincia asociada no encontrada' });
        }

        const imagen = req.file
            ? `/uploads/comidas-tipicas-provincias/${req.file.filename}`
            : req.body.imagen || null;

        const nuevaComida = await comidaModel.createComida({
            ...req.body,
            provincia_id: provinciaId,
            imagen
        });

        res.status(201).json({
            message: 'Comida típica de provincia creada exitosamente',
            comida: nuevaComida
        });
    } catch (error) {
      return handleControllerError(error, req, res, 'Error al crear comida típica de provincia');
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
            ? `/uploads/comidas-tipicas-provincias/${req.file.filename}`
            : req.body.imagen || comidaActual.imagen || null;

        const comidaActualizada = await comidaModel.updateComida(id, {
            ...req.body,
            imagen
        });

        await cleanupReplacedImages(comidaActual, comidaActualizada, ['imagen']);

        res.json({
            message: 'Comida típica de provincia actualizada exitosamente',
            comida: comidaActualizada
        });
    } catch (error) {
      return handleControllerError(error, req, res, 'Error al actualizar comida típica de provincia');
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
            message: 'Comida típica de provincia eliminada exitosamente',
            comida: comidaEliminada
        });
    } catch (error) {
      return handleControllerError(error, req, res, 'Error al eliminar comida típica de provincia');
    }
};