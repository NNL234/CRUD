const jwt = require("jsonwebtoken");
const config = require("config");
const { roleId } = require("./role");

module.exports = (user) => {
    console.log(user.roleId)
    const token = jwt.sign(
        {
            username: user.username,
            roleId : user.roleId,
            name:user.name,
        },
        config.get("jwtPrivateKey")
    );
    return token;
}