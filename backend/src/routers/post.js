const express = require("express");
const postRouter = express.Router();
const createError = require("http-errors");
const { Post } = require("../models");

postRouter
  .route("/")
  .get((req, res) =>
    Promise.resolve()
      .then(() =>
        Post.find({}).populate("comments", "-post").populate("profile")
      )
      .then((data) => res.status(200).json(data))
      .catch((err) => next(err))
  )
  .post((req, res, next) =>
    Promise.resolve()
      .then(() =>
        new Post({ ...req.body, profile: req.user.profile._id })
          .save()
          .then((post) => post.populate("profile"))
      )
      .then((args) => req.publish("post", req.user.profile.followers, args))
      .then((data) => res.status(201).json(data))
      .catch((err) => next(err))
  );

postRouter
  .route("/:id")
  .get((req, res, next) =>
    Promise.resolve()
      .then(() =>
        Post.findById(req.params.id)
          .populate({
            path: "comments",
            select: "-post",
            populate: {
              path: "profile",
            },
          })
          .populate({ path: "profile" })
      )
      .then((data) =>
        data ? res.status(200).json(data) : next(createError(404))
      )
      .catch((err) => next(err))
  )
  .put((req, res, next) =>
    Promise.resolve()
      .then(() =>
        Post.findByIdAndUpdate(req.params.id, req.body, {
          runValidators: true,
          new: true,
        })
      )
      .then((data) =>
        data ? res.status(203).json(data) : next(createError(404))
      )
      .catch((err) => next(err))
  )
  .delete((req, res, next) =>
    Promise.resolve()
      .then(() =>
        Post.deleteOne({ _id: req.params.id }).orFail(() =>
          next(createError(404))
        )
      )
      .then(() => res.status(204).json())
      .catch((err) => next(err))
  );

postRouter.route("/:id/like").post((req, res, next) =>
  Promise.resolve()
    .then(() => Post.findById(req.params.id))
    .then((data) =>
      data
        ? data.likes.find((user) => user._id.equals(req.user.profile._id))
        : next(createError(404))
    )
    .then((user) =>
      user === undefined
        && Post.findOneAndUpdate(
            { _id: req.params.id },
            { $push: { likes: req.user.profile._id } },
            { new: true }
          )
    )
    .then(
      (args) =>
        args && req.publish("post-like", req.user.profile.followers, args)
    )
    .then((data) =>
      data ? res.status(200).json(data) : next(createError(400))
    )
    .catch((err) => next(err))
);

// esse nome ta uma p****
postRouter.route("/:id/unlike").post((req, res, next) =>
  Promise.resolve()
    .then(() => Post.findById(req.params.id))
    .then((data) =>
      data
        ? data.likes.find((user) => user._id.equals(req.user.profile._id))
        : next(createError(404))
    )
    .then(
      (user) =>
        user !== undefined &&
        Post.findOneAndUpdate(
          { _id: req.params.id },
          { $pull: { likes: req.user.profile._id } },
          { new: true }
        )
    )
    .then((data) =>
      data ? res.status(200).json(data) : next(createError(400))
    )
    .catch((err) => next(err))
);

module.exports = postRouter;
