import { Router } from "express";
import { loginUser, registerUser, getAllUsers, updateUser } from "../controllers/user.controller.js";
import {protect} from "../middlewares/auth.middleware.js";

const router = Router();

// This route is used to login a user
router.post("/login", loginUser);

// This route is used to register a user
router.post("/signup", registerUser);

// This route is used to get all the users
router.get("/", protect, getAllUsers);

// This route is used to update the profile picture of a user
router.put("/updateUser", protect, updateUser);

export default router;
