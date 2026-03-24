const { z } = require("zod");

const fechaReporteSchema = z
  .string()
  .regex(
    /^\d{4}-\d{2}-\d{2}(?:[ T]\d{2}:\d{2}(?::\d{2})?)?$/,
    "Formato de fecha inválido",
  );

const prioridadSchema = z.string().max(20).nullable();

const createIncidenciaSchema = z.object({
  body: z.object({
    id_activo: z.number().int().positive(),
    titulo: z.string().min(1).max(150),
    detalle: z.string().max(4000).nullable().optional(),
    prioridad: prioridadSchema.optional(),
    fecha_reporte: fechaReporteSchema.optional(),
  }),
});

const updateIncidenciaSchema = z.object({
  body: z
    .object({
      id_activo: z.number().int().positive().optional(),
      titulo: z.string().min(1).max(150).optional(),
      detalle: z.string().max(4000).nullable().optional(),
      prioridad: prioridadSchema.optional(),
      fecha_reporte: fechaReporteSchema.optional(),
    })
    .refine(
      (data) => Object.keys(data).length > 0,
      "Debe enviar al menos un campo para actualizar",
    ),
});

module.exports = {
  createIncidenciaSchema,
  updateIncidenciaSchema,
};
