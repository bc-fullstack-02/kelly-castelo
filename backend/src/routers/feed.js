const express = require("express");
const feedRouter = express.Router();
const { Post, Profile } = require("../models");

feedRouter.route("/").get((req, res, next) =>
  Promise.resolve()
    .then(() => Profile.findById(req.user.profile.id))
    .then((profile) =>
      Post.find({ profile: { $in: profile.following } }).populate("profile")
    )
    .then((data) => res.status(200).json(data))
    .catch((err) => next(err))
);

module.exports = feedRouter;
