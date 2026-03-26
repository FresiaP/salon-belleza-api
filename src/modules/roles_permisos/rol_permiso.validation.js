const { z } = require("zod");

const assignRolPermisoSchema = z.object({
  body: z.object({
    id_permiso: z.number().int().positive(),
  }),
});

const replaceRolPermisosSchema = z.object({
  body: z.object({
    ids_permisos: z.array(z.number().int().positive()),
  }),
});

module.exports = {
  assignRolPermisoSchema,
  replaceRolPermisosSchema,
};
