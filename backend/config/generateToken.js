import jwt from "jsonwebtoken";
const { sign } = jwt;

// This function is used to generate a token for the user
export const generateToken = (id) => {
    return sign({ id }, process.env.JWT_SECRET_KEY, {
        expiresIn: "1d"
    });
};
