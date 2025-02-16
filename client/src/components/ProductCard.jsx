import { useState, useEffect } from "react";
import BASE_URL from "../config";
import "../css/ProductCard.css";
import { FaRegHeart, FaStar } from "react-icons/fa";
import { PiCurrencyInrThin } from "react-icons/pi";
import axios from "axios";
import { addtoCart } from "../redux/cartSlice";
import { addToWishlist } from "../redux/wishListSlice";
import { useDispatch, useSelector } from "react-redux";

const ProductCard = () => {
    const [mydata, setMydata] = useState([]);
    const dispatch = useDispatch();

    // ✅ Fix: Use correct state path (mywishlist instead of wishlist)
    const wishlistItems = useSelector((state) => state.mywishlist.items);

    // Fetch Product Data
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

                return (
                    <div key={key._id} className="product-card">
                        <div className="image-container">
                            <img src={`${BASE_URL}/${key.defaultImage}`} alt={key.name} className="product-image" />
                            <FaRegHeart
                                className={`wishlist-icon ${isWishlisted ? "active" : ""}`}
                                onClick={() => dispatch(addToWishlist({ id: key._id, name: key.name, brand: key.brand, price: key.price, description: key.description, category: key.category, subcategory: key.subcategory, images: key.images, defaultImage: key.defaultImage, ratings: key.ratings, status: key.status, qnty: 1 }))}
                            />
                        </div>
                        <div className="product-info">
                            <div className="product-title-price">
                                <h3 className="product-title">{key.name}</h3>
                                <span className="product-price">
                                    <PiCurrencyInrThin /> {key.price}
                                </span>
                            </div>
                            <p className="product-description">{key.description}</p>
                            <div className="product-rating">
                                {[...Array(key.ratings)].map((_, index) => (
                                    <FaStar key={index} className="star-icon" />
                                ))}
                            </div>
                            <button className="add-to-cart"
                                onClick={() => { dispatch(addtoCart({ id: key._id, name: key.name, brand: key.brand, price: key.price, description: key.description, category: key.category, subcategory: key.subcategory, images: key.images, defaultImage: key.defaultImage, ratings: key.ratings, status: key.status, qnty: 1 })) }}

                            >Add to Cart</button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ProductCard;
