const activoService = require("./activo.service");
const asyncHandler = require("../../middleware/asyncHandler");
const { toActivoDTO, toActivoListDTO } = require("./activo.mapper");
const logger = require("../../utils/logger");

const activo_controller = {
  // LISTAR TODOS
  getAllActivos: asyncHandler(async (req, res) => {
    logger.info("Consultando listado de activos");

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || null;
    const id_estado_activo = req.query.id_estado_activo;
    const sort = req.query.sort || "id_activo";
    const dir = req.query.dir === "asc" ? "asc" : "desc";

    const result = await activoService.getAllActivos({
      page,
      limit,
      search,
      id_estado_activo,
      sort,
      dir,
    });

    return res.success(
      {
        ...result,
        data: toActivoListDTO(result.data),
      },
      "Listado de activos",
    );
  }),

  // OBTENER POR ID
  getActivoById: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const id_activo = parseInt(id);

    if (isNaN(id_activo)) {
      return res.badRequest("ID inválido");
    }

    const activo = await activoService.getActivoById(id_activo);
    if (!activo) {
      return res.notFound("Activo no encontrado");
    }

    return res.success(toActivoDTO(activo), "Activo obtenido correctamente");
  }),

  // CREAR
  createActivo: asyncHandler(async (req, res) => {
    const {
      id_tipo_activo,
      id_proveedor,
      nombre_identificador,
      descripcion,
      precio_base,
      id_estado_activo,
      fecha_registro,
    } = req.body;

    const creado = await activoService.createActivo({
      id_tipo_activo,
      id_proveedor: id_proveedor ?? null,
      nombre_identificador,
      descripcion: descripcion ?? null,
      precio_base: precio_base ?? 0,
      id_estado_activo: id_estado_activo ?? 1,
      fecha_registro: fecha_registro || new Date(),
      creado_por: req.user.id_usuario,
    });

    return res.created(toActivoDTO(creado), "Activo creado correctamente");
  }),

  // ACTUALIZAR
  updateActivo: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const id_activo = parseInt(id);

    if (isNaN(id_activo)) {
      return res.badRequest("ID inválido");
    }

    const actualizado = await activoService.updateActivo(id_activo, {
      ...req.body,
      modificado_por: req.user.id_usuario,
    });

    if (!actualizado) {
      return res.notFound("Activo no encontrado o no actualizado");
    }

    return res.success(null, "Activo actualizado correctamente");
  }),

  // ACTUALIZAR SOLO ESTADO
  updateEstado: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const id_activo = parseInt(id);

    if (isNaN(id_activo)) {
      return res.badRequest("ID de activo inválido");
    }

    const { id_estado_activo } = req.body;

    const actualizado = await activoService.updateEstado({
      id_activo,
      id_estado_activo,
      modificado_por: req.user.id_usuario,
    });

    if (!actualizado) {
      return res.notFound("Activo no encontrado o no actualizado");
    }

    return res.success(null, "Estado del activo actualizado correctamente");
  }),

  // ELIMINAR
  deleteActivo: asyncHandler(async (req, res) => {
    const id_activo = parseInt(req.params.id);

    if (isNaN(id_activo)) {
      return res.badRequest("ID inválido");
    }

    const eliminado = await activoService.deleteActivo(id_activo);

    if (!eliminado) {
      return res.notFound("Activo no encontrado o no eliminado");
    }

    return res.success(null, "Activo eliminado correctamente");
  }),
};

module.exports = activo_controller;
