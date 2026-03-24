const equipoSalonService = require("./equipo_salon.service");
const asyncHandler = require("../../middleware/asyncHandler");
const {
  toEquipoSalonDTO,
  toEquipoSalonListDTO,
} = require("./equipo_salon.mapper");
const logger = require("../../utils/logger");

const equipo_salon_controller = {
  // LISTAR TODOS
  getAllEquiposSalon: asyncHandler(async (req, res) => {
    logger.info("Consultando listado de equipos de salon");

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || null;
    const sort = req.query.sort || "id_equipo";
    const dir = req.query.dir === "asc" ? "asc" : "desc";

    const result = await equipoSalonService.getAllEquiposSalon({
      page,
      limit,
      search,
      sort,
      dir,
    });

    return res.success(
      {
        ...result,
        data: toEquipoSalonListDTO(result.data),
      },
      "Listado de equipos de salon",
    );
  }),

  // OBTENER POR ID
  getEquipoSalonById: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const id_equipo = parseInt(id);

    if (isNaN(id_equipo)) {
      return res.badRequest("ID inválido");
    }

    const equipo = await equipoSalonService.getEquipoSalonById(id_equipo);

    if (!equipo) {
      return res.notFound("Equipo de salon no encontrado");
    }

    return res.success(
      toEquipoSalonDTO(equipo),
      "Equipo de salon obtenido correctamente",
    );
  }),

  // CREAR
  createEquipoSalon: asyncHandler(async (req, res) => {
    const { id_activo, id_modelo, serie, ultimo_mantenimiento } = req.body;

    const creado = await equipoSalonService.createEquipoSalon({
      id_activo,
      id_modelo,
      serie: serie ?? null,
      ultimo_mantenimiento: ultimo_mantenimiento ?? null,
      creado_por: req.user.id_usuario,
    });

    return res.created(
      toEquipoSalonDTO(creado),
      "Equipo de salon creado correctamente",
    );
  }),

  // ACTUALIZAR
  updateEquipoSalon: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const id_equipo = parseInt(id);

    if (isNaN(id_equipo)) {
      return res.badRequest("ID inválido");
    }

    const actualizado = await equipoSalonService.updateEquipoSalon(id_equipo, {
      ...req.body,
      modificado_por: req.user.id_usuario,
    });

    if (!actualizado) {
      return res.notFound("Equipo de salon no encontrado o no actualizado");
    }

    return res.success(null, "Equipo de salon actualizado correctamente");
  }),

  // ELIMINAR
  deleteEquipoSalon: asyncHandler(async (req, res) => {
    const id_equipo = parseInt(req.params.id);

    if (isNaN(id_equipo)) {
      return res.badRequest("ID inválido");
    }

    const eliminado = await equipoSalonService.deleteEquipoSalon(id_equipo);

    if (!eliminado) {
      return res.notFound("Equipo de salon no encontrado o no eliminado");
    }

    return res.success(null, "Equipo de salon eliminado correctamente");
  }),
};

module.exports = equipo_salon_controller;
