const express = require("express");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose")
const router = express.Router();
const User = require("../models/user")
const generateAuthToken = require("../middleware/generateAuthToken");

router.post("/", async (req,res) => {
    //validate user,password(length,type...)
    //if(err) do st
    //if(!err)
    //find user in db has username === req.body.username
    const user = await User.findOne({username : req.body.username});  
    
    if(!user) 
        return res.status(400).send("Invalid username or password");

    const checkPassword = await bcrypt.compare(req.body.password,user.password);    
    if(!checkPassword) 
    return res.status(400).send("Invalid username or password");

    const token = generateAuthToken({
        _id : user._id,
        roleId : user.idRoleRef,
        isUnlock : user.isUnlock,
    })

    res.send({token});
})

module.exports =router;