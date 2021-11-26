const neo4j = require('neo4j-driver')
const {role} = require('../middleware/role')
const driver = neo4j.driver("bolt://localhost:7687",neo4j.auth.basic("neo4j","admin123456"));
// tat ca cac node co label ma user co the lay duoc thong tin ma cac node do co the lay dc
//vd user(Ha Noi ) co the xem duoc thong tin cua user(cac quan huyen xa thon thuoc Ha Noi)
const findAll = function(session,user) {
     let query = `MATCH(user:User)
                WHERE user.username =~ "${user.username + ".*"}"
                 RETURN user`
      return session.readTransaction(transaction=> transaction.run(query))   
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
const find = function(session,user) {
     let query = `MATCH(user:User{username:$username})
                 RETURN user`
      return session.readTransaction(transaction=> transaction.run(query,{username:user.username}))   
}

//them 1 user do manageUser quan ly
const add = function(session,manageUser,user) {
    let query =`MATCH (manageUser:${role(manageUser.roleId)}{name :$manageUser}) 
                CREATE (manageUser)-[:QUANLY]->
                (user:User:${user.role}{name:$name,username:$username,password:$password,active:true,role:$role})
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
const update = function(session,user) {
    let query = `MATCH (user:User)
                 WHERE user.username =~ "${user.username + ".*"}"
                 SET user.active = true
                 return user`
    return session.writeTransaction(transaction=>transaction.run(query))
}

const changePassword = function(session,user) {
    let query = `MATCH (user:User)
                WHERE user.username = $username
                SET user.password = $newPassword
                return user`
    return session.writeTransaction(transaction=> 
        transaction.run(query,{username:user.username,newPassword:user.newPassword}))
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
    update:update,
    remove:remove,
    changePassword:changePassword,
}