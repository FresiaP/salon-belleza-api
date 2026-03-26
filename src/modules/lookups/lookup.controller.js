const lookupService = require("./lookup.service");
const asyncHandler = require("../../middleware/asyncHandler");
const { toLookupListDTO } = require("./lookup.mapper");

const lookup_controller = {
  getAvailableLookups: asyncHandler(async (req, res) => {
    const data = lookupService.getAvailableLookups(req.user);

    return res.success(data, "Listado de lookups disponibles");
  }),

  getLookupOptions: asyncHandler(async (req, res) => {
    const { resource } = req.params;
    const search = req.query.search || req.query.q || null;
    const limit = parseInt(req.query.limit, 10) || 20;
    const includeInactive = req.query.includeInactive === "true";

    const result = await lookupService.getLookupOptions(
      resource,
      {
        search,
        limit,
        includeInactive,
        filters: req.query,
      },
      req.user,
    );

    if (!result) {
      return res.notFound("Lookup no encontrado");
    }

    return res.success(
      {
        resource: result.resource,
        label: result.label,
        items: toLookupListDTO(result.items),
      },
      `Opciones de ${result.label}`,
    );
  }),
};

module.exports = lookup_controller;
