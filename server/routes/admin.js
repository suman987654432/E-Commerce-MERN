const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// ...existing routes...
router.get('/productdisplay', adminController.displayProducts);
router.post('/productmakeprimary', adminController.makePrimary);
router.post('/productmakenormal', adminController.makeNormal);
router.delete('/productdelete/:id', adminController.deleteProduct);

module.exports = router;