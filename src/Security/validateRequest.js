export const validateRequest = (schema, source = "body") => (req, res, next) => {
  try {
    const input = source === "params" ? req.params : req.body;
    const parsed = schema.parse(input);
    if (source === "params") {
      req.params = parsed;
    } else {
      req.body = parsed;
    }
    return next();
  } catch (error) {
    return res.status(400).json({ error: error.errors?.[0]?.message ?? "Invalid request" });
  }
};
