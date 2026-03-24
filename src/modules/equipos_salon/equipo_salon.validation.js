const { z } = require("zod");

const fechaSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de fecha inválido (YYYY-MM-DD)");

const createEquipoSalonSchema = z.object({
  body: z.object({
    id_activo: z.number().int().positive(),
    id_modelo: z.number().int().positive(),
    serie: z.string().max(50).nullable().optional(),
    ultimo_mantenimiento: fechaSchema.nullable().optional(),
  }),
});

const updateEquipoSalonSchema = z.object({
  body: z
    .object({
      id_activo: z.number().int().positive().optional(),
      id_modelo: z.number().int().positive().optional(),
      serie: z.string().max(50).nullable().optional(),
      ultimo_mantenimiento: fechaSchema.nullable().optional(),
    })
    .refine(
      (data) => Object.keys(data).length > 0,
      "Debe enviar al menos un campo para actualizar",
    ),
});

module.exports = {
  createEquipoSalonSchema,
  updateEquipoSalonSchema,
};
