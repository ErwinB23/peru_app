import * as ciudadModel from "../models/ciudadModel.js";
import * as distritoModel from "../models/distritoModel.js";
import { handleControllerError } from '../utils/httpErrors.js';
import { cleanupReplacedImages, cleanupResourceImages } from '../utils/imageLifecycle.js';
import { getUploadedFileUrl } from '../utils/uploadedFile.js';

// OBTENER TODAS LAS CIUDADES CON PAGINACIÓN
export const getCiudades = async (req, res) => {
    try {
        const {
            departamento_id,
            provincia_id,
            distrito_id,
            page = 1,
            limit = 20
        } = req.query;

        const pageNum = Number(page);
        const limitNum = Number(limit);

        if (
            !Number.isInteger(pageNum) ||
            !Number.isInteger(limitNum) ||
            pageNum < 1 ||
            limitNum < 1 ||
            limitNum > 100
        ) {
            return res.status(400).json({
                error: "Parámetros inválidos. page >= 1, limit entre 1 y 100",
            });
        }

        if (departamento_id) {
            const departamentoId = Number(departamento_id);

            if (!Number.isInteger(departamentoId) || departamentoId <= 0) {
                return res.status(400).json({ error: "ID de departamento inválido" });
            }

            const result = await ciudadModel.getCiudadesByDepartamento(
                departamentoId,
                pageNum,
                limitNum
            );

            return res.json(result);
        }

        if (provincia_id) {
            const provinciaId = Number(provincia_id);

            if (!Number.isInteger(provinciaId) || provinciaId <= 0) {
                return res.status(400).json({ error: "ID de provincia inválido" });
            }

            const result = await ciudadModel.getCiudadesByProvincia(
                provinciaId,
                pageNum,
                limitNum
            );

            return res.json(result);
        }

        if (distrito_id) {
            const distritoId = Number(distrito_id);

            if (!Number.isInteger(distritoId) || distritoId <= 0) {
                return res.status(400).json({ error: "ID de distrito inválido" });
            }

            const distrito = await distritoModel.getDistritoById(distritoId);

            if (!distrito) {
                return res.status(404).json({ error: "Distrito no encontrado" });
            }

            const result = await ciudadModel.getCiudadesByDistrito(
                distritoId,
                pageNum,
                limitNum
            );

            return res.json(result);
        }

        const result = await ciudadModel.getAllCiudades(pageNum, limitNum);
        res.json(result);
    } catch (error) {
      return handleControllerError(error, req, res, 'Error al obtener ciudades');
    }
};

// OBTENER CIUDAD POR ID
export const getCiudadById = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({ error: "ID de ciudad inválido" });
        }

        const ciudad = await ciudadModel.getCiudadById(id);

        if (!ciudad) {
            return res.status(404).json({ error: "Ciudad no encontrada" });
        }

        res.json(ciudad);
    } catch (error) {
      return handleControllerError(error, req, res, 'Error al obtener ciudad');
    }
};

