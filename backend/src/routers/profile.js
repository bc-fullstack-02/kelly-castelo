const express = require("express");
const profileRouter = express.Router();
const createError = require("http-errors");

const { Profile } = require("../models");

profileRouter.route("/").get((req, res, next) =>
  Promise.resolve()
    .then(() => Profile.find({}))
    .then((data) => res.status(200).json(data))
    .catch((err) => next(err))
);

//to-do: review mongodb score parameters
profileRouter.route("/search").get((req, res, next) =>
  Promise.resolve()
    .then(() =>
      Profile.find(
        { $text: { $search: `${req.query.q}` } },
        { score: { $meta: "textScore" } }
      ).sort({ score: { $meta: "textScore" } })
    )
    .then((data) =>
      data ? res.status(200).json(data) : next(createError(404))
    )
    .catch((err) => next(err))
);

profileRouter.route("/:id").get((req, res, next) =>
  Promise.resolve()
    .then(() =>
      Profile.findById(req.params.id).populate(["following", "followers"])
    )
    .then((data) =>
      data ? res.status(200).json(data) : next(createError(404))
    )
    .catch((err) => next(err))
);

profileRouter.route("/:id/follow").post((req, res, next) =>
  Promise.resolve()
    .then(() => Profile.findById(req.params.id))
    .then((data) =>
      data
        ? data.followers.find((user) => user._id.equals(req.user.profile._id))
        : next(createError(404))
    )
    .then(
      (user) =>
        user === undefined &&
        Profile.findOneAndUpdate(
          { _id: req.params.id },
          { $push: { followers: req.user.profile._id } }
        )
    )
    .then((args) => args && req.publish("follow", req.params.id, args))
    .then(
      (data) =>
        data &&
        Profile.findOneAndUpdate(
          { _id: req.user.profile._id },
          { $push: { following: req.params.id } },
          { new: true }
        )
    )
    .then((data) => (data ? res.status(200).json(data) : next(createError(400))))
    .catch((err) => next(err))
);

profileRouter.route("/:id/unfollow").post((req, res, next) =>
  Promise.resolve()
    .then(() => Profile.findById(req.params.id))
    .then((data) =>
      data
        ? data.followers.find((user) => user._id.equals(req.user.profile._id))
        : next(createError(404))
    )
    .then(
      (user) =>
        user !== undefined &&
        Profile.findOneAndUpdate(
          { _id: req.params.id },
          { $pull: { followers: req.user.profile._id } }
        )
    )
    .then(
      (data) =>
        data &&
        Profile.findOneAndUpdate(
          { _id: req.user.profile._id },
          { $pull: { following: req.params.id } },
          { new: true }
        )
    )
    .then((data) => (data ? res.status(200).json(data) : next(createError(400))))
    .catch((err) => next(err))
);

module.exports = profileRouter;
