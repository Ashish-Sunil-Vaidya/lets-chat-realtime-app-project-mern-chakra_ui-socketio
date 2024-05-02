const { isStrongPassword } = require("validator");
const User = require("../models/userModel.js");
const generateToken = require("../config/generateToken.js");
const asyncHandler = require("express-async-handler");

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400)
        throw new Error("Please enter all fields");
    }

    const user = await User.findOne({ email });
    if (!user) {
        res.status(404)
        throw new Error("User does not exist");
    }

    if (!user.matchPassword(password)) {
        res.status(400)
        throw new Error("Invalid credentials");
    }

    const token = generateToken(user._id);

    res.status(201).json({
        token,
        id: user._id,
        username: user.username,
        email: user.email,
        profilePic: user.profilePic
    })

});

const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password, confirmPassword, avatarUrl } = req.body;
    if (!username || !email || !password || !confirmPassword) {
        res.status(400)
        throw new Error("Please enter all fields");
    }

    if (password !== confirmPassword) {
        res.status(400)
        throw new Error("Passwords do not match");
    }

    if (!isStrongPassword(password)) {
        res.status(400)
        throw new Error("Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character");
    }

    const user = await User.findOne({ email });

    if (user) {
        res.status(400)
        throw new Error("User already exists");
    }

    await User.create({
        username,
        email,
        password,
        profilePic: avatarUrl || ""
    }).then((user) => {
        const token = generateToken(user._id);
        res.status(201).json({
            token,
            id: user._id,
            username: user.username,
            email: user.email,
            profilePic: user.profilePic
        })
    }).catch((error) => {
        res.status(400)
        throw new Error(error.message);
    });

});

const getAllUsers = asyncHandler(async (req, res) => {

    if (!req.query.search) {
        throw new Error("Please enter something to search")
    }

    const keyword = req.query.search ? {
        $or: [
            {
                username: {
                    $regex: req.query.search, $options: "i"
                },
            },
            {
                email: {
                    $regex: req.query.search, $options: "i"
                }
            }
        ]
    } : {}

    const users = await User.find(keyword).find({
        _id: { $ne: req.user._id }
    });


    res.send(users);
});

module.exports = { loginUser, registerUser, getAllUsers };


