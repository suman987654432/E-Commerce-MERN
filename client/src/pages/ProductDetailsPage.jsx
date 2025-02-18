import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import axios from "axios";
import BASE_URL from "../config";
import { addtoCart } from "../redux/cartSlice";
import { addToWishlist } from "../redux/wishlistSlice";
import { useDispatch, useSelector } from "react-redux";
import "../css/productDetails.css";

const ProductDetailsPage = () => {
    const wishlistItems = useSelector((state) => state.mywishlist.items);
    const dispatch = useDispatch();
    const { id } = useParams();
    const [proData, setProData] = useState(null);
    const [bigImage, setBigImage] = useState("");

    useEffect(() => {
        const loadData = async () => {
            try {
                const api = `${BASE_URL}/product/productdatashow`;
                const response = await axios.post(api, { id });
                if (response.data) {
                    setProData(response.data);
                    setBigImage(response.data.defaultImage);
                }
            } catch (error) {
                console.error("Error fetching product data:", error);
            }
        };
        loadData();
    }, [id]);

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

                    <div className="color-options">
                        {proData.colors?.map((color, index) => (
                            <span key={index} className="color-dot" style={{ backgroundColor: color }}></span>
                        ))}
                    </div>

                    <div className="size-selector mt-3">
                        {proData.sizes?.map((size, index) => (
                            <Button key={index} variant="outline-dark" className="size-btn">{size}</Button>
                        ))}
                    </div>

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
                        <Button variant="success" size="lg" className="action-btn">Buy Now</Button>
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
        </Container>
    );
};

export default ProductDetailsPage;