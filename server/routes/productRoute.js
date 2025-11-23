const express = require("express");
const route = express.Router();
const ProductController = require("../controllers/productController");
const { authenticateToken } = require('../middleware/authMiddleware');

route.get("/homeproductdisplay", ProductController.productDisplay);
route.post("/productdatashow", ProductController.productDataShow);



module.exports = route;