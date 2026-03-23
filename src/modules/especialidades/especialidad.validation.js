const { z } = require("zod");

// CREATE
const createEspecialidadSchema = z.object({
    body: z.object({
        nombre_especialidad: z.string().min(3).max(60)
    })
});

// UPDATE
const updateEspecialidadSchema = z.object({
    body: z.object({
        nombre_especialidad: z.string().min(3).max(60).optional()
    })
});

// UPDATE ESTADO
const updateEstadoSchema = z.object({
    body: z.object({
        estado: z.union([z.boolean(), z.number().int().min(0).max(1)])
    })
});

module.exports = {
    createEspecialidadSchema,
    updateEspecialidadSchema,
    updateEstadoSchema
};