const express = require('express');
const { accessChat, fetchChats, createGroupChat, renameGroupChat, addToGroupChat, removefromGroupChat } = require('../controllers/chatController');
const router = express.Router();
const protect = require("../middlewares/auth")

// This route is used to fetch all the chats of the user
router.get('/', protect, fetchChats)

// This route is used to access a chat
router.post('/', protect, accessChat)

// This route is used to create a group chat
router.post('/group', protect, createGroupChat)

// This route is used to rename a group chat
router.put('/renameGroupChat', protect, renameGroupChat)

// This route is used to add a user to a group chat
router.put('/addToGroupChat', protect, addToGroupChat)

// This route is used to remove a user from a group chat
router.put('/removeFromGroupChat', protect, removefromGroupChat)

module.exports = router