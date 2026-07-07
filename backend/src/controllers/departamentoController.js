import * as departamentoModel from '../models/departamentoModel.js';

//OBTENER TODOS LOS DEPARTAMENTOS
export const getDepartamentos = async (req, res) => {
    try {
        const departamentos = await departamentoModel.getAllDepartamentos();
        res.json(departamentos);
    }
    catch (error) {
        console.error('Error al obtener departamentos:', error);
        res.status(500).json({ message: 'Error al obtener departamentos' });
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
            return res.status(404).json({ error: 'Departamento no encontrado' });
        }

        res.json(departamento);
    }
    catch (error) {
        console.error('Error en getDepartamentoById:', error);
        res.status(500).json({ error: 'Error al obtener departamento' });
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
        });

        res.status(201).json({
            message: "Departamento creado exitosamente",
            departamento: newDepartamento,
        });
    } catch (error) {
        console.error("Error en createDepartamento:", error);
        res.status(500).json({ error: "Error al crear departamento" });
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
            ...req.body,
            imagen_fondo,
        });

        res.json({
            message: "Departamento actualizado exitosamente",
            departamento: updatedDepartamento,
        });
    } catch (error) {
        console.error("Error en updateDepartamento:", error);
        res.status(500).json({ error: "Error al actualizar departamento" });
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

        res.json({
            message: 'Departamento eliminado exitosamente',
            departamento: deletedDepartamento
        });
    }
    catch (error) {
        console.error('Error en deleteDepartamento:', error);
        res.status(500).json({ error: 'Error al eliminar departamento' });
    }
};