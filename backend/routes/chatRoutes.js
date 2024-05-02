const express = require('express');
const { accessChat, fetchChats, createGroupChat, renameGroupChat, addToGroupChat, removefromGroupChat } = require('../controllers/chatController');
const router = express.Router();
const protect = require("../middlewares/auth")

router.get('/', protect, fetchChats)
router.post('/', protect, accessChat)
router.post('/group', protect, createGroupChat)
router.put('/renameGroupChat', protect, renameGroupChat)
router.put('/addToGroupChat', protect, addToGroupChat)
router.put('/removeFromGroupChat', protect, removefromGroupChat)

module.exports = router