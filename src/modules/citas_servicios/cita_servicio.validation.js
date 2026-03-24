const { z } = require("zod");

const fechaCitaSchema = z
  .string()
  .regex(
    /^\d{4}-\d{2}-\d{2}(?:[ T]\d{2}:\d{2}(?::\d{2})?)?$/,
    "Formato de fecha inválido",
  );

const montoFinalSchema = z.number().min(0).max(99999999.99).nullable();

const createCitaServicioSchema = z.object({
  body: z.object({
    id_cliente: z.number().int().positive(),
    id_activo: z.number().int().positive(),
    id_empleado: z.number().int().positive().nullable().optional(),
    fecha_cita: fechaCitaSchema,
    monto_final: montoFinalSchema.optional(),
    notas_estilista: z.string().max(4000).nullable().optional(),
  }),
});

const updateCitaServicioSchema = z.object({
  body: z
    .object({
      id_cliente: z.number().int().positive().optional(),
      id_activo: z.number().int().positive().optional(),
      id_empleado: z.number().int().positive().nullable().optional(),
      fecha_cita: fechaCitaSchema.optional(),
      monto_final: montoFinalSchema.optional(),
      notas_estilista: z.string().max(4000).nullable().optional(),
    })
    .refine(
      (data) => Object.keys(data).length > 0,
      "Debe enviar al menos un campo para actualizar",
    ),
});

module.exports = {
  createCitaServicioSchema,
  updateCitaServicioSchema,
};
