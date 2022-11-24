const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const TOKEN_SECRET = process.env.TOKEN_SECRET;
const { User } = require("../models");

const authValidator = (req, res, next) =>
  Promise.resolve()
    .then(() => req.headers.authorization)
    .then((authHeader) =>
      authHeader ? authHeader.split(" ") : next(createError(401))
    )
    .then(([_, token]) =>
      token
        ? jwt.verify(token, TOKEN_SECRET)
        : createError(403)
    )
    .then((user) =>
      User.findOne({user})
        .populate("profile")
        .then((userFound) => {
          req.user = userFound;
          next();
        })
    )
    .catch((err) => next(err));

module.exports = authValidator;
