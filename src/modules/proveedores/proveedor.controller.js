const proveedorService = require("./proveedor.service");
const asyncHandler = require("../../middleware/asyncHandler");
const { toProveedorDTO, toProveedorListDTO } = require("./proveedor.mapper");
const logger = require("../../utils/logger");
const { es } = require("zod/v4/locales");

const proveedor_controller = {
  // LISTAR TODOS
  getAllProveedores: asyncHandler(async (req, res) => {
    logger.info("Consultando listado de proveedores");

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || null;
    const estado = req.query.estado;
    const sort = req.query.sort || "id_proveedor";
    const dir = req.query.dir === "asc" ? "asc" : "desc";

    const result = await proveedorService.getAllProveedores({
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
        data: toProveedorListDTO(result.data),
      },
      "Listado de proveedores",
    );
  }),

  // OBTENER POR ID
  getProveedorById: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const id_proveedor = parseInt(id);

    if (isNaN(id_proveedor)) {
      return res.badRequest("ID inválido");
    }

    const proveedor = await proveedorService.getProveedorById(id_proveedor);
    if (!proveedor) {
      return res.notFound("Proveedor no encontrado");
    }

    return res.success(
      toProveedorDTO(proveedor),
      "Proveedor obtenido correctamente",
    );
  }),

  // CREAR
  createProveedor: asyncHandler(async (req, res) => {
    const {
      razon_social,
      contacto_nombre,
      telefono,
      email,
      direccion,
      ruc_cedula,
    } = req.body;

    const creado = await proveedorService.createProveedor({
      razon_social,
      contacto_nombre,
      telefono,
      email,
      direccion,
      ruc_cedula,
      estado: true, // Por defecto activo
      creado_por: req.user.id_usuario,
    });

    return res.success(
      toProveedorDTO(creado),
      "Proveedor creado correctamente",
    );
  }),

  // ACTUALIZAR
  updateProveedor: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const actualizado = await proveedorService.updateProveedor(parseInt(id), {
      ...req.body,
      modificado_por: req.user.id_usuario,
    });

    if (!actualizado) {
      return res.notFound("Proveedor no encontrado o no actualizado");
    }

    return res.success(null, "Proveedor actualizado correctamente");
  }),

  // ACTUALIZAR SOLO ESTADO
  updateEstado: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const id_proveedor = parseInt(id);

    if (isNaN(id_proveedor)) {
      return res.badRequest("ID de proveedor inválido");
    }

    const { estado } = req.body;
    const modificado_por = req.user.id_usuario;

    const actualizado = await proveedorService.updateEstado({
      id_proveedor,
      estado,
      modificado_por,
    });

    if (!actualizado) {
      return res.notFound("Proveedor no encontrado o no actualizado");
    }

    return res.success(null, "Estado del proveedor actualizado correctamente");
  }),

  // ELIMINAR
  deleteProveedor: asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);

    const eliminado = await proveedorService.deleteProveedor(id);

    if (!eliminado) {
      return res.notFound("Proveedor no encontrado o no eliminado");
    }

    return res.success(null, "Proveedor eliminado correctamente");
  }),
};

module.exports = proveedor_controller;
