const ApiError = require('../shared/ApiError');

module.exports = (schema) => (req, res, next) => {
  try {
    const result = schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    req.validated = result;
    next();
  } catch (err) {
    const details = err.errors?.map((e) => ({
      path: e.path.join('.'),
      message: e.message,
    }));
    next(new ApiError(400, 'Validation failed', details));
  }
};