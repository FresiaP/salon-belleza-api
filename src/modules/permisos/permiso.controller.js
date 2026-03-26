const permisoService = require("./permiso.service");
const asyncHandler = require("../../middleware/asyncHandler");
const { toPermisoDTO, toPermisoListDTO } = require("./permiso.mapper");
const logger = require("../../utils/logger");

const permiso_controller = {
  getAllPermisos: asyncHandler(async (req, res) => {
    logger.info("Consultando listado de permisos");

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || null;
    const sort = req.query.sort || "id_permiso";
    const dir = req.query.dir === "asc" ? "asc" : "desc";

    const result = await permisoService.getAllPermisos({
      page,
      limit,
      search,
      sort,
      dir,
    });

    return res.success(
      {
        ...result,
        data: toPermisoListDTO(result.data),
      },
      "Listado de permisos",
    );
  }),

  getPermisoById: asyncHandler(async (req, res) => {
    const id_permiso = parseInt(req.params.id);

    if (isNaN(id_permiso)) {
      return res.badRequest("ID inválido");
    }

    const permiso = await permisoService.getPermisoById(id_permiso);

    if (!permiso) {
      return res.notFound("Permiso no encontrado");
    }

    return res.success(toPermisoDTO(permiso), "Permiso obtenido correctamente");
  }),
};

module.exports = permiso_controller;
