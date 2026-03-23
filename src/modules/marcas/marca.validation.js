const { z } = require("zod");

// Esquema para creación
const createMarcaSchema = z.object({

    nombre_marca: z.string().min(2).max(50),

    sitio_web: z.string().url().max(150).optional(),

    estado_marca: z.boolean()

});

// Esquema para actualización completa (PUT)
const updateMarcaSchema = z.object({
    nombre_marca: z.string().min(2).max(50).optional(),
    sitio_web: z.string().url().max(150).optional().or(z.literal('')),
    estado_marca: z.boolean().optional()
});

// Esquema para cambio de estado (PATCH)
const updateEstadoSchema = z.object({
    estado_marca: z.boolean({
        required_error: "El estado es obligatorio",
        invalid_type_error: "El estado debe ser un valor booleano"
    })
});

module.exports = {
    createMarcaSchema,
    updateMarcaSchema,
    updateEstadoSchema
};