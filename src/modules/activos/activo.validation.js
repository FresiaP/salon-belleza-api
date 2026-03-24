const { z } = require("zod");

const fechaRegistroSchema = z
  .string()
  .regex(
    /^\d{4}-\d{2}-\d{2}(?:[ T]\d{2}:\d{2}(?::\d{2})?)?$/,
    "Formato de fecha inválido",
  );

const precioBaseSchema = z.number().min(0).max(99999999.99);

const createActivoSchema = z.object({
  body: z.object({
    id_tipo_activo: z.number().int().positive(),
    id_proveedor: z.number().int().positive().nullable().optional(),
    nombre_identificador: z.string().min(1).max(100),
    descripcion: z.string().max(4000).nullable().optional(),
    precio_base: precioBaseSchema.optional(),
    id_estado_activo: z.number().int().positive().optional(),
    fecha_registro: fechaRegistroSchema.optional(),
  }),
});

const updateActivoSchema = z.object({
  body: z
    .object({
      id_tipo_activo: z.number().int().positive().optional(),
      id_proveedor: z.number().int().positive().nullable().optional(),
      nombre_identificador: z.string().min(1).max(100).optional(),
      descripcion: z.string().max(4000).nullable().optional(),
      precio_base: precioBaseSchema.optional(),
      id_estado_activo: z.number().int().positive().optional(),
      fecha_registro: fechaRegistroSchema.optional(),
    })
    .refine(
      (data) => Object.keys(data).length > 0,
      "Debe enviar al menos un campo para actualizar",
    ),
});

const updateEstadoSchema = z.object({
  body: z.object({
    id_estado_activo: z.number().int().positive(),
  }),
});

module.exports = {
  createActivoSchema,
  updateActivoSchema,
  updateEstadoSchema,
};
