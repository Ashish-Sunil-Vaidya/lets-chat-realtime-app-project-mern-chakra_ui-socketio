
const { sign } = require("jsonwebtoken");

// This function is used to generate a token for the user
const generateToken = (id) => {
    return sign({ id }, process.env.JWT_SECRET_KEY, {
        expiresIn: "1d"
    });
}

module.exports = generateToken;