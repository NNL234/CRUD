const express = require('express');
const config = require('config');
const jwt =require('jsonwebtoken');
const app = express();

const port =3000;

const users = [
  {
    username : "admin",
    password :123456,
    role :"admin",
  },
  {
    username : "teacher",
    password :123456,
    role:"teacher",
  },
  {
    username : "student",
    password :123456,
    role:"student",
  }

]


// create application/json parser
app.use(express.json());
// create application/x-www-form-urlencoded parser
app.use(express.urlencoded({ extended: true }));

//login , req.body include username and password
app.post('/login', function (req, res) {
  //find in db
  var user = users.filter(user => req.body.username === user.username && req.body.password === user.password)[0];
  // if username or password wrong 
  if(!user) res.send("tài khoản không hợp lệ") ;
  else {
    //send token to client , jwt.sign(payload,sercretKey)
    token = jwt.sign({role :user.role },config.get("jwtPrivateKey")) 
    //send token jwt 
    res.send({
      token : token,
    })
  }
    
  })
  console.log(config.get("jwtPrivateKey"))

  //only teachers and admin can access
 app.get('/api/students', function (req, res) {
     var token  = req.header('token');
    
     try{
          data = jwt.verify(token,config.get("jwtPrivateKey"))
          //who can see  list students
          if(data.role === "teacher" ||data.role ==="admin")
            res.send("student list")
          else
            res.send("you don't have permission to access this page");
        } 
     catch (err){
       if(!token) res.send("you must login")
       res.send("invalid token")
     }
  })

  // only admin can access
 app.get('/api/teachers', function (req, res) {
     var token  = req.header('token');
    
     try{
          data = jwt.verify(token,config.get("jwtPrivateKey"))
          //who can see  list students
          if(data.role ==="admin")
            res.send("teacher list")
          else
            res.send("you don't have permission to access this page");
        } 
     catch (err){
       if(!token) res.send("you must login")
       res.send("invalid token")
     }
  })


app.listen(port,()=>{
    console.log('app listening at http://localhost:'+port)
})