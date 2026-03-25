const productoSalonService = require("./producto_salon.service");
const asyncHandler = require("../../middleware/asyncHandler");
const {
  toProductoSalonDTO,
  toProductoSalonListDTO,
} = require("./producto_salon.mapper");
const logger = require("../../utils/logger");

const producto_salon_controller = {
  // LISTAR TODOS
  getAllProductosSalon: asyncHandler(async (req, res) => {
    logger.info("Consultando listado de productos de salon");

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || null;
    const sort = req.query.sort || "id_producto";
    const dir = req.query.dir === "asc" ? "asc" : "desc";

    const result = await productoSalonService.getAllProductosSalon({
      page,
      limit,
      search,
      sort,
      dir,
    });

    return res.success(
      {
        ...result,
        data: toProductoSalonListDTO(result.data),
      },
      "Listado de productos de salon",
    );
  }),

  // OBTENER POR ID
  getProductoSalonById: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const id_producto = parseInt(id);

    if (isNaN(id_producto)) {
      return res.badRequest("ID inválido");
    }

    const producto =
      await productoSalonService.getProductoSalonById(id_producto);

    if (!producto) {
      return res.notFound("Producto de salon no encontrado");
    }

    return res.success(
      toProductoSalonDTO(producto),
      "Producto de salon obtenido correctamente",
    );
  }),

  // CREAR
  createProductoSalon: asyncHandler(async (req, res) => {
    const {
      id_activo,
      codi_barras,
      id_marca,
      stock_actual,
      stock_minimo,
      contenido_neto,
    } = req.body;

    const creado = await productoSalonService.createProductoSalon({
      id_activo,
      codi_barras: codi_barras ?? null,
      id_marca,
      stock_actual: stock_actual ?? 0,
      stock_minimo: stock_minimo ?? 5,
      contenido_neto: contenido_neto ?? null,
      creado_por: req.user.id_usuario,
    });

    return res.created(
      toProductoSalonDTO(creado),
      "Producto de salon creado correctamente",
    );
  }),

  // ACTUALIZAR
  updateProductoSalon: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const id_producto = parseInt(id);

    if (isNaN(id_producto)) {
      return res.badRequest("ID inválido");
    }

    const actualizado = await productoSalonService.updateProductoSalon(
      id_producto,
      {
        ...req.body,
        modificado_por: req.user.id_usuario,
      },
    );

    if (!actualizado) {
      return res.notFound("Producto de salon no encontrado o no actualizado");
    }

    return res.success(null, "Producto de salon actualizado correctamente");
  }),

  // ELIMINAR
  deleteProductoSalon: asyncHandler(async (req, res) => {
    const id_producto = parseInt(req.params.id);

    if (isNaN(id_producto)) {
      return res.badRequest("ID inválido");
    }

    const eliminado =
      await productoSalonService.deleteProductoSalon(id_producto);

    if (!eliminado) {
      return res.notFound("Producto de salon no encontrado o no eliminado");
    }

    return res.success(null, "Producto de salon eliminado correctamente");
  }),
};

module.exports = producto_salon_controller;
