const express = require("express");
const route = express.Router();
const AdminController = require("../controllers/adminController");
const upload = require("../middlewares/uploadMiddleware");

route.post("/productsave", upload.array('files', 10), AdminController.productSave);
route.get("/productdisplay", AdminController.productDisplay)
route.post("/productmakeprimary", AdminController.productMakePrimary);
route.post("/productmakenormal", AdminController.productMakeNormal);

module.exports = route;