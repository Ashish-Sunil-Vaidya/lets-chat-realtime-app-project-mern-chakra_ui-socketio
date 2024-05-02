const{ Schema,model } = require("mongoose");

const messageSchema = new Schema({
    chat: {
        type: Schema.Types.ObjectId,
        ref: 'Chat'
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
}, {
    timestamps: true
})

const Message = model('Message', messageSchema);

module.exports = Message;