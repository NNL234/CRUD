const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = (user) => {
    const token = jwt.sign(
        {
            _id: user._id,
            roleId : user.roleId,
        },
        config.get("jwtPrivateKey")
    );
    return token;
}