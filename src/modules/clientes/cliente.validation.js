const { z } = require("zod");
const { es } = require("zod/v4/locales");

// CREATE
const createClienteSchema = z.object({
  body: z.object({
    nombre: z.string().min(1).max(100),
    telefono: z.string().min(7).max(20),
    email: z.string().email().max(100),
    fecha_nacimiento: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de fecha inválido (YYYY-MM-DD)"),
  }),
});

// UPDATE
const updateClienteSchema = z.object({
  body: z.object({
    nombre: z.string().min(1).max(100),
    telefono: z.string().min(7).max(20),
    email: z.string().email().max(100),
    fecha_nacimiento: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de fecha inválido (YYYY-MM-DD)"),
  }),
});

module.exports = {
  createClienteSchema,
  updateClienteSchema,
};
