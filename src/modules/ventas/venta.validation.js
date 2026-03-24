const { z } = require("zod");

const fechaVentaSchema = z
  .string()
  .regex(
    /^\d{4}-\d{2}-\d{2}(?:[ T]\d{2}:\d{2}(?::\d{2})?)?$/,
    "Formato de fecha inválido",
  );

const totalVentaSchema = z.number().min(0).max(99999999.99);

const createVentaSchema = z.object({
  body: z.object({
    id_cliente: z.number().int().positive().nullable().optional(),
    id_empleado: z.number().int().positive().nullable().optional(),
    fecha_venta: fechaVentaSchema.optional(),
    total_venta: totalVentaSchema.optional(),
  }),
});

const updateVentaSchema = z.object({
  body: z
    .object({
      id_cliente: z.number().int().positive().nullable().optional(),
      id_empleado: z.number().int().positive().nullable().optional(),
      fecha_venta: fechaVentaSchema.optional(),
      total_venta: totalVentaSchema.optional(),
    })
    .refine(
      (data) => Object.keys(data).length > 0,
      "Debe enviar al menos un campo para actualizar",
    ),
});

module.exports = {
  createVentaSchema,
  updateVentaSchema,
};
