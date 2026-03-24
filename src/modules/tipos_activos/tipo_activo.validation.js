const { z } = require("zod");

const createTipoActivoSchema = z.object({
  body: z.object({
    nombre: z.string().min(1).max(50),
  }),
});

const updateTipoActivoSchema = z.object({
  body: z
    .object({
      nombre: z.string().min(1).max(50).optional(),
    })
    .refine(
      (data) => Object.keys(data).length > 0,
      "Debe enviar al menos un campo para actualizar",
    ),
});

module.exports = {
  createTipoActivoSchema,
  updateTipoActivoSchema,
};
