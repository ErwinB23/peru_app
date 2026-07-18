import * as distritoModel from "../models/distritoModel.js";
import * as provinciaModel from "../models/provinciaModel.js";
import { handleControllerError } from '../utils/httpErrors.js';
import { cleanupReplacedImages, cleanupResourceImages } from '../utils/imageLifecycle.js';
import { getUploadedFileUrl } from '../utils/uploadedFile.js';

// OBTENER TODOS LOS DISTRITOS CON PAGINACIÓN
export const getDistritos = async (req, res) => {
    try {
        const { provincia_id, page = 1, limit = 20 } = req.query;

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

        if (provincia_id) {
            const provinciaId = Number(provincia_id);

            if (!Number.isInteger(provinciaId) || provinciaId <= 0) {
                return res.status(400).json({ error: "ID de provincia inválido" });
            }

            const provincia = await provinciaModel.getProvinciaById(provinciaId);

            if (!provincia) {
                return res.status(404).json({ error: "Provincia no encontrada" });
            }

            const result = await distritoModel.getDistritosByProvincia(
                provinciaId,
                pageNum,
                limitNum,
            );
            return res.json(result);
        }

        const result = await distritoModel.getAllDistritos(pageNum, limitNum);
        res.json(result);
    } catch (error) {
      return handleControllerError(error, req, res, 'Error al obtener distritos');
    }
};

// OBTENER DISTRITO POR ID
export const getDistritoById = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({ error: "ID de distrito inválido" });
        }

        const distrito = await distritoModel.getDistritoById(id);

        if (!distrito) {
            return res.status(404).json({ error: "Distrito no encontrado" });
        }

        res.json(distrito);
    } catch (error) {
      return handleControllerError(error, req, res, 'Error al obtener distrito');
    }
};

// CREAR DISTRITO (solo admin)
export const createDistrito = async (req, res) => {
    try {
        const {
            nombre,
            provincia_id,
            area_km2,
            poblacion_aprox,
            altitud_msnm,
            tipo_zona,
            servicios_basicos,
            nivel_desarrollo,
            descripcion,
        } = req.body;

        if (!nombre || !provincia_id || !area_km2 || !poblacion_aprox) {
            return res.status(400).json({
                error:
                    "Los campos nombre, provincia_id, area_km2 y poblacion_aprox son obligatorios",
            });
        }

        const provinciaId = Number(provincia_id);

        if (!Number.isInteger(provinciaId) || provinciaId <= 0) {
            return res.status(400).json({ error: "ID de provincia inválido" });
        }

        const provincia = await provinciaModel.getProvinciaById(provinciaId);

        if (!provincia) {
            return res
                .status(404)
                .json({ error: "Provincia asociada no encontrada" });
        }

        if (tipo_zona && !["Urbano", "Rural", "Mixto"].includes(tipo_zona)) {
            return res.status(400).json({
                error: "Tipo de zona inválido. Use Urbano, Rural o Mixto",
            });
        }

        if (
            nivel_desarrollo &&
            !["Alto", "Medio", "Bajo"].includes(nivel_desarrollo)
        ) {
            return res.status(400).json({
                error: "Nivel de desarrollo inválido. Use Alto, Medio o Bajo",
            });
        }

        const imagen_fondo = getUploadedFileUrl(req.file, 'distritos')
            || req.body.imagen_fondo || null;

        const newDistrito = await distritoModel.createDistrito({
            nombre: nombre.trim(),
            provincia_id: provinciaId,
            area_km2,
            poblacion_aprox,
            altitud_msnm: altitud_msnm || null,
            tipo_zona: tipo_zona || null,
            servicios_basicos: servicios_basicos || null,
            nivel_desarrollo: nivel_desarrollo || null,
            descripcion: descripcion || null,
            imagen_fondo,
        });

        res.status(201).json({
            message: "Distrito creado exitosamente",
            distrito: newDistrito,
        });
    } catch (error) {
      return handleControllerError(error, req, res, 'Error al crear distrito');
    }
};
// ACTUALIZAR DISTRITO (solo admin)
export const updateDistrito = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({ error: "ID de distrito inválido" });
        }

        const {
            nombre,
            provincia_id,
            area_km2,
            poblacion_aprox,
            altitud_msnm,
            tipo_zona,
            servicios_basicos,
            nivel_desarrollo,
            descripcion,
        } = req.body;

        if (!nombre || !provincia_id || !area_km2 || !poblacion_aprox) {
            return res.status(400).json({
                error:
                    "Los campos nombre, provincia_id, area_km2 y poblacion_aprox son obligatorios",
            });
        }

        const distrito = await distritoModel.getDistritoById(id);

        if (!distrito) {
            return res.status(404).json({ error: "Distrito no encontrado" });
        }

        const provinciaId = Number(provincia_id);

        if (!Number.isInteger(provinciaId) || provinciaId <= 0) {
            return res.status(400).json({ error: "ID de provincia inválido" });
        }

        const provincia = await provinciaModel.getProvinciaById(provinciaId);

        if (!provincia) {
            return res
                .status(404)
                .json({ error: "Provincia asociada no encontrada" });
        }

        if (tipo_zona && !["Urbano", "Rural", "Mixto"].includes(tipo_zona)) {
            return res.status(400).json({
                error: "Tipo de zona inválido. Use Urbano, Rural o Mixto",
            });
        }

        if (
            nivel_desarrollo &&
            !["Alto", "Medio", "Bajo"].includes(nivel_desarrollo)
        ) {
            return res.status(400).json({
                error: "Nivel de desarrollo inválido. Use Alto, Medio o Bajo",
            });
        }

        const imagen_fondo = getUploadedFileUrl(req.file, 'distritos')
            || req.body.imagen_fondo || distrito.imagen_fondo || null;

        const updatedDistrito = await distritoModel.updateDistrito(id, {
            nombre: nombre.trim(),
            provincia_id: provinciaId,
            area_km2,
            poblacion_aprox,
            altitud_msnm: altitud_msnm || null,
            tipo_zona: tipo_zona || null,
            servicios_basicos: servicios_basicos || null,
            nivel_desarrollo: nivel_desarrollo || null,
            descripcion: descripcion || null,
            imagen_fondo,
        });

        await cleanupReplacedImages(distrito, updatedDistrito, ['imagen_fondo']);

        res.json({
            message: "Distrito actualizado exitosamente",
            distrito: updatedDistrito,
        });
    } catch (error) {
      return handleControllerError(error, req, res, 'Error al actualizar distrito');
    }
};

// ELIMINAR DISTRITO (solo admin)
export const deleteDistrito = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({ error: "ID de distrito inválido" });
        }

        const deletedDistrito = await distritoModel.deleteDistrito(id);

        if (!deletedDistrito) {
            return res.status(404).json({ error: "Distrito no encontrado" });
        }

        await cleanupResourceImages(deletedDistrito, ['imagen_fondo']);

        res.json({
            message: "Distrito eliminado exitosamente",
            distrito: deletedDistrito,
        });
    } catch (error) {
      return handleControllerError(error, req, res, 'Error al eliminar distrito');
    }
};
