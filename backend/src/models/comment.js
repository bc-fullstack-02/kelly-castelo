const { Schema, model } = require("mongoose");

const commentSchema = new Schema(
  {
    description: {
      type: String,
      required: true,
      minLength: 2,
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
  },
  { timestamps: true }
);

module.exports = model("Comment", commentSchema);
