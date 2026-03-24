const tipoActivoService = require("./tipo_activo.service");
const asyncHandler = require("../../middleware/asyncHandler");
const {
  toTipoActivoDTO,
  toTipoActivoListDTO,
} = require("./tipo_activo.mapper");
const logger = require("../../utils/logger");

const tipo_activo_controller = {
  // LISTAR TODOS
  getAllTiposActivos: asyncHandler(async (req, res) => {
    logger.info("Consultando listado de tipos de activo");

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || null;
    const sort = req.query.sort || "id_tipo_activo";
    const dir = req.query.dir === "asc" ? "asc" : "desc";

    const result = await tipoActivoService.getAllTiposActivos({
      page,
      limit,
      search,
      sort,
      dir,
    });

    return res.success(
      {
        ...result,
        data: toTipoActivoListDTO(result.data),
      },
      "Listado de tipos de activo",
    );
  }),

  // OBTENER POR ID
  getTipoActivoById: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const id_tipo_activo = parseInt(id);

    if (isNaN(id_tipo_activo)) {
      return res.badRequest("ID inválido");
    }

    const tipoActivo =
      await tipoActivoService.getTipoActivoById(id_tipo_activo);

    if (!tipoActivo) {
      return res.notFound("Tipo de activo no encontrado");
    }

    return res.success(
      toTipoActivoDTO(tipoActivo),
      "Tipo de activo obtenido correctamente",
    );
  }),

  // CREAR
  createTipoActivo: asyncHandler(async (req, res) => {
    const { nombre } = req.body;

    const creado = await tipoActivoService.createTipoActivo({
      nombre,
      creado_por: req.user.id_usuario,
    });

    return res.created(
      toTipoActivoDTO(creado),
      "Tipo de activo creado correctamente",
    );
  }),

  // ACTUALIZAR
  updateTipoActivo: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const id_tipo_activo = parseInt(id);

    if (isNaN(id_tipo_activo)) {
      return res.badRequest("ID inválido");
    }

    const actualizado = await tipoActivoService.updateTipoActivo(
      id_tipo_activo,
      {
        ...req.body,
        modificado_por: req.user.id_usuario,
      },
    );

    if (!actualizado) {
      return res.notFound("Tipo de activo no encontrado o no actualizado");
    }

    return res.success(null, "Tipo de activo actualizado correctamente");
  }),

  // ELIMINAR
  deleteTipoActivo: asyncHandler(async (req, res) => {
    const id_tipo_activo = parseInt(req.params.id);

    if (isNaN(id_tipo_activo)) {
      return res.badRequest("ID inválido");
    }

    const eliminado = await tipoActivoService.deleteTipoActivo(id_tipo_activo);

    if (!eliminado) {
      return res.notFound("Tipo de activo no encontrado o no eliminado");
    }

    return res.success(null, "Tipo de activo eliminado correctamente");
  }),
};

module.exports = tipo_activo_controller;
