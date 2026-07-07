import * as comidaModel from '../models/comidaTipicaProvinciaModel.js';
import * as provinciaModel from '../models/provinciaModel.js';

export const getComidasByProvinciaId = async (req, res) => {
    try {
        const provinciaId = Number(req.params.provinciaId);

        if (!Number.isInteger(provinciaId) || provinciaId <= 0) {
            return res.status(400).json({ error: 'ID de provincia inválido' });
        }

        const comidas = await comidaModel.getComidasByProvinciaId(provinciaId);

        res.json(comidas);
    } catch (error) {
        console.error('Error en getComidasByProvinciaId:', error);
        res.status(500).json({ error: 'Error al obtener comidas típicas de la provincia' });
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
        console.error('Error en createComida:', error);
        res.status(500).json({ error: 'Error al crear comida típica de provincia' });
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

        res.json({
            message: 'Comida típica de provincia actualizada exitosamente',
            comida: comidaActualizada
        });
    } catch (error) {
        console.error('Error en updateComida:', error);
        res.status(500).json({ error: 'Error al actualizar comida típica de provincia' });
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
            message: 'Comida típica de provincia eliminada exitosamente',
            comida: comidaEliminada
        });
    } catch (error) {
        console.error('Error en deleteComida:', error);
        res.status(500).json({ error: 'Error al eliminar comida típica de provincia' });
    }
};