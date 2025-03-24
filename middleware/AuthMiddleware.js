// authMiddleware.js
const jwt = require("jsonwebtoken");

const generateToken = (user) => {
    return jwt.sign({ userId: user.email }, global.settings.KEY, { expiresIn: global.settings.TIME });
};





module.exports = { generateToken };