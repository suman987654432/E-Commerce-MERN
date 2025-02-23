const ProductModel = require('../models/productModel');
const Review = require('../models/reviewModel');

const productDisplay = async (req, res) => {
    try {
        const Product = await ProductModel.find({ status: 'primary' });
        res.status(200).send(Product);
    } catch (error) {
        console.log(error);
    }
}

const productDataShow = async (req, res) => {
    const Product = await ProductModel.findById(req.body.id);
    res.status(200).send(Product);
}

const getProductReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ productId: req.params.id })
            .sort({ createdAt: -1 });
        
        const averageRating = reviews.length > 0 
            ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length 
            : 0;

        res.json({
            success: true,
            reviews,
            averageRating
        });
    } catch (error) {
        console.error('Get reviews error:', error);
        res.status(500).json({ 
            success: false,
            message: "Error fetching reviews",
            error: error.message
        });
    }
};

const addProductReview = async (req, res) => {
    try {
        const review = new Review({
            productId: req.params.id,
            userId: req.user.userId,
            userName: req.user.name,
            rating: req.body.rating,
            comment: req.body.comment
        });

        await review.save();
        
        const reviews = await Review.find({ productId: req.params.id });
        const averageRating = reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length;
        
        await ProductModel.findByIdAndUpdate(req.params.id, {
            ratings: averageRating.toFixed(1)
        });

        res.status(201).json({ 
            success: true,
            message: "Review added successfully" 
        });
    } catch (error) {
        console.error('Review error:', error);
        res.status(500).json({ 
            success: false,
            message: "Error adding review",
            error: error.message 
        });
    }
};

module.exports = {
    productDisplay,
    productDataShow,
    getProductReviews,
    addProductReview
};