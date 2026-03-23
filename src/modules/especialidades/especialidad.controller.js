const especialidadService = require("./especialidad.service");
const asyncHandler = require("../../middleware/async_handler");
const logger = require("../../utils/logger");
const response = require("../../utils/response");

const especialidad_controller = {
    // LISTAR TODOS
    getAllEspecialidades: asyncHandler(async (req, res) => {
        logger.info("Consultando listado de especialidades");

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || null;
        const estado = req.query.estado;
        const sort = req.query.sort || "id_especialidad";
        const dir = req.query.dir === "asc" ? "asc" : "desc";

        const result = await especialidadService.getAllEspecialidades({
            page,
            limit,
            search,
            estado,
            sort,
            dir
        });

        return response.success(res, result, "Listado de especialidades obtenido");
    }),

    // OBTENER POR ID
    getEspecialidadById: asyncHandler(async (req, res) => {
        const { id } = req.params;
        const id_especialidad = parseInt(id);

        if (isNaN(id_especialidad)) {
            return res.status(400).json({ success: false, message: "ID inválido" });
        }

        const especialidad = await especialidadService.getEspecialidadById(id_especialidad);
        if (!especialidad) {
            return res.status(404).json({ success: false, message: "Especialidad no encontrada" });
        }

        return response.success(res, especialidad, "Especialidad obtenida correctamente");
    }),

    // CREAR
    createEspecialidad: asyncHandler(async (req, res) => {
        const { nombre_especialidad } = req.body;

        const creado = await especialidadService.createEspecialidad({
            nombre_especialidad,
            creado_por: req.user.id_usuario
        });

        if (!creado) {
            return res.status(400).json({ success: false, message: "No se pudo crear la especialidad" });
        }

        return response.success(res, null, "Especialidad creada correctamente", 201);
    }),

    // ACTUALIZAR
    updateEspecialidad: asyncHandler(async (req, res) => {
        const { id } = req.params;
        const actualizado = await especialidadService.updateEspecialidad(parseInt(id), {
            ...req.body,
            modificado_por: req.user.id_usuario
        });

        if (!actualizado) {
            return res.status(404).json({ success: false, message: "Especialidad no encontrada o no actualizada" });
        }

        return response.success(res, null, "Especialidad actualizada correctamente");
    }),

    // ACTUALIZAR SOLO ESTADO
    updateEstado: asyncHandler(async (req, res) => {
        const { id } = req.params;
        const id_especialidad = parseInt(id);

        if (isNaN(id_especialidad)) {
            return res.status(400).json({ success: false, message: "ID de especialidad inválido" });
        }

        const { estado } = req.body;
        const modificado_por = req.user.id_usuario;

        const actualizado = await especialidadService.updateEstado({
            id_especialidad,
            estado,
            modificado_por
        });

        if (!actualizado) {
            return res.status(404).json({ success: false, message: "Especialidad no encontrada o no actualizada" });
        }

        return response.success(res, null, "Estado de la especialidad actualizado correctamente");
    }),

    // ELIMINAR
    deleteEspecialidad: asyncHandler(async (req, res) => {
        const { id } = req.params;

        try {
            const eliminado = await especialidadService.deleteEspecialidad(parseInt(id));

            if (!eliminado) {
                return res.status(404).json({ success: false, message: "Especialidad no encontrada o no eliminada" });
            }

            return response.success(res, null, "Especialidad eliminada correctamente");
        } catch (error) {
            // Captura error de FK
            if (error.message.includes("asociado")) {
                return res.status(400).json({ success: false, message: error.message });
            }
            throw error;
        }
    })
};

module.exports = especialidad_controller;
