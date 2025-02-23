import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import axios from "axios";
import BASE_URL from "../config";
import { addtoCart } from "../redux/cartSlice";
import { addToWishlist } from "../redux/wishlistSlice";
import { useDispatch } from "react-redux";
import "../css/productDetails.css";
import { toast } from 'react-toastify';
import { FaStar } from "react-icons/fa";

const ProductDetailsPage = () => {
    const dispatch = useDispatch();
    const { id } = useParams();
    const [proData, setProData] = useState(null);
    const [bigImage, setBigImage] = useState("");
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
    const navigate = useNavigate();

    const token = localStorage.getItem('token');
    const userData = JSON.parse(localStorage.getItem('user'));
    console.log('Current user data:', userData);

    useEffect(() => {
        console.log('User Data:', userData);

        const loadData = async () => {
            try {
                const productResponse = await axios.post(`${BASE_URL}/product/productdatashow`, { id });
                setProData(productResponse.data);
                setBigImage(productResponse.data.defaultImage);

                // Fetch product reviews correctly
                const reviewsResponse = await axios.get(`${BASE_URL}/product/${id}/reviews`);
                setReviews(reviewsResponse.data.reviews);
            } catch (error) {
                console.error("Error fetching product data:", error);
            }
        };
        loadData();
    }, [id]);


    const handleReviewSubmit = async (e) => {
        e.preventDefault();

        if (!token || !userData) {
            toast.warning("Please login to submit a review");
            navigate('/userlogin');
            return;
        }

        if (!newReview.comment) {
            toast.error("Please write your review");
            return;
        }

        try {
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            };

            // Only send rating and comment - backend will use token data for user info
            await axios.post(
                `${BASE_URL}/product/${id}/review`,
                {
                    rating: newReview.rating,
                    comment: newReview.comment
                },
                config
            );

            // Fetch updated data
            const [reviewsResponse, productResponse] = await Promise.all([
                axios.get(`${BASE_URL}/product/${id}/reviews`),
                axios.post(`${BASE_URL}/product/productdatashow`, { id })
            ]);

            setReviews(reviewsResponse.data.reviews);
            setProData(productResponse.data);
            setNewReview({ rating: 5, comment: "" }); // Reset without name field

            toast.success("Review submitted successfully!");
        } catch (error) {
            console.error("Error submitting review:", error);
            if (error.response?.status === 401) {
                toast.error("Please login to submit a review");
                navigate('/userlogin');
            } else {
                toast.error(error.response?.data?.message || "Failed to submit review");
            }
        }
    };


    if (!proData) return <h2 className="text-center">Loading Product Details...</h2>;

    return (
        <Container className="product-detail-container mt-4">
            <Row className="product-detail-row">
                {/* Left Side - Product Image */}
                <Col md={5} className="product-image-section">
                    <Card className="product-image-card shadow-sm p-3">
                        <Card.Img
                            variant="top"
                            src={`${BASE_URL}/${bigImage}`}
                            alt={proData.name}
                            className="product-img"
                        />
                    </Card>
                    <div className="thumbnail-container mt-3">
                        {proData.images?.map((img, index) => (
                            <img
                                key={index}
                                src={`${BASE_URL}/${img}`}
                                alt={`Thumbnail ${index}`}
                                className="thumbnail-img"
                                onClick={() => setBigImage(img)}
                            />
                        ))}
                    </div>
                </Col>

                {/* Right Side - Product Details */}
                <Col md={7} className="product-info-section">
                    <h2 className="product-name">{proData.name}</h2>
                    <p className="product-brand"><strong>Brand:</strong> {proData.brand}</p>
                    <p className="product-category"><strong>Category:</strong> {proData.category}</p>
                    <p className="product-description">{proData.description}</p>
                    <p className="product-ratings text-warning">⭐ {proData.ratings}/5 Ratings</p>
                    <h3 className="product-price">${proData.price}</h3>

                    <div className="button-group mt-4">
                        <Button variant="primary" size="lg"
                            onClick={() => {
                                dispatch(addtoCart({
                                    id: proData._id,
                                    name: proData.name,
                                    brand: proData.brand,
                                    price: proData.price,
                                    description: proData.description,
                                    category: proData.category,
                                    subcategory: proData.subcategory,
                                    images: proData.images,
                                    defaultImage: proData.defaultImage,
                                    ratings: proData.ratings,
                                    status: proData.status,
                                    qnty: 1
                                }));
                            }}
                            className="action-btn">
                            Add to Cart
                        </Button>
                        <Button
                            variant="success"
                            size="lg"
                            className="action-btn"
                            onClick={() => navigate("/checkout", { state: { items: [proData], isBuyNow: true } })}
                        >
                            Buy Now
                        </Button>
                        <Button variant="danger" size="lg"
                            onClick={() => {
                                dispatch(addToWishlist({
                                    id: proData._id,
                                    name: proData.name,
                                    brand: proData.brand,
                                    price: proData.price,
                                    description: proData.description,
                                    category: proData.category,
                                    subcategory: proData.subcategory,
                                    images: proData.images,
                                    defaultImage: proData.defaultImage,
                                    ratings: proData.ratings,
                                    status: proData.status,
                                    qnty: 1
                                }));
                            }}
                            className="action-btn wishlist-btn">
                            Add to Wishlist
                        </Button>
                    </div>
                </Col>
            </Row>

            {/* Updated Review Form */}
            <div className="write-review-section mb-4">
                <Card className="border-0 bg-light">
                    <Card.Body>
                        <h5 className="mb-3">Write a Review</h5>
                        <Form onSubmit={handleReviewSubmit}>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Reviewing as</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={userData?.name || 'Please login to review'}
                                            disabled
                                            className="bg-light"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Rating</Form.Label>
                                        <div className="star-rating">
                                            {[5, 4, 3, 2, 1].map((star) => (
                                                <FaStar
                                                    key={star}
                                                    className={star <= newReview.rating ? "star-filled" : "star-empty"}
                                                    onClick={() => setNewReview({ ...newReview, rating: star })}
                                                />
                                            ))}
                                        </div>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Form.Group className="mb-3">
                                <Form.Label>Your Review</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={newReview.comment}
                                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                                    placeholder="Share your thoughts about the product..."
                                    required
                                />
                            </Form.Group>
                            <Button
                                variant="primary"
                                type="submit"
                                disabled={!userData}
                            >
                                Submit Review
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
            </div>

            {/* Reviews List */}
            <div className="reviews-list">
                {reviews.length > 0 ? (
                    reviews.map((review, index) => (
                        <Card key={index} className="review-item mb-3">
                            <Card.Body>
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <div className="reviewer-info">
                                        <h6 className="mb-0">{review.userName}</h6>
                                        <small className="text-muted">
                                            {userData && userData._id === review.userId ? '' : ''}
                                        </small>
                                    </div>
                                    <small className="text-muted">
                                        {new Date(review.createdAt).toLocaleDateString()}
                                    </small>
                                </div>
                                <div className="rating-stars mb-2">
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar
                                            key={i}
                                            className={i < review.rating ? "star-filled" : "star-empty"}
                                        />
                                    ))}
                                </div>
                                <p className="review-text mb-0">{review.comment}</p>
                            </Card.Body>
                        </Card>
                    ))
                ) : (
                    <div className="text-center py-4">
                        <p className="text-muted mb-0">No reviews yet. Be the first to review!</p>
                    </div>
                )}
            </div>
        </Container>
    );
};

export default ProductDetailsPage;
