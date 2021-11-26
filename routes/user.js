const User = require('../models/user')
const  utilsdb= require('../models/neo4j')
const auth = require('../middleware/auth')
const neo4j =require('neo4j-driver')
const driver = neo4j.driver("bolt://localhost:7687",neo4j.auth.basic("neo4j","admin123456"));
const router = require('express').Router()

//lay cac node user thuoc quan li cua user
router.get('/all',[auth],async function (req,res,next) {
    req.user ={...req.decodedToken}
    User.findAll(driver.session(),req.user)
    .then(result=> res.send(result))
    .catch(err=>console.log(err))
})
//decodedToken gom username, name, roleId 
//session utilsdb.getSession(req)
//them 1 user
router.post('/add',[auth],async function (req,res,next) {
    const user ={...req.decodedToken}
    const {username,password,name}= req.body
    //username la ma tp/huyen/xa...
    //name la ten tp/huyen/xa...
    const newUser ={username,password,name}
    //tim trong db ...
    let result
    await User.find(driver.session(),{username,password})
    .then(response=> result=response.records[0])
    .catch(err=>console.log(err))
    // //neu tai khoan da ton tai...
    if(result) 
    res.status(400).send({message:"tai khoan da ton tai"})
    //neu chua tao tai khoan
    else
    User.add(driver.session(),user,newUser)
        .then(response=> res.status(201).send(response))
        .catch(err=> res.send(err));
})

//doi pass chinh chu
router.put('/changePw',[auth],async function(req,res,next){
    const {username,password,newPassword} = req.body
    //check password=== repassword ben BE hay FE?
    const result = await User.find(driver.session(),{username,password})
    .then(response=> result=response.records[0])
    .catch(err=>res.send(err))
    //neu tim thay
    if(result)
        User.changePassword(driver.session(),{username,newPassword})
        .then(response=> console.log(response))
        .catch(err=>console.log(err))
})

module.exports = router

