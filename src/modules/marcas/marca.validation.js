const { z } = require("zod");

// Esquema para creación
const createMarcaSchema = z.object({
  nombre_marca: z.string().min(2).max(50),

  sitio_web: z.string().url().max(150).optional(),

  estado: z.boolean(),
});

// Esquema para actualización completa (PUT)
const updateMarcaSchema = z.object({
  nombre_marca: z.string().min(2).max(50).optional(),
  sitio_web: z.string().url().max(150).optional().or(z.literal("")),
  estado: z.boolean().optional(),
});

// Esquema para cambio de estado (PATCH)
const updateEstadoSchema = z.object({
  body: z.object({
    estado: z
      .union([z.boolean(), z.number().int().min(0).max(1)])
      .transform((val) => Boolean(val)),
  }),
});

module.exports = {
  createMarcaSchema,
  updateMarcaSchema,
  updateEstadoSchema,
};
