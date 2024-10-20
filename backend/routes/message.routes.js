import express from 'express';
import {protect} from "../middlewares/auth.middleware.js";
import { sendMessage, getAllMessages } from '../controllers/messages.controller.js';

const router = express.Router();

// This route is used to send a message
router.post('/', protect, sendMessage);

// This route is used to get all the messages in a chat
router.get('/:chatId', protect, getAllMessages);

export default router;
