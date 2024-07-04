import express from 'express';
import { accessChat, fetchChats, createGroupChat, renameGroupChat, addToGroupChat, removefromGroupChat, updateProfilePic, deleteChats } from '../controllers/chat.controller.js';
import {protect} from "../middlewares/auth.middleware.js";

const router = express.Router();

// This route is used to fetch all the chats of the user
router.get('/', protect, fetchChats);

// This route is used to access a chat
router.post('/', protect, accessChat);

// This route is used to create a group chat
router.post('/group', protect, createGroupChat);

// This route is used to rename a group chat
router.put('/renameGroupChat', protect, renameGroupChat);

// This route is used to add a user to a group chat
router.put('/addToGroupChat', protect, addToGroupChat);

// This route is used to remove a user from a group chat
router.put('/removeFromGroupChat', protect, removefromGroupChat);

// This route is used to update group chat profile picture
router.put("/updateProfilePic", protect, updateProfilePic);

// This route is used to delete a chats of a specific user
router.delete('/', protect, deleteChats);

export default router;
