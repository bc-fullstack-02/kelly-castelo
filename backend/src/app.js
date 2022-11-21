const express = require("express");
const app = express();
const cors = require("cors");
const helmet = require("helmet");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

const { Connection } = require("./models");
const { PostRouter, CommentRouter, UserRouter } = require("./routers");
const { AuthValidator, ErrorHandler } = require("./middleware");

app.use(express.json());
app.use(cors());
app.use(helmet());

// swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// create connection with mongo
app.use((req, res, next) =>
  Connection.then(() => next()).catch((err) => next(err))
);

// routes

app.use("/v1/users", UserRouter);
app.use("/v1/posts", AuthValidator, PostRouter);
PostRouter.use("/", AuthValidator, CommentRouter);

// error handler middleware
app.use(ErrorHandler);

module.exports = app;
