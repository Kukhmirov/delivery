const {Schema, model} = require('mongoose');

const chatSchema = new Schema({
    users: {
        type: [Schema.Types.ObjectId, Schema.Types.ObjectId],
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
    },
    messages: {
        type: Array,
    },
});

module.exports = model('Chat', chatSchema);