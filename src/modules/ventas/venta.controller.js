const ventaService = require("./venta.service");
const asyncHandler = require("../../middleware/asyncHandler");
const { toVentaDTO, toVentaListDTO } = require("./venta.mapper");
const logger = require("../../utils/logger");

const venta_controller = {
  // LISTAR TODOS
  getAllVentas: asyncHandler(async (req, res) => {
    logger.info("Consultando listado de ventas");

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || null;
    const sort = req.query.sort || "id_venta";
    const dir = req.query.dir === "asc" ? "asc" : "desc";

    const result = await ventaService.getAllVentas({
      page,
      limit,
      search,
      sort,
      dir,
    });

    return res.success(
      {
        ...result,
        data: toVentaListDTO(result.data),
      },
      "Listado de ventas",
    );
  }),

  // OBTENER POR ID
  getVentaById: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const id_venta = parseInt(id);

    if (isNaN(id_venta)) {
      return res.badRequest("ID inválido");
    }

    const venta = await ventaService.getVentaById(id_venta);

    if (!venta) {
      return res.notFound("Venta no encontrada");
    }

    return res.success(toVentaDTO(venta), "Venta obtenida correctamente");
  }),

  // CREAR
  createVenta: asyncHandler(async (req, res) => {
    const { id_cliente, id_empleado, fecha_venta, total_venta } = req.body;

    const creado = await ventaService.createVenta({
      id_cliente,
      id_empleado,
      fecha_venta: fecha_venta || new Date(),
      total_venta: total_venta ?? 0,
      creado_por: req.user.id_usuario,
    });

    return res.created(toVentaDTO(creado), "Venta creada correctamente");
  }),

  // ACTUALIZAR
  updateVenta: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const id_venta = parseInt(id);

    if (isNaN(id_venta)) {
      return res.badRequest("ID inválido");
    }

    const actualizado = await ventaService.updateVenta(id_venta, {
      ...req.body,
      modificado_por: req.user.id_usuario,
    });

    if (!actualizado) {
      return res.notFound("Venta no encontrada o no actualizada");
    }

    return res.success(null, "Venta actualizada correctamente");
  }),

  // ELIMINAR
  deleteVenta: asyncHandler(async (req, res) => {
    const id_venta = parseInt(req.params.id);

    if (isNaN(id_venta)) {
      return res.badRequest("ID inválido");
    }

    const eliminado = await ventaService.deleteVenta(id_venta);

    if (!eliminado) {
      return res.notFound("Venta no encontrada o no eliminada");
    }

    return res.success(null, "Venta eliminada correctamente");
  }),
};

module.exports = venta_controller;
