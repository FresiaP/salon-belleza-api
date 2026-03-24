const clienteService = require("./cliente.service");
const asyncHandler = require("../../middleware/asyncHandler");
const { toClienteDTO, toClienteListDTO } = require("./cliente.mapper");
const logger = require("../../utils/logger");

const cliente_controller = {
  // LISTAR TODOS
  getAllClientes: asyncHandler(async (req, res) => {
    logger.info("Consultando listado de clientes");

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || null;
    const estado = req.query.estado;
    const sort = req.query.sort || "id_cliente";
    const dir = req.query.dir === "asc" ? "asc" : "desc";

    const result = await clienteService.getAllClientes({
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
        data: toClienteListDTO(result.data),
      },
      "Listado de clientes",
    );
  }),

  // OBTENER POR ID
  getClienteById: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const id_cliente = parseInt(id);

    if (isNaN(id_cliente)) {
      return res.badRequest("ID inválido");
    }

    const cliente = await clienteService.getClienteById(id_cliente);
    if (!cliente) {
      return res.notFound("Cliente no encontrado");
    }

    return res.success(toClienteDTO(cliente), "Cliente obtenido correctamente");
  }),

  // CREAR
  createCliente: asyncHandler(async (req, res) => {
    const { nombre, telefono, email, fecha_nacimiento } = req.body;

    const creado = await clienteService.createCliente({
      nombre,
      email,
      telefono,
      fecha_nacimiento,
      creado_por: req.user.id_usuario,
    });

    return res.success(toClienteDTO(creado), "Cliente creado correctamente");
  }),

  // ACTUALIZAR
  updateCliente: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const actualizado = await clienteService.updateCliente(parseInt(id), {
      ...req.body,
      modificado_por: req.user.id_usuario,
    });

    if (!actualizado) {
      return res.notFound("Cliente no encontrado o no actualizado");
    }

    return res.success(null, "Cliente actualizado correctamente");
  }),

  // ELIMINAR
  deleteCliente: asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);

    const eliminado = await clienteService.deleteCliente(id);

    if (!eliminado) {
      return res.notFound("Cliente no encontrado o no eliminado");
    }

    return res.success(null, "Cliente eliminado correctamente");
  }),
};

module.exports = cliente_controller;
