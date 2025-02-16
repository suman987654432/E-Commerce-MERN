const ProductModel = require("../models/productModel");

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



module.exports = {
    productSave,
    productDisplay,
    productMakePrimary,
    productMakeNormal
};
