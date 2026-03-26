const { z } = require("zod");

const createRolSchema = z.object({
  body: z.object({
    nombre_rol: z.string().min(1).max(100),
  }),
});

const updateRolSchema = z.object({
  body: z
    .object({
      nombre_rol: z.string().min(1).max(100).optional(),
    })
    .refine(
      (data) => Object.keys(data).length > 0,
      "Debe enviar al menos un campo para actualizar",
    ),
});

module.exports = {
  createRolSchema,
  updateRolSchema,
};
