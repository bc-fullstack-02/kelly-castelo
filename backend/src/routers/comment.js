const express = require("express");
const commentRouter = express.Router();
const createError = require("http-errors");
const { Comment, Post } = require("../models");

commentRouter
  .param("postId", (req, res, next, id) =>
    Promise.resolve()
      .then(() => Post.findById(id))
      .then((post) => (post ? next() : next(createError(404))))
      .catch((err) => next(err))
  )
  .route("/:postId/comments")
  .get((req, res) =>
    Promise.resolve()
      .then(() =>
        Comment.find({ post: req.params.postId })
          .select("-post")
          .populate("profile")
      )
      .then((data) => res.status(200).json(data))
      .catch((err) => next(err))
  )
  .post((req, res, next) =>
    Promise.resolve()
      .then(() =>
        new Comment(Object.assign(req.body, { post: req.params.postId })).save()
      )
      .then((comment) =>
        Post.findById(comment.post)
          .populate("profile")
          .then((post) =>
            Object.assign(post, { comments: [...post.comments, comment._id] })
          )
          .then((post) => Post.findByIdAndUpdate(comment.post, post))
          .then(() => comment)
      )
      .then((data) => {
        res.status(201).json(data);
      })
      .catch((err) => next(err))
  );

// loading infinito se passar um id existente que não seja do post....
commentRouter
  .param("postId", (req, res, next, id) =>
    Promise.resolve()
      .then(() => Post.findById(id))
      .then((post) => (post ? next() : next(createError(404))))
      .catch((err) => next(err))
  )
  .route("/:postId/comments/:id")
  .get((req, res, next) =>
    Promise.resolve()
      .then(() =>
        Comment.findById(req.params.id)
          .orFail(() => createError(404))
          .select("-post")
          .populate({ path: "profile" })
      )
      .then((data) => res.status(200).json(data))
      .catch((err) => next(err))
  )
  .put((req, res, next) =>
    Promise.resolve()
      .then(() =>
        Comment.findByIdAndUpdate(req.params.id, req.body, {
          runValidators: true,
          new: true,
        })
      )
      .then((data) => (data ? res.status(203).json(data) : next(createError(404))))
      .catch((err) => next(err))
  )
  .delete((req, res, next) =>
    Promise.resolve()
      .then(() =>
        Comment.deleteOne({ _id: req.params.id }).orFail(() =>
          next(createError(404))
        )
      )
      .then(() => res.status(204).json())
      .catch((err) => next(err))
  );

commentRouter
  .param("postId", (req, res, next, id) =>
    Promise.resolve()
      .then(() => Post.findById(id))
      .then((post) => (post ? next() : next(createError(404))))
      .catch((err) => next(err))
  )
  .route("/:postId/comments/:id/like")
  .post((req, res, next) =>
    Promise.resolve()
      .then(() => Comment.findById(req.params.id))
      .then((data) =>
        data.likes.find((user) => user._id.toString() === req.user.profile.id)
      )
      .then((user) =>
        user === undefined
          ? Comment.findOneAndUpdate(
              { _id: req.params.id },
              { $push: { likes: req.user.profile.id } },
              { new: true }
            )
          : next(createError(400))
      )
      .then((data) => (data ? res.status(200).json(data) : createError(400)))
      .catch((err) => next(err))
  );

// esse nome ta uma p****
commentRouter
  .param("postId", (req, res, next, id) =>
    Promise.resolve()
      .then(() => Post.findById(id))
      .then((post) => (post ? next() : next(createError(404))))
      .catch((err) => next(err))
  )
  .route("/:postId/comments/:id/unlike")
  .post((req, res, next) =>
    Promise.resolve()
      .then(() => Comment.findById(req.params.id))
      .then((data) =>
        data.likes.find((user) => user._id.toString() === req.user.profile.id)
      )
      .then((user) =>
        user !== undefined
          ? Comment.findOneAndUpdate(
              { _id: req.params.id },
              { $pull: { likes: req.user.profile.id } },
              { new: true }
            )
          : next(createError(400))
      )
      .then((data) => (data ? res.status(200).json(data) : createError(400)))
      .catch((err) => next(err))
  );

module.exports = commentRouter;
