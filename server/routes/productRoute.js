const express = require("express");
const route = express.Router();
const ProductController = require("../controllers/productController");

route.get("/homeproductdisplay", ProductController.productDisplay);


module.exports = route;