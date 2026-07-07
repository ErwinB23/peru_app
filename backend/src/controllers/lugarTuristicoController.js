import * as lugarTuristicoModel from "../models/lugarTuristicoModel.js";

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
        console.error("Error en getLugaresByDepartamentoId:", error);
        res.status(500).json({ error: "Error al obtener lugares turísticos" });
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
        console.error("Error en getLugarById:", error);
        res.status(500).json({ error: "Error al obtener lugar turístico" });
    }
};

export const createLugarTuristico = async (req, res) => {
    try {
        const imagen = req.file
            ? `/uploads/lugares-turisticos/${req.file.filename}`
            : req.body.imagen || null;

        const nuevoLugar = await lugarTuristicoModel.createLugarTuristico({
            ...req.body,
            departamento_id: Number(req.body.departamento_id),
            imagen,
        });

        res.status(201).json({
            message: "Lugar turístico creado exitosamente",
            lugar: nuevoLugar,
        });
    } catch (error) {
        console.error("Error en createLugarTuristico:", error);
        res.status(500).json({ error: "Error al crear lugar turístico" });
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

        const imagen = req.file
            ? `/uploads/lugares-turisticos/${req.file.filename}`
            : req.body.imagen || lugarActual.imagen || null;

        const lugarActualizado = await lugarTuristicoModel.updateLugarTuristico(
            id,
            {
                ...req.body,
                imagen,
            },
        );

        res.json({
            message: "Lugar turístico actualizado exitosamente",
            lugar: lugarActualizado,
        });
    } catch (error) {
        console.error("Error en updateLugarTuristico:", error);
        res.status(500).json({ error: "Error al actualizar lugar turístico" });
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

        res.json({
            message: "Lugar turístico eliminado exitosamente",
            lugar: lugarEliminado,
        });
    } catch (error) {
        console.error("Error en deleteLugarTuristico:", error);
        res.status(500).json({ error: "Error al eliminar lugar turístico" });
    }
};
