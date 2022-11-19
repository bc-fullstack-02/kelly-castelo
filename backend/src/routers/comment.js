/*
    TO-DO: remover comentários assim que resolver os problemas
*/

const express = require("express");
const commentRouter = express.Router();
const createError = require("http-errors");
const { Comment, Post } = require("../models");

//search for transactions with mongoose
commentRouter
  .route("/:postId/comments")
  .get((req, res) =>
    Promise.resolve()
      .then(() => Comment.find({ post: req.params.postId }))
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
  .route("/:postId/comments/:id")
  .get((req, res, next) =>
    Promise.resolve()
      .then(() => Comment.findById(req.params.id))
      .then((data) => {
        data ? res.status(200).json(data) : createError(404);
      })
      .catch((err) => next(err))
  )
  .put((req, res, next) =>
    Promise.resolve()
      .then(() =>
        Comment.findByIdAndUpdate(req.params.id, req.body, {
          runValidators: true,
          new: true
        })
      )
      .then((data) => res.status(203).json(data))
      .catch((err) => next(err))
  )
  .delete((req, res, next) =>
    Promise.resolve()
      .then(() => Comment.deleteOne({ _id: req.params.id }))
      .then((data) => res.status(203).json(data))
      .catch((err) => next(err))
  );

module.exports = commentRouter;
