const { z } = require("zod");

const createEstadoActivoSchema = z.object({
  body: z.object({
    nombre_estado: z.string().min(1).max(30),
  }),
});

const updateEstadoActivoSchema = z.object({
  body: z
    .object({
      nombre_estado: z.string().min(1).max(30).optional(),
    })
    .refine(
      (data) => Object.keys(data).length > 0,
      "Debe enviar al menos un campo para actualizar",
    ),
});

module.exports = {
  createEstadoActivoSchema,
  updateEstadoActivoSchema,
};
