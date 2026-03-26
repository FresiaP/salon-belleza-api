const rolPermisoService = require("./rol_permiso.service");
const asyncHandler = require("../../middleware/asyncHandler");
const { toRolPermisoDTO } = require("./rol_permiso.mapper");
const logger = require("../../utils/logger");

const rol_permiso_controller = {
  getPermisosByRol: asyncHandler(async (req, res) => {
    const id_rol = parseInt(req.params.id);

    if (isNaN(id_rol)) {
      return res.badRequest("ID inválido");
    }

    logger.info(`Consultando permisos del rol ${id_rol}`);

    const result = await rolPermisoService.getPermisosByRol(id_rol);

    if (!result) {
      return res.notFound("Rol no encontrado");
    }

    return res.success(
      toRolPermisoDTO(result),
      "Permisos del rol obtenidos correctamente",
    );
  }),

  assignPermiso: asyncHandler(async (req, res) => {
    const id_rol = parseInt(req.params.id);

    if (isNaN(id_rol)) {
      return res.badRequest("ID inválido");
    }

    const result = await rolPermisoService.assignPermiso(
      id_rol,
      req.body.id_permiso,
    );

    if (!result) {
      return res.notFound("Rol no encontrado");
    }

    return res.created(null, "Permiso asignado correctamente al rol");
  }),

  removePermiso: asyncHandler(async (req, res) => {
    const id_rol = parseInt(req.params.id);
    const id_permiso = parseInt(req.params.idPermiso);

    if (isNaN(id_rol) || isNaN(id_permiso)) {
      return res.badRequest("ID inválido");
    }

    const eliminado = await rolPermisoService.removePermiso(id_rol, id_permiso);

    if (eliminado === null) {
      return res.notFound("Rol no encontrado");
    }

    if (!eliminado) {
      return res.notFound("Permiso no asignado al rol");
    }

    return res.success(null, "Permiso quitado correctamente del rol");
  }),

  replacePermisos: asyncHandler(async (req, res) => {
    const id_rol = parseInt(req.params.id);

    if (isNaN(id_rol)) {
      return res.badRequest("ID inválido");
    }

    const result = await rolPermisoService.replacePermisos(
      id_rol,
      req.body.ids_permisos,
    );

    if (!result) {
      return res.notFound("Rol no encontrado");
    }

    return res.success(
      toRolPermisoDTO(result),
      "Permisos del rol actualizados correctamente",
    );
  }),
};

module.exports = rol_permiso_controller;
