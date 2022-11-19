const express = require("express");
const app = express();
const { Connection } = require("./models");
const { PostRouter, CommentRouter } = require("./routers");

app.use(express.json());

app.use((req, res, next) =>
  Connection.then(() => next()).catch((err) => next(err))
);

app.use("/posts", PostRouter);
PostRouter.use("/", CommentRouter);

module.exports = app;
