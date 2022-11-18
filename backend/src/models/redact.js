const { Schema, model } = require("mongoose");

const redactSchema = new Schema({
  term: {
    type: String,
    required: true,
    minLength: 2,
  },
});

module.exports = model("Redact", redactSchema);
