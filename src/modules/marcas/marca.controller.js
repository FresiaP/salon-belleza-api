// ======================================
// Controlador de Marcas
// ======================================

const marcaService = require("./marca.service");
const asyncHandler = require("../../middleware/asyncHandler");
const helpers = require("../../utils/helpers");
const logger = require("../../utils/logger");

// GET - Listado
const getAllMarcas = asyncHandler(async (req, res) => {
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

  return response.success(res, result, "Listado de marcas obtenido");
});

// GET - Por ID
const getMarcaById = asyncHandler(async (req, res) => {
  const id_marca = helpers.parseId(req.params.id);

  if (!id_marca) return response.badRequest(res, "ID de marca inválido");

  const marca = await marcaService.getMarcaById(id_marca);
  if (!marca) return response.notFound(res, "Marca no encontrada");

  return response.success(res, marca, "Marca encontrada");
});

// POST - Crear
const createMarca = asyncHandler(async (req, res) => {
  const { nombre_marca, sitio_web, estado_marca } = req.body;

  const nuevaMarca = await marcaService.createMarca({
    nombre_marca: helpers.cleanString(nombre_marca),
    sitio_web: sitio_web ? helpers.cleanString(sitio_web) : null,
    estado_marca: helpers.parseBoolean(estado_marca),
  });

  logger.info(`Marca creada: ${helpers.cleanString(nombre_marca)}`);
  return response.created(res, nuevaMarca, "Marca creada correctamente");
});

// PUT - Actualizar
const updateMarca = asyncHandler(async (req, res) => {
  const id_marca = helpers.parseId(req.params.id);
  if (!id_marca) return response.badRequest(res, "ID de marca inválido");

  const { nombre_marca, sitio_web, estado_marca } = req.body;

  const data = {};

  if (nombre_marca !== undefined) {
    data.nombre_marca = helpers.cleanString(nombre_marca);
  }

  if (sitio_web !== undefined) {
    data.sitio_web = sitio_web ? helpers.cleanString(sitio_web) : null;
  }

  if (estado_marca !== undefined) {
    data.estado_marca = helpers.parseBoolean(estado_marca);
  }

  if (Object.keys(data).length === 0) {
    return response.badRequest(res, "No se enviaron campos para actualizar");
  }

  const marcaActualizada = await marcaService.updateMarca(id_marca, data);

  if (!marcaActualizada) {
    return response.notFound(res, "Marca no encontrada");
  }

  logger.info(`Marca actualizada con ID ${id_marca}`);

  const marca = await marcaService.getMarcaById(id_marca);

  return response.success(res, marca, "Marca actualizada correctamente");
});

// PATCH - Estado
const updateEstado = asyncHandler(async (req, res) => {
  const id_marca = helpers.parseId(req.params.id);
  if (!id_marca) return response.badRequest(res, "ID de marca inválido");

  // Zod ya validó que estado_marca existe y es booleano
  const { estado_marca } = req.body;

  const actualizado = await marcaService.updateEstado({
    id_marca,
    estado_marca: helpers.parseBoolean(estado_marca),
  });

  if (!actualizado) return response.notFound(res, "Marca no encontrada");

  logger.info(`Estado de marca actualizado ID ${id_marca}`);
  return response.success(res, null, "Estado de la marca actualizado");
});

// DELETE - Eliminar
const deleteMarca = asyncHandler(async (req, res) => {
  const id_marca = helpers.parseId(req.params.id);
  if (!id_marca) return response.badRequest(res, "ID de marca inválido");

  const eliminado = await marcaService.deleteMarca(id_marca);
  if (!eliminado) return response.notFound(res, "Marca no encontrada");

  logger.info(`Marca eliminada con ID ${id_marca}`);
  return response.success(res, null, "Marca eliminada correctamente");
});

module.exports = {
  getAllMarcas,
  getMarcaById,
  createMarca,
  updateMarca,
  updateEstado,
  deleteMarca,
};
