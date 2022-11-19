const express = require("express");
const postRouter = express.Router();
const createError = require("http-errors");
const { Post } = require("../models");

postRouter
  .route("/")
  .get((req, res) =>
    Promise.resolve()
      .then(() => Post.find({}).populate("comments"))
      .then((data) => res.status(200).json(data))
      .catch((err) => next(err))
  )
  .post((req, res, next) =>
    Promise.resolve()
      .then(() => new Post(req.body).save())
      .then((data) => res.status(201).json(data))
      .catch((err) => next(err))
  );

postRouter
  .route("/:id")
  .get((req, res, next) =>
    Promise.resolve()
      .then(() =>
        Post.findById(req.params.id).populate({
          path: "comments",
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
        Post.findByIdAndUpdate(req.params.id, req.body, {
          runValidators: true,
          new: true
        })
      )
      .then((data) => res.status(203).json(data))
      .catch((err) => next(err))
  )
  .delete((req, res, next) =>
    Promise.resolve()
      .then(() => Post.deleteOne({ _id: req.params.id }))
      .then((data) => res.status(203).json(data))
      .catch((err) => next(err))
  );

module.exports = postRouter;