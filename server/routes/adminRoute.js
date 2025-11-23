const express = require("express");
const route = express.Router();
const AdminController = require("../controllers/adminController");

const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

route.post("/productsave", upload.array('files', 10), AdminController.productSave);
route.get("/productdisplay", AdminController.productDisplay)
route.post("/productmakeprimary", AdminController.productMakePrimary);
route.post("/productmakenormal", AdminController.productMakeNormal);
route.put('/productupdate/:id', upload.single('image'), AdminController.updateProduct);
route.delete('/productdelete/:id', AdminController.deleteProduct);
    

module.exports = route;