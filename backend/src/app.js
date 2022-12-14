const express = require("express");
const app = express();
const cors = require("cors");
const helmet = require("helmet");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
const createError = require("http-errors");
const path = require("path");

const { Connection } = require("./models");
const {
  PostRouter,
  CommentRouter,
  UserRouter,
  SecurityRouter,
  ProfileRouter,
  FeedRouter,
} = require("./routers");
const { AuthValidator, ErrorHandler } = require("./middleware");
const pubsub = require("./pubsub");

app.use(express.json());
app.use(express.urlencoded({ extended: false }))

app.use(express.static(path.join(__dirname, "public")));

app.use(pubsub.pub);

// app.use((req, res, next) =>
//   (/^multipart\//i.test(req.get("Content-Type")))
//     ? next()
//     : urlencodedMiddleware(req, res, next)
// );

app.use(cors());
// app.use(helmet());

// swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// create connection with mongo
app.use((req, res, next) =>
  Connection.then(() => next()).catch((err) => next(err))
);

// routes
app.use("/v1/security", SecurityRouter);
app.use("/v1/users", AuthValidator, UserRouter);
app.use("/v1/posts", AuthValidator, PostRouter);
app.use("/v1/profiles", AuthValidator, ProfileRouter);
app.use("/v1/feed", AuthValidator, FeedRouter);
PostRouter.use("/", AuthValidator, CommentRouter);

// if requested a route that doesn't exist
app.use((req, res, next) => {
  const err = createError(404);
  next(err);
});

// error handler middleware
app.use(ErrorHandler);

module.exports = app;
