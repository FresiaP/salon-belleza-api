const { z } = require("zod");
const { es } = require("zod/v4/locales");

// CREATE
const createProveedorSchema = z.object({
  body: z.object({
    razon_social: z.string().min(1).max(100),
    contacto_nombre: z.string().min(1).max(100),
    telefono: z.string().min(7).max(20),
    email: z.string().email().max(100),
    direccion: z.string().min(1).max(200),
    ruc_cedula: z.string().min(1).max(20),
  }),
});

// UPDATE
const updateProveedorSchema = z.object({
  body: z.object({
    razon_social: z.string().min(1).max(100),
    contacto_nombre: z.string().min(1).max(100),
    telefono: z.string().min(7).max(20),
    email: z.string().email().max(100),
    direccion: z.string().min(1).max(200),
    ruc_cedula: z.string().min(1).max(20),
    estado: z.boolean().optional(),
  }),
});

// UPDATE ESTADO
const updateEstadoSchema = z.object({
  body: z.object({
    estado: z
      .union([z.boolean(), z.number().int().min(0).max(1)])
      .transform((val) => Boolean(val)),
  }),
});

module.exports = {
  createProveedorSchema,
  updateProveedorSchema,
  updateEstadoSchema,
};
