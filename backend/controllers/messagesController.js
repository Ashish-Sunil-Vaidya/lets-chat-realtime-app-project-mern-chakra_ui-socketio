const asyncHandler = require("express-async-handler");

const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");

const sendMessage = asyncHandler(async (req, res) => {
    const { chatId, messageContent } = req.body;
    if (!chatId || !messageContent) {
        res.status(400);
        throw new Error("ChatId or message not sent with the request");
    }

    const newMessage = {
        sender: req.user._id,
        chat: chatId,
        content: messageContent,
    };

    await Message.create(newMessage)
        .then(async (result) => {
            result = await result.populate("sender", "name pic").execPopulate();
            result = await result.populate("chat").execPopulate();
            result = await User.populate(result, {
                path: "chat.users",
                select: "name pic email",
            });
            await Chat.findByIdAndUpdate(chatId, {
                latestMessage: result._id,
            });
            res.status(200).json(result);
        })
        .catch((error) => {
            res.status(400);
            throw new Error(error.message);
        });
}
);