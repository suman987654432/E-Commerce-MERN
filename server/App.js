
const express=require('express')
require('dotenv').config();
const app=express();
const bodyParser=require('body-parser')
const adminRoute= require("./routes/adminRoute");
const cors=require('cors')
const db=require('./db') //used to connect the database with database file
db() //used to connect the database with database file
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/admin", adminRoute);




const port=process.env.PORT
app.listen(port,function(){
console.log(`server listening on port ${port}`)
})