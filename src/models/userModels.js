const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    email: {
        type: String,
        require: true,
    },
    passwordHash: {
        type: String,
        require: true,
    },
    name: {
        type: String,
        require: true,
    },
    contactPhone: {
        type: String,
        default: "",
    }
});

module.exports = model("User", userSchema);