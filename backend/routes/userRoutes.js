const { Router } = require("express");
const router = Router();
const { loginUser, registerUser, getAllUsers } = require("../controllers/userController.js");
const protect = require("../middlewares/auth.js");

router.post("/login", loginUser);
router.post("/signup", registerUser);
router.get("/", protect, getAllUsers)

module.exports = router;
