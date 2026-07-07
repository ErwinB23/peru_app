import * as comidaModel from '../models/comidaTipicaDistritoModel.js';
import * as distritoModel from '../models/distritoModel.js';

export const getComidasByDistritoId = async (req, res) => {
    try {
        const distritoId = Number(req.params.distritoId);

        if (!Number.isInteger(distritoId) || distritoId <= 0) {
            return res.status(400).json({ error: 'ID de distrito inválido' });
        }

        const comidas = await comidaModel.getComidasByDistritoId(distritoId);

        res.json(comidas);
    } catch (error) {
        console.error('Error en getComidasByDistritoId:', error);
        res.status(500).json({ error: 'Error al obtener comidas típicas del distrito' });
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
        console.error('Error en getComidaById:', error);
        res.status(500).json({ error: 'Error al obtener comida típica' });
    }
};

export const createComida = async (req, res) => {
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
            ? `/uploads/comidas-tipicas-distritos/${req.file.filename}`
            : req.body.imagen || null;

        const nuevaComida = await comidaModel.createComida({
            ...req.body,
            distrito_id: distritoId,
            imagen
        });

        res.status(201).json({
            message: 'Comida típica de distrito creada exitosamente',
            comida: nuevaComida
        });
    } catch (error) {
        console.error('Error en createComida:', error);
        res.status(500).json({ error: 'Error al crear comida típica de distrito' });
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
            ? `/uploads/comidas-tipicas-distritos/${req.file.filename}`
            : req.body.imagen || comidaActual.imagen || null;

        const comidaActualizada = await comidaModel.updateComida(id, {
            ...req.body,
            imagen
        });

        res.json({
            message: 'Comida típica de distrito actualizada exitosamente',
            comida: comidaActualizada
        });
    } catch (error) {
        console.error('Error en updateComida:', error);
        res.status(500).json({ error: 'Error al actualizar comida típica de distrito' });
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

        res.json({
            message: 'Comida típica de distrito eliminada exitosamente',
            comida: comidaEliminada
        });
    } catch (error) {
        console.error('Error en deleteComida:', error);
        res.status(500).json({ error: 'Error al eliminar comida típica de distrito' });
    }
};