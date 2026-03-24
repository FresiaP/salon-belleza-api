const { z } = require("zod");

const createProtocoloServicioSchema = z.object({
  body: z.object({
    id_activo: z.number().int().positive(),
    paso_a_paso: z.string().min(1),
    tiempo_estimado_min: z.number().int().positive().nullable().optional(),
    precauciones: z.string().max(4000).nullable().optional(),
    herramientas_necesarias: z.string().max(250).nullable().optional(),
  }),
});

const updateProtocoloServicioSchema = z.object({
  body: z
    .object({
      id_activo: z.number().int().positive().optional(),
      paso_a_paso: z.string().min(1).optional(),
      tiempo_estimado_min: z.number().int().positive().nullable().optional(),
      precauciones: z.string().max(4000).nullable().optional(),
      herramientas_necesarias: z.string().max(250).nullable().optional(),
    })
    .refine(
      (data) => Object.keys(data).length > 0,
      "Debe enviar al menos un campo para actualizar",
    ),
});

module.exports = {
  createProtocoloServicioSchema,
  updateProtocoloServicioSchema,
};
