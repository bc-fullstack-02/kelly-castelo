const express = require("express");
const userRouter = express.Router();
const { User } = require("../models");
const createError = require("http-errors");

userRouter
  .route("/me")
  .get((req, res, next) =>
    Promise.resolve()
      .then(() => User.findById(req.user._id, ["-password"]))
      .then((data) => data ? res.status(200).json(data) : next(createError(404)))
      .catch((err) => next(err))
  )
  .put((req, res, next) =>
    Promise.resolve()
      .then(() =>
        User.findByIdAndUpdate(req.user._id, req.body, {
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
      .then(() => User.deleteOne({ _id: req.user.id }))
      .then(() => res.status(204).json())
      .catch((err) => next(err))
  );

module.exports = userRouter;
