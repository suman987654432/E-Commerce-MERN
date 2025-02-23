const express = require("express");
const route = express.Router();
const ProductController = require("../controllers/productController");
const { authenticateToken } = require('../middleware/authMiddleware');

route.get("/homeproductdisplay", ProductController.productDisplay);
route.post("/productdatashow", ProductController.productDataShow);
route.get("/:id/reviews", ProductController.getProductReviews);
route.post("/:id/review", authenticateToken, ProductController.addProductReview);


module.exports = route;