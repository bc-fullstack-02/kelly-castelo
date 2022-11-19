const express = require("express");
const app = express();
const { Connection } = require("./models");
const { PostRouter, CommentRouter, UserRouter } = require("./routers");

app.use(express.json());

app.use((req, res, next) =>
  Connection.then(() => next()).catch((err) => next(err))
);

app.use("/users", UserRouter);
app.use("/posts", PostRouter);
PostRouter.use("/", CommentRouter);

module.exports = app;
