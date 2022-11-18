const mongoose = require("mongoose");

const connect = mongoose.connect(
  `${process.env.MONGO_URL || "mongodb://localhost:27017/mydb"}_${
    process.env.NODE_ENV || "development"
  }`,
  // https://mongoosejs.com/docs/connections.html#options
  {
    serverSelectionTimeoutMS: !process.env.NODE_ENV ? 1000 : 30000,
  } // Keep trying to send operations for 5 seconds
);

exports.Post = require("./post");
exports.Comment = require("./comment");
exports.Redact = require("./redact");

mongoose.connection.on("error", () => {
  console.error("Mongo not connected");
});
mongoose.connection.on("connected", () => {
  console.info("Mongo connected");
});
mongoose.connection.on("disconnected", () => {
  console.error("Mongo disconnected");
});

exports.Connection = connect;
