const { z } = require("zod");

const createInsumoProtocoloSchema = z.object({
  body: z.object({
    id_protocolo: z.number().int().positive(),
    id_activo_producto: z.number().int().positive(),
    cantidad_sugerida: z.string().max(50).nullable().optional(),
  }),
});

const updateInsumoProtocoloSchema = z.object({
  body: z
    .object({
      id_protocolo: z.number().int().positive().optional(),
      id_activo_producto: z.number().int().positive().optional(),
      cantidad_sugerida: z.string().max(50).nullable().optional(),
    })
    .refine(
      (data) => Object.keys(data).length > 0,
      "Debe enviar al menos un campo para actualizar",
    ),
});

module.exports = {
  createInsumoProtocoloSchema,
  updateInsumoProtocoloSchema,
};
