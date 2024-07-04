import asyncHandler from 'express-async-handler';
import { User } from '../models/user.model.js';
import { Chat } from '../models/chat.model.js';

// function name: accessChat
// Task: To access the chat between two users
// Parameters: req, res
// Method: POST
// Route: http://localhost:5000/api/chat/
// Access: Private (JWT required)
// Returns: Chat Model Object with populated users and latestMessage
export const accessChat = asyncHandler(async (req, res) => {
    const { userId } = req.body;
    if (!userId) {
        res.status(400);
        throw new Error("UserId param not sent with the request");
    }

    let isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            {
                users: { $elemMatch: { $eq: req.user._id } }
            },
            {
                users: { $elemMatch: { $eq: req.userId } }
            }
        ]
    }).populate("users", "-password").populate("latestMessage");
    isChat = await User.populate(isChat, {
        path: "latestMessage.sender"
    });

    if (isChat.length > 0) {
        res.send(isChat[0]);
    } else {
        let chatData = {
            chatName: 'sender',
            isGroupChat: false,
            users: [req.user._id, userId]
        };

        try {
            const createdChat = await Chat.create(chatData);
            const FullChat = await Chat.findOne({ _id: createdChat._id }).populate("users", "-password");
            res.status(200).send(FullChat);
        } catch (err) {
            res.status(400);
            throw new Error(err.message);
        }
    }
});

// function name: fetchChats
// Task: To fetch all the chats of the logged in user
// Parameters: req, res
// Method: GET
// Route: http://localhost:5000/api/chat/
// Access: Private (JWT required)
// Returns: Array of Chat Model Objects with populated users and latestMessage
export const fetchChats = asyncHandler(async (req, res) => {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } }).populate("users", "-password").populate("groupAdmin", "-password").populate("latestMessage").sort({ updatedAt: -1 })
        .then(async (results) => {
            results = await User.populate(results, {
                path: "latestMessage.sender",
                select: "username profilePic email",
            });
            res.status(200).send(results);
        })
        .catch((error) => {
            res.status(400);
            throw new Error(error.message);
        });
});

// function name: createGroupChat
// Task: To create a group chat
// Parameters: req, res
// Method: POST
// Route: http://localhost:5000/api/chat/group
// Access: Private (JWT required)
// Returns: Chat Model Object with populated users and latestMessage
export const createGroupChat = asyncHandler(async (req, res) => {
    if (!req.body.users || !req.body.name) {
        return res.status(400).send({ message: "Please Fill all the feilds" });
    }

    var users = JSON.parse(req.body.users);

    if (users.length < 2) {
        return res
            .status(400)
            .send("More than 2 users are required to form a group chat");
    }

    users.push(req.user);

    try {
        const groupChat = await Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user,
            groupChatProfilePic: req.body.groupChatProfilePic || ''
        });

        const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("groupChatProfilePic", "-password");

        res.status(200).json(fullGroupChat);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

// function name: renameGroupChat
// Task: To rename a group chat
// Parameters: req, res
// Method: PUT
// Route: http://localhost:5000/api/chat/renameGroupChat
// Access: Private (JWT required)
// Returns: Chat Model Object with populated users and latestMessage
export const renameGroupChat = asyncHandler(async (req, res) => {
    const { chatId, chatName } = req.body;
    const updatedChat = await Chat.findByIdAndUpdate(chatId, {
        chatName
    }, {
        new: true
    }).populate("users", "-password").populate("groupAdmin", "-password");
    if (!updatedChat) {
        res.status(404);
        throw new Error("Chat Not Found");
    } else {
        res.status(200).send(updatedChat);
    }
});

export const addToGroupChat = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;
    const addedUsers = await Chat.findByIdAndUpdate(chatId, {
        $push: { users: userId }
    }, {
        new: true
    }).populate("users", "-password").populate("groupAdmin", "-password");
    if (!addedUsers) {
        res.status(404);
        throw new Error("Chat not Found");
    }
    else {
        res.status(200).send(addedUsers);
    }
});

export const removefromGroupChat = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;
    const addedUsers = await Chat.findByIdAndUpdate(chatId, {
        $pull: { users: userId }
    }, {
        new: true
    }).populate("users", "-password").populate("groupAdmin", "-password");
    if (!addedUsers) {
        res.status(404);
        throw new Error("Chat not Found");
    }
    else {
        res.status(200).send(addedUsers);
    }
});

export const updateProfilePic = asyncHandler(async (req, res) => {
    const { chatId, groupChatProfilePic } = req.body;
    const updatedChat = await Chat.findByIdAndUpdate(chatId, {
        groupChatProfilePic
    }, {
        new: true
    }).populate("users", "-password").populate("groupAdmin", "-password");
    if (!updatedChat) {
        res.status(404);
        throw new Error("Chat Not Found");
    } else {
        res.status(200).send(updatedChat);
    }
});

export const deleteChats = asyncHandler(async (req, res) => {
    const { chatIds } = req.body;
    const deletedChats = await Chat.deleteMany({ _id: { $in: chatIds } });
    if (!deletedChats) {
        res.status(404);
        throw new Error("Chats not Found");
    } else {
        res.status(200).send("Chats Deleted Successfully");
    }
});
