const { z } = require("zod");

// LOGIN
const loginSchema = z.object({
    body: z.object({
        username: z.string().min(3).max(50),
        password: z.string().min(6).max(200)
    })
});

// CREATE
const createUsuarioSchema = z.object({
    body: z.object({
        username: z.string().min(3).max(50),
        password: z.string().min(6).max(200),
        id_rol: z.number(),
        id_empleado: z.number().nullable().optional()
    })
});

// UPDATE
const updateUsuarioSchema = z.object({
    body: z.object({
        username: z.string().min(3).max(50).optional(),
        id_rol: z.number().optional(),
        id_empleado: z.number().nullable().optional(),
        estado: z.boolean().optional()
    })
});

// CHANGE PASSWORD
const changePasswordSchema = z.object({
    password_actual: z.string().min(6).max(200),
    password_nuevo: z.string().min(6).max(200)
});

// UPDATE ESTADO
const updateEstadoSchema = z.object({
    body: z.object({
        estado: z.union([z.boolean(), z.number().int().min(0).max(1)])
    })
});


module.exports = {
    createUsuarioSchema,
    updateUsuarioSchema,
    loginSchema,
    changePasswordSchema,
    updateEstadoSchema
};