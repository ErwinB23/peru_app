import * as provinciaModel from "../models/provinciaModel.js";
import * as departamentoModel from "../models/departamentoModel.js";
import { handleControllerError } from '../utils/httpErrors.js';

// OBTENER TODAS LAS PROVINCIAS
export const getProvincias = async (req, res) => {
    try {
        const { departamento_id } = req.query;

        if (departamento_id) {
            const departamentoId = Number(departamento_id);

            if (!Number.isInteger(departamentoId) || departamentoId <= 0) {
                return res.status(400).json({ error: "ID de departamento inválido" });
            }

            const departamento =
                await departamentoModel.getDepartamentoById(departamentoId);

            if (!departamento) {
                return res.status(404).json({ error: "Departamento no encontrado" });
            }

            const provincias =
                await provinciaModel.getProvinciasByDepartamento(departamentoId);
            return res.json(provincias);
        }

        const provincias = await provinciaModel.getAllProvincias();
        res.json(provincias);
    } catch (error) {
      return handleControllerError(error, req, res, 'Error al obtener provincias');
    }
};

// OBTENER PROVINCIA POR ID
export const getProvinciaById = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({ error: "ID de provincia inválido" });
        }

        const provincia = await provinciaModel.getProvinciaById(id);

        if (!provincia) {
            return res.status(404).json({ error: "Provincia no encontrada" });
        }

        res.json(provincia);
    } catch (error) {
      return handleControllerError(error, req, res, 'Error al obtener provincia');
    }
};

// CREAR PROVINCIA (solo admin)
export const createProvincia = async (req, res) => {
    try {
        const {
            nombre,
            capital,
            departamento_id,
            area_km2,
            poblacion_aprox,
            actividad_economica_principal,
            festividad_representativa,
            descripcion_general,
        } = req.body;

        if (
            !nombre ||
            !capital ||
            !departamento_id ||
            !area_km2 ||
            !poblacion_aprox
        ) {
            return res.status(400).json({
                error:
                    "Los campos nombre, capital, departamento_id, area_km2 y poblacion_aprox son obligatorios",
            });
        }

        const departamentoId = Number(departamento_id);

        if (!Number.isInteger(departamentoId) || departamentoId <= 0) {
            return res.status(400).json({ error: "ID de departamento inválido" });
        }

        const departamento =
            await departamentoModel.getDepartamentoById(departamentoId);

        if (!departamento) {
            return res
                .status(404)
                .json({ error: "Departamento asociado no encontrado" });
        }

        const imagen_fondo = req.file
            ? `/uploads/provincias/${req.file.filename}`
            : req.body.imagen_fondo || null;

        const newProvincia = await provinciaModel.createProvincia({
            nombre: nombre.trim(),
            capital: capital.trim(),
            departamento_id: departamentoId,
            area_km2,
            poblacion_aprox,
            actividad_economica_principal,
            festividad_representativa,
            descripcion_general,
            imagen_fondo,
        });

        res.status(201).json({
            message: "Provincia creada exitosamente",
            provincia: newProvincia,
        });
    } catch (error) {
      return handleControllerError(error, req, res, 'Error al crear provincia');
    }
};

// ACTUALIZAR PROVINCIA (solo admin)
export const updateProvincia = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({ error: "ID de provincia inválido" });
        }

        const {
            nombre,
            capital,
            departamento_id,
            area_km2,
            poblacion_aprox,
            actividad_economica_principal,
            festividad_representativa,
            descripcion_general,
        } = req.body;

        if (
            !nombre ||
            !capital ||
            !departamento_id ||
            !area_km2 ||
            !poblacion_aprox
        ) {
            return res.status(400).json({
                error:
                    "Los campos nombre, capital, departamento_id, area_km2 y poblacion_aprox son obligatorios",
            });
        }

        const provincia = await provinciaModel.getProvinciaById(id);

        if (!provincia) {
            return res.status(404).json({ error: "Provincia no encontrada" });
        }

        const departamentoId = Number(departamento_id);

        if (!Number.isInteger(departamentoId) || departamentoId <= 0) {
            return res.status(400).json({ error: "ID de departamento inválido" });
        }

        const departamento =
            await departamentoModel.getDepartamentoById(departamentoId);

        if (!departamento) {
            return res
                .status(404)
                .json({ error: "Departamento asociado no encontrado" });
        }

        const imagen_fondo = req.file
            ? `/uploads/provincias/${req.file.filename}`
            : req.body.imagen_fondo || provincia.imagen_fondo || null;

        const updatedProvincia = await provinciaModel.updateProvincia(id, {
            nombre: nombre.trim(),
            capital: capital.trim(),
            departamento_id: departamentoId,
            area_km2,
            poblacion_aprox,
            actividad_economica_principal,
            festividad_representativa,
            descripcion_general,
            imagen_fondo,
        });

        res.json({
            message: "Provincia actualizada exitosamente",
            provincia: updatedProvincia,
        });
    } catch (error) {
      return handleControllerError(error, req, res, 'Error al actualizar provincia');
    }
};

// ELIMINAR PROVINCIA (solo admin)
export const deleteProvincia = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({ error: "ID de provincia inválido" });
        }

        const deletedProvincia = await provinciaModel.deleteProvincia(id);

        if (!deletedProvincia) {
            return res.status(404).json({ error: "Provincia no encontrada" });
        }

        res.json({
            message: "Provincia eliminada exitosamente",
            provincia: deletedProvincia,
        });
    } catch (error) {
      return handleControllerError(error, req, res, 'Error al eliminar provincia');
    }
};
