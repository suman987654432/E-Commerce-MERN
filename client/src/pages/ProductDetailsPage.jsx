import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import axios from "axios";
import BASE_URL from "../config";
import { addtoCart } from "../redux/cartSlice";
import { addToWishlist } from "../redux/wishlistSlice";
import { useDispatch } from "react-redux";
import "../css/productDetails.css";



const ProductDetailsPage = () => {
    const dispatch = useDispatch();
    const { id } = useParams();
    const [proData, setProData] = useState(null);
    const [bigImage, setBigImage] = useState("");

    const navigate = useNavigate();

    const userData = JSON.parse(localStorage.getItem('user'));
    console.log('Current user data:', userData);

    useEffect(() => {
        console.log('User Data:', userData);

        const loadData = async () => {
            try {
                const productResponse = await axios.post(`${BASE_URL}/product/productdatashow`, { id });
                setProData(productResponse.data);
                setBigImage(productResponse.data.defaultImage);

              
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
                <Col md={4} className="product-image-section">
                    <Card className="product-image-card shadow-sm p-3">
                        <Card.Img
                            variant="top"
                            src={`${BASE_URL}/${bigImage}`}
                            alt={proData.name}
                            className="product-img"
                            style={{ 
                                height: '350px', 
                                width: '100%',
                                objectFit: 'cover', 
                                borderRadius: '8px',
                                border: '1px solid #eee'
                            }}
                        />
                    </Card>
                    <div className="thumbnail-container mt-2">
                        {proData.images?.map((img, index) => (
                            <img
                                key={index}
                                src={`${BASE_URL}/${img}`}
                                alt={`Thumbnail ${index}`}
                                className="thumbnail-img"
                                onClick={() => setBigImage(img)}
                                style={{ width: '60px', height: '60px', objectFit: 'cover', margin: '5px', cursor: 'pointer', border: bigImage === img ? '2px solid #007bff' : '1px solid #ddd' }}
                            />
                        ))}
                    </div>
                </Col>

                {/* Right Side - Product Details */}
                <Col md={8} className="product-info-section">
                    <h2 className="product-name">{proData.name}</h2>
                    <p className="product-brand"><strong>Brand:</strong> {proData.brand}</p>
                    <p className="product-category"><strong>Category:</strong> {proData.category}</p>
                    <p className="product-description">{proData.description}</p>
    
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
