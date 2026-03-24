const detalleVentaService = require("./detalle_venta.service");
const asyncHandler = require("../../middleware/asyncHandler");
const {
  toDetalleVentaDTO,
  toDetalleVentaListDTO,
} = require("./detalle_venta.mapper");
const logger = require("../../utils/logger");

const detalle_venta_controller = {
  // LISTAR TODOS
  getAllDetallesVenta: asyncHandler(async (req, res) => {
    logger.info("Consultando listado de detalles de venta");

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || null;
    const sort = req.query.sort || "id_detalle";
    const dir = req.query.dir === "asc" ? "asc" : "desc";

    const result = await detalleVentaService.getAllDetallesVenta({
      page,
      limit,
      search,
      sort,
      dir,
    });

    return res.success(
      {
        ...result,
        data: toDetalleVentaListDTO(result.data),
      },
      "Listado de detalles de venta",
    );
  }),

  // OBTENER POR ID
  getDetalleVentaById: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const id_detalle = parseInt(id);

    if (isNaN(id_detalle)) {
      return res.badRequest("ID inválido");
    }

    const detalle = await detalleVentaService.getDetalleVentaById(id_detalle);

    if (!detalle) {
      return res.notFound("Detalle de venta no encontrado");
    }

    return res.success(
      toDetalleVentaDTO(detalle),
      "Detalle de venta obtenido correctamente",
    );
  }),

  // CREAR
  createDetalleVenta: asyncHandler(async (req, res) => {
    const { id_venta, id_activo, cantidad, precio_unitario } = req.body;

    const creado = await detalleVentaService.createDetalleVenta({
      id_venta: id_venta ?? null,
      id_activo: id_activo ?? null,
      cantidad: cantidad ?? 1,
      precio_unitario,
      creado_por: req.user.id_usuario,
    });

    return res.created(
      toDetalleVentaDTO(creado),
      "Detalle de venta creado correctamente",
    );
  }),

  // ACTUALIZAR
  updateDetalleVenta: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const id_detalle = parseInt(id);

    if (isNaN(id_detalle)) {
      return res.badRequest("ID inválido");
    }

    const actualizado = await detalleVentaService.updateDetalleVenta(
      id_detalle,
      {
        ...req.body,
        modificado_por: req.user.id_usuario,
      },
    );

    if (!actualizado) {
      return res.notFound("Detalle de venta no encontrado o no actualizado");
    }

    return res.success(null, "Detalle de venta actualizado correctamente");
  }),

  // ELIMINAR
  deleteDetalleVenta: asyncHandler(async (req, res) => {
    const id_detalle = parseInt(req.params.id);

    if (isNaN(id_detalle)) {
      return res.badRequest("ID inválido");
    }

    const eliminado = await detalleVentaService.deleteDetalleVenta(id_detalle);

    if (!eliminado) {
      return res.notFound("Detalle de venta no encontrado o no eliminado");
    }

    return res.success(null, "Detalle de venta eliminado correctamente");
  }),
};

module.exports = detalle_venta_controller;
