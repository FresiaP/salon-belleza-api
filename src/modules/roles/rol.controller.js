const rolService = require("./rol.service");
const asyncHandler = require("../../middleware/asyncHandler");
const { toRolDTO, toRolListDTO } = require("./rol.mapper");
const logger = require("../../utils/logger");

const rol_controller = {
  getAllRoles: asyncHandler(async (req, res) => {
    logger.info("Consultando listado de roles");

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || null;
    const sort = req.query.sort || "id_rol";
    const dir = req.query.dir === "asc" ? "asc" : "desc";

    const result = await rolService.getAllRoles({
      page,
      limit,
      search,
      sort,
      dir,
    });

    return res.success(
      {
        ...result,
        data: toRolListDTO(result.data),
      },
      "Listado de roles",
    );
  }),

  getRolById: asyncHandler(async (req, res) => {
    const id_rol = parseInt(req.params.id);

    if (isNaN(id_rol)) {
      return res.badRequest("ID inválido");
    }

    const rol = await rolService.getRolById(id_rol);

    if (!rol) {
      return res.notFound("Rol no encontrado");
    }

    return res.success(toRolDTO(rol), "Rol obtenido correctamente");
  }),

  createRol: asyncHandler(async (req, res) => {
    const creado = await rolService.createRol(req.body);

    return res.created(toRolDTO(creado), "Rol creado correctamente");
  }),

  updateRol: asyncHandler(async (req, res) => {
    const id_rol = parseInt(req.params.id);

    if (isNaN(id_rol)) {
      return res.badRequest("ID inválido");
    }

    const actualizado = await rolService.updateRol(id_rol, req.body);

    if (!actualizado) {
      return res.notFound("Rol no encontrado o no actualizado");
    }

    return res.success(null, "Rol actualizado correctamente");
  }),

  deleteRol: asyncHandler(async (req, res) => {
    const id_rol = parseInt(req.params.id);

    if (isNaN(id_rol)) {
      return res.badRequest("ID inválido");
    }

    const eliminado = await rolService.deleteRol(id_rol);

    if (!eliminado) {
      return res.notFound("Rol no encontrado o no eliminado");
    }

    return res.success(null, "Rol eliminado correctamente");
  }),
};

module.exports = rol_controller;
