const { z } = require("zod");

const createProductoSalonSchema = z.object({
  body: z.object({
    id_activo: z.number().int().positive(),
    codi_barras: z.string().max(50).nullable().optional(),
    id_marca: z.number().int().positive(),
    stock_actual: z.number().int().min(0).optional(),
    stock_minimo: z.number().int().min(0).optional(),
    contenido_neto: z.string().max(20).nullable().optional(),
  }),
});

const updateProductoSalonSchema = z.object({
  body: z
    .object({
      id_activo: z.number().int().positive().optional(),
      codi_barras: z.string().max(50).nullable().optional(),
      id_marca: z.number().int().positive().optional(),
      stock_actual: z.number().int().min(0).optional(),
      stock_minimo: z.number().int().min(0).optional(),
      contenido_neto: z.string().max(20).nullable().optional(),
    })
    .refine(
      (data) => Object.keys(data).length > 0,
      "Debe enviar al menos un campo para actualizar",
    ),
});

module.exports = {
  createProductoSalonSchema,
  updateProductoSalonSchema,
};
