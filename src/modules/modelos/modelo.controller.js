const modeloService = require("./modelo.service");
const asyncHandler = require("../../middleware/asyncHandler");
const { toModeloDTO, toModeloListDTO } = require("./modelo.mapper");
const logger = require("../../utils/logger");

const modelo_controller = {
  // LISTAR TODOS
  getAllModelos: asyncHandler(async (req, res) => {
    logger.info("Consultando listado de modelos");

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || null;
    const estado = req.query.estado;
    const sort = req.query.sort || "id_modelo";
    const dir = req.query.dir === "asc" ? "asc" : "desc";

    const result = await modeloService.getAllModelos({
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
        data: toModeloListDTO(result.data),
      },
      "Listado de modelos",
    );
  }),

  // OBTENER POR ID
  getModeloById: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const id_modelo = parseInt(id);

    if (isNaN(id_modelo)) {
      return res.badRequest("ID inválido");
    }

    const modelo = await modeloService.getModeloById(id_modelo);
    if (!modelo) {
      return res.notFound("Modelo no encontrado");
    }

    return res.success(toModeloDTO(modelo), "Modelo obtenido correctamente");
  }),

  // CREAR
  createModelo: asyncHandler(async (req, res) => {
    const { nombre_modelo, id_marca } = req.body;

    const creado = await modeloService.createModelo({
      nombre_modelo,
      id_marca,
      estado: true,
      creado_por: req.user.id_usuario,
    });

    return res.created(toModeloDTO(creado), "Modelo creado correctamente");
  }),

  // ACTUALIZAR
  updateModelo: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const id_modelo = parseInt(id);

    if (isNaN(id_modelo)) {
      return res.badRequest("ID inválido");
    }

    const actualizado = await modeloService.updateModelo(id_modelo, {
      ...req.body,
      modificado_por: req.user.id_usuario,
    });

    if (!actualizado) {
      return res.notFound("Modelo no encontrado o no actualizado");
    }

    return res.success(null, "Modelo actualizado correctamente");
  }),

  // ACTUALIZAR SOLO ESTADO
  updateEstado: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const id_modelo = parseInt(id);

    if (isNaN(id_modelo)) {
      return res.badRequest("ID de modelo inválido");
    }

    const { estado } = req.body;

    const actualizado = await modeloService.updateEstado({
      id_modelo,
      estado,
      modificado_por: req.user.id_usuario,
    });

    if (!actualizado) {
      return res.notFound("Modelo no encontrado o no actualizado");
    }

    return res.success(null, "Estado del modelo actualizado correctamente");
  }),

  // ELIMINAR
  deleteModelo: asyncHandler(async (req, res) => {
    const id_modelo = parseInt(req.params.id);

    if (isNaN(id_modelo)) {
      return res.badRequest("ID inválido");
    }

    const eliminado = await modeloService.deleteModelo(id_modelo);

    if (!eliminado) {
      return res.notFound("Modelo no encontrado o no eliminado");
    }

    return res.success(null, "Modelo eliminado correctamente");
  }),
};

module.exports = modelo_controller;
