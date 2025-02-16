
const express = require('express')
require('dotenv').config();
const app = express();
const path = require('path')
const bodyParser = require('body-parser')
const adminRoute = require("./routes/adminRoute");
const productRoute = require("./routes/productRoute")
const cors = require('cors')
const db = require('./db') //used to connect the database with database file
db() //used to connect the database with database file
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cors());

app.use("/admin", adminRoute);
app.use("/product", productRoute);




const port = process.env.PORT
app.listen(port, function () {
    console.log(`server listening on port ${port}`)
})