// ======================================
// Controlador de Marcas
// ======================================

const marcaService = require("./marca.service");
const asyncHandler = require("../../middleware/asyncHandler");
const { toMarcaDTO, toMarcaListDTO } = require("./marca.mapper");
const logger = require("../../utils/logger");

const marca_controller = {
  // LISTAR TODOS
  getAllMarcas: asyncHandler(async (req, res) => {
    logger.info("Consultando listado de marcas");

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || null;
    const estado = req.query.estado;
    const sort = req.query.sort || "id_marca";
    const dir = req.query.dir === "asc" ? "asc" : "desc";

    const result = await marcaService.getAllMarcas({
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
        data: toMarcaListDTO(result.data),
      },
      "Listado de marcas",
    );
  }),

  // OBTENER POR ID
  getMarcaById: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const id_marca = parseInt(id);

    if (isNaN(id_marca)) {
      return res.badRequest("ID inválido");
    }

    const marca = await marcaService.getMarcaById(id_marca);
    if (!marca) {
      return res.notFound("Marca no encontrada");
    }

    return res.success(toMarcaDTO(marca), "Marca obtenida correctamente");
  }),

  // CREAR
  createMarca: asyncHandler(async (req, res) => {
    const { nombre_marca, sitio_web } = req.body;

    const creado = await marcaService.createMarca({
      nombre_marca: nombre_marca,
      sitio_web: sitio_web || null,
      estado: true,
      creado_por: req.user.id_usuario,
    });

    return res.success(toMarcaDTO(creado), "Marca creada correctamente");
  }),

  // ACTUALIZAR
  updateMarca: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const actualizado = await marcaService.updateMarca(parseInt(id), {
      ...req.body,
      modificado_por: req.user.id_usuario,
    });

    if (!actualizado) {
      return res.notFound("Marca no encontrada o no actualizada");
    }

    return res.success(null, "Marca actualizada correctamente");
  }),

  // ACTUALIZAR SOLO ESTADO
  updateEstado: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const id_marca = parseInt(id);

    if (isNaN(id_marca)) {
      return res.badRequest("ID de marca inválido");
    }

    const { estado } = req.body;
    const modificado_por = req.user.id_usuario;

    const actualizado = await marcaService.updateEstado({
      id_marca,
      estado,
      modificado_por,
    });

    if (!actualizado) {
      return res.notFound("Marca no encontrada o no actualizada");
    }

    return res.success(null, "Estado de la marca actualizado correctamente");
  }),

  // ELIMINAR
  deleteMarca: asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);

    const eliminado = await marcaService.deleteMarca(id);

    if (!eliminado) {
      return res.notFound("Marca no encontrada o no eliminada");
    }

    return res.success(null, "Marca eliminada correctamente");
  }),
};

module.exports = marca_controller;
