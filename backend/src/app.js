const express = require("express");

const app = express();

const { Connection } = require("./models");

app.use((req, res, next) =>
  Connection.then(() => next()).catch((err) => next(err))
);

module.exports = app;
