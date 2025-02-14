const ProductModel = require("../models/productModel");

const productSave = async (req, res) => {
    try {
        const imageUrls = req.files.map(file => file.path);
        let { name, brand, price, description, category, subcategory } = req.body;

        // Ensure category is a string (remove empty values if it's an array)
        if (Array.isArray(category)) {
            category = category.filter(Boolean)[0] || ""; // Get first valid category
        }

        // Validate required fields
        if (!name || !brand || !price || !description || !category || !subcategory || imageUrls.length === 0) {
            return res.status(400).send("All fields are required.");
        }

        // Save the product
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

module.exports = { productSave };
