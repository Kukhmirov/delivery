const { Schema, model } = require('mongoose');

const advertisementSchema = new Schema({
    shortText: {
        type: String,
        require: true,
    },
    description: {
        type: String,
        default: "",
    },
    images: {
        type: [String],
        default: [],
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
    },
    updatedAt: {
        type: Date,
        required: true,
    },
    tags: {
        type: [String],
        default: [],
    },
    isDeleted: {
        type: Boolean,
        required: true,
    }
});

module.exports = model("advertisementDb", advertisementSchema);