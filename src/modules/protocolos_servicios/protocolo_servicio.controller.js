const protocoloServicioService = require("./protocolo_servicio.service");
const asyncHandler = require("../../middleware/asyncHandler");
const {
  toProtocoloServicioDTO,
  toProtocoloServicioListDTO,
} = require("./protocolo_servicio.mapper");
const logger = require("../../utils/logger");

const protocolo_servicio_controller = {
  // LISTAR TODOS
  getAllProtocolosServicios: asyncHandler(async (req, res) => {
    logger.info("Consultando listado de protocolos de servicio");

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || null;
    const sort = req.query.sort || "id_protocolo";
    const dir = req.query.dir === "asc" ? "asc" : "desc";

    const result = await protocoloServicioService.getAllProtocolosServicios({
      page,
      limit,
      search,
      sort,
      dir,
    });

    return res.success(
      {
        ...result,
        data: toProtocoloServicioListDTO(result.data),
      },
      "Listado de protocolos de servicio",
    );
  }),

  // OBTENER POR ID
  getProtocoloServicioById: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const id_protocolo = parseInt(id);

    if (isNaN(id_protocolo)) {
      return res.badRequest("ID inválido");
    }

    const protocolo =
      await protocoloServicioService.getProtocoloServicioById(id_protocolo);

    if (!protocolo) {
      return res.notFound("Protocolo de servicio no encontrado");
    }

    return res.success(
      toProtocoloServicioDTO(protocolo),
      "Protocolo de servicio obtenido correctamente",
    );
  }),

  // CREAR
  createProtocoloServicio: asyncHandler(async (req, res) => {
    const {
      id_activo,
      paso_a_paso,
      tiempo_estimado_min,
      precauciones,
      herramientas_necesarias,
    } = req.body;

    const creado = await protocoloServicioService.createProtocoloServicio({
      id_activo,
      paso_a_paso,
      tiempo_estimado_min: tiempo_estimado_min ?? null,
      precauciones: precauciones ?? null,
      herramientas_necesarias: herramientas_necesarias ?? null,
      creado_por: req.user.id_usuario,
    });

    return res.created(
      toProtocoloServicioDTO(creado),
      "Protocolo de servicio creado correctamente",
    );
  }),

  // ACTUALIZAR
  updateProtocoloServicio: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const id_protocolo = parseInt(id);

    if (isNaN(id_protocolo)) {
      return res.badRequest("ID inválido");
    }

    const actualizado = await protocoloServicioService.updateProtocoloServicio(
      id_protocolo,
      {
        ...req.body,
        modificado_por: req.user.id_usuario,
      },
    );

    if (!actualizado) {
      return res.notFound(
        "Protocolo de servicio no encontrado o no actualizado",
      );
    }

    return res.success(null, "Protocolo de servicio actualizado correctamente");
  }),

  // ELIMINAR
  deleteProtocoloServicio: asyncHandler(async (req, res) => {
    const id_protocolo = parseInt(req.params.id);

    if (isNaN(id_protocolo)) {
      return res.badRequest("ID inválido");
    }

    const eliminado =
      await protocoloServicioService.deleteProtocoloServicio(id_protocolo);

    if (!eliminado) {
      return res.notFound("Protocolo de servicio no encontrado o no eliminado");
    }

    return res.success(null, "Protocolo de servicio eliminado correctamente");
  }),
};

module.exports = protocolo_servicio_controller;
