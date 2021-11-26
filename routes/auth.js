const express = require("express");
const router = express.Router();
const lodash = require('lodash')
const User = require("../models/user")
const utilsdb = require('../models/neo4j')
const generateAuthToken = require("../middleware/generateAuthToken");
const { roleId } = require("../middleware/role");


router.post('/',async function(req,res,next) {
    //need validate more
    if(!req.body.username||!req.body.password)
    res.status(400).send('Invalid username or password ')
    const username = req.body.username
    const password = req.body.password
    await User.find(utilsdb.getSession(req),{username:username,password:password})
    .then(result => {
                    if(lodash.isEmpty(result.records)){
                        return res.status(400).send("invalid username or password")
                    }
                    else {
                        const dbUser =lodash.get(result.records[0].get('user'),'properties');
                        if(dbUser.password!=password)
                        return res.status(400).send("wrong username or password")
                        res.send( {token:generateAuthToken({username:username,roleId:roleId(dbUser.role),name:dbUser.name}),
                                    ma_dia_phuong:dbUser.username,
                                    ten_tai_khoan: dbUser.name
                        })
                    }
                })
    .catch (err=>res.send(err))
})

module.exports =router;


