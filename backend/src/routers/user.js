const express = require("express");
const userRouter = express.Router();
const createError = require("http-errors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { User } = require("../models");
const TOKEN_SECRET = process.env.TOKEN_SECRET;

userRouter
  .route("/")
  .get((req, res) =>
    Promise.resolve()
      .then(() => User.find({}, ["-password"]))
      .then((data) => res.status(200).json(data))
      .catch((err) => next(err))
  )
  .post((req, res, next) =>
    Promise.resolve()
      .then(() => bcrypt.hash(req.body.password, 8))
      .then((password) => new User({ ...req.body, password }).save())
      .then((data) => {
        const user = { ...data };
        delete user._doc.password;
        return user._doc;
      })
      .then((user) => res.status(201).json(user))
      .catch((err) => next(err))
  );

userRouter
  .route("/:id")
  .get((req, res, next) =>
    Promise.resolve()
      .then(() =>
        User.findById(req.params.id).select("-password").populate({
          path: "following",
        })
      )
      .then((data) =>
        data ? res.status(200).json(data) : next(createError(404))
      )
      .catch((err) => next(err))
  )
  .put((req, res, next) =>
    Promise.resolve()
      .then(() =>
        User.findByIdAndUpdate(req.params.id, req.body, {
          runValidators: true,
          new: true,
          select: "-password",
        })
      )
      .then((data) => res.status(203).json(data))
      .catch((err) => next(err))
  )
  .delete((req, res, next) =>
    Promise.resolve()
      .then(() => User.deleteOne({ _id: req.params.id }))
      .then((data) => res.status(203).json(data))
      .catch((err) => next(err))
  );

userRouter.route("/login").post((req, res, next) =>
  Promise.resolve()
    .then(() => User.findOne({ user: req.body.user }))
    .then((user) =>
      user
        ? bcrypt.compare(req.body.password, user.password)
        : next(createError(404))
    )
    .then((password) =>
      password ? jwt.sign(req.body.user, TOKEN_SECRET) : next(createError(400))
    )
    .then((token) =>
      token ? res.status(201).json({ token }) : next(createError(400))
    )
    .catch((err) => next(err))
);

module.exports = userRouter;
