const express = require('express');
const config = require('config');
const neo4j = require('neo4j-driver');
const neo4jdb = config.get("neo4j")
const app = express();
const routes = require('./routes');
const neo4jSessionCleanup = require('./middleware/neo4jSessionCleanup');

const port =3000;

// const getNode= async function(){
//     let session = driver.session();
//     let name ="admin"
//     const node = await session.run(`MATCH(u {user :$name}) RETURN u`,{name: "admin"});
//     session.close()
//     console.log(node.records[0]._fields);
// }
// getNode()
// create application/json parser
app.use(express.json());
// create application/x-www-form-urlencoded parser
app.use(express.urlencoded({ extended: true }));

// app.use("/api/auth",auth);
app.use(neo4jSessionCleanup)

app.use('/api/auth',routes.auth)
app.use('/api/user',routes.user)


app.listen(port,()=>{
    console.log('app listening at http://localhost:'+port)
})