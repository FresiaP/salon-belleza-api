const estadoActivoService = require("./estado_activo.service");
const asyncHandler = require("../../middleware/asyncHandler");
const {
  toEstadoActivoDTO,
  toEstadoActivoListDTO,
} = require("./estado_activo.mapper");
const logger = require("../../utils/logger");

const estado_activo_controller = {
  // LISTAR TODOS
  getAllEstadosActivos: asyncHandler(async (req, res) => {
    logger.info("Consultando listado de estados de activo");

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || null;
    const sort = req.query.sort || "id_estado_activo";
    const dir = req.query.dir === "asc" ? "asc" : "desc";

    const result = await estadoActivoService.getAllEstadosActivos({
      page,
      limit,
      search,
      sort,
      dir,
    });

    return res.success(
      {
        ...result,
        data: toEstadoActivoListDTO(result.data),
      },
      "Listado de estados de activo",
    );
  }),

  // OBTENER POR ID
  getEstadoActivoById: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const id_estado_activo = parseInt(id);

    if (isNaN(id_estado_activo)) {
      return res.badRequest("ID inválido");
    }

    const estadoActivo =
      await estadoActivoService.getEstadoActivoById(id_estado_activo);

    if (!estadoActivo) {
      return res.notFound("Estado de activo no encontrado");
    }

    return res.success(
      toEstadoActivoDTO(estadoActivo),
      "Estado de activo obtenido correctamente",
    );
  }),

  // CREAR
  createEstadoActivo: asyncHandler(async (req, res) => {
    const { nombre_estado } = req.body;

    const creado = await estadoActivoService.createEstadoActivo({
      nombre_estado,
      creado_por: req.user.id_usuario,
    });

    return res.created(
      toEstadoActivoDTO(creado),
      "Estado de activo creado correctamente",
    );
  }),

  // ACTUALIZAR
  updateEstadoActivo: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const id_estado_activo = parseInt(id);

    if (isNaN(id_estado_activo)) {
      return res.badRequest("ID inválido");
    }

    const actualizado = await estadoActivoService.updateEstadoActivo(
      id_estado_activo,
      {
        ...req.body,
        modificado_por: req.user.id_usuario,
      },
    );

    if (!actualizado) {
      return res.notFound("Estado de activo no encontrado o no actualizado");
    }

    return res.success(null, "Estado de activo actualizado correctamente");
  }),

  // ELIMINAR
  deleteEstadoActivo: asyncHandler(async (req, res) => {
    const id_estado_activo = parseInt(req.params.id);

    if (isNaN(id_estado_activo)) {
      return res.badRequest("ID inválido");
    }

    const eliminado =
      await estadoActivoService.deleteEstadoActivo(id_estado_activo);

    if (!eliminado) {
      return res.notFound("Estado de activo no encontrado o no eliminado");
    }

    return res.success(null, "Estado de activo eliminado correctamente");
  }),
};

module.exports = estado_activo_controller;
