const User = require('../models/user')
const  utilsdb= require('../models/neo4j')

//decodedToken gom username, name, roleId 
exports.getUsers=async function (req,res,next) {
    req.user ={...req.decodedToken}
    User.findAll(utilsdb.getSession(req),req.user)
    .then(result=> res.send(result))
    .catch(err=>console.log(err))
}
//them 1 user
//client gui name,username,password
//cac fields khac nhu active(quyen khai bao) =true,
//role,completed(hoan thanh khai bao)=false models tu them
exports.addUser = async function (req,res,next) {
    const user ={...req.decodedToken}
    const {username,password,name}= req.body
    const newUser ={username,password,name}
    //username la ma tp/huyen/xa...
    //name la ten tp/huyen/xa...
    //tim trong db ...
    let result
    //tim trng db  co node co ten tinh/tp hoac ma tinh/tp giong voi tt client gui len khong
    await User.find(utilsdb.getSession(req),{username,name})
    .then(response=> res.status(201).send(response))
    .catch(err=>console.log(err))
    // //neu tai khoan da ton tai...
    if(result) 
    res.status(400).send({message:"tai khoan da ton tai"})
    //neu chua tao tai khoan
    else
    User.add(utilsdb.getSession(req),user,newUser)
        .then(response=> res.status(201).send(response))
        .catch(err=> res.status(500).send({message:"Loi server"}));
}

exports.changePassword = async function(req,res,next){
    const {password,newPassword,reNewPassword} = req.body
    const {username} = req.decodedToken
    //check password== repassword ben BE hay FE?
    if(newPassword!==reNewPassword) console.log({message:"newPass khong trung voi reNewPass"})
    else User.changePassword(utilsdb.getSession(req),{username,newPassword,password})
        .then(response=> {
            if(!response.records.length) console.log({message:"Sai mat khau cu"})
            else console.log({message:"doi mat khau thanh cong"})
        })
        .catch(err=>console.log(err))
        //?? redirect
}

//thay doi quyen khai bao cua mot user va cac node phia duoi user do
exports.changePermission = async function(req,res,next) {
    User.changePermission(utilsdb.getSession(req),req.username,isActive)
}