const incidenciaService = require("./incidencia.service");
const asyncHandler = require("../../middleware/asyncHandler");
const { toIncidenciaDTO, toIncidenciaListDTO } = require("./incidencia.mapper");
const logger = require("../../utils/logger");

const incidencia_controller = {
  // LISTAR TODOS
  getAllIncidencias: asyncHandler(async (req, res) => {
    logger.info("Consultando listado de incidencias");

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || null;
    const prioridad = req.query.prioridad || null;
    const sort = req.query.sort || "id_incidencia";
    const dir = req.query.dir === "asc" ? "asc" : "desc";

    const result = await incidenciaService.getAllIncidencias({
      page,
      limit,
      search,
      prioridad,
      sort,
      dir,
    });

    return res.success(
      {
        ...result,
        data: toIncidenciaListDTO(result.data),
      },
      "Listado de incidencias",
    );
  }),

  // OBTENER POR ID
  getIncidenciaById: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const id_incidencia = parseInt(id);

    if (isNaN(id_incidencia)) {
      return res.badRequest("ID inválido");
    }

    const incidencia = await incidenciaService.getIncidenciaById(id_incidencia);

    if (!incidencia) {
      return res.notFound("Incidencia no encontrada");
    }

    return res.success(
      toIncidenciaDTO(incidencia),
      "Incidencia obtenida correctamente",
    );
  }),

  // CREAR
  createIncidencia: asyncHandler(async (req, res) => {
    const { id_activo, titulo, detalle, prioridad, fecha_reporte } = req.body;

    const creado = await incidenciaService.createIncidencia({
      id_activo,
      titulo,
      detalle: detalle ?? null,
      prioridad: prioridad ?? null,
      fecha_reporte: fecha_reporte || new Date(),
      creado_por: req.user.id_usuario,
    });

    return res.created(
      toIncidenciaDTO(creado),
      "Incidencia creada correctamente",
    );
  }),

  // ACTUALIZAR
  updateIncidencia: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const id_incidencia = parseInt(id);

    if (isNaN(id_incidencia)) {
      return res.badRequest("ID inválido");
    }

    const actualizado = await incidenciaService.updateIncidencia(
      id_incidencia,
      {
        ...req.body,
        modificado_por: req.user.id_usuario,
      },
    );

    if (!actualizado) {
      return res.notFound("Incidencia no encontrada o no actualizada");
    }

    return res.success(null, "Incidencia actualizada correctamente");
  }),

  // ELIMINAR
  deleteIncidencia: asyncHandler(async (req, res) => {
    const id_incidencia = parseInt(req.params.id);

    if (isNaN(id_incidencia)) {
      return res.badRequest("ID inválido");
    }

    const eliminado = await incidenciaService.deleteIncidencia(id_incidencia);

    if (!eliminado) {
      return res.notFound("Incidencia no encontrada o no eliminada");
    }

    return res.success(null, "Incidencia eliminada correctamente");
  }),
};

module.exports = incidencia_controller;
