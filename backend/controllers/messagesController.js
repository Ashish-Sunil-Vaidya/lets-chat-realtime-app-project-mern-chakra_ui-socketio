import asyncHandler from "express-async-handler";
import {Message} from "../models/messageModel.js";
import {User} from "../models/userModel.js";
import {Chat} from "../models/chatModel.js";

// function name: sendMessage
// Task: To send a message in a chat
// Parameters: req, res
// Method: POST
// Route: http://localhost:5000/api/chat/sendMessage
// Access: Private (JWT required)
// Returns: Message Model Object
export const sendMessage = asyncHandler(async (req, res) => {
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
            result = await result.populate("sender", "username profilePic");
            result = await result.populate("chat");
            result = await User.populate(result, {
                path: "chat.users",
                select: "username profilePic email",
            });
            await Chat.findByIdAndUpdate(chatId, {
                latestMessage: result,
            });
            res.status(200).json(result);
        })
        .catch((error) => {
            res.status(400);
            throw new Error(error.message);
        });
});

// function name: getAllMessages
// Task: To get all the messages in a chat
// Parameters: req, res
// Method: GET
// Route: http://localhost:5000/api/chat/:chatId
// Access: Private (JWT required)
// Returns: Array of Message Model Objects
export const getAllMessages = asyncHandler(async (req, res) => {
    const chatId = req.params.chatId;
    if (!chatId) {
        res.status(400);
        throw new Error("ChatId not sent with the request");
    }

    await Message.find({ chat: chatId })
        .populate("sender", "username profilePic email")
        .populate("chat")
        .then((result) => {
            res.status(200).json(result);
        })
        .catch((error) => {
            res.status(400);
            throw new Error(error.message);
        });
});
