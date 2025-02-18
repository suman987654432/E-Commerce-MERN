import { useSelector, useDispatch } from "react-redux";
import { removeFromWishlist } from "../redux/wishlistSlice";
import { FaTrash } from "react-icons/fa";
import BASE_URL from "../config";
import "../css/wishlist.css";
import { useNavigate } from "react-router-dom";

const WishlistPage = () => {
    const wishlistItems = useSelector((state) => state.mywishlist.items);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    return (
        <div className="wishlist-container">
            <h1 className="wishlist-heading">Your Wishlist ❤️</h1>
            {wishlistItems.length === 0 ? (
                <p className="empty-message">No items in wishlist.</p>
            ) : (
                <div className="wishlist-table-wrapper">
                    <table className="wishlist-table">
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Name</th>
                                <th>Brand</th>
                                <th>Price</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {wishlistItems.map((product) => (
                                <tr key={product._id}>
                                    <td>
                                        <img
                                            src={`${BASE_URL}/${product.defaultImage}`}
                                            alt={product.name}
                                            className="wishlist-image"
                                            onClick={() => navigate(`/productdetails/${product.id}`)}
                                        />
                                    </td>
                                    <td className="wishlist-name">{product.name}</td>
                                    <td>{product.brand}</td>
                                    <td className="wishlist-price">${product.price}</td>
                                    <td>
                                        <button
                                            className="remove-button"
                                            onClick={() => dispatch(removeFromWishlist(product.id))}
                                        >
                                            <FaTrash /> Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default WishlistPage;