// CREAR CIUDAD (solo admin)
export const createCiudad = async (req, res) => {
    try {
        const {
            nombre,
            distrito_id,
            tipo_ciudad,
            poblacion,
            latitud,
            longitud,
            clima,
            principal_actividad,
            atractivo_turistico,
            descripcion_cultural,
        } = req.body;

        if (!nombre || !distrito_id || !poblacion) {
            return res.status(400).json({
                error: "Los campos nombre, distrito_id y poblacion son obligatorios",
            });
        }

        const distritoId = Number(distrito_id);

        if (!Number.isInteger(distritoId) || distritoId <= 0) {
            return res.status(400).json({ error: "ID de distrito inválido" });
        }

        const distrito = await distritoModel.getDistritoById(distritoId);

        if (!distrito) {
            return res.status(404).json({ error: "Distrito asociado no encontrado" });
        }

        if (
            tipo_ciudad &&
            !["Capital", "Historica", "Turistica", "Comercial"].includes(tipo_ciudad)
        ) {
            return res.status(400).json({
                error:
                    "Tipo de ciudad inválido. Use Capital, Historica, Turistica o Comercial",
            });
        }

        const imagen_fondo = getUploadedFileUrl(req.file, 'ciudades')
            || req.body.imagen_fondo || null;

        const newCiudad = await ciudadModel.createCiudad({
            nombre: nombre.trim(),
            distrito_id: distritoId,
            tipo_ciudad: tipo_ciudad || null,
            poblacion,
            latitud: latitud || null,
            longitud: longitud || null,
            clima: clima || null,
            principal_actividad: principal_actividad || null,
            atractivo_turistico: atractivo_turistico || null,
            descripcion_cultural: descripcion_cultural || null,
            imagen_fondo,
        });

        res.status(201).json({
            message: "Ciudad creada exitosamente",
            ciudad: newCiudad,
        });
    } catch (error) {
      return handleControllerError(error, req, res, 'Error al crear ciudad');
    }
};

// ACTUALIZAR CIUDAD (solo admin)
export const updateCiudad = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({ error: "ID de ciudad inválido" });
        }

        const {
            nombre,
            distrito_id,
            tipo_ciudad,
            poblacion,
            latitud,
            longitud,
            clima,
            principal_actividad,
            atractivo_turistico,
            descripcion_cultural,
        } = req.body;

        if (!nombre || !distrito_id || !poblacion) {
            return res.status(400).json({
                error: "Los campos nombre, distrito_id y poblacion son obligatorios",
            });
        }

        const ciudad = await ciudadModel.getCiudadById(id);

        if (!ciudad) {
            return res.status(404).json({ error: "Ciudad no encontrada" });
        }

        const distritoId = Number(distrito_id);

        if (!Number.isInteger(distritoId) || distritoId <= 0) {
            return res.status(400).json({ error: "ID de distrito inválido" });
        }

        const distrito = await distritoModel.getDistritoById(distritoId);

        if (!distrito) {
            return res.status(404).json({ error: "Distrito asociado no encontrado" });
        }

        if (
            tipo_ciudad &&
            !["Capital", "Historica", "Turistica", "Comercial"].includes(tipo_ciudad)
        ) {
            return res.status(400).json({
                error:
                    "Tipo de ciudad inválido. Use Capital, Historica, Turistica o Comercial",
            });
        }

        const imagen_fondo = getUploadedFileUrl(req.file, 'ciudades')
            || req.body.imagen_fondo || ciudad.imagen_fondo || null;

        const updatedCiudad = await ciudadModel.updateCiudad(id, {
            nombre: nombre.trim(),
            distrito_id: distritoId,
            tipo_ciudad: tipo_ciudad || null,
            poblacion,
            latitud: latitud || null,
            longitud: longitud || null,
            clima: clima || null,
            principal_actividad: principal_actividad || null,
            atractivo_turistico: atractivo_turistico || null,
            descripcion_cultural: descripcion_cultural || null,
            imagen_fondo,
        });

        await cleanupReplacedImages(ciudad, updatedCiudad, ['imagen_fondo']);

        res.json({
            message: "Ciudad actualizada exitosamente",
            ciudad: updatedCiudad,
        });
    } catch (error) {
      return handleControllerError(error, req, res, 'Error al actualizar ciudad');
    }
};

// ELIMINAR CIUDAD (solo admin)
export const deleteCiudad = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({ error: "ID de ciudad inválido" });
        }

        const deletedCiudad = await ciudadModel.deleteCiudad(id);

        if (!deletedCiudad) {
            return res.status(404).json({ error: "Ciudad no encontrada" });
        }

        await cleanupResourceImages(deletedCiudad, ['imagen_fondo']);

        res.json({
            message: "Ciudad eliminada exitosamente",
            ciudad: deletedCiudad,
        });
    } catch (error) {
      return handleControllerError(error, req, res, 'Error al eliminar ciudad');
    }
};
