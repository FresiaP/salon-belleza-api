const especialidadService = require("./especialidad.service");
const asyncHandler = require("../../middleware/asyncHandler");
const {
  toEspecialidadDTO,
  toEspecialidadListDTO,
} = require("./especialidad.mapper");
const logger = require("../../utils/logger");

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
      dir,
    });

    return res.success(
      {
        ...result,
        data: toEspecialidadListDTO(result.data),
      },
      "Listado de especialidades",
    );
  }),

  // OBTENER POR ID
  getEspecialidadById: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const id_especialidad = parseInt(id);

    if (isNaN(id_especialidad)) {
      return res.badRequest("ID inválido");
    }

    const especialidad =
      await especialidadService.getEspecialidadById(id_especialidad);
    if (!especialidad) {
      return res.notFound("Especialidad no encontrada");
    }

    return res.success(
      toEspecialidadDTO(especialidad),
      "Especialidad obtenida correctamente",
    );
  }),

  // CREAR
  createEspecialidad: asyncHandler(async (req, res) => {
    const { nombre_especialidad } = req.body;

    const creado = await especialidadService.createEspecialidad({
      nombre_especialidad,
      estado: true,
      creado_por: req.user.id_usuario,
    });

    return res.success(
      toEspecialidadDTO(creado),
      "Especialidad creada correctamente",
    );
  }),

  // ACTUALIZAR
  updateEspecialidad: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const actualizado = await especialidadService.updateEspecialidad(
      parseInt(id),
      {
        ...req.body,
        modificado_por: req.user.id_usuario,
      },
    );

    if (!actualizado) {
      return res.notFound("Especialidad no encontrada o no actualizada");
    }

    return res.success(null, "Especialidad actualizada correctamente");
  }),

  // ACTUALIZAR SOLO ESTADO
  updateEstado: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const id_especialidad = parseInt(id);

    if (isNaN(id_especialidad)) {
      return res.badRequest("ID de especialidad inválido");
    }

    const { estado } = req.body;
    const modificado_por = req.user.id_usuario;

    const actualizado = await especialidadService.updateEstado({
      id_especialidad,
      estado,
      modificado_por,
    });

    if (!actualizado) {
      return res.notFound("Especialidad no encontrada o no actualizada");
    }

    return res.success(
      null,
      "Estado de la especialidad actualizado correctamente",
    );
  }),

  // ELIMINAR
  deleteEspecialidad: asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);

    const eliminado = await especialidadService.deleteEspecialidad(id);

    if (!eliminado) {
      return res.notFound("Especialidad no encontrada o no eliminada");
    }

    return res.success(null, "Especialidad eliminada correctamente");
  }),
};

module.exports = especialidad_controller;
