const auth = require('../middleware/auth')
const { checkPermission } = require('../middleware/role');
const { getUsers, addUser, changePassword, changePermission } = require('../controller/user');
const router = require('express').Router()

//lay cac node user thuoc quan li cua user
router.get('/all',[auth],getUsers)
//them 1 user
//    router         check middleware      controller
router.post('/add',[auth,checkPermission],addUser)

//doi pass chinh chu
router.put('/me/changePassword',[auth],changePassword)
//doi pass cua 1 node cap duoi
// router.put('/resetPassword',[auth,checkPermission],(req,res,next)=>{})
//thay doi quyen khai bao cua 1 user va cac node phia duoi user do
router.put('/changePermision/:id',[auth,checkPermission],changePermission)

module.exports = router

