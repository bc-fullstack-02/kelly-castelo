const { Schema, model } = require("mongoose");
const Redact = require("./redact");

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "titulo obrigatorio"],
      minLength: [2, "titulo no minimo 2"],
    },
    description: {
      type: String,
      required: [true, "descricao obrigatoria"],
      validate: {
        // bonus track
        validator: (val) =>
          Redact.count({ term: val }).then((count) => count === 0),
        message: "nao pode usar a palavra {VALUE}",
      },
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  { timestamps: true }
);

module.exports = model("Post", postSchema);
