const express = require('express');
const router = express.Router();
const protect = require("../middlewares/auth")
const {sendMessage,getAllMessages} = require('../controllers/messagesController')

// This route is used to send a message
router.post('/',protect,sendMessage)

// This route is used to get all the messages in a chat
router.get('/:chatId',protect,getAllMessages )


module.exports = router