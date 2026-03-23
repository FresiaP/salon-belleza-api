const validate = (schema) => (req, res, next) => {
    try {
        const result = schema.parse({
            body: req.body,
            params: req.params,
            query: req.query
        });

        // Sobrescribir con datos validados (y transformados si usas coerce)
        req.body = result.body ?? req.body;
        req.params = result.params ?? req.params;
        req.query = result.query ?? req.query;

        next();

    } catch (error) {

        // Manejo de errores Zod
        const errors = error.issues?.map(e => ({
            field: e.path.join("."),
            message: e.message
        })) || [];

        // Log para debug en consola
        console.error(" VALIDATION ERROR:", error.issues);

        return res.status(400).json({
            success: false,
            message: "Error de validación",
            errors
        });
    }
};

module.exports = validate;