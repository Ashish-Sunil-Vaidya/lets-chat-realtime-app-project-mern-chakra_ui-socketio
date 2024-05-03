const express = require('express');
const router = express.Router();
const protect = require("../middlewares/auth")


router.post('/',protect,sendMessage)
router.get('/:chatId',protect,getAllMessages )


module.exports = router