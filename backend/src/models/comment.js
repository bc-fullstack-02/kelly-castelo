const { Schema, model } = require("mongoose");

const commentSchema = new Schema(
  {
    description: {
      type: String,
      required: true,
      minLength: 2,
    },
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
  },
);

module.exports = model("Comment", commentSchema);
