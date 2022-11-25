const { Schema, model } = require("mongoose");

const postSchema = new Schema({
  title: {
    type: String,
    required: true,
    minLength: 2,
  },
  description: {
    type: String,
    required: true,
    minLength: 2,
  },
  profile: {
    type: Schema.Types.ObjectId,
    ref: "Profile",
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: "Profile",
    },
  ],
  image: {
    type: Boolean,
    default: false
  },
  image_url: {
    type: String
  }
});

module.exports = model("Post", postSchema);
