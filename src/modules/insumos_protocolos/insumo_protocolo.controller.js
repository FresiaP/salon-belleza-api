const insumoProtocoloService = require("./insumo_protocolo.service");
const asyncHandler = require("../../middleware/asyncHandler");
const {
  toInsumoProtocoloDTO,
  toInsumoProtocoloListDTO,
} = require("./insumo_protocolo.mapper");
const logger = require("../../utils/logger");

const insumo_protocolo_controller = {
  // LISTAR TODOS
  getAllInsumosProtocolo: asyncHandler(async (req, res) => {
    logger.info("Consultando listado de insumos de protocolo");

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || null;
    const sort = req.query.sort || "id_insumo";
    const dir = req.query.dir === "asc" ? "asc" : "desc";

    const result = await insumoProtocoloService.getAllInsumosProtocolo({
      page,
      limit,
      search,
      sort,
      dir,
    });

    return res.success(
      {
        ...result,
        data: toInsumoProtocoloListDTO(result.data),
      },
      "Listado de insumos de protocolo",
    );
  }),

  // OBTENER POR ID
  getInsumoProtocoloById: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const id_insumo = parseInt(id);

    if (isNaN(id_insumo)) {
      return res.badRequest("ID inválido");
    }

    const insumo =
      await insumoProtocoloService.getInsumoProtocoloById(id_insumo);

    if (!insumo) {
      return res.notFound("Insumo de protocolo no encontrado");
    }

    return res.success(
      toInsumoProtocoloDTO(insumo),
      "Insumo de protocolo obtenido correctamente",
    );
  }),

  // CREAR
  createInsumoProtocolo: asyncHandler(async (req, res) => {
    const { id_protocolo, id_activo_producto, cantidad_sugerida } = req.body;

    const creado = await insumoProtocoloService.createInsumoProtocolo({
      id_protocolo,
      id_activo_producto,
      cantidad_sugerida: cantidad_sugerida ?? null,
      creado_por: req.user.id_usuario,
    });

    return res.created(
      toInsumoProtocoloDTO(creado),
      "Insumo de protocolo creado correctamente",
    );
  }),

  // ACTUALIZAR
  updateInsumoProtocolo: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const id_insumo = parseInt(id);

    if (isNaN(id_insumo)) {
      return res.badRequest("ID inválido");
    }

    const actualizado = await insumoProtocoloService.updateInsumoProtocolo(
      id_insumo,
      {
        ...req.body,
        modificado_por: req.user.id_usuario,
      },
    );

    if (!actualizado) {
      return res.notFound("Insumo de protocolo no encontrado o no actualizado");
    }

    return res.success(null, "Insumo de protocolo actualizado correctamente");
  }),

  // ELIMINAR
  deleteInsumoProtocolo: asyncHandler(async (req, res) => {
    const id_insumo = parseInt(req.params.id);

    if (isNaN(id_insumo)) {
      return res.badRequest("ID inválido");
    }

    const eliminado =
      await insumoProtocoloService.deleteInsumoProtocolo(id_insumo);

    if (!eliminado) {
      return res.notFound("Insumo de protocolo no encontrado o no eliminado");
    }

    return res.success(null, "Insumo de protocolo eliminado correctamente");
  }),
};

module.exports = insumo_protocolo_controller;
