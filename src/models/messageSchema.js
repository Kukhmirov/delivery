const {Schema, model} = require('mongoose');

const messageSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    sentAt: {
        type: Date,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    readAt: { //a message is considered as red, when the field is empty
        type: Date,    
    },

});

module.exports = model('Message', messageSchema);