const {role} = require('../middleware/role')
// tim cac node co label user do user quan ly
const findAll = function(session,user) {
     let query = `MATCH(user:User{username:$username})-[:QUANLY]-> (u:User)
                    RETURN u`
     return session.readTransaction(transaction=> transaction.run(query,{username:user.username}))   
     // WHERE user.username =~ "${user.username + ".*"}"
}
//ex query
//   `MATCH (c:Company) 
//    WHERE c.companyName =~ {name} 
//    RETURN c 
//    ORDER BY c.companyName 
//    SKIP {offset} 
//    LIMIT {limit}`
// find(driver.session(),{username:'00'})
// .then(res=>console.log(res.records.length))
// .catch(err=>console.log(err))
//tim 1 user

//?? tim theo ten tinh thanh pho hoac ma tinh/tp luc tao tk de xem  ten/ma tinh/tp do da dc tao/dc dung chua
//?? Tim theo ten tinh/tp
//?? tim theo ma tinh/tp
const find = function(session,user) {
     let query = `MATCH(user:User{username:$username})
                 RETURN user`
      return session.readTransaction(transaction=> transaction.run(query,{username:user.username}))   
}

//them 1 user do manageUser quan ly
const add = function(session,manageUser,user) {
    let query =`MATCH (manageUser:${role(manageUser.roleId)}{name :$manageUser}) 
                CREATE (manageUser)-[:QUANLY]->
                (user:User:${role(manageUser.roleId +1)}{name:$name,username:$username,password:$password,active:true,role:$role,completed :false})
                RETURN user `
    return session.writeTransaction(ss => ss.run(query,
    {   manageUser :manageUser.name,
        role: role(manageUser.roleId + 1),
        name:user.name,
        username : user.username,
        password:user.password,
    })
)}

//xoa 1  node user nhung khong xoa cac node bi quan ly boi node bi xoa (!!!!)
const remove = function(session,user) {
    let query = `MATCH(user:User{username :$username}) DETACH DELETE user`
    return session.writeTransaction(transaction=> {
        transaction.run(query,{username:user.username})
    })
}

//update quyen khai bao neu 1 node user active = false thi cac node user bi quan li phia duoi active = false
const changePermission = function(session,user,isActive) {
    let query = `MATCH (user:User)
                 WHERE user.username =~ "${user.username + ".*"}"
                 SET user.active = ${isActive}
                 return user`
    return session.writeTransaction(transaction=>transaction.run(query))
}

const changePassword = function(session,user) {
    let query = `MATCH (user:User)
                WHERE user.username = $username AND user.password =$password
                SET user.password = $newPassword
                return user`
    return session.writeTransaction(transaction=> 
        transaction.run(query,{username:user.username,newPassword:user.newPassword,password:user.password}))
}
// update(driver.session(),{username :"00"})
// .then(re=>console.log( re))
// .catch(err=>console.log(err))
// driver.session().writeTransaction(tx=>tx.run('match(user{name:"Viet Nam"}) create (user)-[:QUANLY]->(u:User{name:"Ha Noi"}) return u'))
// .then(re=>console.log(re))
// .catch(err=>console.log(err))
        // find(driver.session(),{username:'admin',password:'123456'})
        // .then(result =>console.log(result.records[0].get('user')))

//  const login=function(session,user) {
//       return session.readTransaction(tx=> tx.run(`MATCH(user:User {username :$username}) RETURN user`,{username : user.username}))
//         .then(result => {
//           console.log(result.records[0].get('user'))
//             if(lodash.isEmpty(result.records)){
//                 throw {username:'username does not exist',status :400}
//             }
//             else {
//                 const dbUser =lodash.get(result.records[0].get('user'),'properties');
//                 if(dbUser.password!=user.password)
//                     throw ( {message : 'wrong username/password',status :400})
//             }
//             return {token:'token'}
//         })
//         .catch (error=>error)
          
// }

// login(driver.session(),{username:'admin',password:'123456'})
  
module.exports={
    find : find,
    findAll:findAll,
    add:add,
    changePermission:changePermission,
    remove:remove,
    changePassword:changePassword,
}