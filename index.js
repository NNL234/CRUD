const express = require('express');
const config = require('config');
const jwt =require('jsonwebtoken');
const auth = require('./routes/auth');
const mongoose = require('mongoose');
const app = express();

const port =3000;
mongoose.connect('mongodb://127.0.0.1/db',{
    useNewUrlParser:true,
    useUnifiedTopology:true
});

// create application/json parser
app.use(express.json());
// create application/x-www-form-urlencoded parser
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth",auth);
const bcrypt = require('bcrypt')

app.listen(port,()=>{
    console.log('app listening at http://localhost:'+port)
})