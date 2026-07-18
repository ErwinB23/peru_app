import * as departamentoModel from '../models/departamentoModel.js';
import { AppError, handleControllerError } from '../utils/httpErrors.js';
import { cleanupReplacedImages, cleanupResourceImages } from '../utils/imageLifecycle.js';

//OBTENER TODOS LOS DEPARTAMENTOS
export const getDepartamentos = async (req, res) => {
    try {
        const departamentos = await departamentoModel.getAllDepartamentos();
        res.json(departamentos);
    }
    catch (error) {
      return handleControllerError(error, req, res, 'Error al obtener departamentos');
    }
};

// OBTENER DEPARTAMENTO POR ID
export const getDepartamentoById = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({ error: 'ID de departamento inválido' });
        }

        const departamento = await departamentoModel.getDepartamentoById(id);

        if (!departamento) {
            throw new AppError(
                'Departamento no encontrado',
                404,
                'RESOURCE_NOT_FOUND'
            );
        }

        res.json(departamento);
    }
    catch (error) {
      return handleControllerError(error, req, res, 'Error al obtener departamento');
    }
};

// CREAR DEPARTAMENTO (solo admin)
export const createDepartamento = async (req, res) => {
    try {
        const imagen_fondo = req.file
            ? `/uploads/departamentos/${req.file.filename}`
            : req.body.imagen_fondo || null;

        const newDepartamento = await departamentoModel.createDepartamento({
            ...req.body,
            imagen_fondo,
            introduccion: req.body.introduccion || null,
        });

        res.status(201).json({
            message: "Departamento creado exitosamente",
            departamento: newDepartamento,
        });
    } catch (error) {
      return handleControllerError(error, req, res, 'Error al crear departamento');
    }
};


// ACTUALIZAR DEPARTAMENTO (solo admin)
export const updateDepartamento = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({ error: "ID de departamento inválido" });
        }

        const departamentoActual = await departamentoModel.getDepartamentoById(id);

        if (!departamentoActual) {
            return res.status(404).json({ error: "Departamento no encontrado" });
        }

        const imagen_fondo = req.file
            ? `/uploads/departamentos/${req.file.filename}`
            : req.body.imagen_fondo || departamentoActual.imagen_fondo || null;

        const updatedDepartamento = await departamentoModel.updateDepartamento(id, {
            ...departamentoActual,
            ...req.body,
            imagen_fondo,
            introduccion:
                req.body.introduccion !== undefined
                    ? req.body.introduccion
                    : departamentoActual.introduccion || null,
        });

        await cleanupReplacedImages(departamentoActual, updatedDepartamento, ['imagen_fondo']);

        res.json({
            message: "Departamento actualizado exitosamente",
            departamento: updatedDepartamento,
        });
    } catch (error) {
      return handleControllerError(error, req, res, 'Error al actualizar departamento');
    }
};
// ELIMINAR DEPARTAMENTO (solo admin)
export const deleteDepartamento = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({ error: 'ID de departamento inválido' });
        }

        const deletedDepartamento = await departamentoModel.deleteDepartamento(id);

        if (!deletedDepartamento) {
            return res.status(404).json({ error: 'Departamento no encontrado' });
        }

        await cleanupResourceImages(deletedDepartamento, ['imagen_fondo']);

        res.json({
            message: 'Departamento eliminado exitosamente',
            departamento: deletedDepartamento
        });
    }
    catch (error) {
      return handleControllerError(error, req, res, 'Error al eliminar departamento');
    }
};