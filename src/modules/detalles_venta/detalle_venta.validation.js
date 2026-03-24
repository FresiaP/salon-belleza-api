const { z } = require("zod");

const precioUnitarioSchema = z.number().min(0).max(99999999.99);

const createDetalleVentaSchema = z.object({
  body: z.object({
    id_venta: z.number().int().positive().nullable().optional(),
    id_activo: z.number().int().positive().nullable().optional(),
    cantidad: z.number().int().positive().optional(),
    precio_unitario: precioUnitarioSchema,
  }),
});

const updateDetalleVentaSchema = z.object({
  body: z
    .object({
      id_venta: z.number().int().positive().nullable().optional(),
      id_activo: z.number().int().positive().nullable().optional(),
      cantidad: z.number().int().positive().optional(),
      precio_unitario: precioUnitarioSchema.optional(),
    })
    .refine(
      (data) => Object.keys(data).length > 0,
      "Debe enviar al menos un campo para actualizar",
    ),
});

module.exports = {
  createDetalleVentaSchema,
  updateDetalleVentaSchema,
};
