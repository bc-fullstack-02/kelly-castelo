const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const TOKEN_SECRET = process.env.TOKEN_SECRET;

const authValidator = (req, res, next) =>
  Promise.resolve()
    .then(() => req.headers.authorization)
    .then((authHeader) =>
      authHeader ? authHeader.split(" ") : createError(401)
    )
    .then(([_, token]) => jwt.verify(token, TOKEN_SECRET))
    .then(() => next())
    .catch((err) => next(err));

module.exports = authValidator;
