const { z } = require("zod");

const createModeloSchema = z.object({
  body: z.object({
    nombre_modelo: z.string().min(2).max(50),
    id_marca: z.number().int().positive(),
  }),
});

const updateModeloSchema = z.object({
  body: z
    .object({
      nombre_modelo: z.string().min(2).max(50).optional(),
      id_marca: z.number().int().positive().optional(),
      estado: z.boolean().optional(),
    })
    .refine(
      (data) => Object.keys(data).length > 0,
      "Debe enviar al menos un campo para actualizar",
    ),
});

const updateEstadoSchema = z.object({
  body: z.object({
    estado: z
      .union([z.boolean(), z.number().int().min(0).max(1)])
      .transform((value) => Boolean(value)),
  }),
});

module.exports = {
  createModeloSchema,
  updateModeloSchema,
  updateEstadoSchema,
};
