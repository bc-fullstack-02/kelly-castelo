const express = require("express");
const userRouter = express.Router();
const { User } = require("../models");

userRouter
  .route("/me")
  .get((req, res, next) =>
    Promise.resolve()
      .then(() => User.findById(req.user.id, ["-password"]))
      .then((data) => res.status(200).json(data))
      .catch((err) => next(err))
  )
  .put((req, res, next) =>
    Promise.resolve()
      .then(() =>
        User.findByIdAndUpdate(req.user.id, req.body, {
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
      .then((data) => res.status(203).json(data))
      .catch((err) => next(err))
  );

module.exports = userRouter;
