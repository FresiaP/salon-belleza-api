const { z } = require("zod");

// CREATE
const createEmpleadoSchema = z.object({
    body: z.object({
        nombre_empleado: z.string().min(3).max(80),
        numero_dni: z.string()
            .min(5)
            .max(20)
            .regex(/^[a-zA-Z0-9-]+$/, "El DNI solo puede contener letras, números y guiones"),
        fecha_nacimiento: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de fecha inválido (YYYY-MM-DD)"),
        telefono: z.string().min(7).max(20),
        domicilio: z.string().min(1).max(100),
        id_especialidad: z.number().nullable().optional()
    })
});

// UPDATE
const updateEmpleadoSchema = z.object({
    body: z.object({
        nombre_empleado: z.string().min(3).max(80).optional(),
        numero_dni: z.string()
            .min(5)
            .max(20)
            .regex(/^[a-zA-Z0-9-]+$/, "El DNI solo puede contener letras, números y guiones"),
        fecha_nacimiento: z.string()
            .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de fecha inválido (YYYY-MM-DD)")
            .optional(),
        telefono: z.string().min(7).max(20).optional(),
        domicilio: z.string().min(1).max(100).optional(),
        id_especialidad: z.number().nullable().optional()
    })
});

// UPDATE ESTADO
const updateEstadoSchema = z.object({
    body: z.object({
        estado: z.union([z.boolean(), z.number().int().min(0).max(1)])
    })
});

module.exports = {
    createEmpleadoSchema,
    updateEmpleadoSchema,
    updateEstadoSchema
};
