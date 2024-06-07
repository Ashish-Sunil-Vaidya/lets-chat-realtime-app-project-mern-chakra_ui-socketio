const { Router } = require("express");
const router = Router();
const { loginUser, registerUser, getAllUsers } = require("../controllers/userController.js");
const protect = require("../middlewares/auth.js");

// This route is used to login a user
router.post("/login", loginUser);

// This route is used to register a user
router.post("/signup", registerUser);

// This route is used to get all the users
router.get("/", protect, getAllUsers)

module.exports = router;
