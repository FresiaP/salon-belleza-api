const empleado_model = require("../models/empleado_model");

const empleado_controller = {
    async getAllEmpleados(req, res, next) {
        try {
            const datos = await empleado_model.getEmpleados();
            res.json({ success: true, data: datos });
        } catch (error) {
            next(error);
        }
    },

    async getEmpleadoById(req, res, next) {
        try {
            const { id } = req.params;
            const id_empleado = parseInt(id);
            if (isNaN(id_empleado)) {
                return res.status(400).json({ success: false, message: "ID inválido" });
            }

            const empleado = await empleado_model.getEmpleadoById(id_empleado);
            if (!empleado) {
                return res.status(404).json({ success: false, message: "Empleado no encontrado" });
            }

            res.json({ success: true, data: empleado });
        } catch (error) {
            next(error);
        }
    },

    async createEmpleado(req, res, next) {
        try {
            const { nombre_empleado, fecha_nacimiento, telefono, domicilio, id_especialidad } = req.body;
            if (!nombre_empleado || !fecha_nacimiento || !telefono || !domicilio || !id_especialidad) {
                return res.status(400).json({ success: false, message: "Faltan campos obligatorios" });
            }

            const creado = await empleado_model.createEmpleado({ nombre_empleado, fecha_nacimiento, telefono, domicilio, id_especialidad });
            if (!creado) {
                return res.status(400).json({ success: false, message: "No se pudo crear el empleado" });
            }

            res.status(201).json({ success: true, message: "Empleado creado correctamente" });
        } catch (error) {
            next(error);
        }
    },

    async updateEmpleado(req, res, next) {
        try {
            const { id } = req.params;
            const { nombre_empleado, fecha_nacimiento, telefono, domicilio, id_especialidad } = req.body;
            const actualizado = await empleado_model.updateEmpleado(parseInt(id), { nombre_empleado, fecha_nacimiento, telefono, domicilio, id_especialidad });
            if (!actualizado) {
                return res.status(404).json({ success: false, message: "Empleado no encontrado o no actualizado" });
            }
            res.json({ success: true, message: "Empleado actualizado correctamente" });
        } catch (error) {
            next(error);
        }
    },

    async deleteEmpleado(req, res, next) {
        try {
            const { id } = req.params;
            const eliminado = await empleado_model.deleteEmpleado(parseInt(id));
            if (!eliminado) {
                return res.status(404).json({ success: false, message: "Empleado no encontrado o no eliminado" });
            }
            res.json({ success: true, message: "Empleado eliminado correctamente" });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = empleado_controller;
