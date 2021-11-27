
const roleList=['Admin','A1','A2','A3','B1','B2'];

exports.roleId =(role)=> {
    return roleList.findIndex((roleItem)=> roleItem ==role);
}
exports.role = (roleId) => {
    return roleList[roleId]
}
exports.checkRole = function (roleId,permissRole) {
    return roleId <= role(permissRole);
}
//check roleid cua user xem user do co quyen them user khong
const checkAddUserPermission = function(roleId) {
    return roleId < 5
}
exports.checkPermission = function (req,res,next) {
    if(checkAddUserPermission(req.decodedToken.roleId))
        next()
    else res.status(403).send({message:"Accesss denied"})
}
