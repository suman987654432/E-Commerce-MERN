import { useState, useEffect } from "react";
import BASE_URL from "../config";
import "../css/ProductCard.css";
import { FaRegHeart, FaStar } from "react-icons/fa";
import { PiCurrencyInrThin } from "react-icons/pi";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { addtoCart } from "../redux/cartSlice";
import { addToWishlist } from "../redux/wishlistSlice";
import { useDispatch, useSelector } from "react-redux";

const ProductCard = () => {
    const [mydata, setMydata] = useState([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const wishlistItems = useSelector((state) => state.mywishlist.items);

    useEffect(() => {
        const loadData = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/product/homeproductdisplay`);
                setMydata(response.data);
            } catch (error) {
                console.log(error);
            }
        };
        loadData();
    }, []);

    return (
        <div className="product-list">
            {mydata.map((key) => {
                const isWishlisted = wishlistItems.some((item) => item.id === key._id);
                const averageRating = key.averageRating || key.ratings || 0;

                return (
                    <div key={key._id} className="product-card">
                        <div className="image-container">
                            <img src={`${BASE_URL}/${key.defaultImage}`} alt={key.name} className="product-image" onClick={() => navigate(`/productdetails/${key._id}`)} />
                            <FaRegHeart
                                className={`wishlist-icon ${isWishlisted ? "active" : ""}`}
                                onClick={() => dispatch(addToWishlist({ id: key._id, name: key.name, brand: key.brand, price: key.price, description: key.description, category: key.category, subcategory: key.subcategory, images: key.images, defaultImage: key.defaultImage,  status: key.status, qnty: 1 }))}
                            />
                        </div>
                        <div className="product-info">
                            <div className="product-title-price">
                                <h3 className="product-title">{key.name}</h3>
                                <span className="product-price" style={{ fontSize: "1.2rem" }}>
                                    <PiCurrencyInrThin /> {key.price}
                                </span>
                            </div>
                            <p className="product-description">{key.description}</p>
                            <div className="product-rating">
                                {[...Array(Math.max(0, Math.floor(Number(averageRating))))].map((_, index) => (
                                    <FaStar key={index} className="star-icon" />
                                ))}
                                <span className="rating-text">({averageRating.toFixed(1)})</span>
                            </div>

                            <button className="add-to-cart"
                                onClick={() => { dispatch(addtoCart({ id: key._id, name: key.name, brand: key.brand, price: key.price, description: key.description, category: key.category, subcategory: key.subcategory, images: key.images, defaultImage: key.defaultImage, status: key.status, qnty: 1 })) }}

                            >Add to Cart</button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ProductCard;
