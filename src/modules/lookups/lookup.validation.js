const { z } = require("zod");

const parseOptionalInt = (value) => {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  const parsed = parseInt(value, 10);
  return Number.isNaN(parsed) ? value : parsed;
};

const getLookupSchema = z.object({
  params: z.object({
    resource: z.string().min(1).max(100),
  }),
  query: z
    .object({
      search: z.string().max(100).optional(),
      q: z.string().max(100).optional(),
      limit: z.preprocess(
        parseOptionalInt,
        z.number().int().min(1).max(100).optional(),
      ),
      includeInactive: z
        .union([z.literal("true"), z.literal("false")])
        .optional(),
    })
    .passthrough(),
});

module.exports = {
  getLookupSchema,
};
