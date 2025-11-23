const ProductModel = require("../models/productModel");
const jwt = require('jsonwebtoken');
const Product = require('../models/productModel');

const productSave = async (req, res) => {
    try {
        const imageUrls = req.files.map(file => file.path);
        let { name, brand, price, description, category, subcategory } = req.body;
        if (Array.isArray(category)) {
            category = category.filter(Boolean)[0] || "";
        }
        if (!name || !brand || !price || !description || !category || !subcategory || imageUrls.length === 0) {
            return res.status(400).send("All fields are required.");
        }
        const product = await ProductModel.create({
            name: name,
            brand: brand,
            price: price,
            description: description,
            category: category,
            subcategory: subcategory,
            images: imageUrls,
            defaultImage: imageUrls[0]
        });

        res.status(200).send("Product Successfully Uploaded!");
    } catch (error) {
        console.error("Error saving product:", error);
        res.status(500).send("Internal Server Error");
    }
};

const productDisplay = async (req, res) => {

    try {
        const Data = await ProductModel.find()
        res.status(200).send(Data)
    } catch (error) {
        console.log(error)
    }
}

const productMakePrimary = async (req, res) => {
    const { id } = req.body
    const Data = await ProductModel.findByIdAndUpdate(id, { status: "primary" })
    res.status(201).send({ msg: "Product Status Succesfully Changed!" });
}
const productMakeNormal = async (req, res) => {
    const { id } = req.body;
    const Data = await ProductModel.findByIdAndUpdate(id, { status: "normal" });
    res.status(201).send({ msg: "Product Status Succesfully Changed!" });
}

// Fixed admin credentials
const ADMIN_CREDENTIALS = {
    email: 'admin@example.com',
    password: 'admin123',
    name: 'Admin',
    role: 'admin'
};

const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check against fixed admin credentials
        if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
            // Generate admin token
            const token = jwt.sign(
                { 
                    userId: 'admin-id',
                    role: 'admin',
                    name: ADMIN_CREDENTIALS.name,
                    email: ADMIN_CREDENTIALS.email
                },
                'your-secret-key',
                { expiresIn: '1d' }
            );

            res.status(200).json({
                success: true,
                message: 'Admin login successful',
                token,
                user: {
                    _id: 'admin-id',
                    name: ADMIN_CREDENTIALS.name,
                    email: ADMIN_CREDENTIALS.email,
                    role: ADMIN_CREDENTIALS.role
                }
            });
        } else {
            res.status(401).json({
                success: false,
                message: 'Invalid admin credentials'
            });
        }
    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({
            success: false,
            message: 'Error in admin login'
        });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        console.log('Received delete request for ID:', id);
        
        if (!id) {
            return res.status(400).json({ 
                success: false,
                message: 'Product ID is required' 
            });
        }

        const product = await Product.findByIdAndDelete(id);
        
        if (!product) {
            return res.status(404).json({ 
                success: false,
                message: 'Product not found' 
            });
        }

        res.status(200).json({ 
            success: true,
            message: 'Product deleted successfully',
            deletedId: id
        });

    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error while deleting product',
            error: error.message 
        });
    }
};

const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = { ...req.body };

        // If new image is uploaded
        if (req.file) {
            updateData.defaultImage = req.file.path;
        }

        const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });
        
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json({ 
            message: 'Product updated successfully', 
            product: updatedProduct 
        });
    } catch (error) {
        res.status(500).json({ message: 'Error updating product', error: error.message });
    }
};

module.exports = {
    productSave,
    productDisplay,
    productMakePrimary,
    productMakeNormal,
    adminLogin,
    deleteProduct,
    updateProduct
};
