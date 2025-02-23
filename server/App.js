const express = require('express')
require('dotenv').config();
const app = express();
const path = require('path')
const bodyParser = require('body-parser')
const adminRoute = require("./routes/adminRoute");
const productRoute = require("./routes/productRoute")
const authRoute = require('./routes/authRoute');
const orderRoute = require('./routes/orderRoute');
const cors = require('cors')
const db = require('./db') //used to connect the database with database file

db() //used to connect the database with database file

// Enable CORS first
app.use(cors());

// Then body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("/admin", adminRoute);
app.use("/product", productRoute);
app.use('/auth', authRoute);
app.use('/order', orderRoute);

const port = process.env.PORT
app.listen(port, function () {
    console.log(`server listening on port ${port}`)
})