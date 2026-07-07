import * as comidaModel from '../models/comidaTipicaCiudadModel.js';
import * as ciudadModel from '../models/ciudadModel.js';

export const getComidasByCiudadId = async (req, res) => {
    try {
        const ciudadId = Number(req.params.ciudadId);

        if (!Number.isInteger(ciudadId) || ciudadId <= 0) {
            return res.status(400).json({ error: 'ID de ciudad inválido' });
        }

        const comidas = await comidaModel.getComidasByCiudadId(ciudadId);
        res.json(comidas);
    } catch (error) {
        console.error('Error en getComidasByCiudadId:', error);
        res.status(500).json({ error: 'Error al obtener comidas típicas de la ciudad' });
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
        console.error('Error en createComida:', error);
        res.status(500).json({ error: 'Error al crear comida típica de ciudad' });
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

        res.json({
            message: 'Comida típica de ciudad actualizada exitosamente',
            comida: comidaActualizada
        });
    } catch (error) {
        console.error('Error en updateComida:', error);
        res.status(500).json({ error: 'Error al actualizar comida típica de ciudad' });
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
            message: 'Comida típica de ciudad eliminada exitosamente',
            comida: comidaEliminada
        });
    } catch (error) {
        console.error('Error en deleteComida:', error);
        res.status(500).json({ error: 'Error al eliminar comida típica de ciudad' });
    }
};