
const roleList=['Admin','A1','A2','A3','B1','B2'];
exports.roleId =(role)=> {
    return roleList.findIndex((roleItem)=> roleItem ==role);
}
exports.role = (roleId) => {
    return roleList[roleId]
}
