import * as comidaTipicaModel from "../models/comidaTipicaModel.js";
import { handleControllerError } from '../utils/httpErrors.js';
import { cleanupReplacedImages, cleanupResourceImages } from '../utils/imageLifecycle.js';

export const getComidasByDepartamentoId = async (req, res) => {
    try {
        const departamentoId = Number(req.params.departamentoId);

        if (!Number.isInteger(departamentoId) || departamentoId <= 0) {
            return res.status(400).json({ error: "ID de departamento inválido" });
        }

        const comidas =
            await comidaTipicaModel.getComidasByDepartamentoId(departamentoId);

        res.json(comidas);
    } catch (error) {
      return handleControllerError(error, req, res, 'Error al obtener comidas típicas');
    }
};

export const getComidaById = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({ error: "ID de comida típica inválido" });
        }

        const comida = await comidaTipicaModel.getComidaById(id);

        if (!comida) {
            return res.status(404).json({ error: "Comida típica no encontrada" });
        }

        res.json(comida);
    } catch (error) {
      return handleControllerError(error, req, res, 'Error al obtener comida típica');
    }
};

export const createComidaTipica = async (req, res) => {
    try {
        const imagen = req.file
            ? `/uploads/comidas-tipicas/${req.file.filename}`
            : req.body.imagen || null;

        const nuevaComida = await comidaTipicaModel.createComidaTipica({
            ...req.body,
            departamento_id: Number(req.body.departamento_id),
            imagen,
        });

        res.status(201).json({
            message: "Comida típica creada exitosamente",
            comida: nuevaComida,
        });
    } catch (error) {
      return handleControllerError(error, req, res, 'Error al crear comida típica');
    }
};

export const updateComidaTipica = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({ error: "ID de comida típica inválido" });
        }

        const comidaActual = await comidaTipicaModel.getComidaById(id);

        if (!comidaActual) {
            return res.status(404).json({ error: "Comida típica no encontrada" });
        }

        const imagen = req.file
            ? `/uploads/comidas-tipicas/${req.file.filename}`
            : req.body.imagen || comidaActual.imagen || null;

        const comidaActualizada = await comidaTipicaModel.updateComidaTipica(id, {
            ...req.body,
            imagen,
        });

        await cleanupReplacedImages(comidaActual, comidaActualizada, ['imagen']);

        res.json({
            message: "Comida típica actualizada exitosamente",
            comida: comidaActualizada,
        });
    } catch (error) {
      return handleControllerError(error, req, res, 'Error al actualizar comida típica');
    }
};

export const deleteComidaTipica = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({ error: "ID de comida típica inválido" });
        }

        const comidaEliminada = await comidaTipicaModel.deleteComidaTipica(id);

        if (!comidaEliminada) {
            return res.status(404).json({ error: "Comida típica no encontrada" });
        }

        await cleanupResourceImages(comidaEliminada, ['imagen']);

        res.json({
            message: "Comida típica eliminada exitosamente",
            comida: comidaEliminada,
        });
    } catch (error) {
      return handleControllerError(error, req, res, 'Error al eliminar comida típica');
    }
};
