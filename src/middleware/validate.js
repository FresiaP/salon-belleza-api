const validate = (schema) => (req, res, next) => {
  try {
    const result = schema.parse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    req.body = result.body ?? req.body;
    req.params = result.params ?? req.params;
    req.query = result.query ?? req.query;

    next();
  } catch (error) {
    const errors =
      error.issues?.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      })) || [];

    console.error("VALIDATION ERROR:", JSON.stringify(errors, null, 2));

    return res.badRequest("Error de validación", errors);
  }
};

module.exports = validate;
