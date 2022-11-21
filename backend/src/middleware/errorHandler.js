const createError = require("http-errors");

const errorHandler = (err, req, res, next) => {
  if (err.name && err.name === "ValidationError") {
    const errors = Object.entries(err.errors).map(([, obj]) => obj.message);
    res.status(400).json({
      path: req.path,
      status: 400,
      errors,
    });
  } else {
    res.status(err.status || 500).json({
      path: req.path,
      status: err.status || 500,
      errors: err.message,
    });
  }
};

module.exports = errorHandler;
