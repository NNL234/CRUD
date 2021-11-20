const config = require("config");
const jwt = require("jsonwebtoken");

module.exports = function (req,res,next) {
    const token = req.header('token');
    if(!token) return res.status(401).send("Access denied. No token provided");

    try {
        const decoded = jwt.verify(token,config.get("jwtPrivateKey"));
        req.jwtPayload = decoded;
        next();
    } catch (err) {
        res.status(400).send("Invalid token")
    }
}