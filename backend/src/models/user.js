const { Schema, model } = require("mongoose");

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        minLength: 2
    },
    user: {
        type: String,
        unique: true,
        required: true,
        minLength: 2
    },
    password: {
        type: String,
        required: true,
        minLength: 2
    },
    following: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
});

module.exports = model("User", userSchema);
