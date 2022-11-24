const express = require("express");
const securityRouter = express.Router();
const createError = require("http-errors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { User, Profile } = require("../models");
const user = require("../models/user");
const TOKEN_SECRET = process.env.TOKEN_SECRET;

securityRouter.route("/register").post((req, res, next) =>
  Promise.resolve()
    .then(() => bcrypt.hash(req.body.password, 8))
    .then((password) => new User({ ...req.body, password }).save())
    .then((user) =>
      new Profile({ name: req.body.name || req.body.user, user: user._id })
        .save()
        .then((profile) => User.findByIdAndUpdate(user._id, { profile }))
    )
    .then((data) => {
      const user = { ...data };
      delete user._doc.password;
      return user._doc;
    })
    .then((user) => res.status(201).json(user))
    .catch((err) => next(err))
);

securityRouter.route("/login").post((req, res, next) =>
  Promise.resolve()
    .then(() => User.findOne({ user: req.body.user }).populate("profile"))
    .then((user) =>
      user
        ? bcrypt
            .compare(req.body.password, user.password)
            .then((passwordMatch) => [user._doc, passwordMatch])
        : next(createError(404))
    )
    .then(([{ password: _, ...user }, passwordMatch]) => ([user, passwordMatch]))
    .then(([user, passwordMatch]) =>
      passwordMatch
        ? jwt.sign(JSON.stringify(user), TOKEN_SECRET)
        : next(createError(400))
    )
    .then((token) =>
      token ? res.status(201).json({ token }) : next(createError(400))
    )
    .catch((err) => next(err))
);

module.exports = securityRouter;
