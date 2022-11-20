const express = require("express");
const app = express();
const cors = require("cors");
const helmet = require("helmet");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

const { Connection } = require("./models");
const { PostRouter, CommentRouter, UserRouter } = require("./routers");

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
app.use("/v1/posts", PostRouter);
PostRouter.use("/", CommentRouter);

app.use((err, req, res, next) => {
  console.log("Error handling middleware")
  console.log("Path: " + req.path)

  if(err.name && err.name === "ValidationError") {
    const errors = Object.entries(err.errors).map(([, obj]) => obj.message);
    res.status(400).json({
      path: req.path,
      status: 400,
      errors
    })
  } else {
    res.status(err.status || 500).json({
      path: req.path,
      status: err.status || 500,
      errors : err.message
    })
  }
})


module.exports = app;
