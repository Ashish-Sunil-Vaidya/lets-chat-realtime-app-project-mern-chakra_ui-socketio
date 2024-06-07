const { Schema, model } = require("mongoose");

const chatSchema = new Schema({
    chatName: {
        type: String,
        required: true,
        true: true
    },
    isGroupChat: {
        type: Boolean,
        default: false
    },
    groupChatProfilePic: {
        type: String,
        default: ''
    },
    users: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
    latestMessage: {
        type: Schema.Types.ObjectId,
        ref: 'Message'
    },
    groupAdmin: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
})

const Chat = model('Chat', chatSchema);

module.exports = Chat;